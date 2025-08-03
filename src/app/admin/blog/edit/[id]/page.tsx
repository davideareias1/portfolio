import BlogPostForm from '@/components/BlogPostForm'
import { getBlogPostById } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageTransition } from '@/components/Motion'

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const post = await getBlogPostById(params.id)

  if (!post) {
    redirect('/admin/blog')
  }

  const initialData = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    categories: post.categories,
    tags: post.tags,
    published: post.published,
    seoTitle: post.seo.title,
    seoDescription: post.seo.description,
    seoKeywords: post.seo.keywords,
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 sm:p-8 md:p-12">
        <PageTransition>
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Edit Post
            </h1>
            <p className="text-gray-400 mb-8">Make changes to your existing blog post.</p>
            <BlogPostForm initialData={initialData} isEditing={true} postId={params.id} />
          </div>
        </PageTransition>
      </div>
    </div>
  )
} 