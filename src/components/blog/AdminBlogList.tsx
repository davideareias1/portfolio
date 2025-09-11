"use client"

import { motion } from 'framer-motion'
import { Edit, Eye, Trash2, BookText, Clock, User, Tag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { BlogPost } from '@/types/blog'

interface AdminBlogListProps {
  posts: BlogPost[];
}

export default function AdminBlogList({ posts }: AdminBlogListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100
      }
    }
  }

  const router = useRouter()
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDeleteConfirmed() {
    if (!postToDelete?.id) return
    try {
      setIsDeleting(true)
      setDeleteError(null)
      const res = await fetch(`/api/blog/${postToDelete.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || 'Failed to delete post')
      }
      setPostToDelete(null)
      setDeleteError(null)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete post'
      setDeleteError(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {posts.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-gray-600/70 hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-100 flex-1 pr-4">{post.title}</h2>
                  {!post.published && (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                <p className="text-gray-400 mb-4 h-20 overflow-hidden text-ellipsis">{post.excerpt}</p>

                <div className="flex flex-col gap-2 text-sm text-gray-400 mb-4 border-t border-b border-gray-700/50 py-3">
                  <div className="flex items-center gap-2"><User size={14} /><span>{post.author.name}</span></div>
                  <div className="flex items-center gap-2"><Clock size={14} /><span>{new Date(post.updatedAt).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-2"><BookText size={14} /><span>{post.readingTime} min read</span></div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Tag size={14} className="text-gray-400 mt-0.5" />
                  {post.categories.slice(0, 3).map((category) => (
                    <span key={category} className="px-2.5 py-0.5 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 bg-black/20 border-t border-gray-700/50">
                {post.published && (
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-white/10 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href={`/admin/blog/edit/${post.id}`}>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-white/10 hover:text-white">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  onClick={() => { setDeleteError(null); setPostToDelete(post) }}
                  disabled={isDeleting}
                  aria-label={`Delete ${post.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl">
          <h2 className="text-2xl font-semibold text-white mb-2">No Posts Yet</h2>
          <p className="text-gray-400 mb-6">Ready to share something great?</p>
          <Link href="/admin/blog/new">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
              Create Your First Post
            </Button>
          </Link>
        </div>
      )}

      {postToDelete && (
        <div className="fixed inset-0 z-[9999] isolate flex items-center justify-center bg-black/80 p-4">
          <div
            className="w-full max-w-md rounded-xl border border-gray-700/60 bg-gray-900 bg-opacity-100 backdrop-blur-0 text-white shadow-2xl"
            style={{ backgroundColor: 'rgb(17,24,39)' }}
          >
            <div className="p-5 border-b border-gray-700/60">
              <h3 className="text-lg font-semibold">Delete post</h3>
            </div>
            <div className="p-5 text-gray-300">
              <p>Are you sure you want to delete &quot;{postToDelete.title}&quot;? This action cannot be undone.</p>
              {deleteError && (
                <p className="mt-3 text-sm text-red-400">{deleteError}</p>
              )}
            </div>
            <div className="p-5 pt-0 flex justify-end gap-3">
              <Button
                variant="ghost"
                className="text-gray-300 hover:bg-white/10 hover:text-white"
                onClick={() => { setPostToDelete(null); setDeleteError(null) }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 