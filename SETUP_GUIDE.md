# Moving Service Platform - Backend Setup Guide

## 環境變數設定

請在專案根目錄創建 `.env.local` 檔案，並填入以下內容：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Configuration
DATABASE_URL=your_database_url_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 設定步驟

1. **Supabase 設定**
   - 前往 [Supabase](https://app.supabase.com) 建立新專案
   - 取得專案的 URL 和 API Keys
   - 執行 `supabase/schema.sql` 中的 SQL 來建立資料表
   - 執行 `supabase/rls-policies.sql` 來設定 Row Level Security

2. **SendGrid 設定**
   - 註冊 SendGrid 帳號
   - 建立 API Key
   - 驗證寄件人 email

3. **Twilio 設定**
   - 註冊 Twilio 帳號
   - 購買電話號碼
   - 取得 Account SID 和 Auth Token

4. **Google reCAPTCHA 設定**
   - 前往 [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
   - 建立新的 Site
   - 取得 Site Key 和 Secret Key

## 執行專案

```bash
# 安裝相依套件
npm install --legacy-peer-deps

# 執行開發伺服器
npm run dev
```

## 注意事項

- 確保 `.env.local` 檔案已加入 `.gitignore`
- 不要將任何真實的 API Keys 提交到版本控制
- 在生產環境使用環境變數管理服務（如 Vercel Environment Variables） 