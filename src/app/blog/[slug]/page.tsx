import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogPostNavigation from "@/components/blog/BlogPostNavigation";
import BlogPostSidebar from "@/components/blog/BlogPostSidebar";
import RelatedPosts from "@/components/blog/RelatedPosts";
import RichTextEditor from "@/components/RichTextEditor";
import { getBlogPostBySlug, getPublishedBlogPosts, getPublishedBlogPostsBuild, getBlogPostBySlugBuild } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Use build-time function that doesn't require cookies
  const posts = await getPublishedBlogPostsBuild();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Use build-time function that doesn't require cookies
  const post = await getBlogPostBySlugBuild(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      url: `https://areias.it/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  // Use runtime function for actual page rendering
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.categories.some(cat => post.categories.includes(cat)))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage || "",
    "url": `https://areias.it/blog/${post.slug}`,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "image": post.author.image || ""
    },
    "publisher": {
      "@type": "Person",
      "name": "Davide Areias",
      "url": "https://areias.it"
    },
    "wordCount": post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
    "articleSection": post.categories,
    "keywords": post.tags
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article>
              <BlogPostHeader post={post} />
              <div className="prose prose-lg max-w-none mt-8">
                <RichTextEditor
                  content={post.content}
                  editable={false}
                />
              </div>
            </article>
            <BlogPostNavigation currentSlug={post.slug} allPosts={allPosts} />
            {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
          </div>
          <div className="lg:col-span-1">
            <BlogPostSidebar post={post} />
          </div>
        </div>
      </main>
    </>
  );
} 