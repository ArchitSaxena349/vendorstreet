import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShoppingCartIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  
} from '@heroicons/react/24/outline'



const Dashboard = ({ user, userRole }) => {
  const [recentOrders, setRecentOrders] = useState([])
  const [favoriteProducts, setFavoriteProducts] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Mock data - replace with actual API calls
    setRecentOrders([
      {
        id: 'ORD-001',
        vendor: 'Fresh Spices Co.',
        items: 3,
        total: 2450,
        status: 'delivered',
        date: '2025-01-25'
      },
      {
        id: 'ORD-002',
        vendor: 'Grain Masters Ltd.',
        items: 2,
        total: 3200,
        status: 'in_transit',
        date: '2025-01-24'
      },
      {
        id: 'ORD-003',
        vendor: 'Dairy Fresh Suppliers',
        items: 5,
        total: 1800,
        status: 'processing',
        date: '2025-01-23'
      }
    ])

    setFavoriteProducts([
      {
        id: 1,
        name: 'Organic Basmati Rice',
        vendor: 'Grain Masters Ltd.',
        price: 850,
        unit: 'per 25kg bag',
        image: '/api/placeholder/150/150',
        inStock: true
      },
      {
        id: 2,
        name: 'Premium Turmeric Powder',
        vendor: 'Fresh Spices Co.',
        price: 320,
        unit: 'per kg',
        image: '/api/placeholder/150/150',
        inStock: true
      },
      {
        id: 3,
        name: 'Fresh Milk (Full Cream)',
        vendor: 'Dairy Fresh Suppliers',
        price: 65,
        unit: 'per liter',
        image: '/api/placeholder/150/150',
        inStock: false
      }
    ])

    setRecentlyViewed([
      {
        id: 4,
        name: 'Red Chili Powder',
        vendor: 'Spice World Inc.',
        price: 280,
        unit: 'per kg',
        image: '/api/placeholder/150/150'
      },
      {
        id: 5,
        name: 'Whole Wheat Flour',
        vendor: 'Grain Masters Ltd.',
        price: 45,
        unit: 'per kg',
        image: '/api/placeholder/150/150'
      }
    ])

    setNotifications([
      {
        id: 1,
        type: 'order',
        title: 'Order Delivered',
        message: 'Your order ORD-001 has been delivered successfully.',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'price',
        title: 'Price Drop Alert',
        message: 'Premium Turmeric Powder is now 15% cheaper.',
        time: '5 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'stock',
        title: 'Back in Stock',
        message: 'Organic Basmati Rice is now available.',
        time: '1 day ago',
        read: true
      }
    ])
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in_transit':
        return <TruckIcon className="h-5 w-5 text-blue-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'in_transit':
        return 'In Transit'
      case 'processing':
        return 'Processing'
      default:
        return 'Unknown'
    }
  }

  const quickStats = [
    { label: 'Total Orders', value: '24', change: '+12%', color: 'text-green-600' },
    { label: 'Active Orders', value: '3', change: '0%', color: 'text-blue-600' },
    { label: 'Favorite Vendors', value: '8', change: '+25%', color: 'text-purple-600' },
    { label: 'This Month Spent', value: '₹45,600', change: '+8%', color: 'text-orange-600' }
  ]

  return (
    
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your VendorStreet account today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className={`text-sm ${stat.color}`}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  to="/products" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium">Browse Products</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingCartIcon className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">My Orders</span>
                </Link>
                <Link 
                  to="/favorites" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <HeartIcon className="h-8 w-8 text-red-600 mb-2" />
                  <span className="text-sm font-medium">Favorites</span>
                </Link>
                <Link 
                  to="/chat" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Messages</span>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link to="/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.vendor} • {order.items} items</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{getStatusText(order.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Favorite Products</h2>
                <Link to="/favorites" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.vendor}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{product.price} {product.unit}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="text-sm font-medium text-green-600">Buyer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">Jan 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="text-sm text-gray-900">24</span>
                </div>
              </div>
              
              {userRole === 'buyer' && (
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    to="/vendor-application" 
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    Become a Vendor
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {notifications.filter(n => !n.read).length} new
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Viewed</h3>
              <div className="space-y-3">
                {recentlyViewed.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                      <p className="text-xs text-gray-600">{product.vendor}</p>
                      <p className="text-xs text-gray-900">₹{product.price} {product.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

