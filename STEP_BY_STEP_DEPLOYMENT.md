# 🚀 簡單部署步驟

## 第一步：修復 Git 設置

運行以下命令：
```bash
./fix-git-setup.sh
```

這會幫你設置 Git 的用戶名和郵箱。

## 第二步：在 GitHub 創建儲存庫

1. 打開瀏覽器，訪問 https://github.com
2. 登入你的帳號
3. 點擊右上角的 "+" → "New repository"
4. 填寫：
   - Repository name: `moving-service`
   - Description: (可選) `Moving service platform`
   - 選擇 Public 或 Private
   - ⚠️ **重要**：不要勾選任何選項（不要 README, .gitignore, license）
5. 點擊 "Create repository"

## 第三步：推送代碼到 GitHub

運行以下命令：
```bash
./manual-deploy.sh
```

當腳本要求輸入時：
- 確認已創建儲存庫：輸入 `y`
- 輸入你的 GitHub 用戶名
- 當要求輸入密碼時，使用 Personal Access Token

### 如何創建 Personal Access Token

如果你還沒有 token：
1. 訪問 https://github.com/settings/tokens
2. 點擊 "Generate new token" → "Generate new token (classic)"
3. Note: 輸入 `moving-service-deploy`
4. Expiration: 選擇 30 days
5. 勾選 `repo` 權限（全部）
6. 點擊 "Generate token"
7. 複製生成的 token（只會顯示一次！）

## 第四步：設置 Supabase

1. 訪問 https://supabase.com
2. 創建新專案
3. 記錄以下資訊：
   - Project URL
   - API Keys (anon, service_role)
   - Database password

4. 在 SQL Editor 中執行（按順序）：
   - 複製 `supabase/schema.sql` 的內容並執行
   - 複製 `supabase/rls-policies.sql` 的內容並執行
   - 複製 `supabase/storage-setup.sql` 的內容並執行

## 第五步：部署到 Vercel

1. 訪問 https://vercel.com
2. 用 GitHub 登入
3. 點擊 "New Project"
4. 選擇你的 `moving-service` 儲存庫
5. 在 Environment Variables 中添加：

```
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
DATABASE_URL=你的_database_url
JWT_SECRET=運行 node generate-jwt-secret.js 生成
ADMIN_EMAILS=你的郵箱
```

6. 點擊 "Deploy"

## 🎉 完成！

部署成功後，你會得到一個 Vercel URL，例如：
`https://moving-service-xxx.vercel.app`

### 測試你的網站

1. 訪問你的 Vercel URL
2. 嘗試註冊一個新用戶
3. 提交一個搬家報價請求

### 常見問題

**Q: GitHub 推送失敗**
A: 確保使用 Personal Access Token 而不是密碼

**Q: Supabase 連接錯誤**
A: 檢查環境變數是否正確複製

**Q: 頁面顯示錯誤**
A: 在 Vercel Dashboard 檢查 Functions 日誌

需要幫助？檢查 `GITHUB_VERCEL_DEPLOYMENT_GUIDE.md` 獲取更詳細的說明。 