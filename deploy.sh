#!/bin/bash
# Tefera Yadeta Travel - Deployment Script

echo "🚀 Starting Tefera Yadeta Travel Deployment..."

# Step 1: Deploy to GitHub
echo "📦 Step 1: Deploying to GitHub..."
git add .
git commit -m "Deploy Tefera Yadeta Travel System - $(date)"
git push origin main
echo "✅ GitHub deployment complete!"

# Step 2: Deploy Cloudflare Worker (optional)
echo "⚡ Step 2: Deploying Cloudflare Worker..."
if command -v wrangler &> /dev/null; then
    echo "Installing Wrangler..."
    npm install -g wrangler
fi

echo "Logging into Cloudflare..."
wrangler login

echo "Deploying Worker..."
wrangler deploy --env production

# Get Worker URL
WORKER_URL=$(wrangler whoami | grep -o 'workers\.dev.*' | head -1)
echo "✅ Worker deployed at: https://${WORKER_URL}"

# Step 3: Update HTML with Worker URL
echo "🔧 Step 3: Updating configuration..."
# This would update the TELEGRAM_API_URL in index.html
# For now, we'll just output instructions
echo "⚠️  Manual step required:"
echo "   Update TELEGRAM_API_URL in index.html to:"
echo "   https://${WORKER_URL}"
echo ""
echo "   Change this line in index.html:"
echo "   const TELEGRAM_API_URL = 'https://${WORKER_URL}';"

# Step 4: Deploy to Cloudflare Pages
echo "☁️  Step 4: Deploying to Cloudflare Pages..."
echo "⚠️  Manual deployment required:"
echo "   1. Go to Cloudflare Dashboard → Pages"
echo "   2. Connect your GitHub repository"
echo "   3. Configure:"
echo "      - Framework preset: None"
echo "      - Build command: (empty)"
echo "      - Build output directory: (empty)"
echo "      - Root directory: /"
echo "   4. Click 'Save and Deploy'"

# Step 5: Verification
echo "✅ Step 5: Verification"
echo "   Your system will be available at:"
echo "   - Main site: https://tefera-yadeta-travel.pages.dev"
echo "   - Worker: https://${WORKER_URL}"
echo "   - Telegram bot: @GetuSample_Bot"

echo ""
echo "🎉 Deployment complete!"
echo "📋 Next steps:"
echo "   1. Test the system at your Pages URL"
echo "   2. Send a test message via Telegram bot"
echo "   3. Register a test passenger"
echo "   4. Verify Telegram notifications work"