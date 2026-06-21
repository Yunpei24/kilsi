-- 1. Create faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  question_fr text NOT NULL,
  question_en text NOT NULL,
  answer_fr text NOT NULL,
  answer_en text NOT NULL,
  display_order integer NOT NULL DEFAULT 10
);

-- 2. Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY, -- Slug of the article
  created_at timestamptz DEFAULT now(),
  title_fr text NOT NULL,
  title_en text NOT NULL,
  summary_fr text NOT NULL,
  summary_en text NOT NULL,
  content_fr text[] NOT NULL,
  content_en text[] NOT NULL,
  author_fr text NOT NULL DEFAULT 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
  author_en text NOT NULL DEFAULT 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
  date text NOT NULL,
  read_time_fr text NOT NULL,
  read_time_en text NOT NULL,
  published boolean DEFAULT true
);

-- 3. Create fasolabel_applications table
CREATE TABLE IF NOT EXISTS fasolabel_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  last_name text NOT NULL,
  first_name text NOT NULL,
  whatsapp text NOT NULL,
  email text NOT NULL,
  studies text NOT NULL,
  languages text[] NOT NULL,
  motivation text,
  cv_url text
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasolabel_applications ENABLE ROW LEVEL SECURITY;

-- 5. FAQ Table Security Policies
CREATE POLICY "Allow public read on faqs" 
ON faq_items FOR SELECT 
USING (true);

CREATE POLICY "Allow full admin control on faqs" 
ON faq_items FOR ALL 
TO authenticated 
USING (true);

-- 6. Blog Table Security Policies
CREATE POLICY "Allow public read on published blogs" 
ON blog_posts FOR SELECT 
USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow full admin control on blogs" 
ON blog_posts FOR ALL 
TO authenticated 
USING (true);

-- 7. FasoLabel Applications Security Policies
CREATE POLICY "Allow anonymous write on applications" 
ON fasolabel_applications FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow full admin control on applications" 
ON fasolabel_applications FOR ALL 
TO authenticated 
USING (true);

-- 8. Storage Configuration (cv-uploads bucket)
-- Create bucket if it doesn't exist (running as postgres)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-uploads', 'cv-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow anyone to upload files (anonymously) into the cv-uploads bucket
CREATE POLICY "Allow public uploads to cv-uploads" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'cv-uploads');

-- Policy to allow authenticated admin full access to files in the cv-uploads bucket
CREATE POLICY "Allow authenticated read/write/delete on cv-uploads" 
ON storage.objects FOR ALL 
TO authenticated 
USING (bucket_id = 'cv-uploads');
