# VendorStreet - Food Raw Materials Marketplace

VendorStreet is a B2B marketplace application connecting buyers (restaurants, cafes) with vendors (farmers, wholesalers) for food raw materials.

## Features

### For Buyers
- **Browse Products**: Search and filter a wide range of raw materials.
- **Order Management**: Add items to cart, place orders, and track status.
- **Communication**: Real-time chat with vendors.
- **Notifications**: Get alerts for order updates and messages.
- **Wishlist**: Save favorite items for later.

### For Vendors
- **Dashboard**: Track sales, revenue, and order status.
- **Product Management**: Add, edit, and delete product listings with images.
- **Order Fulfillment**: Update order status (Shipped, Delivered).
- **Business Profile**: Manage company details and verification documents.

### For Admins
- **Verification**: Approve or reject new vendor applications.
- **Content Moderation**: Verify new product listings before they go live.
- **Analytics**: Overview of platform users and orders.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Headless UI, Heroicons, React Router v6.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens).
- **Real-time**: Custom polling (MVP implementation for Chat/Notifications).

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas connection string)

## Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Vendorstreet
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../Frontend
    npm install
    ```

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

### Frontend
The frontend connects to `http://localhost:5000` by default.

## Running Locally

1.  **Start the Backend Server**
    ```bash
    cd backend
    npm run dev
    ```
    Server will start on `http://localhost:5000`.

2.  **Start the Frontend Application**
    ```bash
    cd Frontend
    npm run dev
    ```
    Application will run on `http://localhost:5173`.

## Folder Structure

```
Vendorstreet/
├── backend/                # Node.js/Express Backend
│   ├── controllers/       # Route logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth and upload middleware
│   ├── utils/             # Database connection, seeders
│   └── index.js           # Entry point
│
└── Frontend/               # React Frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # React Context (Auth, Cart)
    │   ├── pages/         # Page components
    │   └── App.jsx        # Main component with Routes
```

## API Documentation

The API Documentation is available at `GET /api` when the server is running.
Common endpoints:
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Login
- `GET /api/listings`: Get all products
- `POST /api/orders`: Place an order
- `GET /api/chat/conversations`: Get user chats

## License

This project is licensed under the MIT License.