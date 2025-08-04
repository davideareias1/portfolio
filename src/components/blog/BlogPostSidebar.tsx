"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Tag, User, Share2 } from "lucide-react";
import Image from "next/image";
import React from "react";

import { BlogPost } from "@/types/blog";

interface BlogPostSidebarProps {
  post: BlogPost;
}

const BlogPostSidebar: React.FC<BlogPostSidebarProps> = ({ post }) => {
  return (
    <aside className="space-y-8">
      {/* Author Card */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="text-center">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={100}
              height={100}
              className="rounded-full mx-auto mb-4"
            />
          ) : (
            <div className="w-25 h-25 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} className="text-gray-400" />
            </div>
          )}
          <h3 className="text-xl font-semibold text-white mb-2">{post.author.name}</h3>
          {post.author.bio && (
            <p className="text-gray-400 text-sm mb-4">{post.author.bio}</p>
          )}
        </div>
      </motion.div>

      {/* Post Meta */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Article Info</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-400">
            <Calendar size={16} />
            <span className="text-sm">
              Published {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-400">
            <Clock size={16} />
            <span className="text-sm">{post.readingTime} minute read</span>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30"
            >
              {category}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-gray-800/50 rounded border border-gray-700"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Share */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Share</h3>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 transition-colors duration-300">
          <Share2 size={16} />
          Share Article
        </button>
      </motion.div>
    </aside>
  );
};

export default BlogPostSidebar; 