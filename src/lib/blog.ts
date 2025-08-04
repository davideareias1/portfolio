import { createBuildClient } from '@/lib/supabase/build'
import { createClient } from '@/lib/supabase/server'
import { BlogPost, BlogPostRow, BlogPostForm, AuthorRow } from '@/types/blog'

// Transform database row to BlogPost type
function transformBlogPost(row: BlogPostRow, author?: AuthorRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: row.featured_image || '',
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    readingTime: row.reading_time || 0,
    categories: row.categories || [],
    tags: row.tags || [],
    published: row.published,
    author: {
      id: author?.id,
      name: author?.name || 'Anonymous',
      image: author?.image || '',
      bio: author?.bio || '',
    },
    seo: {
      title: row.seo_title || row.title,
      description: row.seo_description || row.excerpt,
      keywords: row.seo_keywords || [],
    },
  }
}

// Calculate reading time (approximate)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Build-time functions (for generateStaticParams, etc.)
export async function getPublishedBlogPostsBuild(): Promise<BlogPost[]> {
  const supabase = createBuildClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      authors (*)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data.map(row => transformBlogPost(row, row.authors))
}

export async function getBlogPostBySlugBuild(slug: string): Promise<BlogPost | null> {
  const supabase = createBuildClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      authors (*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) {
    return null
  }

  return transformBlogPost(data, data.authors)
}

// Runtime functions (for server components during requests)
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      authors (*)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data.map(row => transformBlogPost(row, row.authors))
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      authors (*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) {
    return null
  }

  return transformBlogPost(data, data.authors)
}

// Get blog post by ID (for editing and previewing)
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      authors (*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return transformBlogPost(data, data.authors)
}

// Get all blog posts for admin (including drafts)
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      authors (*)
    `)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching all blog posts:', error)
    return []
  }

  return data.map(row => transformBlogPost(row, row.authors))
}

// Create new blog post
export async function createBlogPost(postData: BlogPostForm, authorId: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  
  const readingTime = calculateReadingTime(postData.content)
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug: postData.slug,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      featured_image: postData.featuredImage || null,
      reading_time: readingTime,
      categories: postData.categories,
      tags: postData.tags,
      published: postData.published,
      author_id: authorId,
      seo_title: postData.seoTitle || null,
      seo_description: postData.seoDescription || null,
      seo_keywords: postData.seoKeywords || [],
    })
    .select(`
      *,
      authors (*)
    `)
    .single()

  if (error || !data) {
    console.error('Error creating blog post:', error)
    return null
  }

  return transformBlogPost(data, data.authors)
}

// Update blog post
export async function updateBlogPost(id: string, postData: BlogPostForm): Promise<BlogPost | null> {
  const supabase = await createClient()
  
  const readingTime = calculateReadingTime(postData.content)
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      slug: postData.slug,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      featured_image: postData.featuredImage || null,
      reading_time: readingTime,
      categories: postData.categories,
      tags: postData.tags,
      published: postData.published,
      seo_title: postData.seoTitle || null,
      seo_description: postData.seoDescription || null,
      seo_keywords: postData.seoKeywords || [],
    })
    .eq('id', id)
    .select(`
      *,
      authors (*)
    `)
    .single()

  if (error || !data) {
    console.error('Error updating blog post:', error)
    return null
  }

  return transformBlogPost(data, data.authors)
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    return false
  }

  return true
} 