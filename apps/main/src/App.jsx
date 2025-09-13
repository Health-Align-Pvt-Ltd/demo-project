import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@health-align/shared/contexts/AuthContext'
import AdminApp from '@health-align/admin/src/App'
import PharmacyApp from '@health-align/pharmacy/src/App'
import LabApp from '@health-align/lab/src/App'
import UserApp from '@health-align/user/src/App'
import RegionalAdminApp from '@health-align/regional-admin/src/App'
import HospitalAdminApp from '@health-align/hospital-admin/src/App'
import HospitalStaffApp from '@health-align/hospital-staff/src/App'
import HospitalAccountantApp from '@health-align/hospital-accountant/src/App'
import HospitalPharmacyApp from '@health-align/hospital-pharmacy/src/App'
import HospitalLabApp from '@health-align/hospital-lab/src/App'
import HospitalSupportApp from '@health-align/hospital-support/src/App'
import ClinicAdminApp from '@health-align/clinic-admin/src/App'
import ClinicStaffApp from '@health-align/clinic-staff/src/App'
import ClinicAccountantApp from '@health-align/clinic-accountant/src/App'
import PharmacyAdminApp from '@health-align/pharmacy-admin/src/App'
import PharmacyStaffApp from '@health-align/pharmacy-staff/src/App'
import PharmacyAccountantApp from '@health-align/pharmacy-accountant/src/App'
import DoctorAdminApp from '@health-align/doctor-admin/src/App'
import DoctorApp from '@health-align/doctor/src/App'
import DoctorAssistantApp from '@health-align/doctor-assistant/src/App'
import LabAdminApp from '@health-align/lab-admin/src/App'
import LabStaffApp from '@health-align/lab-staff/src/App'
import LabTechnicianApp from '@health-align/lab-technician/src/App'
import LabAccountantApp from '@health-align/lab-accountant/src/App'
import DeliveryAdminApp from '@health-align/delivery-admin/src/App'
import DeliveryAgentApp from '@health-align/delivery-agent/src/App'
import SuperAdminApp from '@health-align/super-admin/src/App'
import AccountantApp from '@health-align/accountant/src/App'
import CAApp from '@health-align/ca/src/App'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminApp />} />
            
            {/* Regional Admin routes */}
            <Route path="/regional-admin/*" element={<RegionalAdminApp />} />
            
            {/* Hospital Admin routes */}
            <Route path="/hospital-admin/*" element={<HospitalAdminApp />} />
            
            {/* Hospital Staff routes */}
            <Route path="/hospital-staff/*" element={<HospitalStaffApp />} />
            
            {/* Hospital Accountant routes */}
            <Route path="/hospital-accountant/*" element={<HospitalAccountantApp />} />
            
            {/* Hospital Pharmacy routes */}
            <Route path="/hospital-pharmacy/*" element={<HospitalPharmacyApp />} />
            
            {/* Hospital Lab routes */}
            <Route path="/hospital-lab/*" element={<HospitalLabApp />} />
            
            {/* Hospital Support routes */}
            <Route path="/hospital-support/*" element={<HospitalSupportApp />} />
            
            {/* Clinic Admin routes */}
            <Route path="/clinic-admin/*" element={<ClinicAdminApp />} />
            
            {/* Clinic Staff routes */}
            <Route path="/clinic-staff/*" element={<ClinicStaffApp />} />
            
            {/* Clinic Accountant routes */}
            <Route path="/clinic-accountant/*" element={<ClinicAccountantApp />} />
            
            {/* Pharmacy Admin routes */}
            <Route path="/pharmacy-admin/*" element={<PharmacyAdminApp />} />
            
            {/* Pharmacy Staff routes */}
            <Route path="/pharmacy-staff/*" element={<PharmacyStaffApp />} />
            
            {/* Pharmacy Accountant routes */}
            <Route path="/pharmacy-accountant/*" element={<PharmacyAccountantApp />} />
            
            {/* Doctor Admin routes */}
            <Route path="/doctor-admin/*" element={<DoctorAdminApp />} />
            
            {/* Doctor routes */}
            <Route path="/doctor/*" element={<DoctorApp />} />
            
            {/* Doctor Assistant routes */}
            <Route path="/doctor-assistant/*" element={<DoctorAssistantApp />} />
            
            {/* Lab Admin routes */}
            <Route path="/lab-admin/*" element={<LabAdminApp />} />
            
            {/* Lab Staff routes */}
            <Route path="/lab-staff/*" element={<LabStaffApp />} />
            
            {/* Lab Technician routes */}
            <Route path="/lab-technician/*" element={<LabTechnicianApp />} />
            
            {/* Lab Accountant routes */}
            <Route path="/lab-accountant/*" element={<LabAccountantApp />} />
            
            {/* Delivery Admin routes */}
            <Route path="/delivery-admin/*" element={<DeliveryAdminApp />} />
            
            {/* Delivery Agent routes */}
            <Route path="/delivery-agent/*" element={<DeliveryAgentApp />} />
            
            {/* Super Admin routes */}
            <Route path="/super-admin/*" element={<SuperAdminApp />} />
            
            {/* Accountant routes */}
            <Route path="/accountant/*" element={<AccountantApp />} />
            
            {/* Charted Accountant routes */}
            <Route path="/ca/*" element={<CAApp />} />
            
            {/* Pharmacy routes */}
            <Route path="/pharmacy/*" element={<PharmacyApp />} />
            
            {/* Lab/Ambulance routes */}
            <Route path="/lab/*" element={<LabApp />} />
            <Route path="/ambulance/*" element={<LabApp />} />
            
            {/* User routes */}
            <Route path="/user/*" element={<UserApp />} />
            
            {/* Root routes - default to user app */}
            <Route path="/" element={<UserApp />} />
            <Route path="*" element={<UserApp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App