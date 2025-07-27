import React from 'react';

// You can use a library like 'react-icons' for better visuals
// Example: import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ContactUsPage = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implement form submission logic here.
    // This could involve using an API endpoint, a service like EmailJS, or another backend solution.
    alert("Thank you for your message! We will get back to you shortly.");
    event.target.reset();
  };

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
                <span className="text-2xl text-blue-600">📞</span> 
                <a href="tel:+917880730633" className="text-gray-700 hover:text-blue-600 text-lg">+91 7880730633</a>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl text-blue-600">✉️</span> 
                <a href="mailto:architsaxena349@gmail.com" className="text-gray-700 hover:text-blue-600 text-lg">architsaxena349@gmail.com</a>
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
                  <input type="text" id="firstName" name="firstName" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" id="lastName" name="lastName" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" name="email" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" name="message" rows="5" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-[#00a63e] text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;