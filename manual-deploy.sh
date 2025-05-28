#!/bin/bash

echo "📤 手動 GitHub 部署腳本"
echo "======================"
echo ""

# 檢查是否已經在 GitHub 創建了儲存庫
echo "⚠️  請確認你已經在 GitHub 上創建了 'moving-service' 儲存庫"
read -p "已經創建了嗎？(y/n): " CREATED

if [ "$CREATED" != "y" ]; then
    echo ""
    echo "請先到 GitHub 創建儲存庫："
    echo "1. 訪問 https://github.com/new"
    echo "2. Repository name: moving-service"
    echo "3. 不要勾選 'Initialize this repository with a README'"
    echo "4. 點擊 'Create repository'"
    echo ""
    exit 1
fi

# 獲取 GitHub 用戶名
read -p "請輸入你的 GitHub 用戶名: " GITHUB_USERNAME
echo ""

# 清理現有的 git 設置
echo "🧹 清理現有 Git 設置..."
rm -rf .git

# 重新初始化
echo "📝 初始化新的 Git 儲存庫..."
git init

# 添加所有文件
echo "📁 添加所有文件..."
git add .

# 提交
echo "💾 創建提交..."
git commit -m "Initial commit - Moving Service Platform v1.0.0"

# 設置主分支
echo "🌿 設置主分支..."
git branch -M main

# 添加遠程儲存庫
echo "🔗 連接到 GitHub..."
git remote add origin https://github.com/$GITHUB_USERNAME/moving-service.git

# 推送
echo ""
echo "⬆️  準備推送到 GitHub..."
echo "提示：如果出現認證錯誤，你可能需要："
echo "1. 使用 Personal Access Token 而不是密碼"
echo "2. 訪問 https://github.com/settings/tokens 創建 token"
echo "3. 選擇 'repo' 權限"
echo ""
read -p "準備好了嗎？按 Enter 繼續..."

git push -u origin main

# 檢查是否成功
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    echo "🏷️  創建版本標籤..."
    git tag -a v1.0.0 -m "Release version 1.0.0"
    git push origin v1.0.0
    
    echo ""
    echo "🎉 GitHub 部分完成！"
    echo ""
    echo "你可以訪問: https://github.com/$GITHUB_USERNAME/moving-service"
    echo ""
    echo "📋 下一步："
    echo "1. 創建 Supabase 專案"
    echo "2. 部署到 Vercel"
    echo "詳細說明請參考 GITHUB_VERCEL_DEPLOYMENT_GUIDE.md"
else
    echo ""
    echo "❌ 推送失敗！"
    echo ""
    echo "可能的解決方案："
    echo "1. 確認 GitHub 用戶名是否正確"
    echo "2. 確認儲存庫是否已創建"
    echo "3. 使用 Personal Access Token 進行認證"
fi 