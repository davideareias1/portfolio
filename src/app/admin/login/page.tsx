import { redirect } from 'next/navigation'

import LoginForm from '@/components/LoginForm'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLoginPage() {
  const supabase = await createClient()
  
  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/admin/blog')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to manage your blog</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
} 