import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShoppingCartIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const MyOrders = ({ user }) => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOrders = [
      {
        id: 'ORD-001',
        orderNumber: 'VS2024001',
        date: '2024-01-15',
        status: 'delivered',
        total: 2850,
        items: [
          {
            id: 1,
            name: 'Organic Basmati Rice',
            vendor: 'Grain Masters Ltd.',
            quantity: 25,
            unit: 'kg',
            price: 85,
            image: '/rice.jpg'
          },
          {
            id: 2,
            name: 'Turmeric Powder',
            vendor: 'Spice World Inc.',
            quantity: 5,
            unit: 'kg',
            price: 320,
            image: '/turmeric.jpg'
          }
        ],
        vendor: {
          name: 'Grain Masters Ltd.',
          phone: '+91 9876543210',
          verified: true
        },
        deliveryAddress: '123 Restaurant Street, Food District, Mumbai 400001',
        estimatedDelivery: '2024-01-18',
        actualDelivery: '2024-01-17'
      },
      {
        id: 'ORD-002',
        orderNumber: 'VS2024002',
        date: '2024-01-20',
        status: 'shipped',
        total: 1650,
        items: [
          {
            id: 3,
            name: 'Red Chili Powder',
            vendor: 'Spice World Inc.',
            quantity: 10,
            unit: 'kg',
            price: 280,
            image: '/chilli.jpg'
          }
        ],
        vendor: {
          name: 'Spice World Inc.',
          phone: '+91 8765432109',
          verified: true
        },
        deliveryAddress: '456 Kitchen Avenue, Culinary Zone, Delhi 110001',
        estimatedDelivery: '2024-01-25',
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'ORD-003',
        orderNumber: 'VS2024003',
        date: '2024-01-22',
        status: 'processing',
        total: 3200,
        items: [
          {
            id: 4,
            name: 'Whole Wheat Flour',
            vendor: 'Grain Masters Ltd.',
            quantity: 50,
            unit: 'kg',
            price: 45,
            image: '/floor.jpg'
          },
          {
            id: 5,
            name: 'Fresh Coconut Oil',
            vendor: 'Coconut Paradise',
            quantity: 2,
            unit: 'liter',
            price: 450,
            image: '/coconut.jpg'
          }
        ],
        vendor: {
          name: 'Grain Masters Ltd.',
          phone: '+91 9876543210',
          verified: true
        },
        deliveryAddress: '789 Bakery Lane, Food Hub, Bangalore 560001',
        estimatedDelivery: '2024-01-28'
      },
      {
        id: 'ORD-004',
        orderNumber: 'VS2024004',
        date: '2024-01-10',
        status: 'cancelled',
        total: 1200,
        items: [
          {
            id: 6,
            name: 'Full Cream Milk',
            vendor: 'Dairy Fresh',
            quantity: 20,
            unit: 'liter',
            price: 65,
            image: '/milk.jpg'
          }
        ],
        vendor: {
          name: 'Dairy Fresh',
          phone: '+91 7654321098',
          verified: false
        },
        deliveryAddress: '321 Cafe Street, Food Court, Chennai 600001',
        cancelReason: 'Product out of stock'
      }
    ]

    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter))
    }
  }, [statusFilter, orders])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const contactVendor = (vendor) => {
    const message = `Hi! I have a question about my order. Can you please help?`
    const whatsappUrl = `https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <ShoppingCartIcon className="h-8 w-8 text-green-600 mr-3" />
                My Orders
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your orders</p>
            </div>
            <Link
              to="/products"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Orders', count: orders.length },
                { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
                { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
                { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
                { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    statusFilter === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${statusFilter} orders found.`}
            </p>
            <Link
              to="/products"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-lg font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">by {item.vendor}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} {item.unit} × ₹{item.price} = ₹{(item.quantity * item.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Delivery Address</h5>
                      <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Vendor</h5>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-900 flex items-center">
                            {order.vendor.name}
                            {order.vendor.verified && (
                              <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />
                            )}
                          </p>
                          <p className="text-sm text-gray-600">{order.vendor.phone}</p>
                        </div>
                        <button
                          onClick={() => contactVendor(order.vendor)}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>Contact</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status-specific information */}
                  {order.status === 'shipped' && order.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Tracking Number</p>
                          <p className="text-sm text-gray-600">{order.trackingNumber}</p>
                        </div>
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                          <EyeIcon className="h-4 w-4" />
                          <span>Track Package</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {order.status === 'delivered' && order.actualDelivery && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-green-600">
                        ✅ Delivered on {new Date(order.actualDelivery).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}

                  {order.status === 'cancelled' && order.cancelReason && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-red-600">
                        ❌ Cancelled: {order.cancelReason}
                      </p>
                    </div>
                  )}

                  {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        📅 Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders