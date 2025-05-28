-- Create storage buckets for the moving service platform

-- Create bucket for quote photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('quote-photos', 'quote-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create bucket for partner logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('partner-logos', 'partner-logos', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Create bucket for review photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('review-photos', 'review-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for quote-photos bucket
CREATE POLICY "Anyone can view quote photos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'quote-photos');

CREATE POLICY "Authenticated users can upload quote photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'quote-photos');

CREATE POLICY "Users can update their own quote photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'quote-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own quote photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'quote-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for partner-logos bucket
CREATE POLICY "Anyone can view partner logos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'partner-logos');

CREATE POLICY "Partners can upload their logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'partner-logos' 
    AND EXISTS (
      SELECT 1 FROM partners 
      WHERE id = auth.uid() 
      AND status IN ('active', 'pending')
    )
  );

CREATE POLICY "Partners can update their logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'partner-logos'
    AND EXISTS (
      SELECT 1 FROM partners 
      WHERE id = auth.uid() 
      AND status IN ('active', 'pending')
    )
  );

CREATE POLICY "Partners can delete their logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'partner-logos'
    AND EXISTS (
      SELECT 1 FROM partners 
      WHERE id = auth.uid() 
      AND status IN ('active', 'pending')
    )
  );

-- Storage policies for review-photos bucket
CREATE POLICY "Anyone can view review photos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'review-photos');

CREATE POLICY "Authenticated users can upload review photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-photos');

CREATE POLICY "Users can update their own review photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own review photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]); 