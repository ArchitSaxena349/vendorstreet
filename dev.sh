#!/bin/bash

echo "Starting VendorStreet Development Environment..."
echo

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "Frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd Frontend
    npm install
    cd ..
fi

echo
echo "Starting both Frontend and Backend servers..."
echo
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"
echo

npm run dev