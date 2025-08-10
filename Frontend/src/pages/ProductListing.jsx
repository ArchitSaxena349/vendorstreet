import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

const ProductListing = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [priceInputs, setPriceInputs] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('name')
  const [favorites, setFavorites] = useState(new Set())
  const [showFilters, setShowFilters] = useState(window.innerWidth >= 1024) // Show by default on large screens

  // Handle responsive filter visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !showFilters) {
        setShowFilters(true) // Auto-show on large screens
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showFilters])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [premiumOnly, setPremiumOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  // Initialize search query from URL parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search')
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery)
    }
  }, [searchParams])

  // Initialize price inputs
  useEffect(() => {
    setPriceInputs({
      min: priceRange[0] === 0 ? '' : priceRange[0].toString(),
      max: priceRange[1] === 10000 ? '' : priceRange[1].toString()
    })
  }, [priceRange])

  // Calculate dynamic category counts based on actual products
  const categoriesWithCounts = useMemo(() => {
    const baseCategoriesData = [
      { id: 'all', name: 'All Categories' },
      { id: 'grains', name: 'Grains & Cereals' },
      { id: 'spices', name: 'Spices & Herbs' },
      { id: 'dairy', name: 'Dairy Products' },
      { id: 'fruits', name: 'Fruits & Vegetables' },
      { id: 'meat', name: 'Meat & Seafood' },
      { id: 'oils', name: 'Oils & Fats' }
    ]

    return baseCategoriesData.map(category => ({
      ...category,
      count: category.id === 'all' 
        ? products.length 
        : products.filter(product => product.category === category.id).length
    })).filter(category => category.count > 0 || category.id === 'all') // Only show categories with products
  }, [products])

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProducts = [
      {
        id: 1,
        name: 'Organic Basmati Rice',
        vendor: 'Grain Masters Ltd.',
        vendorVerified: true,
        vendorRating: 4.8,
        category: 'grains',
        price: 850,
        unit: 'per 25kg bag',
        originalPrice: 950,
        discount: 11,
        image: '/rice.jpg',
        inStock: true,
        stockQuantity: 45,
        minOrder: 1,
        description: 'Premium quality organic basmati rice, aged for perfect aroma and taste.',
        tags: ['organic', 'premium', 'aged'],
        rating: 4.6,
        reviews: 24,
        location: 'Punjab, India'
      },
      {
        id: 2,
        name: 'Premium Turmeric Powder',
        vendor: 'Fresh Spices Co.',
        vendorVerified: true,
        vendorRating: 4.9,
        category: 'spices',
        price: 320,
        unit: 'per kg',
        originalPrice: 350,
        discount: 9,
        image: '/turmeric.jpg',
        inStock: true,
        stockQuantity: 120,
        minOrder: 5,
        description: 'Pure turmeric powder with high curcumin content, naturally processed.',
        tags: ['pure', 'high-curcumin', 'natural'],
        rating: 4.7,
        reviews: 18,
        location: 'Kerala, India'
      },
      {
        id: 3,
        name: 'Fresh Milk (Full Cream)',
        vendor: 'Dairy Fresh Suppliers',
        vendorVerified: false,
        vendorRating: 4.3,
        category: 'dairy',
        price: 65,
        unit: 'per liter',
        originalPrice: 70,
        discount: 7,
        image: '/milk.jpg',
        inStock: false,
        stockQuantity: 0,
        minOrder: 10,
        description: 'Fresh full cream milk from grass-fed cows, delivered daily.',
        tags: ['fresh', 'full-cream', 'daily-delivery'],
        rating: 4.2,
        reviews: 12,
        location: 'Gujarat, India'
      },
      {
        id: 4,
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
        location: 'Rajasthan, India'
      },
      {
        id: 5,
        name: 'Whole Wheat Flour',
        vendor: 'Grain Masters Ltd.',
        vendorVerified: true,
        vendorRating: 4.8,
        category: 'grains',
        price: 45,
        unit: 'per kg',
        originalPrice: 50,
        discount: 10,
        image: '/floor.jpg',
        inStock: true,
        stockQuantity: 200,
        minOrder: 10,
        description: 'Stone ground whole wheat flour, rich in fiber and nutrients.',
        tags: ['stone-ground', 'whole-grain', 'fiber-rich'],
        rating: 4.4,
        reviews: 28,
        location: 'Punjab, India'
      },
      {
        id: 6,
        name: 'Fresh Coconut Oil',
        vendor: 'Coconut Paradise',
        vendorVerified: true,
        vendorRating: 4.6,
        category: 'oils',
        price: 450,
        unit: 'per liter',
        originalPrice: 500,
        discount: 10,
        image: '\coconut.jpg',
        inStock: true,
        stockQuantity: 30,
        minOrder: 1,
        description: 'Cold-pressed virgin coconut oil, 100% pure and natural.',
        tags: ['cold-pressed', 'virgin', 'pure'],
        rating: 4.8,
        reviews: 15,
        location: 'Kerala, India'
      }
    ]

    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Verified vendors filter
    if (verifiedOnly) {
      filtered = filtered.filter(product => product.vendorVerified)
    }

    // Premium vendors filter (assuming premium vendors have rating >= 4.5)
    if (premiumOnly) {
      filtered = filtered.filter(product => product.vendorRating >= 4.5)
    }

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock)
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, priceRange, sortBy, verifiedOnly, premiumOnly, inStockOnly])

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const openWhatsApp = (product) => {
    const message = `Hi! I'm interested in ${product.name} from VendorStreet. Can you provide more details?`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for products, vendors, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Filters and Sort */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors relative"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                {(selectedCategory !== 'all' || verifiedOnly || premiumOnly || inStockOnly || priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {[
                      selectedCategory !== 'all',
                      verifiedOnly,
                      premiumOnly,
                      inStockOnly,
                      priceRange[0] > 0 || priceRange[1] < 10000
                    ].filter(Boolean).length}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Results Count and Active Filters */}
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {categoriesWithCounts.find(cat => cat.id === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {verifiedOnly && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Verified Only
                    <button
                      onClick={() => setVerifiedOnly(false)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {premiumOnly && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Premium Only
                    <button
                      onClick={() => setPremiumOnly(false)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    In Stock Only
                    <button
                      onClick={() => setInStockOnly(false)}
                      className="ml-1 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                    <button
                      onClick={() => {
                        setPriceRange([0, 10000])
                        setPriceInputs({ min: '', max: '' })
                      }}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 relative">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}
          
          {/* Sidebar Filters */}
          <div className={`w-80 flex-shrink-0 transition-all duration-300 ${showFilters ? 'block' : 'hidden'} ${showFilters ? 'fixed lg:relative top-0 left-0 h-full lg:h-auto z-50 lg:z-auto overflow-y-auto lg:overflow-visible' : ''}`}>
            <div className="bg-white rounded-lg shadow p-6 sticky top-8 lg:top-8">
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between mb-4 lg:mb-0">
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2 mb-6">
                {categoriesWithCounts.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </div>
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceInputs.min}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      setPriceInputs(prev => ({ ...prev, min: inputValue }))
                      
                      const numValue = inputValue === '' ? 0 : parseInt(inputValue)
                      if (!isNaN(numValue) && numValue >= 0) {
                        setPriceRange([numValue, priceRange[1]])
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setPriceInputs(prev => ({ ...prev, min: '0' }))
                        setPriceRange([0, priceRange[1]])
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceInputs.max}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      setPriceInputs(prev => ({ ...prev, max: inputValue }))
                      
                      const numValue = inputValue === '' ? 10000 : parseInt(inputValue)
                      if (!isNaN(numValue) && numValue >= 0) {
                        setPriceRange([priceRange[0], numValue])
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setPriceInputs(prev => ({ ...prev, max: '10000' }))
                        setPriceRange([priceRange[0], 10000])
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Type</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                  />
                  <span className="ml-2 text-sm text-gray-700">Verified Vendors Only</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={premiumOnly}
                    onChange={(e) => setPremiumOnly(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                  />
                  <span className="ml-2 text-sm text-gray-700">Premium Vendors (4.5+ rating)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setPriceRange([0, 10000])
                    setPriceInputs({ min: '', max: '' })
                    setVerifiedOnly(false)
                    setPremiumOnly(false)
                    setInStockOnly(false)
                    setSearchQuery('')
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
                    e.target.alt = 'Product image not available'}}
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                        {product.discount}% OFF
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      {favorites.has(product.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-400" />
                      )}
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
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{product.unit}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Min order: {product.minOrder}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stockQuantity}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openWhatsApp(product)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </button>
                      <button 
                        disabled={!product.inStock}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setPriceRange([0, 10000])
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListing
