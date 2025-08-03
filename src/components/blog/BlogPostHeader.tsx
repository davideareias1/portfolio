"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import { BlogPost } from "@/types/blog";

interface BlogPostHeaderProps {
  post: BlogPost;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
  return (
    <header className="relative">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background Image */}
        {post.featuredImage && (
          <div className="absolute inset-0">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover opacity-20"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs text-gray-400 bg-gray-800/50 rounded border border-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Image Section (if no hero image) */}
      {!post.featuredImage && (
        <div className="relative h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
          <div className="text-white/60 text-lg">Featured Article</div>
        </div>
      )}
    </header>
  );
};

export default BlogPostHeader; 