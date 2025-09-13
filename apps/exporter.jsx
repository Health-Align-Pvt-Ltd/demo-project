// exporter.jsx
// Centralized export module for all Health Align applications

// Import all app components
import SuperAdminApp from './super-admin/src/App.jsx';
import CAApp from './ca/src/App.jsx';
import RegionalAdminApp from './regional-admin/src/App.jsx';
import HospitalAdminApp from './hospital-admin/src/App.jsx';
import HospitalStaffApp from './hospital-staff/src/App.jsx';
import HospitalAccountantApp from './hospital-accountant/src/App.jsx';
import HospitalPharmacyApp from './hospital-pharmacy/src/App.jsx';
import HospitalLabApp from './hospital-lab/src/App.jsx';
import HospitalSupportApp from './hospital-support/src/App.jsx';
import ClinicAdminApp from './clinic-admin/src/App.jsx';
import ClinicStaffApp from './clinic-staff/src/App.jsx';
import ClinicAccountantApp from './clinic-accountant/src/App.jsx';
import PharmacyAdminApp from './pharmacy-admin/src/App.jsx';
import PharmacyStaffApp from './pharmacy-staff/src/App.jsx';
import PharmacyAccountantApp from './pharmacy-accountant/src/App.jsx';
import DoctorAdminApp from './doctor-admin/src/App.jsx';
import DoctorApp from './doctor/src/App.jsx';
import DoctorAssistantApp from './doctor-assistant/src/App.jsx';
import LabAdminApp from './lab-admin/src/App.jsx';
import LabStaffApp from './lab-staff/src/App.jsx';
import LabTechnicianApp from './lab-technician/src/App.jsx';
import LabAccountantApp from './lab-accountant/src/App.jsx';
import DeliveryAdminApp from './delivery-admin/src/App.jsx';
import DeliveryAgentApp from './delivery-agent/src/App.jsx';
import AccountantApp from './accountant/src/App.jsx';
import AdminApp from './admin/src/App.jsx';
import PharmacyApp from './pharmacy/src/App.jsx';
import LabApp from './lab/src/App.jsx';
import UserApp from './user/src/App.jsx';
import MainApp from './main/src/App.jsx';

// Named exports for individual components
export { SuperAdminApp as SuperAdminHome };
export { CAApp as CAHome };
export { RegionalAdminApp as RegionalAdminHome };
export { HospitalAdminApp as HospitalAdminHome };
export { HospitalStaffApp as HospitalStaffHome };
export { HospitalAccountantApp as HospitalAccountantHome };
export { HospitalPharmacyApp as HospitalPharmacyHome };
export { HospitalLabApp as HospitalLabHome };
export { HospitalSupportApp as HospitalSupportHome };
export { ClinicAdminApp as ClinicAdminHome };
export { ClinicStaffApp as ClinicStaffHome };
export { ClinicAccountantApp as ClinicAccountantHome };
export { PharmacyAdminApp as PharmacyAdminHome };
export { PharmacyStaffApp as PharmacyStaffHome };
export { PharmacyAccountantApp as PharmacyAccountantHome };
export { DoctorAdminApp as DoctorAdminHome };
export { DoctorApp as DoctorHome };
export { DoctorAssistantApp as DoctorAssistantHome };
export { LabAdminApp as LabAdminHome };
export { LabStaffApp as LabStaffHome };
export { LabTechnicianApp as LabTechnicianHome };
export { LabAccountantApp as LabAccountantHome };
export { DeliveryAdminApp as DeliveryAdminHome };
export { DeliveryAgentApp as DeliveryAgentHome };
export { AccountantApp as AccountantHome };
export { AdminApp as AdminHome };
export { PharmacyApp as PharmacyHome };
export { LabApp as LabHome };
export { UserApp as UserHome };
export { MainApp as MainHome };

// Alternative combined export
export {
  SuperAdminApp as SuperAdminHomeAlt,
  CAApp as CAHomeAlt,
  RegionalAdminApp as RegionalAdminHomeAlt,
  HospitalAdminApp as HospitalAdminHomeAlt,
  HospitalStaffApp as HospitalStaffHomeAlt,
  HospitalAccountantApp as HospitalAccountantHomeAlt,
  HospitalPharmacyApp as HospitalPharmacyHomeAlt,
  HospitalLabApp as HospitalLabHomeAlt,
  HospitalSupportApp as HospitalSupportHomeAlt,
  ClinicAdminApp as ClinicAdminHomeAlt,
  ClinicStaffApp as ClinicStaffHomeAlt,
  ClinicAccountantApp as ClinicAccountantHomeAlt,
  PharmacyAdminApp as PharmacyAdminHomeAlt,
  PharmacyStaffApp as PharmacyStaffHomeAlt,
  PharmacyAccountantApp as PharmacyAccountantHomeAlt,
  DoctorAdminApp as DoctorAdminHomeAlt,
  DoctorApp as DoctorHomeAlt,
  DoctorAssistantApp as DoctorAssistantHomeAlt,
  LabAdminApp as LabAdminHomeAlt,
  LabStaffApp as LabStaffHomeAlt,
  LabTechnicianApp as LabTechnicianHomeAlt,
  LabAccountantApp as LabAccountantHomeAlt,
  DeliveryAdminApp as DeliveryAdminHomeAlt,
  DeliveryAgentApp as DeliveryAgentHomeAlt,
  AccountantApp as AccountantHomeAlt,
  AdminApp as AdminHomeAlt,
  PharmacyApp as PharmacyHomeAlt,
  LabApp as LabHomeAlt,
  UserApp as UserHomeAlt,
  MainApp as MainHomeAlt
};