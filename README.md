# VendorStreet - Food Raw Materials Marketplace

A comprehensive marketplace platform connecting food businesses with verified vendors for sourcing raw materials.

## 🚀 Quick Start

### Development Mode (Both Frontend & Backend)

**Option 1: Using Scripts (Recommended)**
```bash
# Windows
dev.bat

# Unix/Linux/Mac
chmod +x dev.sh
./dev.sh

# PowerShell (Windows)
./start-dev.ps1
```

**Option 2: Using npm**
```bash
npm run dev
```

**Option 3: Manual (Separate Terminals)**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd Frontend
npm run dev
```

### Production Mode
```bash
# Windows
start.bat

# Or manually
cd backend
npm start
```

## 📡 Server URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run server` | Start only backend server |
| `npm run client` | Start only frontend server |
| `npm run build` | Build frontend for production |
| `npm run setup` | Install all dependencies and build |

## Features

- **Multi-role Authentication**: Buyers, Vendors, and Admin roles
- **Vendor Verification**: FSSAI license and address verification
- **Product Listings**: Comprehensive product catalog with categories
- **Direct Communication**: In-app messaging and WhatsApp integration
- **Document Upload**: File upload system for verification documents
- **Profile Management**: Comprehensive vendor profile system

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **File Upload**: Multer middleware with validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm

## Environment Setup

Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/VendorStreet
JWT_SECRET=your_super_secure_jwt_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```