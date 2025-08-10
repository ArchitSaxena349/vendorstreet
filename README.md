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
- **Dashboard Management**: Role-based dashboards for different user types
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Heroicons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vendorstreet
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp example.env .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/vendorstreet
JWT_SECRET=your_super_secure_jwt_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Vendors
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create vendor profile
- `PUT /api/vendors/:id` - Update vendor profile

### Listings
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

## User Roles

1. **Buyer**: Browse products, contact vendors, manage orders
2. **Vendor**: Manage products, handle inquiries, track sales
3. **Admin**: Verify vendors, manage platform, oversee operations

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd Frontend
npm run dev
```

### Building for Production

Frontend:
```bash
cd Frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Contact

- Email: architsaxena349@gmail.com
- Phone: +91 8887662519
- Address: 123 Vikas Nagar, Food District, Lucknow 226022