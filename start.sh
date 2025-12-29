#!/bin/bash

echo "🚀 Starting Fawri Recruitment Portal..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo -e "${BLUE}Starting API Server (port 3001)...${NC}"
npm run dev:api &
API_PID=$!

# Wait a bit for API to start
sleep 3

echo ""
echo -e "${BLUE}Starting Next.js Frontend (port 3000)...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Fawri Recruitment Portal is running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Open in browser:"
echo "   Frontend: http://localhost:3000"
echo "   API Health: http://localhost:3001/health"
echo ""
echo "👤 Demo Credentials:"
echo "   Admin: admin@fawri.com / Admin@123"
echo "   HR: hr@fawri.com / Hr@123456"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $API_PID $FRONTEND_PID
