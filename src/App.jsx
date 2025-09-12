import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import DoctorConsultation from './components/consultation/DoctorConsultation'
import DoctorDetails from './components/consultation/DoctorDetails'
import AppointmentDetails from './components/appointment/AppointmentDetails'
import PaymentGateway from './components/payment/PaymentGateway'
import PaymentSuccess from './components/payment/PaymentSuccess'
import Wallet from './components/wallet/Wallet'
import AmbulanceBooking from './components/ambulance/AmbulanceBooking'
import AmbulanceTracking from './components/ambulance/AmbulanceTracking'
import AmbulancePaymentGateway from './components/ambulance/AmbulancePaymentGateway'
import AmbulancePaymentSuccess from './components/ambulance/AmbulancePaymentSuccess'
import BloodRequest from './components/blood/BloodRequest'
import MedicineOrder from './components/medicine/MedicineOrder'
import MedicinePayment from './components/medicine/MedicinePayment'
import MedicineDetails from './components/medicine/MedicineDetails'
import Profile from './components/profile/Profile'
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/consultation" 
            element={
              <ProtectedRoute>
                <DoctorConsultation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/:doctorId" 
            element={
              <ProtectedRoute>
                <DoctorDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointment/:appointmentId" 
            element={
              <ProtectedRoute>
                <AppointmentDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <PaymentGateway />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-success" 
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wallet" 
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ambulance" 
            element={
              <ProtectedRoute>
                <AmbulanceBooking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ambulance-payment" 
            element={
              <ProtectedRoute>
                <AmbulancePaymentGateway />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/track-ambulance" 
            element={
              <ProtectedRoute>
                <AmbulanceTracking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ambulance-payment-success" 
            element={
              <ProtectedRoute>
                <AmbulancePaymentSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blood-request" 
            element={
              <ProtectedRoute>
                <BloodRequest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medicine" 
            element={
              <ProtectedRoute>
                <MedicineOrder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medicine/:medicineId" 
            element={
              <ProtectedRoute>
                <MedicineDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medicine-payment" 
            element={
              <ProtectedRoute>
                <MedicinePayment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App
