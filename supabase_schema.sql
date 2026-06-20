-- ==========================================
-- Supabase Schema for StellaPort Doodle Gallery
-- ==========================================

-- 1. Create the 'drawings' table
CREATE TABLE IF NOT EXISTS public.drawings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    path TEXT NOT NULL UNIQUE,
    caption TEXT,
    flagged BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS) on public.drawings
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;

-- Create policies for public.drawings:
-- (a) Allow public to view (SELECT) drawings
CREATE POLICY "Allow public SELECT on drawings" 
ON public.drawings 
FOR SELECT 
USING (true);

-- (b) Allow anyone to insert (INSERT) drawings (for guest uploads)
CREATE POLICY "Allow anyone INSERT on drawings" 
ON public.drawings 
FOR INSERT 
WITH CHECK (true);

-- 2. Configure Storage Bucket for 'drawings'
-- Insert the bucket into Supabase Storage if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('drawings', 'drawings', true)
ON CONFLICT (id) DO NOTHING;

-- Enable storage RLS policies to allow uploads and reads:
-- (a) Allow public SELECT on files in 'drawings' bucket
CREATE POLICY "Allow public select on drawings storage"
ON storage.objects
FOR SELECT
USING (bucket_id = 'drawings');

-- (b) Allow public INSERT/upload on files in 'drawings' bucket
CREATE POLICY "Allow public insert on drawings storage"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'drawings');
