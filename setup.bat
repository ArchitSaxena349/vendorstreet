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
echo Choose an option:
echo 1. Start development environment (both servers)
echo 2. Exit and start manually later
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Starting development environment...
    cd ..
    call dev.bat
) else (
    echo.
    echo To start the application later:
    echo 1. Development: dev.bat or npm run dev
    echo 2. Production: cd backend && npm start
    echo.
    pause
)