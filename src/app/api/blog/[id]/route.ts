import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateBlogPost, deleteBlogPost } from '@/lib/blog'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const postData = await request.json()
  const updatedPost = await updateBlogPost(params.id, postData)

  if (updatedPost) {
    return NextResponse.json(updatedPost)
  } else {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const success = await deleteBlogPost(params.id)

  if (success) {
    return NextResponse.json({ message: 'Post deleted successfully' })
  } else {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
} 