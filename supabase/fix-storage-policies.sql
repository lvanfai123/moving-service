-- 刪除可能存在的舊 policies
DROP POLICY IF EXISTS "Authenticated users can upload quote images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own quote images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own quote images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view quote images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload quote images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update quote images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete quote images" ON storage.objects;

-- 等待一下確保刪除完成
SELECT pg_sleep(1);

-- 創建新的 public policies
CREATE POLICY "Anyone can view quote images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'quote-images');

CREATE POLICY "Anyone can upload quote images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'quote-images');

CREATE POLICY "Anyone can update quote images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'quote-images')
WITH CHECK (bucket_id = 'quote-images');

CREATE POLICY "Anyone can delete quote images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'quote-images'); 