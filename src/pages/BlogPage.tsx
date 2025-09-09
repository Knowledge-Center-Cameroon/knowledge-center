import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/data/blogs";
import { Link } from "react-router-dom";
import Timeline, { type TimelineItem } from "@/components/Timeline";

const BlogPage: React.FC = () => {
  const posts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-16"
    >
      <div className="max-w-3xl mb-10">
        <h2 className="heading-2 mb-6">Blog</h2>
        <p className="text-muted-foreground">
          Stories, updates, and insights from Knowledge Center.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-muted-foreground">No posts yet. Check back soon.</div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Posts */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
            {posts.map((post, idx) => {
              const date = new Date(post.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              });
              return (
                <motion.div key={post.id} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                  <Card className="shadow-elegant h-full bg-white/60 backdrop-blur-md border border-white/40">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="text-xs text-muted-foreground mb-2">{date}</div>
                      <h3 className="text-xl font-heading font-bold mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((t) => (
                            <span key={t} className="text-xs px-2 py-1 rounded-full bg-kc-black text-white/90">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto">
                        <Button variant="blackOutline" asChild className="rounded-full">
                          <Link to="#" onClick={(e) => e.preventDefault()}>
                            Read more
                          </Link>
                        </Button>
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
