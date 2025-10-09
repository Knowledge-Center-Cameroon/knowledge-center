import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { blogPosts } from "@/data/blogs";
import { Link } from "react-router-dom";
import Timeline, { type TimelineItem } from "@/components/Timeline";
import StemBackground from "@/components/StemBackground";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { Input } from "@/components/ui/input";
import { Heart, MessageSquare, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toggleBlogLike, getBlogLikeStatus } from "@/services/blogApi";

const BlogPage: React.FC = () => {
  const { user } = useUser();
  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [likedPosts, setLikedPosts] = React.useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = React.useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = React.useState<Record<string, number>>({});
  const [loadingLikes, setLoadingLikes] = React.useState<Record<string, boolean>>({});

  const posts = React.useMemo(() => (
    [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  ), []);
  const allTags = React.useMemo(() => {
    const s = new Set<string>();
    posts.forEach(p => (p.tags || []).forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filtered = posts.filter(p => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.title.toLowerCase().includes(q) || (p.excerpt?.toLowerCase().includes(q));
    const matchesTag = !activeTag || (p.tags || []).includes(activeTag);
    return matchesQuery && matchesTag;
  });

  // LocalStorage-backed like/comment state
  React.useEffect(() => {
    try {
      const liked = JSON.parse(localStorage.getItem('kc_liked_posts_v1') || '{}');
      const likes = JSON.parse(localStorage.getItem('kc_like_counts_v1') || '{}');
      const comments = JSON.parse(localStorage.getItem('kc_comment_counts_v1') || '{}');
      // Ensure keys exist for current posts
      const likedInit: Record<string, boolean> = { ...liked };
      const likeCountsInit: Record<string, number> = { ...likes };
      const commentCountsInit: Record<string, number> = { ...comments };
      posts.forEach(p => {
        if (likedInit[p.id] === undefined) likedInit[p.id] = false;
        if (typeof likeCountsInit[p.id] !== 'number') likeCountsInit[p.id] = 0;
        if (typeof commentCountsInit[p.id] !== 'number') commentCountsInit[p.id] = 0;
      });
      setLikedPosts(likedInit);
      setLikeCounts(likeCountsInit);
      setCommentCounts(commentCountsInit);
    } catch {
      // Fallback defaults
      const likedInit: Record<string, boolean> = {};
      const likeCountsInit: Record<string, number> = {};
      const commentCountsInit: Record<string, number> = {};
      posts.forEach(p => {
        likedInit[p.id] = false;
        likeCountsInit[p.id] = 0;
        commentCountsInit[p.id] = 0;
      });
      setLikedPosts(likedInit);
      setLikeCounts(likeCountsInit);
      setCommentCounts(commentCountsInit);
    }
    // Only run on mount/posts (posts stable due to memo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  React.useEffect(() => {
    try { localStorage.setItem('kc_liked_posts_v1', JSON.stringify(likedPosts)); } catch {}
  }, [likedPosts]);
  React.useEffect(() => {
    try { localStorage.setItem('kc_like_counts_v1', JSON.stringify(likeCounts)); } catch {}
  }, [likeCounts]);
  React.useEffect(() => {
    try { localStorage.setItem('kc_comment_counts_v1', JSON.stringify(commentCounts)); } catch {}
  }, [commentCounts]);

  // Load like statuses for all posts when component mounts or user changes
  React.useEffect(() => {
    const loadLikeStatuses = async () => {
      if (!user?.id) return;

      for (const post of posts) {
        try {
          const likeStatus = await getBlogLikeStatus(post.id, user.id);
          setLikedPosts(prev => ({ ...prev, [post.id]: likeStatus.isLiked }));
          setLikeCounts(prev => ({ ...prev, [post.id]: likeStatus.likeCount }));
        } catch (error) {
          console.error(`Error loading like status for post ${post.id}:`, error);
        }
      }
    };

    loadLikeStatuses();
  }, [user?.id, posts]);

  const handleLike = async (postId: string) => {
    if (!user?.id) {
      alert('Please wait for user identification...');
      return;
    }

    const isCurrentlyLiked = likedPosts[postId] || false;
    setLoadingLikes(prev => ({ ...prev, [postId]: true }));

    try {
      const response = await toggleBlogLike(postId, user.id, isCurrentlyLiked);

      setLikedPosts(prev => ({ ...prev, [postId]: response.liked }));
      setLikeCounts(prev => ({ ...prev, [postId]: response.likeCount }));
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setLoadingLikes(prev => ({ ...prev, [postId]: false }));
    }
  };

  const { ref, y } = useParallax(40);
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
      <Parallax ref={ref as any} style={{ y }} className="max-w-3xl mb-10">
        <div className="h-1 w-20 mb-3 bg-kc-blue rounded-full" />
        <h2 className="heading-2 mb-6">Blog</h2>
        <p className="text-muted-foreground">
          Stories, updates, and insights from Knowledge Center.
        </p>
      </Parallax>

      {/* Toolbar: search + tag filters */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-full sm:max-w-md">
          <Input 
            placeholder="Search posts..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            className="shadow-sm transition-all duration-300 focus-visible:shadow-md"
          />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-300 ${activeTag === null ? 'bg-kc-blue text-white border-kc-blue shadow-md' : 'bg-white/70 text-foreground border-border hover:bg-white hover:shadow-sm'}`}
            >
              All
            </button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-300 ${activeTag === t ? 'bg-kc-blue text-white border-kc-blue shadow-md' : 'bg-white/70 text-foreground border-border hover:bg-white hover:shadow-sm'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-muted-foreground">No posts yet. Check back soon.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Feed */}
          <div className="lg:col-span-8 space-y-8">
            {filtered.map((post, idx) => {
              const dt = new Date(post.date);
              const date = dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
              const initials = (post.author || "KC").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
              const pid = post.id;
              const isLiked = likedPosts[pid] === true;
              const likeCount = likeCounts[pid] || 0;
              const commentCount = commentCounts[pid] || 0;
              return (
                <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: idx * 0.05 }}>
                  <Card className="group relative overflow-hidden border-border/60 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-kc-blue/40">
                    {post.cover && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={post.cover} 
                          alt={post.title} 
                          className="w-full h-52 sm:h-64 object-cover transform transition-transform duration-700 group-hover:scale-105" 
                          loading="lazy" 
                          decoding="async" 
                        />
                      </div>
                    )}
                    <CardContent className="p-5 sm:p-6 md:p-8">
                      {/* Header: avatar, title, meta */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-kc-blue/20 transition-all duration-300 group-hover:ring-kc-blue/40 group-hover:shadow-md">
                          <AvatarImage src={post.dp} alt={post.author || post.title} />
                          <AvatarFallback className="bg-kc-blue/10">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3">
                            <h3 className="text-lg sm:text-xl font-semibold truncate">{post.title}</h3>
                            <span className="text-sm text-muted-foreground">• {date}</span>
                          </div>
                          {post.author && (
                            <div className="text-sm text-muted-foreground mt-1">By {post.author}</div>
                          )}
                        </div>
                      </div>

                      {/* Body/excerpt */}
                      <p className="mt-4 sm:mt-6 text-base text-foreground/85 leading-relaxed">{post.excerpt}</p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                          {post.tags.map((t) => (
                            <span 
                              key={t} 
                              className="text-xs px-3 py-1.5 rounded-full bg-kc-blue/10 text-kc-blue font-medium transition-all duration-300 hover:bg-kc-blue hover:text-white cursor-pointer"
                              onClick={() => setActiveTag(t)}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer actions */}
                      <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 items-center">
                        <Button 
                          variant="blue" 
                          asChild 
                          className="rounded-full text-base px-6"
                        >
                          <Link to={`/blog/${post.id}`}>Read more</Link>
                        </Button>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleLike(pid)}
                            disabled={loadingLikes[pid] || !user?.id}
                            aria-pressed={isLiked}
                            className={`inline-flex items-center gap-1.5 text-sm transition-colors duration-300 ${isLiked ? 'text-kc-blue cursor-default' : 'text-muted-foreground hover:text-kc-blue'}`}
                            title={isLiked ? 'You already liked this post' : 'Like this post'}
                          >
                            {loadingLikes[pid] ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Heart className={`h-5 w-5 ${isLiked ? 'fill-kc-blue text-kc-blue' : ''}`} />
                            )}
                            {likeCount}
                          </button>
                          <button
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-300"
                          >
                            <MessageSquare className="h-5 w-5" /> {commentCount}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Sticky sidebar timeline */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8">
              {(() => {
                const items: TimelineItem[] = posts.map((p) => ({
                  title: p.title,
                  date: new Date(p.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }),
                  description: p.excerpt,
                  href: '#',
                }));
                return <Timeline title="Recent Posts" items={items} />;
              })()}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default BlogPage;
