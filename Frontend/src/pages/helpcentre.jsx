import React from 'react';

// You can use an icon library like 'react-icons' for better visuals
// Example: import { FiUser, FiBox, FiDollarSign, FiMessageSquare, FiSettings, FiFileText } from 'react-icons/fi';

// A reusable component for each help category card
const HelpCategoryCard = ({ icon, title, description, link = "#" }) => (
  <a
    href={link}
    className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center mb-3">
      <span className="text-3xl text-blue-600 mr-4">{icon}</span>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </a>
);

const HelpCentrePage = () => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section with Search Bar */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Help Centre
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome! How can we help you today?
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for answers (e.g., 'how to become a vendor')"
                className="w-full p-4 pr-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Browse by Category</h2>
            <p className="mt-2 text-gray-600">Explore topics to find the information you need.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <HelpCategoryCard
            icon="🚀" // Placeholder for an icon like <FiFileText />
            title="Getting Started"
            description="Learn the basics of setting up your account and navigating the VendorStreet platform."
          />
          <HelpCategoryCard
            icon="👤" // Placeholder for an icon like <FiUser />
            title="Account & Profile"
            description="Manage your profile, update details, and handle account settings."
          />
          <HelpCategoryCard
            icon="📦" // Placeholder for an icon like <FiBox />
            title="For Vendors"
            description="Guides on vendor verification, listing products, and managing your inventory."
          />
          <HelpCategoryCard
            icon="🛒" // Placeholder for an icon like <FiShoppingBag />
            title="For Buyers"
            description="Find out how to connect with vendors and source materials with confidence."
          />
          <HelpCategoryCard
            icon="💳" // Placeholder for an icon like <FiDollarSign />
            title="Subscriptions & Payments"
            description="Details about our subscription plans, premium features, and payment logs."
          />
          <HelpCategoryCard
            icon="💬" // Placeholder for an icon like <FiMessageSquare />
            title="FAQ"
            description="Find answers to our most frequently asked questions."
            link="/faq"
          />
        </div>
      </section>
      
      {/* "Can't find answer" Section */}
      <section className="bg-white">
          <div className="container mx-auto px-6 py-20">
              <div className="bg-[#00a63e] text-white rounded-lg p-10 text-center shadow-lg flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4">Still looking for answers?</h2>
                  <p className="mb-6 max-w-lg mx-auto">
                      If you can't find what you're looking for, our support team is here to help.
                  </p>
                  <a href="/contact" className="bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                      Contact Support
                  </a>
              </div>
          </div>
      </section>
    </div>
  );
};

export default HelpCentrePage;