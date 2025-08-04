import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import AdminBlogList from '@/components/blog/AdminBlogList'
import { PageTransition } from '@/components/Motion'
import { Button } from '@/components/ui/button'
import { getAllBlogPosts } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'




export default async function AdminBlogPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/admin/login')
  }

  const posts = await getAllBlogPosts()

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white overflow-hidden p-6 sm:p-8 md:p-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <PageTransition>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Blog Management
            </h1>
            <Link href="/admin/blog/new">
              <Button className="group relative flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg overflow-hidden">
                <Plus className="h-5 w-5" />
                <span>New Post</span>
              </Button>
            </Link>
          </div>
          <AdminBlogList posts={posts} />
        </div>
      </PageTransition>
    </div>
  )
} 