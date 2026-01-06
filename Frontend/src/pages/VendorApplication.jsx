
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'

const VendorApplication = ({ user }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    phone: '',
    email: user?.email || '',
    gstNumber: '',
    fssaiLicense: '',
    bankAccountNumber: '',
    bankIFSC: '',
    bankName: '',
    businessDescription: '',
    productCategories: [],
    experienceYears: '',
    monthlyCapacity: '',
    fssaiDocument: null,
    businessProof: null,
    bankStatement: null,
    agreeToTerms: false,
    agreeToVerification: false
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Private Limited Company',
    'Limited Liability Partnership',
    'Cooperative Society',
    'Other'
  ]

  const productCategories = [
    'Grains & Cereals',
    'Spices & Herbs',
    'Dairy Products',
    'Fruits & Vegetables',
    'Meat & Seafood',
    'Oils & Fats',
    'Beverages',
    'Packaged Foods',
    'Frozen Foods',
    'Organic Products'
  ]

  const steps = [
    { id: 1, name: 'Business Information', status: 'current' },
    { id: 2, name: 'Legal Documents', status: 'upcoming' },
    { id: 3, name: 'Banking Details', status: 'upcoming' },
    { id: 4, name: 'Business Details', status: 'upcoming' },
    { id: 5, name: 'Review & Submit', status: 'upcoming' }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] })
    } else if (type === 'checkbox') {
      if (name === 'productCategories') {
        const updatedCategories = checked
          ? [...formData.productCategories, value]
          : formData.productCategories.filter(cat => cat !== value)
        setFormData({ ...formData, productCategories: updatedCategories })
      } else {
        setFormData({ ...formData, [name]: checked })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.businessName) newErrors.businessName = 'Business name is required'
        if (!formData.businessType) newErrors.businessType = 'Business type is required'
        if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required'
        if (!formData.city) newErrors.city = 'City is required'
        if (!formData.state) newErrors.state = 'State is required'
        if (!formData.pincode) newErrors.pincode = 'Pincode is required'
        if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required'
        if (!formData.phone) newErrors.phone = 'Phone number is required'
        break

      case 2:
        if (!formData.fssaiLicense) newErrors.fssaiLicense = 'FSSAI license number is required'
        if (!formData.fssaiDocument) newErrors.fssaiDocument = 'FSSAI license document is required'
        if (!formData.businessProof) newErrors.businessProof = 'Business proof document is required'
        break

      case 3:
        if (!formData.bankAccountNumber) newErrors.bankAccountNumber = 'Bank account number is required'
        if (!formData.bankIFSC) newErrors.bankIFSC = 'Bank IFSC code is required'
        if (!formData.bankName) newErrors.bankName = 'Bank name is required'
        break

      case 4:
        if (!formData.businessDescription) newErrors.businessDescription = 'Business description is required'
        if (formData.productCategories.length === 0) newErrors.productCategories = 'Select at least one product category'
        if (!formData.experienceYears) newErrors.experienceYears = 'Experience years is required'
        if (!formData.monthlyCapacity) newErrors.monthlyCapacity = 'Monthly capacity is required'
        break

      case 5:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions'
        if (!formData.agreeToVerification) newErrors.agreeToVerification = 'You must agree to verification process'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('companyName', formData.businessName)
      data.append('businessType', formData.businessType)
      data.append('gstNumber', formData.gstNumber)
      data.append('fssaiLicense', formData.fssaiLicense)

      // Address construction
      data.append('businessAddress[street]', formData.businessAddress)
      data.append('businessAddress[city]', formData.city)
      data.append('businessAddress[state]', formData.state)
      data.append('businessAddress[pincode]', formData.pincode)

      // Files
      if (formData.fssaiDocument) {
        data.append('fssaiDocument', formData.fssaiDocument)
      }
      if (formData.businessProof) {
        data.append('businessProof', formData.businessProof)
      }

      // Other fields logic can be added here if backend supports them (e.g. description, categories)
      // Currently backend vendorController mostly focuses on profile core data.
      // We'll append others as metadata if needed or expand the backend later.

      const token = localStorage.getItem('token') // Assuming token is stored here

      const response = await fetch('http://localhost:5000/api/vendors/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Submission failed')
      }

      // Successful submission
      alert('Vendor application submitted successfully! You will receive a confirmation email shortly.')
      navigate('/vendor-dashboard') // Navigate to proper vendor dashboard
    } catch (error) {
      alert(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.businessName ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter your business name"
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.businessType ? 'border-red-500' : 'border-gray-300'
                      } `}
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.businessAddress ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter complete business address"
                  />
                  {errors.businessAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter pincode"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter contact person name"
                  />
                  {errors.contactPerson && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
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
                    disabled={!!user?.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Legal Documents</h3>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Required Documents</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      All vendors must provide valid FSSAI license and business proof documents for verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FSSAI License Number *
                  </label>
                  <input
                    type="text"
                    name="fssaiLicense"
                    value={formData.fssaiLicense}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.fssaiLicense ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter FSSAI license number"
                  />
                  {errors.fssaiLicense && (
                    <p className="text-red-500 text-sm mt-1">{errors.fssaiLicense}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FSSAI License Document *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
                    <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <input
                      type="file"
                      name="fssaiDocument"
                      onChange={handleInputChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="fssai-upload"
                    />
                    <label htmlFor="fssai-upload" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        {formData.fssaiDocument ? formData.fssaiDocument.name : 'Upload FSSAI License'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                    </label>
                  </div>
                  {errors.fssaiDocument && (
                    <p className="text-red-500 text-sm mt-1">{errors.fssaiDocument}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter GST number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Proof Document *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
                    <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <input
                      type="file"
                      name="businessProof"
                      onChange={handleInputChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="business-upload"
                    />
                    <label htmlFor="business-upload" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        {formData.businessProof ? formData.businessProof.name : 'Upload Business Proof'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Business Registration, Shop License, etc. (PDF, JPG, PNG up to 10MB)
                      </p>
                    </label>
                  </div>
                  {errors.businessProof && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessProof}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Banking Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.bankName ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter bank name"
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.bankAccountNumber ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter account number"
                  />
                  {errors.bankAccountNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    name="bankIFSC"
                    value={formData.bankIFSC}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.bankIFSC ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Enter IFSC code"
                  />
                  {errors.bankIFSC && (
                    <p className="text-red-500 text-sm mt-1">{errors.bankIFSC}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.businessDescription ? 'border-red-500' : 'border-gray-300'
                      } `}
                    placeholder="Describe your business, products, and services"
                  />
                  {errors.businessDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Categories * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {productCategories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          name="productCategories"
                          value={category}
                          checked={formData.productCategories.includes(category)}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                  {errors.productCategories && (
                    <p className="text-red-500 text-sm mt-1">{errors.productCategories}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <select
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.experienceYears ? 'border-red-500' : 'border-gray-300'
                        } `}
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    {errors.experienceYears && (
                      <p className="text-red-500 text-sm mt-1">{errors.experienceYears}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Production Capacity *
                    </label>
                    <input
                      type="text"
                      name="monthlyCapacity"
                      value={formData.monthlyCapacity}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.monthlyCapacity ? 'border-red-500' : 'border-gray-300'
                        } `}
                      placeholder="e.g., 1000 kg, 500 units"
                    />
                    {errors.monthlyCapacity && (
                      <p className="text-red-500 text-sm mt-1">{errors.monthlyCapacity}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Submit</h3>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Application Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Business Name:</span>
                    <span className="ml-2 text-gray-900">{formData.businessName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Business Type:</span>
                    <span className="ml-2 text-gray-900">{formData.businessType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">FSSAI License:</span>
                    <span className="ml-2 text-gray-900">{formData.fssaiLicense}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Product Categories:</span>
                    <span className="ml-2 text-gray-900">{formData.productCategories.length} selected</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-green-600 hover:text-green-700">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-green-600 hover:text-green-700">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
                )}

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToVerification"
                    checked={formData.agreeToVerification}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I consent to VendorStreet's verification process including physical address verification
                    and document validation. I understand this may take 3-5 business days.
                  </span>
                </label>
                {errors.agreeToVerification && (
                  <p className="text-red-500 text-sm">{errors.agreeToVerification}</p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">What happens next?</h4>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li>• Document verification (1-2 business days)</li>
                      <li>• Physical address verification by our team</li>
                      <li>• Account activation and onboarding</li>
                      <li>• You'll receive email updates throughout the process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Vendor</h1>
          <p className="text-gray-600 mt-2">
            Join VendorStreet and start selling your food raw materials to verified buyers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step.id < currentStep
                  ? 'bg-green-600 border-green-600 text-white'
                  : step.id === currentStep
                    ? 'border-green-600 text-green-600'
                    : 'border-gray-300 text-gray-300'
                  } `}>
                  {step.id < currentStep ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  } `}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-20 h-0.5 ml-4 ${step.id < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    } `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorApplication
