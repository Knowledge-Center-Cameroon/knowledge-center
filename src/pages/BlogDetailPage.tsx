import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { blogPosts } from "@/data/blogs";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Heart, MessageSquare, Loader2, Send, Edit, Trash2 } from "lucide-react";
import StemBackground from "@/components/StemBackground";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { useUser } from "@/contexts/UserContext";
import { toggleBlogLike, getBlogLikeStatus, getBlogComments, addBlogComment, updateBlogComment, deleteBlogComment, type BlogComment } from "@/services/blogApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSeo } from "@/hooks/useSeo";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, setUserName } = useUser();
  const { ref, y } = useParallax(40);

  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [comments, setComments] = React.useState<BlogComment[]>([]);
  const [commentText, setCommentText] = React.useState("");
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editingText, setEditingText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submittingComment, setSubmittingComment] = React.useState(false);
  const [displayName, setDisplayName] = React.useState<string>(user?.name || "");

  const post = blogPosts.find(p => p.id === slug);

  useSeo({
    title: post ? post.title : "Blog Post | Knowledge Center",
    description: post?.excerpt,
  });

  // Load like status and comments when component mounts
  React.useEffect(() => {
    if (!post || !user?.id) return;

    const loadInteractions = async () => {
      try {
        // Load like status
        const likeStatus = await getBlogLikeStatus(post.id, user.id);
        setIsLiked(likeStatus.isLiked);
        setLikeCount(likeStatus.likeCount);

        // Load comments
        const commentsData = await getBlogComments(post.id);
        setComments(commentsData.comments);
      } catch (error) {
        console.error('Error loading interactions:', error);
      }
    };

    loadInteractions();
  }, [post, user?.id]);

  const handleLike = async () => {
    if (!post || !user?.id) return;

    setLoading(true);
    try {
      const response = await toggleBlogLike(post.id, user.id, isLiked);
      setIsLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !user?.id || !commentText.trim() || !displayName.trim()) return;

    // Persist the chosen display name in user context/localStorage
    if (displayName.trim() && displayName.trim() !== user.name) {
      setUserName(displayName.trim());
    }

    setSubmittingComment(true);
    try {
      const newComment = await addBlogComment(
        post.id,
        user.id,
        displayName.trim(),
        commentText.trim()
      );

      setComments(prev => [newComment, ...prev]);
      setCommentText("");
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = (comment: BlogComment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.content);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!user?.id || !editingText.trim()) return;

    try {
      const updatedComment = await updateBlogComment(commentId, user.id, editingText.trim());

      setComments(prev => prev.map(c =>
        c._id === commentId ? updatedComment : c
      ));

      setEditingCommentId(null);
      setEditingText("");
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user?.id) return;

    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteBlogComment(commentId, user.id);

      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  if (!post) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-4 lg:px-8 py-16 min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="heading-3 mb-4">Post not found</h2>
          <Button asChild variant="blue">
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </motion.section>
    );
  }

  const dt = new Date(post.date);
  const date = dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit"
  });
  const initials = (post.author || "KC").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-16"
    >
      <div className="absolute inset-0 -z-10">
        <StemBackground opacity={0.08} density={44} lineDistance={120} speed={0.4} showIcons={true} />
      </div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/blog')}
          className="group flex items-center gap-2 hover:bg-kc-blue/10"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Button>
      </motion.div>

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <Parallax ref={ref as any} style={{ y }}>
          {post.cover && (
            <div className="relative overflow-hidden rounded-2xl mb-8">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-64 md:h-80 lg:h-96 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-kc-blue/20" />
            </div>
          )}

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {date}
              </div>
              {post.author && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
              )}
            </div>

            <h1 className="heading-1 mb-4 text-kc-blue">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-kc-blue/10 text-kc-blue font-medium"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Parallax>

        {/* Author info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-white border border-border"
        >
          <Avatar className="h-12 w-12 ring-2 ring-kc-blue/20">
            <AvatarImage src={post.dp} alt={post.author || post.title} />
            <AvatarFallback className="bg-kc-blue/10">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">Written by {post.author || 'KC Editorial Team'}</div>
            <div className="text-sm text-muted-foreground">Published on {date}</div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          <div className="text-base md:text-lg leading-relaxed text-foreground/90">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-muted-foreground italic">Full content coming soon...</p>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border/50"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleLike}
                disabled={loading || !user?.id}
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-kc-blue text-kc-blue' : ''}`} />
                )}
                {isLiked ? 'Liked' : 'Like'} ({likeCount})
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({comments.length})
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Share</Button>
              <Button variant="ghost" size="sm">Bookmark</Button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-border/50"
        >
          <h3 className="heading-3 mb-6">Comments ({comments.length})</h3>

          {/* Comment Form */}
          {user?.id ? (
            <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-kc-blue/10 text-kc-blue">
                    {(displayName || user.name || 'A').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name (required)"
                      className="sm:max-w-xs"
                    />
                  </div>
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[100px] resize-none"
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">
                      {commentText.length}/1000 characters
                    </span>
                    <Button
                      type="submit"
                      disabled={!commentText.trim() || !displayName.trim() || submittingComment}
                      className="gap-2"
                    >
                      {submittingComment ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-muted-foreground mb-2">Sign in to join the conversation</p>
              <Button variant="outline" onClick={() => alert('User identification in progress...')}>
                Continue as Guest
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 group"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-kc-blue/10 text-kc-blue">
                      {comment.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      {user?.id === comment.userId && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditComment(comment)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment._id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="min-h-[80px]"
                          maxLength={1000}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={!editingText.trim()}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground/90 leading-relaxed">{comment.content}</p>
                    )}

                    {/* Replies would go here - simplified for now */}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </article>
    </motion.section>
  );
};

export default BlogDetailPage;


