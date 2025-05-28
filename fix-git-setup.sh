#!/bin/bash

echo "🔧 Git 設置修復腳本"
echo "==================="
echo ""

# 檢查 Git 配置
echo "檢查 Git 配置..."
USER_EMAIL=$(git config --global user.email)
USER_NAME=$(git config --global user.name)

if [ -z "$USER_EMAIL" ]; then
    echo "❌ Git 郵箱未設置"
    read -p "請輸入你的郵箱地址: " EMAIL
    git config --global user.email "$EMAIL"
    echo "✅ 郵箱已設置為: $EMAIL"
else
    echo "✅ Git 郵箱已設置: $USER_EMAIL"
fi

if [ -z "$USER_NAME" ]; then
    echo "❌ Git 用戶名未設置"
    read -p "請輸入你的名字: " NAME
    git config --global user.name "$NAME"
    echo "✅ 用戶名已設置為: $NAME"
else
    echo "✅ Git 用戶名已設置: $USER_NAME"
fi

echo ""
echo "📝 Git 配置完成！"
echo ""
echo "接下來，請按照以下步驟操作："
echo ""
echo "1. 先在 GitHub 上創建儲存庫："
echo "   - 訪問 https://github.com"
echo "   - 點擊 'New repository'"
echo "   - Repository name: moving-service"
echo "   - 選擇 Public 或 Private"
echo "   - ⚠️ 不要勾選 'Initialize this repository with a README'"
echo "   - 點擊 'Create repository'"
echo ""
echo "2. 創建完成後，運行以下命令："
echo "   ./manual-deploy.sh"
echo "" 