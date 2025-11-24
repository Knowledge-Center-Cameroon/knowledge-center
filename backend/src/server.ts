import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import mongoose, { Schema, model } from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import validator from 'validator';
import { body, validationResult } from 'express-validator';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8080);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NKWA_BASE_URL = process.env.NKWA_BASE_URL || 'https://api.mynkwa.com';
const NKWA_API_KEY = process.env.NKWA_API_KEY || '';

// Production security middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// Apply rate limiting to all routes
app.use('/api/', limiter);
// Stricter rate limiting for sensitive endpoints
app.use('/api/stem/register', authLimiter);
app.use('/api/nkwa/webhook', authLimiter);

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(cors({
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      CORS_ORIGIN,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:5173',
      'https://localhost:3000'
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Input validation middleware
const validateRegistration = [
  body('payload.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

  body('payload.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

  body('payload.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('payload.phone')
    .matches(/^\+237[6-9]\d{8}$/)
    .withMessage('Phone number must be in Cameroon format: +237XXXXXXXXX'),

  body('payload.school')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('School name must be between 2 and 100 characters'),

  body('payload.grade')
    .isIn(['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Lower Sixth', 'Upper Sixth'])
    .withMessage('Please select a valid grade level'),

  body('amount')
    .isInt({ min: 1000, max: 100000 })
    .withMessage('Amount must be between 1000 and 100000 FCFA'),

  body('payload.paymentMethod')
    .isIn(['mtn', 'orange'])
    .withMessage('Payment method must be either MTN or Orange'),
];

// --- MongoDB Models ---
const SubscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Please provide a valid email address'
    }
  },
  created_at: { type: Date, default: Date.now },
});
const Subscriber = model('Subscriber', SubscriberSchema);

const RegistrationSchema = new Schema({
  reference: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1000,
    max: 100000
  },
  payload: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: 'Please provide a valid email address'
      }
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (phone: string) => /^\+237[6-9]\d{8}$/.test(phone),
        message: 'Phone number must be in Cameroon format: +237XXXXXXXXX'
      }
    },
    school: { type: String, required: true },
    grade: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: ['mtn', 'orange'] },
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  nkwaTransactionId: { type: String },
  paymentDetails: { type: Object },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  completed_at: { type: Date },
});
const Registration = model('Registration', RegistrationSchema);

const TimelineSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date_iso: { type: Date, required: true, index: true },
  tag: { type: String },
  imageUrl: { type: String },
  linkUrl: { type: String },
});
const TimelineItem = model('TimelineItem', TimelineSchema);

// Blog Like Schema
const BlogLikeSchema = new Schema({
  postId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  created_at: { type: Date, default: Date.now },
});
BlogLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
const BlogLike = model('BlogLike', BlogLikeSchema);

// Blog Comment Schema
const BlogCommentSchema = new Schema({
  postId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  author: {
    type: String,
    required: true,
    maxlength: 50,
    validate: {
      validator: (name: string) => /^[a-zA-Z\s'-]+$/.test(name),
      message: 'Author name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
    validate: {
      validator: (content: string) => content.trim().length > 0,
      message: 'Comment content cannot be empty'
    }
  },
  parentId: { type: String, default: null }, // For nested comments
  likes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});
const BlogComment = model('BlogComment', BlogCommentSchema);

// Enhanced health check with database status
app.get('/health', async (_req: Request, res: Response) => {
  const healthCheck = {
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'disconnected',
    services: {
      mongodb: false,
      nkwa: false
    }
  };

  try {
    // Check database connection
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      healthCheck.database = 'connected';
      healthCheck.services.mongodb = true;
    } else {
      healthCheck.ok = false;
      healthCheck.database = 'disconnected';
    }
  } catch (error) {
    healthCheck.ok = false;
    healthCheck.database = 'error';
  }

  // Check Nkwa API availability
  if (NKWA_API_KEY) {
    try {
      await axios.get(`${NKWA_BASE_URL}/health`, {
        headers: { Authorization: `Bearer ${NKWA_API_KEY}` },
        timeout: 5000
      });
      healthCheck.services.nkwa = true;
    } catch (error) {
      healthCheck.services.nkwa = false;
    }
  }

  const statusCode = healthCheck.ok ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Newsletter with enhanced validation and rate limiting
app.post('/api/newsletter',
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  async (req: Request, res: Response) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email } = req.body;

      if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if already subscribed
      const existingSubscriber = await Subscriber.findOne({ email: normalizedEmail });

      if (existingSubscriber) {
        return res.status(409).json({ error: 'Email already subscribed' });
      }

      await Subscriber.create({
        email: normalizedEmail,
        created_at: new Date()
      });

      return res.json({
        success: true,
        message: 'Successfully subscribed to newsletter'
      });
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to subscribe to newsletter'
      });
    }
  }
);

// STEM registration: initiate payment via Nkwa with enhanced validation
app.post('/api/stem/register', validateRegistration, async (req: Request, res: Response) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { payload, amount } = req.body;

    if (!payload || !amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Payload and amount are required'
      });
    }

    if (!NKWA_API_KEY) {
      console.error('Nkwa API key not configured');
      return res.status(500).json({
        error: 'Payment service unavailable',
        message: 'Payment integration not configured'
      });
    }

    // Sanitize and validate payload data
    const sanitizedPayload = {
      firstName: validator.escape(payload.firstName.trim()),
      lastName: validator.escape(payload.lastName.trim()),
      email: payload.email.toLowerCase().trim(),
      phone: payload.phone.trim(),
      school: validator.escape(payload.school.trim()),
      grade: payload.grade,
      paymentMethod: payload.paymentMethod,
    };

    // Generate unique reference
    const reference = `KC-STEM-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // Create registration record
    const registration = await Registration.create({
      reference,
      amount,
      payload: sanitizedPayload,
      status: 'pending',
      created_at: new Date(),
    });

    // Prepare Nkwa payment request
    const nkwaPayload = {
      amount,
      payer: sanitizedPayload.phone,
      operator: sanitizedPayload.paymentMethod,
      reference,
      currency: 'XAF',
      description: `KC STEM Registration - ${sanitizedPayload.firstName} ${sanitizedPayload.lastName}`,
      callback_url: `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/api/nkwa/webhook`,
    };

    try {
      // Initiate payment with Nkwa
      const nkwaResponse = await axios.post(
        `${NKWA_BASE_URL}/nkwapay/collect`,
        nkwaPayload,
        {
          headers: {
            'Authorization': `Bearer ${NKWA_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Update registration with Nkwa transaction details
      await Registration.updateOne(
        { reference },
        {
          nkwaTransactionId: nkwaResponse.data?.transactionId,
          paymentDetails: nkwaResponse.data,
          status: 'processing',
          updated_at: new Date()
        }
      );

      console.log(`Payment initiated for registration ${reference}:`, nkwaResponse.data);

      return res.json({
        reference,
        status: 'processing',
        message: 'Payment request initiated successfully',
        nkwaResponse: process.env.NODE_ENV === 'development' ? nkwaResponse.data : undefined
      });

    } catch (nkwaError: any) {
      console.error('Nkwa API error:', {
        status: nkwaError.response?.status,
        data: nkwaError.response?.data,
        reference
      });

      // Update registration status to failed
      await Registration.updateOne(
        { reference },
        {
          status: 'failed',
          paymentDetails: nkwaError.response?.data,
          updated_at: new Date()
        }
      );

      return res.status(502).json({
        error: 'Payment service error',
        message: 'Failed to initiate payment. Please try again.',
        reference
      });
    }

  } catch (error: any) {
    console.error('STEM registration error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process registration'
    });
  }
});

// Enhanced Nkwa webhook with signature verification (placeholder)
app.post('/api/nkwa/webhook', express.json({ type: '*/*' }), async (req: Request, res: Response) => {
  try {
    const event = req.body as any;
    const { reference, status, transactionId } = event || {};

    if (!reference) {
      console.warn('Webhook received without reference:', event);
      return res.status(400).json({ error: 'Missing reference' });
    }

    console.log(`Webhook received for ${reference}:`, { status, transactionId });

    // Update registration status based on payment result
    const updateData: any = {
      status: status === 'success' ? 'success' : 'failed',
      nkwaTransactionId: transactionId,
      paymentDetails: event,
      updated_at: new Date()
    };

    if (status === 'success') {
      updateData.completed_at = new Date();
    }

    const result = await Registration.updateOne({ reference }, updateData);

    if (result.matchedCount === 0) {
      console.warn(`No registration found for reference: ${reference}`);
      return res.status(404).json({ error: 'Registration not found' });
    }

    console.log(`Updated registration ${reference} status to ${updateData.status}`);

    return res.json({
      received: true,
      reference,
      status: updateData.status
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({
      error: 'Webhook processing failed',
      message: 'Failed to process payment notification'
    });
  }
});

// Blog interactions API
// POST /api/blog/:postId/like - Like a post
app.post('/api/blog/:postId/like', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    // Check if already liked
    const existingLike = await BlogLike.findOne({ postId, userId });
    if (existingLike) {
      return res.status(409).json({ error: 'Already liked' });
    }

    // Create like
    await BlogLike.create({ postId, userId });

    // Get updated like count
    const likeCount = await BlogLike.countDocuments({ postId });

    res.json({ liked: true, likeCount });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/blog/:postId/like - Unlike a post
app.delete('/api/blog/:postId/like', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    // Remove like
    const result = await BlogLike.deleteOne({ postId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Like not found' });
    }

    // Get updated like count
    const likeCount = await BlogLike.countDocuments({ postId });

    res.json({ liked: false, likeCount });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/blog/:postId/likes - Get like status and count
app.get('/api/blog/:postId/likes', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;

    const likeCount = await BlogLike.countDocuments({ postId });
    const isLiked = userId ? await BlogLike.exists({ postId, userId: userId as string }) : false;

    res.json({ likeCount, isLiked });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/blog/:postId/comments - Get comments for a post
app.get('/api/blog/:postId/comments', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string || '1');
    const limit = Math.min(parseInt(req.query.limit as string || '10'), 50);
    const skip = (page - 1) * limit;

    const comments = await BlogComment
      .find({ postId, parentId: null })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment: any) => {
        const replies = await BlogComment
          .find({ parentId: comment._id.toString() })
          .sort({ created_at: 1 })
          .lean();

        return {
          ...comment,
          replies,
          replyCount: replies.length,
        };
      })
    );

    const totalComments = await BlogComment.countDocuments({ postId, parentId: null });

    res.json({
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total: totalComments,
        pages: Math.ceil(totalComments / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/blog/:postId/comments - Add a comment
app.post('/api/blog/:postId/comments', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId, author, content, parentId } = req.body;

    if (!userId || !author || !content) {
      return res.status(400).json({ error: 'User ID, author, and content are required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Comment too long (max 1000 characters)' });
    }

    const comment = await BlogComment.create({
      postId,
      userId,
      author,
      content,
      parentId: parentId || null,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/blog/comments/:commentId - Update a comment
app.put('/api/blog/comments/:commentId', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'User ID and content are required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Comment too long (max 1000 characters)' });
    }

    const comment = await BlogComment.findOneAndUpdate(
      { _id: commentId, userId },
      { content, updated_at: new Date() },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found or not authorized' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/blog/comments/:commentId - Delete a comment
app.delete('/api/blog/comments/:commentId', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    // Delete the comment and all its replies
    const comment = await BlogComment.findOne({ _id: commentId, userId });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found or not authorized' });
    }

    await BlogComment.deleteMany({
      $or: [
        { _id: commentId },
        { parentId: commentId }
      ]
    });

    res.json({ deleted: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function start() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('Warning: MONGODB_URI not set. Connect before production use.');
    } else {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    }
    app.listen(PORT, () => {
      console.log(`KC backend listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();
