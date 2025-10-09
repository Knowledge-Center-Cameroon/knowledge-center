# Knowledge Center Backend Setup Guide

## 🚀 Production Deployment Guide

This guide covers setting up the Knowledge Center backend for production deployment, including database configuration, environment variables, and deployment instructions.

## 📋 Prerequisites

Before deploying to production, ensure you have:

- **Node.js 18+** installed
- **MongoDB Atlas** account (or self-hosted MongoDB)
- **Payment Provider Account** (Nkwa/MTN MoMo/Orange Money)
- **Domain Name** (for HTTPS and CORS)
- **SSL Certificate** (for HTTPS)

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster (M0 Sandbox for testing, M2+ for production)

2. **Configure Database**
   - Create database: `knowledge-center`
   - Collections will be created automatically by the application

3. **Network Access**
   - Add IP whitelist: `0.0.0.0/0` (for all IPs) or specific server IPs
   - Ensure your deployment IP is whitelisted

4. **Database User**
   - Create database user with read/write permissions
   - Note the username and password for environment variables

## 🔐 Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Server Configuration
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/knowledge-center?retryWrites=true&w=majority

# Payment Integration (Nkwa)
NKWA_BASE_URL=https://api.mynkwa.com
NKWA_API_KEY=your_nkwa_api_key

# Security (Generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-32-character-encryption-key

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=info
```

## 🔧 Production Enhancements

### 1. Security Middleware

The backend includes production-ready security features:

- **CORS Configuration**: Properly configured for your domain
- **Rate Limiting**: Prevents abuse (100 requests per 15 minutes per IP)
- **Input Validation**: Comprehensive validation for all endpoints
- **Error Handling**: Secure error responses (no sensitive data leaks)

### 2. Database Indexes

Optimized indexes are automatically created for:
- Email uniqueness in subscribers
- Registration references
- Blog post likes and comments
- Timeline items

### 3. Payment Integration

**Nkwa Payment Setup:**

1. **Create Nkwa Account**
   - Visit [Nkwa Developer Portal](https://developer.mynkwa.com)
   - Register as a merchant

2. **Get API Credentials**
   - Generate API key and secret
   - Configure webhook URL: `https://yourdomain.com/api/nkwa/webhook`

3. **Webhook Configuration**
   - Nkwa will send payment status updates to your webhook
   - The backend automatically updates registration status

## 🚀 Deployment Options

### Option 1: Railway (Recommended for Beginners)

1. **Connect to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   railway link
   railway up
   ```

3. **Set Environment Variables**
   - Go to Railway dashboard
   - Add all environment variables from your `.env` file

### Option 2: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select `backend/` directory as source

2. **Configure Environment**
   - Add all environment variables
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

### Option 3: Manual VPS Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade

   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   cd backend
   npm install --production
   pm2 start src/server.js --name "kc-backend"
   pm2 startup
   pm2 save
   ```

3. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔍 Health Check & Monitoring

### Health Check Endpoint
```
GET /health
```

Returns:
```json
{
  "ok": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": "1h 30m 45s"
}
```

### Monitoring Setup

1. **Application Metrics**
   - Built-in performance monitoring
   - Database connection status
   - API response times

2. **Error Tracking** (Optional)
   - Integrate with Sentry or similar service
   - Add error tracking to environment variables

## 🔄 Backup Strategy

### Database Backups
```bash
# MongoDB Atlas automatic backups (7 days retention)
# Enable in Atlas dashboard: Cluster → Backup → Cloud Backup

# Manual backup script
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +\%Y\%m\%d)
```

### Application Backups
- Git repository for code backups
- Environment variables backup (encrypted)
- SSL certificates backup

## 🔒 Security Checklist

- [ ] Enable HTTPS/SSL on all endpoints
- [ ] Set up firewall rules (ufw, security groups)
- [ ] Configure rate limiting
- [ ] Enable MongoDB Atlas encryption at rest
- [ ] Set up monitoring alerts
- [ ] Regular security updates
- [ ] API key rotation policy

## 🧪 Testing Production Setup

1. **Test Payment Flow**
   ```bash
   # Test Nkwa integration
   curl -X POST https://yourdomain.com/api/stem/register \
     -H "Content-Type: application/json" \
     -d '{"amount": 5000, "payload": {...}}'
   ```

2. **Test Blog Interactions**
   ```bash
   # Test like functionality
   curl -X POST https://yourdomain.com/api/blog/test-post/like \
     -H "Content-Type: application/json" \
     -d '{"userId": "test-user"}'
   ```

3. **Database Connectivity**
   ```bash
   # Check MongoDB connection
   curl https://yourdomain.com/health
   ```

## 📞 Support & Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI format
   - Verify network access in Atlas
   - Confirm username/password

2. **Payment Integration Issues**
   - Verify Nkwa API credentials
   - Check webhook URL configuration
   - Ensure sufficient account balance

3. **CORS Errors**
   - Update CORS_ORIGIN in environment
   - Check frontend domain configuration

### Logs & Debugging

- Application logs: `pm2 logs kc-backend` (if using PM2)
- MongoDB logs: Atlas dashboard → Clusters → Logs
- Nginx logs: `/var/log/nginx/access.log`

## 🎯 Next Steps After Deployment

1. **Domain Configuration**
   - Point domain to server IP
   - Configure SSL certificate
   - Update DNS settings

2. **Frontend Integration**
   - Update API base URL in frontend
   - Configure environment variables
   - Test all integrations

3. **Monitoring Setup**
   - Set up uptime monitoring (UptimeRobot, etc.)
   - Configure error tracking
   - Set up performance monitoring

4. **Backup Verification**
   - Test database backup restoration
   - Verify file backups
   - Document recovery procedures

---

**Need Help?** Contact the development team or check the troubleshooting section above.
