import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhotoIcon } from '@heroicons/react/24/solid'

const AddProduct = () => {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        price: '',
        unit: 'kg',
        stockQuantity: '',
        minimumOrderQuantity: '1',
        image: null
    })

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categories')
                const data = await response.json()
                if (data.success) {
                    setCategories(data.data.categories)
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            }
        }
        fetchCategories()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                image: e.target.files[0]
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('categoryId', formData.categoryId)
            data.append('price', formData.price)
            data.append('unit', formData.unit)
            data.append('stockQuantity', formData.stockQuantity)
            data.append('minimumOrderQuantity', formData.minimumOrderQuantity)

            if (formData.image) {
                data.append('image', formData.image)
            }

            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/listings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Failed to create product')
            }

            alert('Product created successfully! It will be visible after admin approval.')
            navigate('/vendor-dashboard')

        } catch (error) {
            console.error('Error creating product:', error)
            alert(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Add New Product
                        </h2>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="categoryId"
                                required
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Unit</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                >
                                    <option value="kg">Per Kg</option>
                                    <option value="g">Per Gram</option>
                                    <option value="l">Per Litre</option>
                                    <option value="pc">Per Piece</option>
                                    <option value="dozen">Per Dozen</option>
                                    <option value="box">Per Box</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    required
                                    min="0"
                                    value={formData.stockQuantity}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Min Order Qty</label>
                                <input
                                    type="number"
                                    name="minimumOrderQuantity"
                                    required
                                    min="1"
                                    value={formData.minimumOrderQuantity}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="image" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    {formData.image && (
                                        <p className="text-sm text-green-600 font-medium">Selected: {formData.image.name}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/vendor-dashboard')}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProduct
