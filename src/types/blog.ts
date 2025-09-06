export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Now stores rich HTML content from Tiptap
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  readingTime?: number;
  categories: string[];
  tags: string[];
  published?: boolean; // Draft/published status
  author: {
    id?: string;
    name: string;
    image?: string;
    bio?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface BlogCategory {
  id?: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  count: number;
}

export interface BlogTag {
  id?: string;
  slug: string;
  name: string;
  count: number;
}

// Database table types
export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  published_at: string;
  updated_at: string;
  reading_time: number | null;
  categories: string[];
  tags: string[];
  published: boolean;
  author_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  created_at: string;
}

export interface AuthorRow {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

// Form types for creating/editing
export interface BlogPostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

// Re-export Zod validation types for consistency
export type { BlogPostValidation, BlogPostUpdateValidation } from '@/lib/validations' 