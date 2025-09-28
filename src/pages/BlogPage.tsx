import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { blogPosts } from "@/data/blogs";
import { Link } from "react-router-dom";
import Timeline, { type TimelineItem } from "@/components/Timeline";
import StemBackground from "@/components/StemBackground";
import { Input } from "@/components/ui/input";
import { Heart, MessageSquare } from "lucide-react";

const BlogPage: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
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
      <div className="max-w-3xl mb-10">
        <div className="h-1 w-20 mb-3 bg-kc-blue rounded-full" />
        <h2 className="heading-2 mb-6">Blog</h2>
        <p className="text-muted-foreground">
          Stories, updates, and insights from Knowledge Center.
        </p>
      </div>

      {/* Toolbar: search + tag filters */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="max-w-lg">
          <Input placeholder="Search posts..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm border ${activeTag === null ? 'bg-black text-white border-black' : 'bg-white/70 text-foreground border-border hover:bg-white'}`}
            >
              All
            </button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`px-3 py-1.5 rounded-full text-sm border ${activeTag === t ? 'bg-black text-white border-black' : 'bg-white/70 text-foreground border-border hover:bg-white'}`}
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
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Feed */}
          <div className="lg:col-span-8 space-y-6">
            {filtered.map((post, idx) => {
              const dt = new Date(post.date);
              const date = dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
              const initials = (post.author || "KC").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
              const [likes, setLikes] = React.useState(0);
              const [comments, setComments] = React.useState(0);
              return (
                <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: idx * 0.03 }}>
                  <Card className="group relative overflow-hidden border-border/60 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40">
                    {post.cover && (
                      <img src={post.cover} alt={post.title} className="w-full h-52 object-cover" loading="lazy" decoding="async" />
                    )}
                    <CardContent className="p-6">
                      {/* Header: avatar, title, meta */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <AvatarImage src={post.cover} alt={post.author || post.title} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <h3 className="text-base sm:text-lg font-semibold truncate">{post.title}</h3>
                            <span className="text-xs text-muted-foreground">• {date}</span>
                          </div>
                          {post.author && (
                            <div className="text-xs text-muted-foreground mt-0.5">By {post.author}</div>
                          )}
                        </div>
                      </div>

                      {/* Body/excerpt */}
                      <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{post.excerpt}</p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((t) => (
                            <span key={t} className="text-xs px-2 py-1 rounded-full bg-black/80 text-white">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer actions */}
                      <div className="mt-4 flex gap-3 items-center">
                        <Button variant="blackOutline" asChild className="rounded-full">
                          <Link to="#" onClick={(e) => e.preventDefault()}>Read more</Link>
                        </Button>
                        <button onClick={() => setLikes((n) => n + 1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                          <Heart className="h-4 w-4" /> {likes}
                        </button>
                        <button onClick={() => setComments((n) => n + 1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                          <MessageSquare className="h-4 w-4" /> {comments}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar timeline */}
          <div className="lg:col-span-4">
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
      )}
    </motion.section>
  );
};

export default BlogPage;
