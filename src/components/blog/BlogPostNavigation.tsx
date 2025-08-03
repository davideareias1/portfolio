"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface BlogPostNavigationProps {
  currentSlug: string;
  allPosts: BlogPost[];
}

export default function BlogPostNavigation({ currentSlug, allPosts }: BlogPostNavigationProps) {
  const currentIndex = allPosts.findIndex(post => post.slug === currentSlug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  if (!prevPost && !nextPost) {
    return null;
  }

  return (
    <nav className="flex justify-between items-center py-8 border-t border-gray-200 mt-12">
      <div className="flex-1">
        {prevPost && (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="group flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500 mb-1">Previous post</p>
              <p className="text-base font-medium text-gray-900 group-hover:text-blue-600 truncate">
                {prevPost.title}
              </p>
            </div>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex items-center justify-end space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm text-gray-500 mb-1">Next post</p>
              <p className="text-base font-medium text-gray-900 group-hover:text-blue-600 truncate">
                {nextPost.title}
              </p>
            </div>
            <div className="flex-shrink-0">
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
} 