import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@health-align/shared/contexts/AuthContext'
import Dashboard from '@health-align/shared/components/dashboard/Dashboard'
import DoctorConsultation from '@health-align/shared/components/consultation/DoctorConsultation'
import DoctorDetails from '@health-align/shared/components/consultation/DoctorDetails'
import AppointmentDetails from '@health-align/shared/components/appointment/AppointmentDetails'
import PaymentGateway from '@health-align/shared/components/payment/PaymentGateway'
import PaymentSuccess from '@health-align/shared/components/payment/PaymentSuccess'
import Wallet from '@health-align/shared/components/wallet/Wallet'
import BloodRequest from '@health-align/shared/components/blood/BloodRequest'
import MedicineOrder from '@health-align/shared/components/medicine/MedicineOrder'
import MedicinePayment from '@health-align/shared/components/medicine/MedicinePayment'
import MedicineDetails from '@health-align/shared/components/medicine/MedicineDetails'
import Profile from '@health-align/shared/components/profile/Profile'
import PWAInstallPrompt from '@health-align/shared/components/pwa/PWAInstallPrompt'
import Login from '@health-align/shared/components/auth/Login'
import Register from '@health-align/shared/components/auth/Register'
import ProtectedRoute from '@health-align/shared/components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
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
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App