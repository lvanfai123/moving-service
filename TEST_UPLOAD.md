# 測試照片上傳功能

## 在本地測試

1. 確保您的 `.env.local` 文件包含正確的 Supabase 設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. 啟動開發服務器：
   ```bash
   npm run dev
   ```

3. 打開瀏覽器訪問 http://localhost:3000

4. 在首頁點擊「立即獲取報價」按鈕

5. 在表單中找到「上傳物品照片」部分

6. 測試以下功能：
   - 點擊上傳按鈕選擇照片
   - 確認照片預覽正常顯示
   - 測試刪除照片功能（點擊照片上的 × 按鈕）
   - 嘗試上傳超過 10 張照片（應該顯示錯誤提示）
   - 嘗試上傳非圖片文件（應該被拒絕）

## 在 Vercel 上測試

1. 確保在 Vercel 的環境變數中設置了：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. 部署後訪問您的網站進行相同的測試

## 檢查上傳的照片

1. 在 Supabase Dashboard 中，點擊 **Storage**
2. 點擊 `quote-images` bucket
3. 您應該能看到上傳的照片，按照用戶 ID 或 Session ID 分類在不同的資料夾中

## 常見問題

### 上傳失敗
- 檢查瀏覽器的開發者工具 Console 是否有錯誤訊息
- 確認環境變數設置正確
- 確認 bucket 是 public 的
- 確認 policies 已正確設置

### 照片不顯示
- 檢查 bucket 是否設置為 public
- 確認 URL 是否正確
- 嘗試在新的無痕視窗中打開照片 URL

### 刪除失敗
- 檢查 DELETE policy 是否正確設置
- 確認用戶有權限刪除（只能刪除自己上傳的照片） 