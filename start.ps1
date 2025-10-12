# 🚀 Quick Start Script for Perseverance with MongoDB

Write-Host "🎯 Perseverance - Starting Application..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "📊 Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoCheck = mongosh --eval "db.adminCommand('ping')" --quiet 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    } else {
        throw "MongoDB not responding"
    }
} catch {
    Write-Host "❌ MongoDB is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start MongoDB first:" -ForegroundColor Yellow
    Write-Host "  Windows: net start MongoDB" -ForegroundColor White
    Write-Host "  macOS:   brew services start mongodb-community" -ForegroundColor White
    Write-Host "  Linux:   sudo systemctl start mongod" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found, copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file - please update it with your settings" -ForegroundColor Green
    Write-Host ""
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Start the application
Write-Host ""
Write-Host "🚀 Starting Perseverance..." -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

npm run dev:all
