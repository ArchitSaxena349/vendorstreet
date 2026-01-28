import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  UserIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'
import NotificationDropdown from './NotificationDropdown.jsx'
import Cart from './Cart.jsx'
import { useCart } from '../context/CartContext'

const Header = ({ user, userRole, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [headerSearchQuery, setHeaderSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleCart, cartCount } = useCart()
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchUnreadMessages()
      const interval = setInterval(fetchUnreadMessages, 10000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://vendorstreet.onrender.com/api/chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.success) {
        const count = result.data.reduce((acc, conv) => acc + (conv.unread || 0), 0)
        setUnreadMessageCount(count)
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error)
    }
  }

  // Hide header search on products page since it has its own search
  const shouldShowHeaderSearch = !location.pathname.startsWith('/products')

  const handleHeaderSearch = (e) => {
    e.preventDefault()
    if (headerSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearchQuery.trim())}`)
      setIsSearchOpen(false)
      setHeaderSearchQuery('')
    } else {
      navigate('/products')
      setIsSearchOpen(false)
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin-dashboard'
      case 'vendor':
        return '/vendor-dashboard'
      default:
        return '/dashboard'
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VendorStreet</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          {shouldShowHeaderSearch && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleHeaderSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for food raw materials..."
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
            </div>
          )}

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className={`text-sm font-medium ${isActive('/products') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Products
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className={`text-sm font-medium ${isActive(getDashboardLink()) ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                >
                  Dashboard
                </Link>

                {userRole === 'buyer' && (
                  <Link
                    to="/vendor-application"
                    className="text-sm font-medium text-gray-700 hover:text-green-600"
                  >
                    Become Vendor
                  </Link>
                )}

                <Link
                  to="/chat"
                  className="relative text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Messages"
                >
                  <ChatBubbleLeftRightIcon className="h-6 w-6" />
                  {unreadMessageCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadMessageCount}
                    </span>
                  )}
                </Link>

                <NotificationDropdown user={user} />

                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="text-sm font-medium">{user.name || 'Profile'}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
                <button
                  onClick={toggleCart}
                  className="relative text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Cart"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {shouldShowHeaderSearch && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-700 hover:text-green-600"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {shouldShowHeaderSearch && isSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <form onSubmit={handleHeaderSearch} className="relative">
              <input
                type="text"
                placeholder="Search for food raw materials..."
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/products"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {userRole === 'buyer' && (
                    <Link
                      to="/vendor-application"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become Vendor
                    </Link>
                  )}

                  <Link
                    to="/chat"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Messages
                  </Link>

                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium bg-green-600 text-white hover:bg-green-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {user && userRole && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account
                {userRole === 'vendor' && user.verified && (
                  <span className="ml-1 text-green-600">✓ Verified</span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      <Cart />
    </header>
  )
}

export default Header
