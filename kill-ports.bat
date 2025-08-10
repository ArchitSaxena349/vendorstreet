@echo off
echo Killing processes on ports 5000 and 5173...

REM Kill processes on port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill processes on port 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill all node processes as backup
taskkill /f /im node.exe >nul 2>&1

echo Ports cleared successfully!
echo.