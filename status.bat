@echo off
echo Checking VendorStreet Application Status...
echo.

echo Testing Backend API...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API: Running on http://localhost:5000
) else (
    echo ❌ Backend API: Not responding
)

echo.
echo Testing Frontend...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend: Running on http://localhost:5173
) else (
    echo ❌ Frontend: Not responding
)

echo.
echo Application URLs:
echo 🌐 Frontend: http://localhost:5173
echo 📡 Backend API: http://localhost:5000
echo 🔍 Health Check: http://localhost:5000/health
echo.