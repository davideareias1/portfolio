import { NextRequest, NextResponse } from 'next/server'

import { updateBlogPost, deleteBlogPost } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'
import { validateBlogPostUpdate } from '@/lib/validations'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const rawData = await request.json()
  
  // Validate the data using Zod (partial validation for updates)
  const validationResult = validateBlogPostUpdate(rawData)
  
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ')
    return NextResponse.json({ 
      error: 'Validation failed', 
      details: errorMessages,
      issues: validationResult.error.issues
    }, { status: 400 })
  }

  const postData = validationResult.data
  const updatedPost = await updateBlogPost(id, postData)

  if (updatedPost) {
    return NextResponse.json(updatedPost)
  } else {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const success = await deleteBlogPost(id)

  if (success) {
    return NextResponse.json({ message: 'Post deleted successfully' })
  } else {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
} 