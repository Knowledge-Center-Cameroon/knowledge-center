import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { blogPosts } from "@/data/blogs";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Heart, MessageSquare } from "lucide-react";
import StemBackground from "@/components/StemBackground";
import { useParallax, Parallax } from "@/hooks/use-parallax";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { ref, y } = useParallax(40);

  const post = blogPosts.find(p => p.id === slug);

  if (!post) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-4 lg:px-8 py-16 min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
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

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-kc-blue to-kc-red bg-clip-text text-transparent">
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
          className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
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
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" />
                Like
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Comment
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Share</Button>
              <Button variant="ghost" size="sm">Bookmark</Button>
            </div>
          </div>
        </motion.div>

        {/* Related posts or back to blog */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-border/50 text-center"
        >
          <Button asChild variant="blue" className="rounded-full">
            <Link to="/blog">Back to All Posts</Link>
          </Button>
        </motion.div>
      </article>
    </motion.section>
  );
};

export default BlogDetailPage;
