import React from 'react';

// A reusable component for consistent section styling
const LegalSection = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {children}
    </div>
  </section>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* --- Disclaimer --- */}
          <div className="p-4 mb-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800" role="alert">
            <h3 className="font-bold">For Informational Purposes Only</h3>
            <p>This is a template and not legal advice. You must consult a qualified legal professional to draft a Privacy Policy that is compliant with all applicable laws in your jurisdiction (e.g., Lucknow, Uttar Pradesh, India).</p>
          </div>

          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">Last Updated: July 27, 2025</p>
          </header>

          <LegalSection title="1. Introduction">
            <p>
              VendorStreet Technologies Pvt. Ltd. ("VendorStreet," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services (collectively, the "Service").
            </p>
          </LegalSection>

          <LegalSection title="2. Information We Collect">
            <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2.1. Personal Data You Provide</h3>
            <p>
              We collect personally identifiable information that you voluntarily provide to us when you register an account, apply to become a vendor, or otherwise contact us. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Contact Information:</strong> Name, email address, phone number.</li>
              <li><strong>Vendor Verification Data:</strong> Company details, physical business address, and mandatory documents such as your **FSSAI License**.</li>
              <li><strong>Financial Data:</strong> Payment information required for subscriptions and premium features.</li>
              <li><strong>Communications:</strong> Messages and other content you send through our in-app chat or other communication channels.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2.2. Data Collected Automatically</h3>
            <p>
              When you use our Service, we automatically collect information about your device and usage, including your IP address, browser type, operating system, and pages visited.
            </p>
          </LegalSection>

          <LegalSection title="3. How We Use Your Information">
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Create and manage your account.</li>
              <li>Verify vendor identity and credentials to ensure a trustworthy marketplace.</li>
              <li>Process payments for subscriptions and services.</li>
              <li>Facilitate communication between Buyers and Vendors.</li>
              <li>Send you notifications and service updates via integrations like OneSignal.</li>
              <li>Monitor and analyze usage to improve the Service.</li>
              <li>Prevent fraudulent activity and ensure security.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Disclosure of Your Information">
            <p>
              We may share information we have collected about you in certain situations:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>With Other Users:</strong> To facilitate transactions, your profile information (including company name and verification status) will be visible to other users.</li>
              <li><strong>With Service Providers:</strong> We may share your information with third-party vendors who perform services for us, such as payment processing, data analysis, and hosting.</li>
              <li><strong>By Law or to Protect Rights:</strong> We may share your information if required by law or to protect the rights, property, and safety of ourselves and others.</li>
              <li><strong>Business Transfers:</strong> Your information may be transferred in the event of a merger, sale of company assets, or acquisition.</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
          </LegalSection>

          <LegalSection title="5. Data Security">
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
            </p>
          </LegalSection>
          
          <LegalSection title="6. Your Rights">
            <p>
              You have certain rights regarding your personal information, including the right to access, correct, or delete your data. To exercise these rights, please contact us using the information below. We may need to verify your identity before processing your request.
            </p>
          </LegalSection>

          <LegalSection title="7. Children's Privacy">
            <p>
              Our Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18.
            </p>
          </LegalSection>

          <LegalSection title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </LegalSection>

          <LegalSection title="9. Contact Us">
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p>
              <strong>VendorStreet Technologies Pvt. Ltd.</strong><br />
              123 Business Street,<br />
              Food District, City 12345<br />
              Email: <a href="mailto:support@vendorstreet.com" className="text-blue-600 hover:underline">support@vendorstreet.com</a>
            </p>
          </LegalSection>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
