-- ====================================
-- FIX HARDCODED ADMIN MIGRATION
-- ====================================
-- This migration removes hardcoded admin UUIDs and replaces them with email-based admin detection

-- Drop existing hardcoded admin policies if they exist
DROP POLICY IF EXISTS "Admin can view all posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can update all posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can delete all posts" ON blog_posts;

-- Create the admin check function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND email = 'davide@areias.it'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create admin policies using the function
CREATE POLICY "Admin can view all posts" ON blog_posts FOR SELECT USING (
  is_admin_user(auth.uid())
);

CREATE POLICY "Admin can update all posts" ON blog_posts FOR UPDATE USING (
  is_admin_user(auth.uid())
);

CREATE POLICY "Admin can delete all posts" ON blog_posts FOR DELETE USING (
  is_admin_user(auth.uid())
);

-- Verify the policies were created correctly
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'blog_posts' 
AND policyname LIKE '%Admin%'; 