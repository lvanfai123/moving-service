#!/bin/bash

# 快速部署腳本 - Moving Service Platform
# 使用前請確保已經創建了 GitHub 儲存庫

echo "🚀 Moving Service Platform - 快速部署腳本"
echo "========================================="
echo ""

# 檢查是否已經初始化 git
if [ ! -d ".git" ]; then
    echo "📝 初始化 Git 儲存庫..."
    git init
fi

# 提示輸入 GitHub 用戶名
read -p "請輸入你的 GitHub 用戶名: " GITHUB_USERNAME
echo ""

# 設置遠程儲存庫
echo "🔗 設置 GitHub 遠程儲存庫..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$GITHUB_USERNAME/moving-service.git

# 添加所有文件
echo "📁 添加所有文件到 Git..."
git add .

# 提交
echo "💾 創建初始提交..."
git commit -m "Initial commit - Moving Service Platform v1.0.0"

# 設置主分支
git branch -M main

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
echo "如果這是你第一次推送，可能需要輸入 GitHub 密碼或使用 Personal Access Token"
git push -u origin main

# 創建標籤
echo "🏷️  創建版本標籤..."
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

echo ""
echo "✅ GitHub 部分完成！"
echo ""
echo "📋 接下來的步驟："
echo ""
echo "1. 創建 Supabase 專案："
echo "   - 訪問 https://supabase.com"
echo "   - 創建新專案並記錄憑證"
echo ""
echo "2. 在 Supabase SQL Editor 中執行："
echo "   - supabase/schema.sql"
echo "   - supabase/rls-policies.sql"
echo "   - supabase/storage-setup.sql"
echo ""
echo "3. 部署到 Vercel："
echo "   - 訪問 https://vercel.com"
echo "   - 用 GitHub 登入"
echo "   - Import 你的 moving-service 儲存庫"
echo "   - 設置環境變數（參考 env.example）"
echo ""
echo "4. 訪問你的 Vercel URL 測試部署"
echo ""
echo "詳細說明請參考 GITHUB_VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 祝你部署順利！" 