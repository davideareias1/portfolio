"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogPostContentProps {
  post: BlogPost;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  const shareUrl = `https://areias.it/blog/${post.slug}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  // Sample rich content - in a real implementation, this would be rendered from markdown/MDX
  const sampleContent = `
    <h2 id="introduction">Introduction</h2>
    <p>This is where the introduction content would go. In a real implementation, you would render this from markdown, MDX, or your chosen rich text format.</p>
    
    <h2 id="getting-started">Getting Started</h2>
    <p>Here's how to get started with this topic. You can include code blocks, images, and other rich content.</p>
    
    <pre><code>
// Example code block
const example = {
  framework: 'React',
  language: 'TypeScript',
  styling: 'Tailwind CSS'
};
    </code></pre>
    
    <h2 id="advanced-concepts">Advanced Concepts</h2>
    <p>More advanced topics and concepts would be covered here.</p>
    
    <h3 id="best-practices">Best Practices</h3>
    <p>Important best practices and recommendations.</p>
    
    <h3 id="performance-tips">Performance Tips</h3>
    <p>Tips for optimizing performance and efficiency.</p>
    
    <h2 id="conclusion">Conclusion</h2>
    <p>Summary and final thoughts on the topic.</p>
  `;

  return (
    <div className="relative">
      {/* Floating Share Buttons */}
      <motion.div
        className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 z-40"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="flex flex-col gap-3">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
          >
            <Twitter size={20} />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-500 hover:bg-blue-600/30 transition-all duration-300"
          >
            <Linkedin size={20} />
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="p-3 bg-gray-500/20 backdrop-blur-sm border border-gray-400/30 rounded-full text-gray-400 hover:bg-gray-500/30 transition-all duration-300"
          >
            <LinkIcon size={20} />
          </button>
        </div>
      </motion.div>

      {/* Main Content - Now takes full width */}
      <motion.article
        id="article-content"
        className="prose prose-lg prose-invert max-w-none"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Rich Text Content Container */}
        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12">
          {/* Content Note */}
          <div className="mb-8 p-6 bg-blue-500/10 border border-blue-400/30 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Rich Text Editor Integration</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              This content area is designed to work seamlessly with rich text editors like:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-gray-300">
              <li>• <strong>TinyMCE</strong> - Full-featured WYSIWYG editor</li>
              <li>• <strong>Quill.js</strong> - Modern rich text editor</li>
              <li>• <strong>Draft.js</strong> - React-based editor framework</li>
              <li>• <strong>Tiptap</strong> - Headless editor built on ProseMirror</li>
              <li>• <strong>MDX</strong> - Markdown with JSX components</li>
            </ul>
          </div>

          {/* Sample Content */}
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: sampleContent }}
          />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-full px-4 py-2 hover:bg-blue-500/20 transition-colors duration-300 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>

      {/* Mobile Share Bar */}
      <motion.div
        className="lg:hidden fixed bottom-16 left-4 right-4 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Share2 size={18} />
              <span className="text-sm">Share this article</span>
            </div>
            <div className="flex gap-2">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-500/20 rounded-lg text-blue-400"
              >
                <Twitter size={16} />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600/20 rounded-lg text-blue-500"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogPostContent; 