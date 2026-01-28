import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const VendorDashboard = ({ user }) => {
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState({})

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { 'Authorization': `Bearer ${token}` }

        // Fetch Dashboard Stats & Listings
        const dashboardRes = await fetch('https://vendorstreet.onrender.com/api/vendors/dashboard', { headers })
        const dashboardResult = await dashboardRes.json()

        // Fetch Vendor Orders
        const ordersRes = await fetch('https://vendorstreet.onrender.com/api/orders/vendor-orders', { headers })
        const ordersResult = await ordersRes.json()

        let recentOrders = []
        if (ordersResult.success) {
          recentOrders = ordersResult.data
          setOrders(recentOrders.map(order => ({
            id: order._id, // Keep full ID for link
            displayId: order._id.slice(-6).toUpperCase(),
            buyer: `${order.buyer.firstName} ${order.buyer.lastName}`,
            product: order.products[0].listing.title, // Simplified for UI
            quantity: order.products[0].quantity,
            date: new Date(order.createdAt).toLocaleDateString(),
            total: order.totalAmount,
            status: order.status
          })))
        }

        if (dashboardResult.success) {
          const { recentListings, statistics } = dashboardResult.data

          // Map backend listings to frontend format
          const formattedListings = recentListings.map(item => ({
            id: item._id,
            name: item.title,
            category: item.categoryId?.name || 'Uncategorized',
            price: item.price,
            unit: item.unit,
            stock: item.stockQuantity,
            status: item.status,
            views: item.views || 0,
            orders: 0, // Could be calculated if we map orders to products
            image: item.imageUrl ? `https://vendorstreet.onrender.com${item.imageUrl}` : 'https://via.placeholder.com/100'
          }))
          setListings(formattedListings)

          // Map analytics
          setAnalytics({
            totalRevenue: recentOrders.reduce((sum, order) => sum + order.totalAmount, 0), // Calculate real revenue
            totalOrders: recentOrders.length,
            totalProducts: statistics.totalListings || 0,
            totalViews: 0,
            activeListings: statistics.activeListings,
            pendingListings: statistics.pendingListings
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const quickStats = [
    {
      label: 'Total Revenue',
      value: `₹${analytics.totalRevenue?.toLocaleString()}`,
      change: '+15.5%',
      color: 'text-green-600',
      icon: CurrencyRupeeIcon
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders,
      change: '+23%',
      color: 'text-blue-600',
      icon: ShoppingBagIcon
    },
    {
      label: 'Total Products',
      value: analytics.totalProducts,
      change: '+12%',
      color: 'text-purple-600',
      icon: ChartBarIcon
    },
    {
      label: 'Profile Views',
      value: analytics.totalViews?.toLocaleString(),
      change: '+8%',
      color: 'text-orange-600',
      icon: EyeIcon
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Vendor Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your products, orders, and business performance.
              </p>
            </div>
            <Link
              to="/add-product"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Verification Status */}
        {user && !user.verified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Verification Pending</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your vendor account is under review. You can add products, but they won't be visible until verification is complete.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                  <span className={`text-sm ${stat.color}`}>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Listings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
                  <Link
                    to="/manage-products"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Manage all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {listings.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          {getStatusIcon(product.status)}
                          {getStatusBadge(product.status)}
                        </div>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm font-medium text-gray-900">
                            ₹{product.price} {product.unit}
                          </span>
                          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Stock: {product.stock}
                          </span>
                          <span className="text-sm text-gray-600">
                            {product.views} views • {product.orders} orders
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <Link
                    to="/orders"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900">Order #{order.displayId}</p>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-600">{order.buyer}</p>
                        <p className="text-sm text-gray-600">
                          {order.product} × {order.quantity}
                        </p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                        <button className="mt-1 text-sm text-green-600 hover:text-green-700 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Vendor Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Business Name</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.businessName || 'Not Set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verification</span>
                  <span className={`text-sm font-medium ${user?.verified ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                    {user?.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">FSSAI License</span>
                  <span className="text-sm text-gray-900">
                    {user?.fssaiLicense || 'Upload Required'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="text-sm text-gray-900">4.5/5 (24 reviews)</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Link
                  to="/profile"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  Update Profile
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/add-product"
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add New Product</span>
                </Link>
                <Link
                  to="/inventory"
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ChartBarIcon className="h-4 w-4" />
                  <span>Manage Inventory</span>
                </Link>
                <Link
                  to="/analytics"
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  <span>View Analytics</span>
                </Link>
                <Link
                  to="/chat"
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UsersIcon className="h-4 w-4" />
                  <span>Customer Messages</span>
                </Link>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="text-sm font-medium text-gray-900">₹45,600</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Orders</span>
                  <span className="text-sm font-medium text-gray-900">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-medium text-gray-900">3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Order Value</span>
                  <span className="text-sm font-medium text-gray-900">₹2,533</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard

