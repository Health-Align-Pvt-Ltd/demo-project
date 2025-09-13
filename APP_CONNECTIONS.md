# App Connections Documentation

This document explains how all the apps are connected through the main App.jsx file.

## Route Structure

The App.jsx file connects all 30 applications through a comprehensive routing system:

### Default Routes
- `/` - UserHome (default route)
- `*` - UserHome (catch-all route)

### Specialized Routes
1. `/user/*` - UserHome
2. `/admin/*` - AdminHome
3. `/super-admin/*` - SuperAdminHome
4. `/regional-admin/*` - RegionalAdminHome
5. `/hospital-admin/*` - HospitalAdminHome
6. `/hospital-staff/*` - HospitalStaffHome
7. `/hospital-accountant/*` - HospitalAccountantHome
8. `/hospital-pharmacy/*` - HospitalPharmacyHome
9. `/hospital-lab/*` - HospitalLabHome
10. `/hospital-support/*` - HospitalSupportHome
11. `/clinic-admin/*` - ClinicAdminHome
12. `/clinic-staff/*` - ClinicStaffHome
13. `/clinic-accountant/*` - ClinicAccountantHome
14. `/pharmacy-admin/*` - PharmacyAdminHome
15. `/pharmacy-staff/*` - PharmacyStaffHome
16. `/pharmacy-accountant/*` - PharmacyAccountantHome
17. `/doctor-admin/*` - DoctorAdminHome
18. `/doctor/*` - DoctorHome
19. `/doctor-assistant/*` - DoctorAssistantHome
20. `/lab-admin/*` - LabAdminHome
21. `/lab-staff/*` - LabStaffHome
22. `/lab-technician/*` - LabTechnicianHome
23. `/lab-accountant/*` - LabAccountantHome
24. `/delivery-admin/*` - DeliveryAdminHome
25. `/delivery-agent/*` - DeliveryAgentHome
26. `/accountant/*` - AccountantHome
27. `/ca/*` - CAHome (Charted Accountant)
28. `/pharmacy/*` - PharmacyHome
29. `/lab/*` - LabHome
30. `/main/*` - MainHome

## Implementation Details

All apps are imported from the centralized exporter module:
```javascript
import { 
  SuperAdminHome, 
  CAHome, 
  RegionalAdminHome, 
  // ... all other apps
  UserHome,
  MainHome
} from "../apps/exporter"
```

Each app is connected through React Router v6's nested routing system, allowing each specialized app to handle its own sub-routes.

## Benefits

1. **Centralized Management**: All app connections are managed in a single file
2. **Scalable**: Easy to add new apps by updating the exporter and App.jsx
3. **Maintainable**: Clear route structure makes it easy to understand app navigation
4. **Flexible**: Each app can have its own routing structure within its namespace
5. **Consistent**: All apps are connected using the same pattern