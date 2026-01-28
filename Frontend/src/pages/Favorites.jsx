import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HeartIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CheckBadgeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockFavorites = [
      {
        id: 1,
        name: 'Organic Basmati Rice',
        vendor: 'Grain Masters Ltd.',
        vendorVerified: true,
        vendorRating: 4.8,
        category: 'grains',
        price: 850,
        unit: 'per 25kg bag',
        originalPrice: 900,
        discount: 6,
        image: '/rice.jpg',
        inStock: true,
        stockQuantity: 150,
        minOrder: 1,
        description: 'Premium quality organic basmati rice, aged for perfect aroma and taste.',
        tags: ['organic', 'premium', 'aged'],
        rating: 4.6,
        reviews: 89,
        location: 'Punjab, India',
        addedToFavorites: '2024-01-10'
      },
      {
        id: 2,
        name: 'Turmeric Powder',
        vendor: 'Spice World Inc.',
        vendorVerified: true,
        vendorRating: 4.9,
        category: 'spices',
        price: 320,
        unit: 'per kg',
        originalPrice: 350,
        discount: 9,
        image: '/turmeric.jpg',
        inStock: true,
        stockQuantity: 75,
        minOrder: 2,
        description: 'Pure turmeric powder with high curcumin content, sourced directly from farms.',
        tags: ['pure', 'high-curcumin', 'farm-fresh'],
        rating: 4.7,
        reviews: 156,
        location: 'Karnataka, India',
        addedToFavorites: '2024-01-08'
      },
      {
        id: 3,
        name: 'Red Chili Powder',
        vendor: 'Spice World Inc.',
        vendorVerified: true,
        vendorRating: 4.7,
        category: 'spices',
        price: 280,
        unit: 'per kg',
        originalPrice: 300,
        discount: 7,
        image: '/chilli.jpg',
        inStock: true,
        stockQuantity: 85,
        minOrder: 2,
        description: 'Authentic red chili powder with perfect heat and color.',
        tags: ['authentic', 'spicy', 'natural-color'],
        rating: 4.5,
        reviews: 31,
        location: 'Rajasthan, India',
        addedToFavorites: '2024-01-05'
      },
      {
        id: 4,
        name: 'Fresh Coconut Oil',
        vendor: 'Coconut Paradise',
        vendorVerified: true,
        vendorRating: 4.6,
        category: 'oils',
        price: 450,
        unit: 'per liter',
        originalPrice: 500,
        discount: 10,
        image: '/coconut.jpg',
        inStock: false,
        stockQuantity: 0,
        minOrder: 1,
        description: 'Cold-pressed virgin coconut oil, 100% pure and natural.',
        tags: ['cold-pressed', 'virgin', 'pure'],
        rating: 4.8,
        reviews: 15,
        location: 'Kerala, India',
        addedToFavorites: '2024-01-03'
      }
    ]

    setFavorites(mockFavorites)
    setLoading(false)
  }, [])

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId))
  }

  const openWhatsApp = (product) => {
    const message = `Hi! I'm interested in ${product.name} from VendorStreet. Can you provide more details?`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
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
                <HeartIcon className="h-8 w-8 text-red-600 mr-3" />
                My Favorites
              </h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} saved product{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link
              to="/products"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start adding products to your favorites to see them here.
            </p>
            <Link
              to="/products"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
                      e.target.alt = 'Product image not available'
                    }}
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow group"
                    title="Remove from favorites"
                  >
                    <HeartSolidIcon className="h-5 w-5 text-red-500 group-hover:text-red-600" />
                  </button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">{product.vendor}</span>
                    {product.vendorVerified && (
                      <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                    )}
                  </div>

                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{product.unit}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">
                      Min. order: {product.minOrder} {product.unit.split(' ')[1] || 'unit'}
                    </span>
                    <span className="text-sm text-gray-600">{product.location}</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    Added on {new Date(product.addedToFavorites).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openWhatsApp(product)}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                      disabled={!product.inStock}
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      <span>Contact Vendor</span>
                    </button>
                    <Link
                      to={`/products/${product.id}`}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-center"
                    >
                      View Details
                    </Link>
                  </div>

                  {!product.inStock && (
                    <div className="mt-2">
                      <button className="w-full bg-gray-100 text-gray-500 py-2 px-3 rounded-lg text-sm font-medium cursor-not-allowed">
                        Notify When Available
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all favorites?')) {
                    setFavorites([])
                  }
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Clear All Favorites</span>
              </button>
              <Link
                to="/products"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ShoppingCartIcon className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
