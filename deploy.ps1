# Cloudflare Worker Deployment Script
# Sets environment variables and deploys to Cloudflare

Write-Host "🚀 Deploying Rajendranagar Worker to Cloudflare..." -ForegroundColor Cyan

# Check if Wrangler is installed
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Wrangler CLI not found. Installing..." -ForegroundColor Red
    npm install -g wrangler
}

# Set environment variables for production deployment
Write-Host "`n📝 Configuring environment variables..." -ForegroundColor Yellow

$TURSO_URL = "libsql://rajendranagaronline-garbs.aws-ap-south-1.turso.io"
$TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQ0NzcyNzcsImlkIjoiNzE0OTMwZDMtZTJhNS00Mjg5LThmNzItZTljNDU3Mzk1MDQzIiwicmlkIjoiZmQzZTYzMTctZDg2ZC00ZjY4LWJhNGYtYmQ4NzM1NDhjMzVhIn0.n12qoy-3GD6_dYpr9q8FylfRqKh35TShWGwGxX3lwidR-RHJSf2hN6f43TBoqqFhRWJTsKwRo8trhxMOnKQFCA"

Write-Host "  ✓ TURSO_URL configured"
Write-Host "  ✓ TURSO_TOKEN configured"

# Install dependencies if needed
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Deploy to Cloudflare Workers (production environment)
Write-Host "`n🌐 Deploying to Cloudflare Workers..." -ForegroundColor Cyan

# Set secrets for production
wrangler secret put TURSO_URL --env production
wrangler secret put TURSO_TOKEN --env production

# Deploy
wrangler deploy --env production worker/worker.js

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "`n📍 Your Worker will be available at:" -ForegroundColor Yellow
Write-Host "   https://rajendranagar-worker.<account>.workers.dev" -ForegroundColor Cyan
Write-Host "`n🔗 Configure your domain in Cloudflare Workers > Routes" -ForegroundColor Yellow
