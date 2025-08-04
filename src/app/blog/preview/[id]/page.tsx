import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogPostHeader from "@/components/blog/BlogPostHeader";
import RichTextEditor from "@/components/RichTextEditor";
import { getBlogPostById } from "@/lib/blog";

interface PreviewBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PreviewBlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    return {};
  }

  return {
    title: `Preview: ${post.seo.title}`,
    description: post.seo.description,
  };
}

export default async function PreviewBlogPostPage({ params }: PreviewBlogPostPageProps) {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1">
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
        </div>
      </div>
    </main>
  );
} 