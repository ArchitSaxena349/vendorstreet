@echo off
echo Starting VendorStreet in Production Mode...
echo.

REM Build frontend if dist doesn't exist
if not exist "Frontend\dist" (
    echo Building frontend...
    cd Frontend
    call npm run build
    cd ..
)

echo Starting backend server...
echo Backend running on: http://localhost:5000
echo.

cd backend
call npm start