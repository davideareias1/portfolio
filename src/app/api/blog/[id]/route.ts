import { NextRequest, NextResponse } from 'next/server'

import { updateBlogPost, deleteBlogPost } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const postData = await request.json()
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