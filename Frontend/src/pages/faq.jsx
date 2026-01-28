import React, { useState } from 'react';

// An array to hold the FAQ data. This makes it easy to add, remove, or edit questions.
const faqData = [
    {
        question: "What is VendorStreet?",
        answer: "VendorStreet is a specialized digital platform for the food industry, connecting raw material vendors with buyers. We focus on creating a trustworthy marketplace with features for easy communication, secure verification, and efficient inventory management."
    },
    {
        question: "How do I become a vendor?",
        answer: "All users sign up as buyers by default. To become a vendor, you can apply from your user profile. You will need to submit a mandatory FSSAI license and provide your business address for our team to conduct a physical verification."
    },
    {
        question: "What documents are required for vendor verification?",
        answer: "A valid FSSAI (Food Safety and Standards Authority of India) license is mandatory for all vendors. Additionally, we will verify the physical business address you provide to ensure authenticity."
    },
    {
        question: "Is it free to use the platform?",
        answer: "The platform is free for buyers to browse listings and connect with vendors. For vendors, we operate on a subscription model which includes monthly charges for listing items. We also offer premium features like advertising and a 'Verified Seller Badge' for enhanced visibility."
    },
    {
        question: "How do my listings get approved?",
        answer: "After a vendor adds a new listing for a raw material, it is submitted for review. Our admin team will verify the details and approve the listing before it goes live on the marketplace. This ensures quality and trust for all users."
    },
    {
        question: "How can I manage my inventory?",
        answer: "Vendors have access to a dashboard where they can manage their product quantities, update pricing, and set 'out-of-stock' flags. The system also provides real-time updates and notifications for low stock to help you stay on top of your inventory."
    },
    {
        question: "How can I communicate with a seller?",
        answer: "We provide multiple communication channels. You can use the direct 'Chat on WhatsApp' link on a vendor's profile or use the integrated in-app chat for real-time messaging without leaving the platform."
    }
];

// A reusable component for a single FAQ item
const FaqItem = ({ faq, index, openFaq, setOpenFaq }) => {
    const isOpen = index === openFaq;

    const toggleFaq = () => {
        setOpenFaq(isOpen ? null : index);
    };

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={toggleFaq}
                className="w-full flex justify-between items-center text-left focus:outline-none"
            >
                <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                <span className="transform transition-transform duration-300">
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    )}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen mt-4' : 'max-h-0'}`}
            >
                <p className="text-gray-600 leading-relaxed pr-6">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};


const FaqPage = () => {
    // State to keep track of which FAQ item is currently open
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Have questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
                    </p>
                </div>

                <div className="mt-12 max-w-3xl mx-auto">
                    {faqData.map((faq, index) => (
                        <FaqItem
                            key={index}
                            faq={faq}
                            index={index}
                            openFaq={openFaq}
                            setOpenFaq={setOpenFaq}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
