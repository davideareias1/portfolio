# Database Migrations

This directory contains SQL migrations for the portfolio blog system using Supabase.

## Migration Files

1. **001_initial_schema.sql** - Creates the initial database schema with authors and blog_posts tables
2. **002_admin_setup.sql** - Sets up admin access using email-based detection (no hardcoded UUIDs)
3. **003_fix_hardcoded_admin.sql** - Migration to fix existing hardcoded admin UUIDs
4. **004_sample_data.sql** - Creates sample blog post data

## Setup Instructions

### 1. Create Admin User
First, create the admin user through Supabase Dashboard:
- Go to Authentication > Users > "Add User"
- Email: `davide@areias.it`
- Password: [choose a secure password]
- Email Confirm: ✅ true

### 2. Run Migrations
Execute the migrations in order through Supabase SQL Editor:

```sql
-- Run each migration file in sequence:
-- 1. 001_initial_schema.sql
-- 2. 002_admin_setup.sql (or 003_fix_hardcoded_admin.sql if updating existing)
-- 3. 004_sample_data.sql
```

### 3. Verify Setup
Check that everything is working:

```sql
-- Check admin user and author profile
SELECT 
  u.email,
  u.created_at as user_created,
  a.name,
  a.image,
  a.bio
FROM auth.users u
JOIN authors a ON u.id = a.id
WHERE u.email = 'davide@areias.it';

-- Check admin policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'blog_posts' 
AND policyname LIKE '%Admin%';
```

## Key Features

### Dynamic Admin Detection
Instead of hardcoded UUIDs, the system uses an email-based function:

```sql
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
```

### Row Level Security (RLS)
- **Authors**: Can manage their own profiles
- **Blog Posts**: 
  - Everyone can read published posts
  - Authors can manage their own posts
  - Admin can manage all posts (via email detection)

## Troubleshooting

### If you have existing hardcoded admin policies:
Run migration `003_fix_hardcoded_admin.sql` to remove hardcoded UUIDs and replace with email-based detection.

### Admin access not working:
1. Verify admin user email is exactly `davide@areias.it`
2. Check that the `is_admin_user` function exists
3. Verify admin policies are using the function, not hardcoded UUIDs 