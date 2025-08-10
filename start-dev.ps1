# VendorStreet Development Environment Starter
Write-Host "Starting VendorStreet Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if ports are available
if (Test-Port 5000) {
    Write-Host "Warning: Port 5000 is already in use!" -ForegroundColor Yellow
}

if (Test-Port 5173) {
    Write-Host "Warning: Port 5173 is already in use!" -ForegroundColor Yellow
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing root dependencies..." -ForegroundColor Cyan
    npm install
}

if (!(Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
}

if (!(Test-Path "Frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location Frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "🚀 Starting Development Servers..." -ForegroundColor Green
Write-Host "📡 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Frontend App: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers
npm run dev