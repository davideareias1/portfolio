import type { Metadata } from "next";

import BlogCategories from "@/components/blog/BlogCategories";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogHero from "@/components/blog/BlogHero";
import { getPublishedBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Davide Areias - Software Engineering Insights",
  description: "Explore in-depth articles on software development, Python, React, Rust, and modern web technologies. Expert insights from a full-stack engineer with Master's degree.",
  openGraph: {
    title: "Blog | Davide Areias - Software Engineering Insights",
    description: "Explore in-depth articles on software development, Python, React, Rust, and modern web technologies.",
    url: "https://areias.it/blog",
    type: "website",
    images: [
      {
        url: "/blog-og.png",
        width: 1200,
        height: 630,
        alt: "Davide Areias Blog - Software Engineering Insights"
      }
    ]
  },
  keywords: [
    "software development blog",
    "Python programming",
    "React development",
    "Rust programming",
    "web development",
    "full-stack engineering",
    "technical tutorials",
    "coding best practices"
  ]
};

export default async function BlogPage() {
  const blogPosts = await getPublishedBlogPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Davide Areias Blog",
    "description": "Software engineering insights and technical tutorials",
    "url": "https://areias.it/blog",
    "author": {
      "@type": "Person",
      "name": "Davide Areias",
      "url": "https://areias.it"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://areias.it/blog/${post.slug}`,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <BlogHero />
        <BlogCategories />
        <BlogGrid posts={blogPosts} />
      </main>
    </>
  );
} 