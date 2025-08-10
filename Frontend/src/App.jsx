
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { AuthProvider } from '../../backend/contexts/AuthContext'
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
import VendorApplication from './pages/VendorApplication.jsx'
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
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState('buyer') // 'buyer', 'vendor', 'admin'

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('vendorstreet_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setUserRole(userData.role || 'buyer')
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setUserRole(userData.role || 'buyer')
    localStorage.setItem('vendorstreet_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setUserRole('buyer')
    localStorage.removeItem('vendorstreet_user')
  }

  return (
   
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header user={user} userRole={userRole} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<Dashboard user={user} userRole={userRole} />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard user={user} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard user={user} />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/vendor-application" element={<VendorApplication user={user} />} />
            <Route path="/chat" element={<Chat user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/inventory" element={<Inventory user={user} />} />
            <Route path="/orders" element={<MyOrders user={user} />} />
            <Route path="/favorites" element={<Favorites user={user} />} />
            <Route path="/notifications" element={<Notifications user={user} />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/faqq" element={<FaqPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/help" element={<HelpCentrePage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
   
  )
}

export default App
