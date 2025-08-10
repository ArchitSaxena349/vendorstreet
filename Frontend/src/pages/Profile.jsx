import { useState, useEffect } from 'react'
import { 
  UserIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckCircleIcon,
  CameraIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  PhotoIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const Profile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: null
  })
  const [businessData, setBusinessData] = useState({
    companyName: '',
    businessType: '',
    gstNumber: '',
    fssaiLicense: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    }
  })
  const [documents, setDocuments] = useState([])
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [documentFile, setDocumentFile] = useState(null)
  const [documentNumber, setDocumentNumber] = useState('')
  const [documentExpiryDate, setDocumentExpiryDate] = useState('')

  useEffect(() => {
    fetchProfileData()
  }, [])

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.user.firstName || '',
        lastName: profileData.user.lastName || '',
        email: profileData.user.email || '',
        phone: profileData.user.phone || '',
        profileImage: profileData.user.profileImage || null
      })

      if (profileData.vendorProfile) {
        setBusinessData({
          companyName: profileData.vendorProfile.companyName || '',
          businessType: profileData.vendorProfile.businessType || '',
          gstNumber: profileData.vendorProfile.gstNumber || '',
          fssaiLicense: profileData.vendorProfile.fssaiLicense || '',
          businessAddress: {
            street: profileData.vendorProfile.businessAddress?.street || '',
            city: profileData.vendorProfile.businessAddress?.city || '',
            state: profileData.vendorProfile.businessAddress?.state || '',
            pincode: profileData.vendorProfile.businessAddress?.pincode || '',
            landmark: profileData.vendorProfile.businessAddress?.landmark || ''
          }
        })
      }
    }
  }, [profileData])

  const fetchProfileData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        setProfileData(data.data)
        
        // Fetch documents
        const documentsResponse = await fetch('http://localhost:5000/api/auth/documents', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        const documentsData = await documentsResponse.json()
        if (documentsData.success) {
          setDocuments(documentsData.data.documents)
        }
      } else {
        console.error('Failed to fetch profile:', data.message)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('business.')) {
      const field = name.replace('business.', '')
      if (field.startsWith('address.')) {
        const addressField = field.replace('address.', '')
        setBusinessData(prev => ({
          ...prev,
          businessAddress: {
            ...prev.businessAddress,
            [addressField]: value
          }
        }))
      } else {
        setBusinessData(prev => ({
          ...prev,
          [field]: value
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF)')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }
      
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = async () => {
    if (!documentFile || !selectedDocumentType) {
      alert('Please select a document type and file')
      return
    }

    setUploadingDocument(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('document', documentFile)
      formData.append('documentType', selectedDocumentType)
      formData.append('documentNumber', documentNumber)
      formData.append('expiryDate', documentExpiryDate)

      const response = await fetch('http://localhost:5000/api/auth/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        // Add the new document to the list
        setDocuments(prev => [...prev, data.data.document])
        
        // Reset form
        setShowUploadModal(false)
        setDocumentFile(null)
        setSelectedDocumentType('')
        setDocumentNumber('')
        setDocumentExpiryDate('')
        
        alert('Document uploaded successfully!')
      } else {
        alert('Failed to upload document: ' + data.message)
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document. Please try again.')
    } finally {
      setUploadingDocument(false)
    }
  }

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF or image file (JPEG, PNG)')
        return
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      
      setDocumentFile(file)
    }
  }

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/auth/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
        alert('Document deleted successfully!')
      } else {
        alert('Failed to delete document: ' + data.message)
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document. Please try again.')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      
      if (activeTab === 'personal') {
        // Save personal information
        const formDataToSend = new FormData()
        formDataToSend.append('firstName', formData.firstName)
        formDataToSend.append('lastName', formData.lastName)
        formDataToSend.append('phone', formData.phone)
        
        if (profileImageFile) {
          formDataToSend.append('profileImage', profileImageFile)
        }

        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        })

        const data = await response.json()
        if (data.success) {
          setIsEditing(false)
          setProfileImageFile(null)
          setProfileImagePreview(null)
          await fetchProfileData() // Refresh profile data
          alert('Profile updated successfully!')
        } else {
          alert('Failed to update profile: ' + data.message)
        }
      } else if (activeTab === 'business') {
        // Save business information
        const response = await fetch('http://localhost:5000/api/auth/profile/vendor', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(businessData)
        })

        const data = await response.json()
        if (data.success) {
          setIsEditing(false)
          await fetchProfileData() // Refresh profile data
          alert('Business profile updated successfully!')
        } else {
          alert('Failed to update business profile: ' + data.message)
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <ShieldCheckIcon className="h-5 w-5 text-green-500" />
      case 'under_review':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'scheduled':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'business', name: 'Business Info', icon: BuildingStorefrontIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImagePreview || formData.profileImage ? (
                    <img
                      src={profileImagePreview || formData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors cursor-pointer">
                  <CameraIcon className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData ? `${profileData.user.firstName} ${profileData.user.lastName}` : 'Loading...'}
                </h1>
                <p className="text-gray-600">{profileData?.user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profileData?.user.emailVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profileData?.user.emailVerified ? 'Email Verified' : 'Email Pending'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {profileData?.user.role?.charAt(0).toUpperCase() + profileData?.user.role?.slice(1) || 'Buyer'}
                  </span>
                  {profileData?.vendorProfile?.verificationStatus === 'verified' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span>Verified Vendor</span>
                    </span>
                  )}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p>Member since: {new Date(profileData?.user.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  {profileData?.user.lastLogin && (
                    <p>Last login: {new Date(profileData.user.lastLogin).toLocaleDateString('en-IN')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  <div className="flex items-center space-x-2">
                    {isEditing && (
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setProfileImageFile(null)
                          setProfileImagePreview(null)
                          // Reset form data
                          if (profileData) {
                            setFormData({
                              firstName: profileData.user.firstName || '',
                              lastName: profileData.user.lastName || '',
                              email: profileData.user.email || '',
                              phone: profileData.user.phone || '',
                              profileImage: profileData.user.profileImage || null
                            })
                          }
                        }}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : isEditing ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      ) : (
                        <>
                          <PencilIcon className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true} // Email typically can't be changed
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business Info Tab */}
            {activeTab === 'business' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
                  {profileData?.vendorProfile && (
                    <div className="flex items-center space-x-2">
                      {isEditing && (
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            // Reset business data
                            if (profileData?.vendorProfile) {
                              setBusinessData({
                                companyName: profileData.vendorProfile.companyName || '',
                                businessType: profileData.vendorProfile.businessType || '',
                                gstNumber: profileData.vendorProfile.gstNumber || '',
                                fssaiLicense: profileData.vendorProfile.fssaiLicense || '',
                                businessAddress: {
                                  street: profileData.vendorProfile.businessAddress?.street || '',
                                  city: profileData.vendorProfile.businessAddress?.city || '',
                                  state: profileData.vendorProfile.businessAddress?.state || '',
                                  pincode: profileData.vendorProfile.businessAddress?.pincode || '',
                                  landmark: profileData.vendorProfile.businessAddress?.landmark || ''
                                }
                              })
                            }
                          }}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                      <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : isEditing ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        ) : (
                          <>
                            <PencilIcon className="h-4 w-4" />
                            <span>Edit Business Info</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!profileData?.vendorProfile ? (
                  <div className="text-center p-8">
                    <BuildingStorefrontIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Business Profile</h3>
                    <p className="text-gray-600 mb-4">
                      You're currently registered as a buyer. Apply to become a vendor to add business information.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/vendor-application'}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Become a Vendor
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Company Information */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Company Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="business.companyName"
                            value={businessData.companyName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type
                          </label>
                          <select
                            name="business.businessType"
                            value={businessData.businessType}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          >
                            <option value="">Select Business Type</option>
                            <option value="Trader">Trader</option>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Supplier">Supplier</option>
                            <option value="Distributor">Distributor</option>
                            <option value="Wholesaler">Wholesaler</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GST Number (Optional)
                          </label>
                          <input
                            type="text"
                            name="business.gstNumber"
                            value={businessData.gstNumber}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="22AAAAA0000A1Z5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            FSSAI License Number
                          </label>
                          <input
                            type="text"
                            name="business.fssaiLicense"
                            value={businessData.fssaiLicense}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="12345678901234"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Address */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Business Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          <textarea
                            name="business.address.street"
                            value={businessData.businessAddress.street}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows={3}
                            placeholder="Enter complete street address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="business.address.city"
                            value={businessData.businessAddress.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="business.address.state"
                            value={businessData.businessAddress.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="business.address.pincode"
                            value={businessData.businessAddress.pincode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            pattern="[0-9]{6}"
                            placeholder="123456"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            name="business.address.landmark"
                            value={businessData.businessAddress.landmark}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Near landmark"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Verification Status */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Verification Status</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(profileData.vendorProfile.verificationStatus)}
                          <div>
                            <p className="font-medium text-gray-900">
                              {profileData.vendorProfile.verificationStatus === 'verified' ? 'Verified Vendor' :
                               profileData.vendorProfile.verificationStatus === 'under_review' ? 'Under Review' :
                               profileData.vendorProfile.verificationStatus === 'pending' ? 'Pending Verification' :
                               'Verification Required'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {profileData.vendorProfile.verificationStatus === 'verified' 
                                ? 'Your business has been verified and approved.'
                                : 'Complete your profile and upload required documents for verification.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Documents & Verification</h2>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <PhotoIcon className="h-4 w-4" />
                    <span>Upload Document</span>
                  </button>
                </div>
                
                {documents.length === 0 ? (
                  <div className="text-center p-8">
                    <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Uploaded</h3>
                    <p className="text-gray-600 mb-4">
                      Upload your business documents to complete verification process.
                    </p>
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Upload First Document
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((document) => (
                      <div key={document.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {getStatusIcon(document.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-medium text-gray-900">{document.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                                  {document.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600">
                                {document.documentNumber && (
                                  <p>Document Number: <span className="font-medium">{document.documentNumber}</span></p>
                                )}
                                {document.uploadDate && (
                                  <p>Uploaded: {new Date(document.uploadDate).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}</p>
                                )}
                                {document.expiryDate && (
                                  <p>Valid until: {new Date(document.expiryDate).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}</p>
                                )}
                                {document.scheduledDate && (
                                  <p>Scheduled for: {new Date(document.scheduledDate).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}</p>
                                )}
                              </div>

                              {/* Status-specific messages */}
                              {document.status === 'verified' && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                  <p className="text-sm text-green-800">
                                    ✅ Document verified successfully. No further action required.
                                  </p>
                                </div>
                              )}
                              
                              {document.status === 'under_review' && (
                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                  <p className="text-sm text-yellow-800">
                                    ⏳ Document is under review. We'll notify you once verification is complete.
                                  </p>
                                </div>
                              )}
                              
                              {document.status === 'scheduled' && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <p className="text-sm text-blue-800">
                                    📅 Physical verification scheduled. Please be available at the scheduled time.
                                  </p>
                                </div>
                              )}
                              
                              {document.status === 'rejected' && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                  <p className="text-sm text-red-800">
                                    ❌ Document rejected. Please upload a new document with correct information.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => window.open(document.filePath || '#', '_blank')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              View
                            </button>
                            {document.status !== 'verified' && (
                              <button 
                                onClick={() => {
                                  setSelectedDocumentType(document.type)
                                  setShowUploadModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Replace
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteDocument(document.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Delete document"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Document Requirements */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-medium text-blue-900 mb-3">Required Documents for Verification</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                      <span>FSSAI License (Food Safety and Standards Authority of India)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                      <span>Business Registration Certificate</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                      <span>GST Registration (if applicable)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                      <span>Address Proof (Utility Bill/Lease Agreement)</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Document Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setDocumentFile(null)
                    setSelectedDocumentType('')
                    setDocumentNumber('')
                    setDocumentExpiryDate('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select document type</option>
                    <option value="fssai">FSSAI License</option>
                    <option value="business">Business Registration</option>
                    <option value="gst">GST Certificate</option>
                    <option value="address">Address Proof</option>
                    <option value="identity">Identity Proof</option>
                    <option value="bank">Bank Statement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="Enter document number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={documentExpiryDate}
                    onChange={(e) => setDocumentExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      onChange={handleDocumentFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {documentFile ? documentFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setDocumentFile(null)
                    setSelectedDocumentType('')
                    setDocumentNumber('')
                    setDocumentExpiryDate('')
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDocumentUpload}
                  disabled={!documentFile || !selectedDocumentType || uploadingDocument}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingDocument ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload Document'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
