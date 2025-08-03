import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    slug: "advanced-react-patterns-2024",
    title: "Advanced React Patterns Every Developer Should Know in 2024",
    excerpt: "Explore cutting-edge React patterns including compound components, render props, and custom hooks that will elevate your React development skills.",
    content: "", // Will be populated when implementing the blog post page
    featuredImage: "/blog/react-patterns.jpg",
    publishedAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
    readingTime: 8,
    categories: ["react", "frontend"],
    tags: ["react", "patterns", "hooks", "components"],
    author: {
      name: "Davide Areias",
      image: "/me.png",
      bio: "Full-stack software engineer with expertise in React, Python, and Rust"
    },
    seo: {
      title: "Advanced React Patterns Every Developer Should Know in 2024",
      description: "Learn advanced React patterns including compound components, render props, and custom hooks to build better React applications.",
      keywords: ["react patterns", "react hooks", "compound components", "render props", "react development"]
    }
  },
  {
    slug: "python-async-programming-guide",
    title: "Mastering Asynchronous Programming in Python: A Complete Guide",
    excerpt: "Deep dive into Python's asyncio, understanding event loops, coroutines, and building high-performance asynchronous applications.",
    content: "",
    featuredImage: "/blog/python-async.jpg",
    publishedAt: "2024-03-10T14:30:00Z",
    updatedAt: "2024-03-10T14:30:00Z",
    readingTime: 12,
    categories: ["python", "backend"],
    tags: ["python", "async", "asyncio", "performance"],
    author: {
      name: "Davide Areias",
      image: "/me.png",
      bio: "Full-stack software engineer with expertise in React, Python, and Rust"
    },
    seo: {
      title: "Mastering Asynchronous Programming in Python: Complete Guide",
      description: "Learn Python asyncio, event loops, and coroutines for building high-performance asynchronous applications.",
      keywords: ["python async", "asyncio", "python coroutines", "async programming", "python performance"]
    }
  },
  {
    slug: "rust-web-development-actix",
    title: "Building High-Performance Web APIs with Rust and Actix-Web",
    excerpt: "Learn how to build blazing-fast, memory-safe web APIs using Rust and the Actix-Web framework with practical examples.",
    content: "",
    featuredImage: "/blog/rust-web.jpg",
    publishedAt: "2024-03-05T09:15:00Z",
    updatedAt: "2024-03-05T09:15:00Z",
    readingTime: 15,
    categories: ["rust", "backend"],
    tags: ["rust", "actix-web", "web-api", "performance"],
    author: {
      name: "Davide Areias",
      image: "/me.png",
      bio: "Full-stack software engineer with expertise in React, Python, and Rust"
    },
    seo: {
      title: "Building High-Performance Web APIs with Rust and Actix-Web",
      description: "Build fast, memory-safe web APIs using Rust and Actix-Web framework with practical examples and best practices.",
      keywords: ["rust web development", "actix-web", "rust api", "rust backend", "web performance"]
    }
  },
  {
    slug: "nextjs-seo-optimization-guide",
    title: "Next.js SEO Optimization: Complete 2024 Guide",
    excerpt: "Comprehensive guide to optimizing Next.js applications for search engines including metadata, structured data, and performance.",
    content: "",
    featuredImage: "/blog/nextjs-seo.jpg",
    publishedAt: "2024-02-28T16:45:00Z",
    updatedAt: "2024-02-28T16:45:00Z",
    readingTime: 10,
    categories: ["nextjs", "seo"],
    tags: ["nextjs", "seo", "optimization", "metadata"],
    author: {
      name: "Davide Areias",
      image: "/me.png",
      bio: "Full-stack software engineer with expertise in React, Python, and Rust"
    },
    seo: {
      title: "Next.js SEO Optimization: Complete 2024 Guide",
      description: "Learn how to optimize Next.js applications for SEO with metadata, structured data, and performance optimization techniques.",
      keywords: ["nextjs seo", "next.js optimization", "react seo", "web optimization", "search engine optimization"]
    }
  },
  {
    slug: "database-design-patterns",
    title: "Essential Database Design Patterns for Scalable Applications",
    excerpt: "Explore crucial database design patterns including CQRS, Event Sourcing, and database sharding for building scalable systems.",
    content: "",
    featuredImage: "/blog/database-patterns.jpg",
    publishedAt: "2024-02-20T11:20:00Z",
    updatedAt: "2024-02-20T11:20:00Z",
    readingTime: 14,
    categories: ["database", "architecture"],
    tags: ["database", "patterns", "scalability", "architecture"],
    author: {
      name: "Davide Areias",
      image: "/me.png",
      bio: "Full-stack software engineer with expertise in React, Python, and Rust"
    },
    seo: {
      title: "Essential Database Design Patterns for Scalable Applications",
      description: "Learn essential database design patterns like CQRS, Event Sourcing, and sharding for building scalable applications.",
      keywords: ["database design", "database patterns", "scalable architecture", "CQRS", "event sourcing"]
    }
  },
  {
    slug: "modern-css-techniques-2024",
    title: "Modern CSS Techniques That Will Transform Your Designs",
    excerpt: "Discover the latest CSS features including container queries, cascade layers, and advanced grid techniques for modern web design.",
    content: "",
    featuredImage: "/blog/modern-css.jpg",
    publishedAt: "2024-02-15T13:10:00Z",
    updatedAt: "2024-02-15T13:10:00Z",
    readingTime: 7,
    categories: ["css", "frontend"],
    tags: ["css", "design", "layout", "modern-web"],
    author: {
      name: "Davide Areias",
      image: "/me.png",
      bio: "Full-stack software engineer with expertise in React, Python, and Rust"
    },
    seo: {
      title: "Modern CSS Techniques That Will Transform Your Designs",
      description: "Learn modern CSS techniques including container queries, cascade layers, and advanced grid for better web design.",
      keywords: ["modern css", "css techniques", "container queries", "css grid", "web design"]
    }
  }
]; 