-- ====================================
-- COMPLETE DEPLOYMENT SCRIPT
-- ====================================
-- This script sets up the entire database schema and admin access
-- Run this in your Supabase SQL Editor after creating the admin user

-- STEP 1: Initial Schema
-- ====================================

-- Authors table (extends auth.users)
CREATE TABLE IF NOT EXISTS authors (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  reading_time INTEGER,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- STEP 2: Functions and Triggers
-- ====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Admin check function (email-based, no hardcoded UUIDs)
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

-- Triggers
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 3: Clean up any existing hardcoded admin policies
-- ====================================

DROP POLICY IF EXISTS "Admin can view all posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can update all posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can delete all posts" ON blog_posts;

-- STEP 4: RLS Policies
-- ====================================

-- Policies for authors
CREATE POLICY "Authors can view all profiles" ON authors FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON authors FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON authors FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for blog posts
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Authors can view all their own posts" ON blog_posts FOR SELECT USING (author_id = auth.uid());
CREATE POLICY "Authors can create posts" ON blog_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors can update their own posts" ON blog_posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors can delete their own posts" ON blog_posts FOR DELETE USING (author_id = auth.uid());

-- Admin policies (using email-based function)
CREATE POLICY "Admin can view all posts" ON blog_posts FOR SELECT USING (
  is_admin_user(auth.uid())
);

CREATE POLICY "Admin can update all posts" ON blog_posts FOR UPDATE USING (
  is_admin_user(auth.uid())
);

CREATE POLICY "Admin can delete all posts" ON blog_posts FOR DELETE USING (
  is_admin_user(auth.uid())
);

-- STEP 5: Indexes
-- ====================================

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS blog_posts_author_idx ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS blog_posts_categories_idx ON blog_posts USING GIN(categories);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON blog_posts USING GIN(tags);

-- STEP 6: Insert Admin Author Profile
-- ====================================

INSERT INTO authors (id, name, image, bio)
SELECT 
  u.id,
  'Davide Areias',
  '/me.png',
  'Full-stack software engineer with expertise in React, Python, and Rust. Master''s degree in Software Engineering.'
FROM auth.users u
WHERE u.email = 'davide@areias.it'
AND NOT EXISTS (SELECT 1 FROM authors WHERE id = u.id);

-- STEP 7: Sample Data (Optional)
-- ====================================

INSERT INTO blog_posts (
  slug, title, excerpt, content, featured_image, reading_time,
  categories, tags, published, author_id, seo_title, seo_description, seo_keywords
)
SELECT 
  'welcome-to-my-blog',
  'Welcome to My Technical Blog',
  'Exploring the latest in software development, from React and Python to Rust and modern web technologies.',
  '<h1>Welcome to My Blog</h1><p>This is where I share my thoughts and experiences as a <strong>full-stack software engineer</strong>.</p><h2>What You''ll Find Here</h2><ul><li>React and Next.js tutorials</li><li>Python backend development</li><li>Rust programming insights</li><li>Modern web development practices</li></ul><p>I hope you find these articles helpful in your own development journey!</p>',
  '/me.png', 3,
  ARRAY['welcome', 'meta'], ARRAY['introduction', 'blog', 'development'], true,
  u.id,
  'Welcome to My Technical Blog - Davide Areias',
  'Join me as I explore software development, sharing insights on React, Python, Rust, and modern web technologies.',
  ARRAY['software development', 'react', 'python', 'rust', 'web development']
FROM auth.users u
WHERE u.email = 'davide@areias.it'
AND NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'welcome-to-my-blog');

-- STEP 8: Verification
-- ====================================

-- Check setup
SELECT 
  'Setup complete!' as status,
  (SELECT COUNT(*) FROM authors WHERE id IN (SELECT id FROM auth.users WHERE email = 'davide@areias.it')) as admin_author_created,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'blog_posts' AND policyname LIKE '%Admin%') as admin_policies_count; 