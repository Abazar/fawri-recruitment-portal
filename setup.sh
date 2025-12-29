#!/bin/bash

echo "🚀 Fawri Recruitment Portal - Automated Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check if MongoDB Atlas connection string is configured
if grep -q "mongodb://localhost" .env.local; then
    echo -e "${YELLOW}⚠️  WARNING: You're using local MongoDB${NC}"
    echo ""
    echo "For easier setup, we recommend MongoDB Atlas (free cloud database)."
    echo ""
    echo "To use MongoDB Atlas:"
    echo "1. Go to https://www.mongodb.com/cloud/atlas/register"
    echo "2. Create a free account and cluster"
    echo "3. Get your connection string"
    echo "4. Replace DATABASE_URL in .env.local"
    echo ""
    echo -e "${YELLOW}Checking if local MongoDB is running...${NC}"

    # Try to connect to local MongoDB
    if command -v mongosh &> /dev/null; then
        if timeout 5 mongosh --eval "db.version()" &> /dev/null; then
            echo -e "${GREEN}✅ Local MongoDB is running!${NC}"
        else
            echo -e "${RED}❌ Local MongoDB is NOT running!${NC}"
            echo ""
            echo "Please either:"
            echo "1. Start MongoDB: brew services start mongodb-community (Mac)"
            echo "2. Or use MongoDB Atlas (recommended - see instructions above)"
            exit 1
        fi
    else
        echo -e "${RED}❌ MongoDB is not installed locally!${NC}"
        echo ""
        echo "Please use MongoDB Atlas (free cloud database):"
        echo "1. Go to https://www.mongodb.com/cloud/atlas/register"
        echo "2. Create a free account and cluster (takes 2 minutes)"
        echo "3. Click 'Connect' → 'Connect your application'"
        echo "4. Copy the connection string"
        echo "5. Update .env.local with: DATABASE_URL=your-connection-string"
        echo ""
        echo "Then run: npm run setup:complete"
        exit 1
    fi
fi

echo ""
echo "🌱 Seeding database with admin users..."
npm run seed

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to seed database${NC}"
    echo ""
    echo "Common issues:"
    echo "- MongoDB is not running"
    echo "- Wrong connection string in .env.local"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Ready to start!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To start the demo, run:"
echo ""
echo -e "${YELLOW}npm start${NC}"
echo ""
echo "This will start both the API server and frontend."
echo "Then open: http://localhost:3000"
echo ""
echo "Demo credentials:"
echo "  Admin: admin@fawri.com / Admin@123"
echo "  HR: hr@fawri.com / Hr@123456"
echo ""
