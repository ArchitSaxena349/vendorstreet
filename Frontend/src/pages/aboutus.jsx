import React from 'react';

// You can use an icon library like 'react-icons' for better visuals
// import { FiShield, FiMessageCircle, FiBox, FiCheckCircle } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-slate-50">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Building the Future of Food Supply
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            VendorStreet is a dedicated digital marketplace designed to connect raw material vendors and buyers in the food industry, fostering a community built on trust and efficiency.
          </p>
        </div>
      </section>

      <hr />

      {/* Our Mission Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            Our mission is to simplify and secure the food raw material supply chain. We aim to create a single, trustworthy platform where vendors can effortlessly manage their business and buyers can confidently source high-quality materials. We eliminate friction through easy communication, secure verification, and smooth inventory management.
          </p>
        </div>
      </section>

      <hr />

      {/* Key Features Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose VendorStreet?</h2>
            <p className="text-gray-600 mt-2">The core benefits of our platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature Card 1: Verified Network */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              {/* <FiShield className="text-4xl text-blue-600 mb-4" /> */}
              <div className="text-4xl text-blue-600 mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Verified Network</h3>
              <p className="text-gray-600">
                Every vendor is verified through mandatory **FSSAI license checks** and physical address verification to ensure a trustworthy marketplace.
              </p>
            </div>

            {/* Feature Card 2: Seamless Communication */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              {/* <FiMessageCircle className="text-4xl text-blue-600 mb-4" /> */}
              <div className="text-4xl text-blue-600 mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Seamless Communication</h3>
              <p className="text-gray-600">
                Connect instantly with vendors via direct **WhatsApp chats** or our integrated in-app messaging system.
              </p>
            </div>

            {/* Feature Card 3: Effortless Listing */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              {/* <FiBox className="text-4xl text-blue-600 mb-4" /> */}
              <div className="text-4xl text-blue-600 mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Effortless Management</h3>
              <p className="text-gray-600">
                Vendors can easily manage their product listings, inventory, and pricing with **real-time updates** and low-stock alerts.
              </p>
            </div>

            {/* Feature Card 4: Admin Oversight */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              {/* <FiCheckCircle className="text-4xl text-blue-600 mb-4" /> */}
               <div className="text-4xl text-blue-600 mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Guaranteed Quality</h3>
              <p className="text-gray-600">
                All listings go live only after **admin approval**, ensuring high-quality and accurately represented products on the platform.
              </p>
            </div>

          </div>
        </div>
      </section>
      
      <hr />

      {/* Call to Action Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-[#00a63e] text-white rounded-lg p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the VendorStreet Community Today</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Whether you're a buyer looking for reliable suppliers or a vendor aiming to expand your reach, VendorStreet is the platform for you.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/register" className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Get Started as a Buyer
            </a>
            <a href="/vendor-application" className="bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              Apply to be a Vendor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;