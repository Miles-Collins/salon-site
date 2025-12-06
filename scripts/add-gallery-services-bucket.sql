-- Add bucket tracking to gallery_images table
-- This allows tracking which storage bucket each image belongs to

-- Add bucket column if it doesn't exist
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS bucket text DEFAULT 'gallery';

-- Add comment to explain the column
COMMENT ON COLUMN public.gallery_images.bucket IS 'Storage bucket name: gallery, gallery-transformations, or gallery-services';

-- Create index on bucket column for faster queries
CREATE INDEX IF NOT EXISTS gallery_images_bucket_idx ON public.gallery_images (bucket);

-- Optional: Set bucket values based on is_before_after flag (if you have existing data)
-- Uncomment and run if needed:
-- UPDATE public.gallery_images SET bucket = 'gallery-transformations' WHERE is_before_after = true AND bucket = 'gallery';
