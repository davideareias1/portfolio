'use client'

import { motion } from 'framer-motion'
import { Save, Eye, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import { BlogPostForm as BlogPostFormType } from '@/types/blog'

import RichTextEditor from './RichTextEditor'
import { Button } from './ui/button'



interface BlogPostFormProps {
  initialData?: Partial<BlogPostFormType>
  isEditing?: boolean
  postId?: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function BlogPostForm({ initialData, isEditing = false, postId }: BlogPostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BlogPostFormType>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categories: [],
    tags: [],
    published: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    ...initialData,
  })
  const [isSaving, setIsSaving] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !isEditing) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }))
    }
  }, [formData.title, isEditing])

  const handleSubmit = async (published: boolean, { redirectOnSuccess = true } = {}) => {
    setIsLoading(true)
    setIsSaving(true)
    setError(null)
    
    const submitData = {
      ...formData,
      published,
      seoTitle: formData.seoTitle || formData.title,
      seoDescription: formData.seoDescription || formData.excerpt,
    }

    try {
      const response = await fetch(
        isEditing ? `/api/blog/${postId}` : '/api/blog',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        }
      )

      if (response.ok) {
        if (redirectOnSuccess) {
          router.push('/admin/blog')
          router.refresh()
        }
        return response.json()
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || 'Failed to save post'
        setError(errorMessage)
        console.error('Failed to save post:', errorData)
        return null
      }
    } catch (error) {
      console.error('Error saving post:', error)
      setError('Network error occurred while saving post')
      return null
    } finally {
      setIsLoading(false)
      setIsSaving(false)
    }
  }

  const handlePreview = async () => {
    const savedPost = await handleSubmit(formData.published, { redirectOnSuccess: false })
    if (savedPost && savedPost.id) {
      window.open(`/blog/preview/${savedPost.id}`, '_blank')
    } else {
      console.error('Failed to save post for preview')
      // Optionally, show a more user-friendly error message
    }
  }

  const handleCategoryAdd = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }))
    }
  }

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const inputClasses = "w-full p-3 bg-white/5 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 text-gray-200 placeholder-gray-500"
  const labelClasses = "block text-sm font-medium mb-2 text-gray-300"

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
        {isEditing && postId && (
           <Button
             onClick={handlePreview}
             variant="ghost"
             size="sm"
             disabled={isSaving}
             className="text-gray-300 hover:bg-white/10 hover:text-white border-gray-700"
           >
             <Eye size={16} className="mr-2" />
             {isSaving ? 'Saving...' : 'Preview'}
           </Button>
         )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div>
            <label className={labelClasses}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={inputClasses}
              placeholder="Enter blog post title..."
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelClasses}>Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className={inputClasses}
              placeholder="url-friendly-slug"
              required
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelClasses}>Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
            className={inputClasses}
            placeholder="Brief description of the post..."
            required
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className={labelClasses}>Featured Image URL</label>
          <input
            type="url"
            value={formData.featuredImage}
            onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
            className={inputClasses}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Content */}
        <div>
          <label className={labelClasses}>Content</label>
          <div className='mt-2'>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories */}
          <div>
            <label className={labelClasses}>Categories</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.categories.map((category) => (
                <span key={category} className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/20">
                  {category}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      categories: prev.categories.filter(c => c !== category)
                    }))}
                    className="text-blue-300 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add category and press Enter..."
              className={inputClasses}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleCategoryAdd(e.currentTarget.value.trim())
                  e.currentTarget.value = ''
                }
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelClasses}>Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-gray-500/10 text-gray-300 rounded-full text-sm border border-gray-500/20">
                  {tag}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      tags: prev.tags.filter(t => t !== tag)
                    }))}
                    className="text-gray-300 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tag and press Enter..."
              className={inputClasses}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleTagAdd(e.currentTarget.value.trim())
                  e.currentTarget.value = ''
                }
              }}
            />
          </div>
        </div>

        {/* SEO Fields */}
        <div className="border-t border-gray-700/50 pt-8">
          <h3 className="text-xl font-semibold mb-4 text-white">SEO Settings</h3>
          
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>SEO Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                className={inputClasses}
                placeholder="Leave empty to use post title"
              />
            </div>

            <div>
              <label className={labelClasses}>SEO Description</label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                rows={2}
                className={inputClasses}
                placeholder="Leave empty to use excerpt"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-4 pt-8 border-t border-gray-700/50">
          <Button
            type="button"
            onClick={() => handleSubmit(false, { redirectOnSuccess: !isEditing })}
            disabled={isLoading}
            variant="ghost"
            className="text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Save as Draft')}
          </Button>
          
          <motion.button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center justify-center gap-2 rounded-lg bg-blue-500 backdrop-blur-sm px-6 py-2.5 text-base font-semibold text-white shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Eye className="h-4 w-4" />
            <span>{isLoading ? 'Publishing...' : (isEditing ? 'Update & Publish' : 'Publish')}</span>
          </motion.button>
        </div>
      </form>
    </div>
  )
} 