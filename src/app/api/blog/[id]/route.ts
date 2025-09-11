import { NextRequest, NextResponse } from 'next/server'
import type { ZodIssue } from 'zod'

import { updateBlogPost, deleteBlogPost } from '@/lib/blog'
import { applyRateLimit } from '@/lib/rateLimit'
import { isAdminUser, isSameOrigin, sanitizePlainText, sanitizeRichHtml } from '@/lib/security'
import { createClient } from '@/lib/supabase/server'
import { validateBlogPostUpdate } from '@/lib/validations'

function buildSanitizedUpdate(raw: Record<string, unknown>): Record<string, unknown> {
  const update: Record<string, unknown> = {}
  if (raw.slug !== undefined) update.slug = sanitizePlainText(String(raw.slug))
  if (raw.title !== undefined) update.title = sanitizePlainText(String(raw.title))
  if (raw.excerpt !== undefined) update.excerpt = sanitizePlainText(String(raw.excerpt))
  if (raw.content !== undefined) update.content = sanitizeRichHtml(String(raw.content))
  if (raw.featuredImage !== undefined) update.featuredImage = sanitizePlainText(String(raw.featuredImage || ''))
  if (raw.categories !== undefined) update.categories = (raw.categories as string[] | undefined || []).map((c) => sanitizePlainText(c))
  if (raw.tags !== undefined) update.tags = (raw.tags as string[] | undefined || []).map((t) => sanitizePlainText(t))
  if (raw.seoTitle !== undefined) update.seoTitle = sanitizePlainText(String(raw.seoTitle || ''))
  if (raw.seoDescription !== undefined) update.seoDescription = sanitizePlainText(String(raw.seoDescription || ''))
  if (raw.seoKeywords !== undefined) update.seoKeywords = (raw.seoKeywords as string[] | undefined || []).map((k) => sanitizePlainText(k))
  return update
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }

  const rl = applyRateLimit({ request, limit: 20, windowMs: 60_000, identifier: 'blog:put' })
  if (!rl.allowed) {
    return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: rl.headers,
    })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdminUser(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const rawData = await request.json()

  const validationResult = validateBlogPostUpdate(rawData)

  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map((err: ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ')
    return NextResponse.json({ 
      error: 'Validation failed', 
      details: errorMessages,
      issues: validationResult.error.issues
    }, { status: 400 })
  }

  const sanitizedUpdate = buildSanitizedUpdate(validationResult.data as unknown as Record<string, unknown>)
  const updatedPost = await updateBlogPost(id, sanitizedUpdate)

  if (updatedPost) {
    return NextResponse.json(updatedPost, { headers: rl.headers })
  } else {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }

  const rl = applyRateLimit({ request, limit: 10, windowMs: 60_000, identifier: 'blog:delete' })
  if (!rl.allowed) {
    return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: rl.headers,
    })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdminUser(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const success = await deleteBlogPost(id)

  if (success) {
    return NextResponse.json({ message: 'Post deleted successfully' }, { headers: rl.headers })
  } else {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
} 