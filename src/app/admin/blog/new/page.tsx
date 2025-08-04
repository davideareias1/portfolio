import { redirect } from 'next/navigation'

import BlogPostForm from '@/components/BlogPostForm'
import { PageTransition } from '@/components/Motion'
import { createClient } from '@/lib/supabase/server'

export default async function NewBlogPostPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/admin/login')
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto p-6 sm:p-8 md:p-12">
        <PageTransition>
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Create New Blog Post
            </h1>
            <p className="text-gray-400 mb-8">Fill in the details below to create a new post.</p>
            <BlogPostForm />
          </div>
        </PageTransition>
      </div>
    </div>
  )
} 