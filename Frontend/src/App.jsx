import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { CartProvider } from './context/CartContext'
import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VendorDashboard from './pages/VendorDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProductListing from './pages/ProductListing.jsx'
import ProductDetails from './pages/ProductDetails.jsx' // Added ProductDetails
import VendorApplication from './pages/VendorApplication.jsx'
import AddProduct from './pages/AddProduct.jsx'
import AboutPage from './pages/aboutus.jsx'
import FaqPage from './pages/faq.jsx'
import HelpCentrePage from './pages/helpcentre.jsx'
import HowItWorksPage from './pages/howitworks.jsx'
import ContactUsPage from './pages/contactus.jsx'
import TermsOfServicePage from './pages/termsofservice.jsx'
import PrivacyPolicyPage from './pages/privacy.jsx'
import Chat from './pages/Chat.jsx'
import Profile from './pages/Profile.jsx'
import Inventory from './pages/Inventory.jsx'
import MyOrders from './pages/MyOrders.jsx'
import Favorites from './pages/Favorites.jsx'
import Notifications from './pages/Notifications.jsx'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function AppContent() {
  const { user, logout } = useAuth()
  const userRole = user?.role || 'buyer'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} userRole={userRole} onLogout={logout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/faqq" element={<FaqPage />} />
          <Route path="/help" element={<HelpCentrePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard user={user} userRole={userRole} />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendor-application"
            element={
              <PrivateRoute>
                <VendorApplication user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendor-dashboard"
            element={
              <PrivateRoute>
                <VendorDashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProduct user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Inventory user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <MyOrders user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications user={user} />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App

