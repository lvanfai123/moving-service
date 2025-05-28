# 📚 GitHub 上傳及 Vercel 部署完整指南

## 第一部分：上傳到 GitHub

### 1. 創建 GitHub 儲存庫

1. 登入你的 GitHub 帳號
2. 點擊右上角的 "+" → "New repository"
3. 填寫儲存庫資訊：
   - Repository name: `moving-service`
   - Description: `A comprehensive platform connecting customers with moving companies in Hong Kong`
   - 選擇 "Public" 或 "Private"
   - **不要**勾選 "Initialize this repository with a README"（因為我們已經有了）
   - 點擊 "Create repository"

### 2. 初始化本地 Git 儲存庫

在你的專案目錄執行：

```bash
# 初始化 git
git init

# 添加所有文件
git add .

# 創建第一次提交
git commit -m "Initial commit - Moving Service Platform v1.0.0"

# 添加遠程儲存庫（替換 YOUR_USERNAME 為你的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/moving-service.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 3. 創建 GitHub Release

```bash
# 創建標籤
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送標籤
git push origin v1.0.0
```

然後在 GitHub 網站上：
1. 進入你的儲存庫頁面
2. 點擊 "Releases"
3. 點擊 "Create a new release"
4. 選擇剛創建的 `v1.0.0` 標籤
5. 填寫 Release title: `Moving Service Platform v1.0.0`
6. 將 `RELEASE_NOTES.md` 的內容貼到描述欄
7. 點擊 "Publish release"

## 第二部分：在 Vercel 部署

### 1. 準備 Supabase

在部署到 Vercel 之前，你需要：

1. **創建 Supabase 專案**：
   - 訪問 [https://supabase.com](https://supabase.com)
   - 創建新專案
   - 記下以下資訊：
     - Project URL
     - Anon Key
     - Service Role Key
     - JWT Secret

2. **設置資料庫**：
   - 在 Supabase Dashboard 中，進入 SQL Editor
   - 依序執行：
     1. `supabase/schema.sql`
     2. `supabase/rls-policies.sql`
     3. `supabase/storage-setup.sql`

3. **創建儲存桶**：
   - 進入 Storage 頁面
   - 創建以下 buckets：
     - `quote-photos` (公開)
     - `partner-logos` (公開)
     - `review-photos` (公開)

### 2. 部署到 Vercel

#### 方法一：通過 Vercel 網站（推薦）

1. **訪問 Vercel**：
   - 前往 [https://vercel.com](https://vercel.com)
   - 使用 GitHub 帳號登入

2. **導入專案**：
   - 點擊 "New Project"
   - 選擇 "Import Git Repository"
   - 選擇你的 `moving-service` 儲存庫
   - 點擊 "Import"

3. **配置專案**：
   - Framework Preset: 自動檢測為 Next.js
   - Root Directory: 保持為 `./`
   - Build Command: `npm run build`
   - Output Directory: 保持預設

4. **設置環境變數**：
   點擊 "Environment Variables" 並添加以下變數：

   ```
   # Supabase 配置（必須）
   NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
   SUPABASE_JWT_SECRET=你的_jwt_secret
   
   # 資料庫連接（必須）
   DATABASE_URL=你的_database_url
   DIRECT_URL=你的_direct_url
   
   # JWT 密鑰（必須）
   JWT_SECRET=生成一個安全的隨機字串
   
   # 管理員設置
   ADMIN_EMAILS=your-email@example.com
   
   # 應用設置
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   ```

5. **部署**：
   - 點擊 "Deploy"
   - 等待部署完成（通常需要 2-5 分鐘）

#### 方法二：使用 Vercel CLI

1. **安裝 Vercel CLI**：
   ```bash
   npm i -g vercel
   ```

2. **登入 Vercel**：
   ```bash
   vercel login
   ```

3. **部署專案**：
   ```bash
   vercel
   ```
   
   按照提示操作：
   - Set up and deploy: `Y`
   - Which scope: 選擇你的帳號
   - Link to existing project: `N`
   - Project name: `moving-service`
   - Directory: `./`
   - Override settings: `N`

4. **設置環境變數**：
   ```bash
   # 設置生產環境變數
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   # ... 繼續添加其他變數
   ```

5. **重新部署以應用環境變數**：
   ```bash
   vercel --prod
   ```

### 3. 部署後配置

1. **更新域名**：
   - 在 Vercel Dashboard 中，進入專案設置
   - 在 "Domains" 中添加自定義域名（可選）

2. **更新環境變數**：
   - 將 `NEXT_PUBLIC_APP_URL` 更新為你的實際 Vercel URL
   - 例如：`https://moving-service.vercel.app`

3. **測試部署**：
   - 訪問你的 Vercel URL
   - 測試用戶註冊/登入功能
   - 測試報價請求提交

## 故障排除

### 常見問題

1. **Supabase 連接錯誤**：
   - 確認所有 Supabase 環境變數都正確
   - 檢查 Supabase 專案是否啟動

2. **構建失敗**：
   - 檢查 Node.js 版本（需要 18+）
   - 確認所有依賴都已安裝

3. **環境變數未生效**：
   - 在 Vercel Dashboard 中重新部署
   - 確認變數名稱沒有拼寫錯誤

### 檢查清單

- [ ] GitHub 儲存庫已創建並推送代碼
- [ ] Supabase 專案已創建
- [ ] 資料庫表已創建
- [ ] 儲存桶已設置
- [ ] 所有環境變數已在 Vercel 中配置
- [ ] 網站可以正常訪問
- [ ] 基本功能測試通過

## 下一步

1. **設置自定義域名**（可選）
2. **配置第三方服務**：
   - Twilio（SMS 驗證）
   - SendGrid（郵件通知）
   - Stripe（支付處理）
3. **監控和分析**：
   - 設置 Vercel Analytics
   - 配置錯誤追蹤（如 Sentry）

---

**恭喜！** 🎉 你的搬屋服務平台現在已經在線上運行了！ 