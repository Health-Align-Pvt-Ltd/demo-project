import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@health-align/shared/contexts/AuthContext'
import AmbulanceBooking from '@health-align/shared/components/ambulance/AmbulanceBooking'
import AmbulanceTracking from '@health-align/shared/components/ambulance/AmbulanceTracking'
import AmbulancePaymentGateway from '@health-align/shared/components/ambulance/AmbulancePaymentGateway'
import AmbulancePaymentSuccess from '@health-align/shared/components/ambulance/AmbulancePaymentSuccess'
import ProtectedRoute from '@health-align/shared/components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Ambulance/Lab Routes */}
            <Route 
              path="/ambulance" 
              element={
                <ProtectedRoute>
                  <AmbulanceBooking />
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
              path="/ambulance-payment" 
              element={
                <ProtectedRoute>
                  <AmbulancePaymentGateway />
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
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/ambulance" replace />} />
            <Route path="*" element={<Navigate to="/ambulance" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App