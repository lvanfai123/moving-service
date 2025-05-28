-- Create storage bucket for quote images

-- Create bucket for quote images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('quote-images', 'quote-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for quote-images bucket
CREATE POLICY "Anyone can view quote images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'quote-images');

CREATE POLICY "Authenticated users can upload quote images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'quote-images');

CREATE POLICY "Users can update their own quote images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'quote-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own quote images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'quote-images' AND auth.uid()::text = (storage.foldername(name))[1]); 