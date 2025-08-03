-- ====================================
-- ADMIN SETUP MIGRATION
-- ====================================

-- Function to check if user is admin by email
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

-- Admin policies for blog posts using the function
CREATE POLICY "Admin can view all posts" ON blog_posts FOR SELECT USING (
  is_admin_user(auth.uid())
);

CREATE POLICY "Admin can update all posts" ON blog_posts FOR UPDATE USING (
  is_admin_user(auth.uid())
);

CREATE POLICY "Admin can delete all posts" ON blog_posts FOR DELETE USING (
  is_admin_user(auth.uid())
);

-- Insert admin author profile (will be created when auth user exists)
-- This will run after the admin user is created through Supabase Auth
INSERT INTO authors (id, name, image, bio)
SELECT 
  u.id,
  'Davide Areias',
  '/me.png',
  'Full-stack software engineer with expertise in React, Python, and Rust. Master''s degree in Software Engineering.'
FROM auth.users u
WHERE u.email = 'davide@areias.it'
AND NOT EXISTS (SELECT 1 FROM authors WHERE id = u.id); 