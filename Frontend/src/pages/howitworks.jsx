import React from 'react';

// Placeholder icons can be replaced with a library like react-icons or SVGs
const Step = ({ number, title, description, colorClass = 'bg-blue-600' }) => (
  <div className="flex items-start space-x-4">
    <div className={`flex-shrink-0 h-10 w-10 ${colorClass} text-white rounded-full flex items-center justify-center font-bold text-lg`}>
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-600">{description}</p>
    </div>
  </div>
);

const HowItWorksPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 text-center">
        <div className="container mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Simple Steps to Get Started
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            VendorStreet simplifies the process of sourcing and selling. Follow our straightforward guide for buyers and vendors.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          
          {/* === For Buyers === */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center md:text-left text-blue-700">
              For Buyers
            </h2>
            <div className="space-y-6 border-l-2 border-blue-200 pl-6">
              <Step
                number="1"
                title="Create Your Account"
                description="Simply sign up to get started. Every new user is automatically a buyer, giving you immediate access to browse the marketplace."
                colorClass="bg-blue-600"
              />
              <Step
                number="2"
                title="Discover & Connect"
                description="Explore listings from a network of verified vendors. Contact them directly through WhatsApp or our secure in-app chat to ask questions and discuss your needs."
                colorClass="bg-blue-600"
              />
              <Step
                number="3"
                title="Source with Confidence"
                description="Procure raw materials knowing that every vendor has passed FSSAI and physical address verification, ensuring a trustworthy and reliable supply chain."
                colorClass="bg-blue-600"
              />
            </div>
          </div>

          {/* === For Vendors === */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center md:text-left text-green-700">
              For Vendors
            </h2>
            <div className="space-y-6 border-l-2 border-green-200 pl-6">
              <Step
                number="1"
                title="Register & Apply"
                description="Sign up as a user and navigate to your profile to apply to become a vendor. The process is quick and straightforward."
                colorClass="bg-green-600"
              />
              <Step
                number="2"
                title="Complete Verification"
                description="Submit your FSSAI license and business address. Our team will review your documents and perform a physical verification to establish you as a trusted seller."
                colorClass="bg-green-600"
              />
              <Step
                number="3"
                title="List Your Products"
                description="Once verified, add your food raw materials to the marketplace. Your listings will go live after a quick approval from our admin team to ensure quality."
                colorClass="bg-green-600"
              />
              <Step
                number="4"
                title="Manage & Grow"
                description="Use your vendor dashboard to manage inventory, track stock levels, and update pricing. Utilize premium features to grow your business and reach more buyers."
                colorClass="bg-green-600"
              />
            </div>
          </div>

        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="bg-slate-50">
          <div className="container mx-auto px-6 py-20">
              <div className="bg-gray-800 text-white rounded-lg p-10 text-center shadow-lg">
                  <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
                  <p className="mb-6 max-w-2xl mx-auto">
                      Become part of a growing community dedicated to revolutionizing the food supply industry.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <a href="/register" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-500 transition-colors">
                          Sign Up Now
                      </a>
                      <a href="/contact" className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-500 transition-colors">
                          Contact Us
                      </a>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;