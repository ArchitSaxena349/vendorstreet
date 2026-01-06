import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { StarIcon, ShoppingCartIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const ProductDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // We'll reuse the existing listing API but modify backend if needed
                // Currently we don't have a direct get-one endpoint publicly documented
                // So we might need to rely on the general list or create a specific one
                // For now, let's assume we can filter or fetch all and find
                // Optimization: Create GET /api/listings/:id

                // Temporary workaround: Fetch all and find (Inefficient but works for MVP)
                // Real implementation should have GET /api/listings/:id
                const response = await fetch('http://localhost:5000/api/listings')
                const data = await response.json()
                if (data.success) {
                    const found = data.data.find(p => p._id === id)
                    setProduct(found)
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = () => {
        addToCart(product, quantity)
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    )

    if (!product) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
            <button onClick={() => navigate('/products')} className="mt-4 text-green-600 hover:text-green-700">
                Back to products
            </button>
        </div>
    )

    const imageUrl = product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/400'

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    Back
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={product.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

                            <div className="flex items-center space-x-2 mb-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    {product.categoryId?.name || 'General'}
                                </span>
                                {product.vendorId?.verificationStatus === 'verified' && (
                                    <span className="flex items-center text-xs text-blue-600 font-medium">
                                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                                        Verified Vendor
                                    </span>
                                )}
                            </div>

                            <div className="flex items-baseline space-x-2 mb-6">
                                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                                <span className="text-lg text-gray-500">/ {product.unit}</span>
                            </div>

                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {product.description || 'No description available for this product.'}
                            </p>

                            <div className="border-t border-b border-gray-200 py-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-gray-900">Sold By</span>
                                    <span className="text-sm text-green-600 font-medium">{product.vendorId?.companyName || 'Vendor'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">Stock Status</span>
                                    <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} ${product.unit})` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 font-medium text-gray-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stockQuantity <= 0}
                                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCartIcon className="h-5 w-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2 text-sm text-gray-500 justify-center">
                                    <TruckIcon className="h-4 w-4" />
                                    <span>Standard delivery in 2-4 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
