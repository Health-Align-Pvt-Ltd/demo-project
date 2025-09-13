import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
// Import all app components from exporter
import { 
  SuperAdminHome, 
  CAHome, 
  RegionalAdminHome, 
  HospitalAdminHome, 
  HospitalStaffHome, 
  HospitalAccountantHome, 
  HospitalPharmacyHome, 
  HospitalLabHome, 
  HospitalSupportHome, 
  ClinicAdminHome, 
  ClinicStaffHome, 
  ClinicAccountantHome, 
  PharmacyAdminHome, 
  PharmacyStaffHome, 
  PharmacyAccountantHome, 
  DoctorAdminHome, 
  DoctorHome, 
  DoctorAssistantHome, 
  LabAdminHome, 
  LabStaffHome, 
  LabTechnicianHome, 
  LabAccountantHome, 
  DeliveryAdminHome, 
  DeliveryAgentHome, 
  AccountantHome, 
  AdminHome, 
  PharmacyHome, 
  LabHome, 
  UserHome,
  MainHome
} from "../apps/exporter"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {/* Default route */}
        <Route path='/' element={<UserHome />} />
        
        {/* User routes */}
        <Route path='/user/*' element={<UserHome />} />
        
        {/* Admin routes */}
        <Route path='/admin/*' element={<AdminHome />} />
        
        {/* Super Admin routes */}
        <Route path='/super-admin/*' element={<SuperAdminHome />} />
        
        {/* Regional Admin routes */}
        <Route path='/regional-admin/*' element={<RegionalAdminHome />} />
        
        {/* Hospital Admin routes */}
        <Route path='/hospital-admin/*' element={<HospitalAdminHome />} />
        
        {/* Hospital Staff routes */}
        <Route path='/hospital-staff/*' element={<HospitalStaffHome />} />
        
        {/* Hospital Accountant routes */}
        <Route path='/hospital-accountant/*' element={<HospitalAccountantHome />} />
        
        {/* Hospital Pharmacy routes */}
        <Route path='/hospital-pharmacy/*' element={<HospitalPharmacyHome />} />
        
        {/* Hospital Lab routes */}
        <Route path='/hospital-lab/*' element={<HospitalLabHome />} />
        
        {/* Hospital Support routes */}
        <Route path='/hospital-support/*' element={<HospitalSupportHome />} />
        
        {/* Clinic Admin routes */}
        <Route path='/clinic-admin/*' element={<ClinicAdminHome />} />
        
        {/* Clinic Staff routes */}
        <Route path='/clinic-staff/*' element={<ClinicStaffHome />} />
        
        {/* Clinic Accountant routes */}
        <Route path='/clinic-accountant/*' element={<ClinicAccountantHome />} />
        
        {/* Pharmacy Admin routes */}
        <Route path='/pharmacy-admin/*' element={<PharmacyAdminHome />} />
        
        {/* Pharmacy Staff routes */}
        <Route path='/pharmacy-staff/*' element={<PharmacyStaffHome />} />
        
        {/* Pharmacy Accountant routes */}
        <Route path='/pharmacy-accountant/*' element={<PharmacyAccountantHome />} />
        
        {/* Doctor Admin routes */}
        <Route path='/doctor-admin/*' element={<DoctorAdminHome />} />
        
        {/* Doctor routes */}
        <Route path='/doctor/*' element={<DoctorHome />} />
        
        {/* Doctor Assistant routes */}
        <Route path='/doctor-assistant/*' element={<DoctorAssistantHome />} />
        
        {/* Lab Admin routes */}
        <Route path='/lab-admin/*' element={<LabAdminHome />} />
        
        {/* Lab Staff routes */}
        <Route path='/lab-staff/*' element={<LabStaffHome />} />
        
        {/* Lab Technician routes */}
        <Route path='/lab-technician/*' element={<LabTechnicianHome />} />
        
        {/* Lab Accountant routes */}
        <Route path='/lab-accountant/*' element={<LabAccountantHome />} />
        
        {/* Delivery Admin routes */}
        <Route path='/delivery-admin/*' element={<DeliveryAdminHome />} />
        
        {/* Delivery Agent routes */}
        <Route path='/delivery-agent/*' element={<DeliveryAgentHome />} />
        
        {/* Accountant routes */}
        <Route path='/accountant/*' element={<AccountantHome />} />
        
        {/* CA (Charted Accountant) routes */}
        <Route path='/ca/*' element={<CAHome />} />
        
        {/* Pharmacy routes */}
        <Route path='/pharmacy/*' element={<PharmacyHome />} />
        
        {/* Lab routes */}
        <Route path='/lab/*' element={<LabHome />} />
        
        {/* Main app routes */}
        <Route path='/main/*' element={<MainHome />} />
        
        {/* Catch all route - default to UserHome */}
        <Route path='*' element={<UserHome />} />
      </Routes>
    </>
  )
}

export default App