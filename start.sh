#!/bin/bash

echo "🎯 Perseverance - Starting Application..."
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running!"
    echo ""
    echo "Please start MongoDB first:"
    echo "  macOS:   brew services start mongodb-community"
    echo "  Linux:   sudo systemctl start mongod"
    echo ""
    echo "Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found, copying from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file - please update it with your settings"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Start the application
echo ""
echo "🚀 Starting Perseverance..."
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev:all
