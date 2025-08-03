import { createClient } from '@/lib/supabase/server'
import { createBlogPost } from '@/lib/blog'
import { BlogPostForm } from '@/types/blog'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const postData: BlogPostForm = await request.json()

    // Validate required fields
    if (!postData.title || !postData.slug || !postData.excerpt || !postData.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create the blog post
    const newPost = await createBlogPost(postData, user.id)

    if (!newPost) {
      return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
    }

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 