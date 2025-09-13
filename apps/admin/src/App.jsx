import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AdminDashboard from './components/AdminDashboard'
import AdminManagement from './components/AdminManagement'
import AdminForm from './components/AdminForm'
import AdminProfile from './components/AdminProfile'
import AdminProtectedRoute from './components/AdminProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/profile" 
              element={
                <AdminProtectedRoute>
                  <AdminProfile />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/:entityType/:action" 
              element={
                <AdminProtectedRoute>
                  <AdminManagement />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/:entityType/add-new/form" 
              element={
                <AdminProtectedRoute>
                  <AdminForm />
                </AdminProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App