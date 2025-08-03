-- ====================================
-- ADMIN USER SETUP FOR DAVIDE AREIAS
-- ====================================

-- Step 1: First, you need to create the user via Supabase Auth UI or this SQL
-- Note: This requires admin privileges. You may need to do this through the Supabase dashboard instead.

-- Insert admin user into auth.users (if not using Supabase Auth UI)
-- IMPORTANT: Use Supabase Dashboard > Authentication > Users > "Add User" instead
-- Email: davide@areias.it
-- Password: [choose a secure password]
-- Email Confirm: true

-- Step 2: After creating the auth user, insert the author profile
-- Replace 'USER_UUID_HERE' with the actual UUID from auth.users table

INSERT INTO authors (id, name, image, bio)
VALUES (
  -- Get the UUID from auth.users where email = 'davide@areias.it'
  (SELECT id FROM auth.users WHERE email = 'davide@areias.it' LIMIT 1),
  'Davide Areias',
  '/me.png',
  'Full-stack software engineer with expertise in React, Python, and Rust. Master''s degree in Software Engineering.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  bio = EXCLUDED.bio,
  updated_at = NOW();

-- Step 3: Verify the setup
SELECT 
  u.email,
  u.created_at as user_created,
  a.name,
  a.image,
  a.bio,
  a.created_at as author_created
FROM auth.users u
JOIN authors a ON u.id = a.id
WHERE u.email = 'davide@areias.it';

-- Step 4: Optional - Create a sample blog post for testing
INSERT INTO blog_posts (
  slug,
  title,
  excerpt,
  content,
  featured_image,
  reading_time,
  categories,
  tags,
  published,
  author_id,
  seo_title,
  seo_description,
  seo_keywords
)
VALUES (
  'welcome-to-my-blog',
  'Welcome to My Technical Blog',
  'Exploring the latest in software development, from React and Python to Rust and modern web technologies.',
  '<h1>Welcome to My Blog</h1><p>This is where I share my thoughts and experiences as a <strong>full-stack software engineer</strong>.</p><h2>What You''ll Find Here</h2><ul><li>React and Next.js tutorials</li><li>Python backend development</li><li>Rust programming insights</li><li>Modern web development practices</li></ul><p>I hope you find these articles helpful in your own development journey!</p>',
  '/me.png',
  3,
  ARRAY['welcome', 'meta'],
  ARRAY['introduction', 'blog', 'development'],
  true,
  (SELECT id FROM auth.users WHERE email = 'davide@areias.it' LIMIT 1),
  'Welcome to My Technical Blog - Davide Areias',
  'Join me as I explore software development, sharing insights on React, Python, Rust, and modern web technologies.',
  ARRAY['software development', 'react', 'python', 'rust', 'web development']
)
ON CONFLICT (slug) DO NOTHING; 