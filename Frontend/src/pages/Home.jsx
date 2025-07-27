import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
  StarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const featuredCategories = [
    { name: 'Grains & Cereals', count: '250+ products', image: '/cereals.jpg' },
    { name: 'Spices & Herbs', count: '180+ products', image: '/spices.jpg' },
    { name: 'Dairy Products', count: '120+ products', image: '/dairy.jpg' },
    { name: 'Fruits & Vegetables', count: '300+ products', image: '/vegies.jpg' },
    { name: 'Meat & Seafood', count: '90+ products', image: '/meat.jpg' },
    { name: 'Oils & Fats', count: '65+ products', image: '/oils.jpg' }
  ]

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Verified Vendors',
      description: 'All vendors are verified with FSSAI license and physical address verification'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Direct Communication',
      description: 'Chat directly with vendors via WhatsApp or in-app messaging'
    },
    {
      icon: TruckIcon,
      title: 'Quality Assurance',
      description: 'Premium food raw materials with quality guarantees'
    }
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Restaurant Owner',
      content: 'VendorStreet has made sourcing ingredients so much easier. The verified vendors give me confidence in quality.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Food Manufacturer',
      content: 'Great platform with reliable suppliers. The direct communication feature saves a lot of time.',
      rating: 5
    },
    {
      name: 'Ahmed Ali',
      role: 'Caterer',
      content: 'Excellent variety of products and competitive prices. Highly recommended for food businesses.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Trusted Marketplace for
              <span className="block text-green-200">Food Raw Materials</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Connect with verified vendors, discover quality ingredients, and grow your food business with VendorStreet
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for food raw materials, vendors, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 text-gray-900 rounded-full text-lg focus:ring-4 focus:ring-green-300 focus:outline-none"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <button className="absolute right-2 top-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start as Buyer
              </Link>
              <Link 
                to="/vendor-application" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover a wide range of food raw materials from verified vendors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCategories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl bg-gray-200 h-48 mb-4">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Remove or modify this line to remove the green shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VendorStreet?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a secure, efficient, and reliable platform for all your food sourcing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-200">Verified Vendors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-200">Products Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2500+</div>
              <div className="text-green-200">Happy Buyers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-200">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied vendors and buyers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
