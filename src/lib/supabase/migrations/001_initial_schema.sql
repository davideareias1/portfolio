-- ====================================
-- INITIAL SCHEMA MIGRATION
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
  content TEXT NOT NULL, -- Rich HTML content from Tiptap
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

-- Policies for authors
CREATE POLICY "Authors can view all profiles" ON authors FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON authors FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON authors FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for blog posts (without hardcoded admin)
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Authors can view all their own posts" ON blog_posts FOR SELECT USING (author_id = auth.uid());
CREATE POLICY "Authors can create posts" ON blog_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors can update their own posts" ON blog_posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors can delete their own posts" ON blog_posts FOR DELETE USING (author_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS blog_posts_author_idx ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS blog_posts_categories_idx ON blog_posts USING GIN(categories);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON blog_posts USING GIN(tags);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 