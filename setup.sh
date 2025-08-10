#!/bin/bash

echo "Installing VendorStreet Dependencies..."
echo

echo "Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Backend installation failed!"
    exit 1
fi
cd ..

echo
echo "Installing Frontend Dependencies..."
cd Frontend
npm install
if [ $? -ne 0 ]; then
    echo "Frontend installation failed!"
    exit 1
fi
cd ..

echo
echo "Building Frontend..."
cd Frontend
npm run build
if [ $? -ne 0 ]; then
    echo "Frontend build failed!"
    exit 1
fi
cd ..

echo
echo "Setup completed successfully!"
echo
echo "To start the application:"
echo "1. Backend: cd backend && npm start"
echo "2. Frontend: cd Frontend && npm run dev"
echo