import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation

const LegalSection = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {children}
    </div>
  </section>
);

const TermsOfServicePage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Disclaimer Box */}
          <div className="p-4 mb-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800" role="alert">
            <h3 className="font-bold">Disclaimer: For Informational Purposes Only</h3>
            <p>This is a template for Terms of Service and not legal advice. You must consult with a qualified legal professional to draft a document that is tailored to your business and compliant with all applicable laws.</p>
          </div>

          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-500">Last Updated: July 27, 2025</p>
          </header>

          <LegalSection title="1. Agreement to Terms">
            <p>
              By accessing or using the VendorStreet platform, website, and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). These Terms affect your legal rights and obligations. If you do not agree to be bound by all of these Terms, do not access or use the Service.
            </p>
            <p>
              The Service is owned and operated by VendorStreet Technologies Pvt. Ltd. ("VendorStreet", "we", "us", "our").
            </p>
          </LegalSection>
          
          <LegalSection title="2. User Roles and Accounts">
            <p>
              Our Service offers two main user roles: Buyers and Vendors. By default, all users who register for an account on the Service are considered "Buyers."
            </p>
            <p>
              Users may apply to become a "Vendor" through the application process available on the platform. Approval as a Vendor is at the sole discretion of VendorStreet and is subject to the verification requirements outlined in these Terms.
            </p>
          </LegalSection>

          <LegalSection title="3. Vendor Verification and Listings">
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3.1. Verification Process</h3>
            <p>
              To be approved as a Vendor, you must submit the following for verification:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>A valid and current FSSAI (Food Safety and Standards Authority of India) license.</li>
              <li>A verifiable physical business address, which will be subject to physical verification by VendorStreet personnel or our appointed agents.</li>
            </ul>
            <p>
              Providing false or misleading information during the verification process will result in immediate rejection of your application or termination of your Vendor account.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3.2. Product Listings</h3>
            <p>
              As a verified Vendor, you may add or remove listings for food raw materials. All listings are subject to review and approval by the VendorStreet admin team before they are made public on the Service. We reserve the right to reject or remove any listing that violates our policies or is deemed inappropriate, at our sole discretion.
            </p>
          </LegalSection>

          <LegalSection title="4. Fees and Monetization">
            <p>
              VendorStreet charges fees for certain services. By using these services, you agree to the pricing and payment terms that will be disclosed to you for those services.
            </p>
             <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Listing Charges:</strong> Vendors are subject to subscription fees based on a monthly plan for listing items on the platform.</li>
                <li><strong>Premium Features:</strong> We may offer optional premium features, such as advertising listings at the top of search results or a "Verified Seller Badge," for an additional charge.</li>
            </ul>
            <p>
              All fees are non-refundable. We reserve the right to change our fees at any time, with appropriate notice provided to affected users.
            </p>
          </LegalSection>

          <LegalSection title="5. Platform Conduct">
            <p>
              You agree not to use the Service to post, solicit, or engage in any activity that is illegal, harmful, fraudulent, or infringes on the rights of others. You are solely responsible for the interactions you have with other users, whether online or offline.
            </p>
          </LegalSection>

          <LegalSection title="6. Disclaimers and Limitation of Liability">
            <p>
              The Service is provided on an "as is" and "as available" basis. To the fullest extent permissible by law, VendorStreet disclaims all warranties, express or implied, in connection with the Service and your use thereof.
            </p>
            <p>
              VendorStreet is a platform that connects Buyers and Vendors. We are not a party to any transaction between users. We are not responsible for the quality, safety, legality, or any other aspect of the items listed, nor for the truth or accuracy of the listings.
            </p>
          </LegalSection>

          <LegalSection title="7. Governing Law">
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or the use of the Service shall be subject to the exclusive jurisdiction of the courts located in Lucknow, Uttar Pradesh, India.
            </p>
          </LegalSection>

          <LegalSection title="8. Changes to Terms">
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </LegalSection>

          <LegalSection title="9. Contact Us">
            <p>
              If you have any questions about these Terms, please contact us through our <Link to="/contact-us" className="text-blue-600 hover:underline">Contact Page</Link>.
            </p>
          </LegalSection>

        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
