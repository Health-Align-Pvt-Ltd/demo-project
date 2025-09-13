// Test file to verify all app connections
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './src/App';

// Mock the exporter imports
jest.mock('./apps/exporter', () => ({
  SuperAdminHome: () => <div>SuperAdminHome</div>,
  CAHome: () => <div>CAHome</div>,
  RegionalAdminHome: () => <div>RegionalAdminHome</div>,
  HospitalAdminHome: () => <div>HospitalAdminHome</div>,
  HospitalStaffHome: () => <div>HospitalStaffHome</div>,
  HospitalAccountantHome: () => <div>HospitalAccountantHome</div>,
  HospitalPharmacyHome: () => <div>HospitalPharmacyHome</div>,
  HospitalLabHome: () => <div>HospitalLabHome</div>,
  HospitalSupportHome: () => <div>HospitalSupportHome</div>,
  ClinicAdminHome: () => <div>ClinicAdminHome</div>,
  ClinicStaffHome: () => <div>ClinicStaffHome</div>,
  ClinicAccountantHome: () => <div>ClinicAccountantHome</div>,
  PharmacyAdminHome: () => <div>PharmacyAdminHome</div>,
  PharmacyStaffHome: () => <div>PharmacyStaffHome</div>,
  PharmacyAccountantHome: () => <div>PharmacyAccountantHome</div>,
  DoctorAdminHome: () => <div>DoctorAdminHome</div>,
  DoctorHome: () => <div>DoctorHome</div>,
  DoctorAssistantHome: () => <div>DoctorAssistantHome</div>,
  LabAdminHome: () => <div>LabAdminHome</div>,
  LabStaffHome: () => <div>LabStaffHome</div>,
  LabTechnicianHome: () => <div>LabTechnicianHome</div>,
  LabAccountantHome: () => <div>LabAccountantHome</div>,
  DeliveryAdminHome: () => <div>DeliveryAdminHome</div>,
  DeliveryAgentHome: () => <div>DeliveryAgentHome</div>,
  AccountantHome: () => <div>AccountantHome</div>,
  AdminHome: () => <div>AdminHome</div>,
  PharmacyHome: () => <div>PharmacyHome</div>,
  LabHome: () => <div>LabHome</div>,
  UserHome: () => <div>UserHome</div>,
  MainHome: () => <div>MainHome</div>
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    const { getByText } = render(
      <Router>
        <App />
      </Router>
    );
    
    // This test will pass if the App component renders without errors
    expect(true).toBe(true);
  });
});