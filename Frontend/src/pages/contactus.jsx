import React, { useState } from 'react';

// You can use a library like 'react-icons' for better visuals
// Example: import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Create email content
      const subject = `Contact Form Message from ${formData.firstName} ${formData.lastName}`
      const body = `
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}

Message:
${formData.message}

---
Sent from VendorStreet Contact Form
      `

      // Create mailto link
      const mailtoLink = `mailto:architsaxena349@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      // Try to open email client
      const emailWindow = window.open(mailtoLink)
      
      // Check if email client opened successfully
      setTimeout(() => {
        if (emailWindow && !emailWindow.closed) {
          setSubmitStatus('success')
          setFormData({ firstName: '', lastName: '', email: '', message: '' })
        } else {
          // Fallback: copy to clipboard and show instructions
          navigator.clipboard.writeText(`To: architsaxena349@gmail.com\nSubject: ${subject}\n\n${body}`)
            .then(() => {
              setSubmitStatus('clipboard')
            })
            .catch(() => {
              setSubmitStatus('manual')
            })
        }
      }, 1000)

    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50">
      {/* Page Header */}
      <section className="bg-white text-center border-b">
        <div className="container mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Get In Touch
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about features, trials, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      {/* Main Content: Two-Column Layout */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Column 1: Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Contact Information</h2>
            <p className="text-gray-600">
              Fill up the form and our team will get back to you within 24 hours. Alternatively, you can reach us through the channels below.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-2xl text-green-600">📞</span> 
                <a href="tel:+918887662519" className="text-gray-700 hover:text-green-600 text-lg">+91 8887662519</a>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl text-green-600">✉️</span> 
                <a href="mailto:architsaxena349@gmail.com" className="text-gray-700 hover:text-green-600 text-lg">architsaxena349@gmail.com</a>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-2xl text-blue-600 mt-1">📍</span>
                <p className="text-gray-700 text-lg">
                  123 Vikas Nagar,<br />
                  Food District, Lucknow 226022
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    required 
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  required 
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  required
                ></textarea>
              </div>

              {/* Status Messages */}
              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                  submitStatus === 'clipboard' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                  submitStatus === 'manual' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                  'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus === 'success' && (
                    <div>
                      <strong>✅ Email client opened!</strong>
                      <p className="mt-1">Your email client should have opened with a pre-filled message. Please send it to complete your inquiry.</p>
                    </div>
                  )}
                  {submitStatus === 'clipboard' && (
                    <div>
                      <strong>📋 Message copied to clipboard!</strong>
                      <p className="mt-1">The message has been copied to your clipboard. Please paste it into your email client and send to: architsaxena349@gmail.com</p>
                    </div>
                  )}
                  {submitStatus === 'manual' && (
                    <div>
                      <strong>📧 Please send manually</strong>
                      <p className="mt-1">Please send your message manually to: <strong>architsaxena349@gmail.com</strong></p>
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div>
                      <strong>❌ Error occurred</strong>
                      <p className="mt-1">Please contact us directly at: <strong>architsaxena349@gmail.com</strong> or call <strong>+91 8887662519</strong></p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
