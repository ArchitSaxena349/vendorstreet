import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock notifications data
    const mockNotifications = [
      {
        id: 1,
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order #VS2024002 has been shipped and is on the way. Expected delivery: Tomorrow',
        timestamp: '2 minutes ago',
        date: new Date(Date.now() - 2 * 60 * 1000),
        read: false,
        icon: TruckIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        link: '/orders',
        priority: 'high'
      },
      {
        id: 2,
        type: 'message',
        title: 'New Message from Fresh Spices Co.',
        message: 'You have received a new message about your turmeric powder inquiry. They have provided detailed pricing information.',
        timestamp: '5 minutes ago',
        date: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        icon: ChatBubbleLeftRightIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        link: '/chat',
        priority: 'medium'
      },
      {
        id: 3,
        type: 'order',
        title: 'Order Delivered Successfully',
        message: 'Your order #VS2024001 has been successfully delivered to your address. Please confirm receipt.',
        timestamp: '1 hour ago',
        date: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
        icon: CheckIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        link: '/orders',
        priority: 'medium'
      },
      {
        id: 4,
        type: 'alert',
        title: 'Stock Alert - Turmeric Powder',
        message: 'The product you favorited is running low in stock. Only 5 units left. Order now to avoid disappointment.',
        timestamp: '2 hours ago',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        icon: ExclamationTriangleIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        link: '/products',
        priority: 'low'
      },
      {
        id: 5,
        type: 'order',
        title: 'New Order Received',
        message: 'You have received a new order for Organic Basmati Rice (25kg). Order value: ₹2,125',
        timestamp: '3 hours ago',
        date: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
        icon: ShoppingCartIcon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        link: '/orders',
        priority: 'high'
      },
      {
        id: 6,
        type: 'message',
        title: 'Message from Grain Masters Ltd.',
        message: 'Your inquiry about bulk wheat flour pricing has been answered. Special discount available for orders above 100kg.',
        timestamp: '5 hours ago',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: true,
        icon: ChatBubbleLeftRightIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        link: '/chat',
        priority: 'medium'
      },
      {
        id: 7,
        type: 'alert',
        title: 'Price Drop Alert',
        message: 'Good news! The price of Red Chili Powder in your favorites has dropped by 15%. Now available at ₹238/kg.',
        timestamp: '1 day ago',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        icon: ExclamationTriangleIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        link: '/favorites',
        priority: 'medium'
      }
    ]

    setNotifications(mockNotifications)
    setFilteredNotifications(mockNotifications)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (filter === 'all') {
      setFilteredNotifications(notifications)
    } else if (filter === 'unread') {
      setFilteredNotifications(notifications.filter(n => !n.read))
    } else {
      setFilteredNotifications(notifications.filter(n => n.type === filter))
    }
  }, [filter, notifications])

  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
  }

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([])
    }
  }

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return notifications.length
    if (filterType === 'unread') return notifications.filter(n => !n.read).length
    return notifications.filter(n => n.type === filterType).length
  }

  const formatDate = (date) => {
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BellIcon className="h-8 w-8 text-green-600 mr-3" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Clear all</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All', count: getFilterCount('all') },
                { key: 'unread', label: 'Unread', count: getFilterCount('unread') },
                { key: 'order', label: 'Orders', count: getFilterCount('order') },
                { key: 'message', label: 'Messages', count: getFilterCount('message') },
                { key: 'alert', label: 'Alerts', count: getFilterCount('alert') }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
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

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : `No ${filter} notifications found. Try checking other categories.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const IconComponent = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow p-6 ${
                    !notification.read ? 'border-l-4 border-green-500 bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center`}>
                      <IconComponent className={`h-5 w-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-3">
                            <span className="text-sm text-gray-500">
                              {formatDate(notification.date)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.priority} priority
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.type === 'order' ? 'bg-purple-100 text-purple-800' :
                              notification.type === 'message' ? 'bg-green-100 text-green-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {notification.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50"
                              title="Mark as read"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                            title="Remove notification"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {notification.link && (
                        <div className="mt-4">
                          <Link
                            to={notification.link}
                            onClick={() => markAsRead(notification.id)}
                            className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            View details →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications