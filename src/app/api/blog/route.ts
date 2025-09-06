import { NextRequest, NextResponse } from 'next/server'

import { createBlogPost } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'
import { BlogPostForm } from '@/types/blog'
import { validateBlogPost } from '@/lib/validations'


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rawData = await request.json()

    // Validate the data using Zod
    const validationResult = validateBlogPost(rawData)
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ')
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: errorMessages,
        issues: validationResult.error.issues
      }, { status: 400 })
    }

    const postData: BlogPostForm = validationResult.data

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