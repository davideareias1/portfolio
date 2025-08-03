-- Migration to fix admin access to all blog posts including drafts
-- This uses the admin user ID directly instead of querying auth.users table

-- Drop existing admin policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admin can view all posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can update all posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can delete all posts" ON blog_posts;

-- Add admin policy to view all posts (using direct user ID)
-- Replace with the actual admin user ID: ebb5ef0a-bf38-47f9-b357-711d576ba070
CREATE POLICY "Admin can view all posts" ON blog_posts FOR SELECT USING (
  auth.uid() = 'ebb5ef0a-bf38-47f9-b357-711d576ba070'::uuid
);

-- Add admin policy to update all posts
CREATE POLICY "Admin can update all posts" ON blog_posts FOR UPDATE USING (
  auth.uid() = 'ebb5ef0a-bf38-47f9-b357-711d576ba070'::uuid
);

-- Add admin policy to delete all posts
CREATE POLICY "Admin can delete all posts" ON blog_posts FOR DELETE USING (
  auth.uid() = 'ebb5ef0a-bf38-47f9-b357-711d576ba070'::uuid
);

-- Verify the policies were created
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'blog_posts' 
AND policyname LIKE '%Admin%'; 