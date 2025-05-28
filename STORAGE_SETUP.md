# Supabase Storage 設置指南

## 1. 登入 Supabase Dashboard

1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 選擇您的專案

## 2. 創建 Storage Bucket

1. 在左側選單中點擊 **Storage**
2. 點擊 **New bucket** 按鈕
3. 創建以下 bucket：

### quote-images bucket
- **Name**: `quote-images`
- **Public bucket**: ✅ (勾選)
- **File size limit**: 5MB
- **Allowed MIME types**: 
  - image/jpeg
  - image/jpg
  - image/png
  - image/webp

## 3. 執行 SQL 設置權限

1. 在左側選單中點擊 **SQL Editor**
2. 點擊 **New query**
3. 複製並執行 `supabase/storage-setup-images.sql` 中的內容

```sql
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
```

## 4. 驗證設置

1. 返回 **Storage** 頁面
2. 確認 `quote-images` bucket 已創建
3. 點擊 bucket 名稱查看詳情
4. 確認 **Public** 狀態為啟用

## 5. 測試上傳功能

1. 在您的應用程式中測試照片上傳功能
2. 確認照片可以成功上傳和顯示
3. 確認刪除功能正常運作

## 注意事項

- 確保環境變數正確設置：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Service Role Key 只應在伺服器端使用，不要暴露給客戶端
- 照片會根據用戶 ID 或 Session ID 分類存儲在不同資料夾中 