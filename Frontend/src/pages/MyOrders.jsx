import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClockIcon, CheckCircleIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/outline'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'shipped': return <TruckIcon className="h-5 w-5 text-blue-500" />
      case 'cancelled': return <XCircleIcon className="h-5 w-5 text-red-500" />
      default: return <ClockIcon className="h-5 w-5 text-yellow-500" />
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Start shopping to see your orders here.</p>
            <Link to="/products" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Order Placed</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Total</p>
                      <p className="text-sm font-medium text-gray-900">₹{order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Order #</p>
                      <p className="text-sm font-medium text-gray-900">{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-4">
                    {order.products.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={item.listing?.imageUrl ? `http://localhost:5000${item.listing.imageUrl}` : 'https://via.placeholder.com/64'}
                              alt={item.listing?.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              <Link to={`/products/${item.listing?._id}`} className="hover:text-green-600">
                                {item.listing?.title || 'Product Unavailable'}
                              </Link>
                            </h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-xs text-gray-500">Sold by: {item.vendor?.companyName}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">₹{item.priceAtPurchase}</p>
                      </div>
                    ))}
                  </div>
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