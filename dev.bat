@echo off
echo Starting VendorStreet Development Environment...
echo.

REM Check if node_modules exist
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "Frontend\node_modules" (
    echo Installing frontend dependencies...
    cd Frontend
    call npm install
    cd ..
)

echo.
echo Starting both Frontend and Backend servers...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

call npm run dev