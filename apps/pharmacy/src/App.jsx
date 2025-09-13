import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@health-align/shared/contexts/AuthContext'
import Pharmacy from '@health-align/shared/components/pharmacy/Pharmacy'
import MedicineCart from '@health-align/shared/components/pharmacy/MedicineCart'
import MedicineCategory from '@health-align/shared/components/pharmacy/MedicineCategory'
import MedicineSearch from '@health-align/shared/components/pharmacy/MedicineSearch'
import MyOrders from '@health-align/shared/components/pharmacy/MyOrders'
import PharmacyMedicineDetails from '@health-align/shared/components/pharmacy/PharmacyMedicineDetails'
import PharmacyPayment from '@health-align/shared/components/pharmacy/PharmacyPayment'
import UploadPrescription from '@health-align/shared/components/pharmacy/UploadPrescription'
import PrescriptionConfirmation from '@health-align/shared/components/pharmacy/PrescriptionConfirmation'
import ProtectedRoute from '@health-align/shared/components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Pharmacy Routes */}
            <Route 
              path="/pharmacy" 
              element={
                <ProtectedRoute>
                  <Pharmacy />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacy/cart" 
              element={
                <ProtectedRoute>
                  <MedicineCart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacy/category/:categoryId" 
              element={
                <ProtectedRoute>
                  <MedicineCategory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacy/search" 
              element={
                <ProtectedRoute>
                  <MedicineSearch />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacy/orders" 
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacy/payment" 
              element={
                <ProtectedRoute>
                  <PharmacyPayment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacy/:medicineId" 
              element={
                <ProtectedRoute>
                  <PharmacyMedicineDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload-prescription" 
              element={
                <ProtectedRoute>
                  <UploadPrescription />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prescription-confirmation" 
              element={
                <ProtectedRoute>
                  <PrescriptionConfirmation />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/pharmacy" replace />} />
            <Route path="*" element={<Navigate to="/pharmacy" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App