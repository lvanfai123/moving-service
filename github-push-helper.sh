#!/bin/bash

echo "🚀 GitHub 推送助手"
echo "=================="
echo ""
echo "GitHub 用戶名: lvanfai123"
echo ""

# 清理並重新初始化
echo "🧹 清理現有 Git 設置..."
rm -rf .git

echo "📝 初始化 Git..."
git init

echo "📁 添加所有文件..."
git add .

echo "💾 創建提交..."
git commit -m "Initial commit - Moving Service Platform v1.0.0"

echo "🌿 設置主分支..."
git branch -M main

echo "🔗 連接到 GitHub..."
git remote add origin https://github.com/lvanfai123/moving-service.git

echo ""
echo "⚠️  重要提醒："
echo "GitHub 不再支援密碼認證，你需要使用 Personal Access Token"
echo ""
echo "📋 創建 Token 的步驟："
echo "1. 訪問: https://github.com/settings/tokens"
echo "2. 點擊 'Generate new token' → 'Generate new token (classic)'"
echo "3. Note: 輸入 'moving-service'"
echo "4. Expiration: 選擇 '30 days'"
echo "5. 勾選 'repo' 權限（全部）"
echo "6. 點擊 'Generate token'"
echo "7. 複製生成的 token"
echo ""
echo "準備好 token 後，運行以下命令："
echo ""
echo "git push -u origin main"
echo ""
echo "當要求輸入密碼時，貼上你的 Personal Access Token（不是密碼！）"
echo ""

# 嘗試使用 SSH 方式
echo "或者，你可以設置 SSH 密鑰（更安全）："
echo "1. 生成 SSH 密鑰: ssh-keygen -t ed25519 -C 'your-email@example.com'"
echo "2. 添加到 GitHub: https://github.com/settings/keys"
echo "" 