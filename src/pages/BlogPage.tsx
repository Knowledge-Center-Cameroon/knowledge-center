import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/data/blogs";
import { Link } from "react-router-dom";

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
        <h1 className="text-4xl font-heading font-bold mb-3">Blog</h1>
        <p className="text-muted-foreground">
          Stories, updates, and insights from Knowledge Center.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-muted-foreground">No posts yet. Check back soon.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const date = new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });
            return (
              <Card key={post.id} className="shadow-elegant h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="text-xs text-muted-foreground mb-2">{date}</div>
                  <h3 className="text-xl font-heading font-bold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-muted text-foreground/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto">
                    <Button variant="blackOutline" asChild>
                      <Link to="#" onClick={(e) => e.preventDefault()}>
                        Read more
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};

export default BlogPage;
