import { NextRequest, NextResponse } from 'next/server'
import type { ZodIssue } from 'zod'

import { createBlogPost } from '@/lib/blog'
import { applyRateLimit } from '@/lib/rateLimit'
import { isAdminUser, isSameOrigin, sanitizePlainText, sanitizeRichHtml } from '@/lib/security'
import { createClient } from '@/lib/supabase/server'
import { validateBlogPost } from '@/lib/validations'
import { BlogPostForm } from '@/types/blog'

function buildSanitizedPost(data: BlogPostForm): BlogPostForm {
  return {
    ...data,
    title: sanitizePlainText(data.title),
    slug: sanitizePlainText(data.slug),
    excerpt: sanitizePlainText(data.excerpt),
    content: sanitizeRichHtml(data.content),
    featuredImage: sanitizePlainText(data.featuredImage || ''),
    seoTitle: sanitizePlainText(data.seoTitle || ''),
    seoDescription: sanitizePlainText(data.seoDescription || ''),
    seoKeywords: (data.seoKeywords || []).map((k) => sanitizePlainText(k)),
    categories: (data.categories || []).map((c) => sanitizePlainText(c)),
    tags: (data.tags || []).map((t) => sanitizePlainText(t)),
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }

    const rl = applyRateLimit({ request, limit: 10, windowMs: 60_000, identifier: 'blog:post' })
    if (!rl.allowed) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: rl.headers,
      })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const rawData = await request.json()
    const validationResult = validateBlogPost(rawData)
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((err: ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ')
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: errorMessages,
        issues: validationResult.error.issues
      }, { status: 400 })
    }

    const postData = buildSanitizedPost(validationResult.data as BlogPostForm)
    const newPost = await createBlogPost(postData, user.id)

    if (!newPost) {
      return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
    }

    return NextResponse.json(newPost, { status: 201, headers: rl.headers })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 