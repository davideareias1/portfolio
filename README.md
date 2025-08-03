# Portfolio Blog

A modern Next.js portfolio with integrated blog functionality using Supabase as the backend.

## Features

- 🎨 Modern, responsive design
- ✍️ Rich text blog editor (Tiptap)
- 🔐 Secure admin authentication
- 📝 Draft/publish blog posts
- 🔍 SEO optimized
- 🚀 Fast performance with Next.js 14

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Editor:** Tiptap (Rich text)
- **Deployment:** Vercel

## Setup Instructions

### 1. Clone and Install

```bash
git clone [your-repo-url]
cd portfolio
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup

1. **Create Supabase Project:** Go to [supabase.com](https://supabase.com) and create a new project

2. **Create Admin User:** In Supabase Dashboard > Authentication > Users > "Add User"
   - Email: `davide@areias.it`
   - Password: [secure password]
   - Email Confirm: ✅ true

3. **Run Database Migration:** Copy and paste the contents of `src/lib/supabase/deploy.sql` into your Supabase SQL Editor and run it.

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
