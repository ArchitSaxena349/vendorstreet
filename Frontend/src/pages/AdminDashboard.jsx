import { useState, useEffect } from 'react'
import {
  UserGroupIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const [pendingVendors, setPendingVendors] = useState([])
  const [pendingListings, setPendingListings] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`
      }

      // Fetch pending vendors
      const vendorsRes = await fetch('https://vendorstreet.onrender.com/api/vendors/pending', { headers })
      const vendorsData = await vendorsRes.json()
      if (vendorsData.success) {
        setPendingVendors(vendorsData.data)
      }

      // Fetch pending listings
      const listingsRes = await fetch('https://vendorstreet.onrender.com/api/listings/admin/pending', { headers })
      const listingsData = await listingsRes.json()
      if (listingsData.success) {
        setPendingListings(listingsData.data) // Assuming backend matches this naming
      }

      // Fetch stats (mock for now or implement backend endpoint)
      // For now we can calculate some from the data we have or leave as mock
      setStats({
        totalVendors: 156, // Placeholder
        activeVendors: 142,
        pendingVendors: vendorsData.data ? vendorsData.data.length : 0,
        totalListings: 1247,
        approvedListings: 1189,
        pendingListings: listingsData.data ? listingsData.data.length : 0,
        totalOrders: 3456,
        totalRevenue: 2458000
      })

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error)
    }
  }

  const handleVendorAction = async (vendorId, status) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://vendorstreet.onrender.com/api/vendors/${vendorId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }) // 'verified' or 'rejected'
      })

      if (response.ok) {
        // Refresh data
        fetchDashboardData()
      } else {
        alert('Failed to update vendor status')
      }
    } catch (error) {
      console.error('Error updating vendor:', error)
    }
  }

  const handleListingAction = async (listingId, status) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://vendorstreet.onrender.com/api/listings/${listingId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }) // 'approved' or 'rejected'
      })

      if (response.ok) {
        fetchDashboardData()
      } else {
        alert('Failed to update listing status')
      }
    } catch (error) {
      console.error('Error updating listing:', error)
    }
  }

  const approveVendor = (id) => handleVendorAction(id, 'verified')
  const rejectVendor = (id) => handleVendorAction(id, 'rejected')
  const approveListing = (id) => handleListingAction(id, 'approved')
  const rejectListing = (id) => handleListingAction(id, 'rejected')

  const quickStats = [
    {
      label: 'Total Vendors',
      value: stats.totalVendors,
      change: '+5%',
      color: 'text-blue-600',
      icon: BuildingStorefrontIcon
    },
    {
      label: 'Active Listings',
      value: stats.approvedListings,
      change: '+12%',
      color: 'text-green-600',
      icon: DocumentTextIcon
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      change: '+18%',
      color: 'text-purple-600',
      icon: ShoppingBagIcon
    },
    {
      label: 'Revenue',
      value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
      change: '+15%',
      color: 'text-orange-600',
      icon: ChartBarIcon
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage vendors, listings, and platform operations
          </p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Vendor Applications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Pending Vendor Applications ({pendingVendors.filter(v => v.status === 'pending').length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingVendors.filter(vendor => vendor.status === 'pending').map((vendor) => (
                  <div key={vendor._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{vendor.companyName}</h3>
                        <p className="text-sm text-gray-600">{vendor.userId?.email}</p>
                        <p className="text-sm text-gray-600">{vendor.userId?.phone}</p>
                      </div>
                      <span className="px-2  py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Business Type: {vendor.businessType}</p>
                      <p>FSSAI: {vendor.fssaiLicense}</p>
                      <p>Applied: {new Date(vendor.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => approveVendor(vendor._id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectVendor(vendor._id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Listings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Pending Product Listings ({pendingListings.filter(l => l.status === 'pending').length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingListings.filter(listing => listing.status === 'pending').map((listing) => (
                  <div key={listing._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{listing.title}</h3>
                        <p className="text-sm text-gray-600">{listing.vendorId?.companyName}</p>
                        <p className="text-sm text-gray-600">{listing.categoryId?.name}</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Price: ₹{listing.price}</p>
                      <p>Submitted: {new Date(listing.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => approveListing(listing._id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectListing(listing._id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <UserGroupIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-700">New vendor application from Fresh Spices Co.</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <DocumentTextIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">Product listing approved: Organic Basmati Rice</span>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <ShoppingBagIcon className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-700">Order completed: ORD-12345</span>
                <span className="text-xs text-gray-500">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

