@echo off
echo Installing VendorStreet Dependencies...
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo Installing Frontend Dependencies...
cd Frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo Building Frontend...
cd Frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo Setup completed successfully!
echo.
echo To start the application:
echo 1. Backend: cd backend && npm start
echo 2. Frontend: cd Frontend && npm run dev
echo.
pause