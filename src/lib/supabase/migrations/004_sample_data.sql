-- ====================================
-- SAMPLE DATA MIGRATION
-- ====================================

-- Create a sample blog post for testing (only if admin author exists)
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
SELECT 
  'welcome-to-my-blog',
  'Welcome to My Technical Blog',
  'Exploring the latest in software development, from React and Python to Rust and modern web technologies.',
  '<h1>Welcome to My Blog</h1><p>This is where I share my thoughts and experiences as a <strong>full-stack software engineer</strong>.</p><h2>What You''ll Find Here</h2><ul><li>React and Next.js tutorials</li><li>Python backend development</li><li>Rust programming insights</li><li>Modern web development practices</li></ul><p>I hope you find these articles helpful in your own development journey!</p>',
  '/me.png',
  3,
  ARRAY['welcome', 'meta'],
  ARRAY['introduction', 'blog', 'development'],
  true,
  u.id,
  'Welcome to My Technical Blog - Davide Areias',
  'Join me as I explore software development, sharing insights on React, Python, Rust, and modern web technologies.',
  ARRAY['software development', 'react', 'python', 'rust', 'web development']
FROM auth.users u
WHERE u.email = 'davide@areias.it'
AND NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'welcome-to-my-blog'); 