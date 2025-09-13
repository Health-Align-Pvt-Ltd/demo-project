# Admin Panel Documentation

## Overview
The Admin Panel provides comprehensive management capabilities for the HealthAlign platform. Admin users can manage medicines, categories, diseases, pharmacies, labs, and ambulances through a centralized interface.

## Access
Only users with the email `kanaishil501@gmail.com` or userType `admin` can access the admin panel.

## Features

### Dashboard
- Overview of platform statistics
- Quick access to all management sections

### Entity Management
Each entity type (medicines, categories, diseases, pharmacies, labs, ambulances) includes:
- **Add New**: Create new records
- **Pending Records**: Review and approve pending submissions
- **Approved Records**: Manage approved records
- **Record History**: View historical changes

### Profile Management
- Update admin profile information
- Change password (coming soon)

## Routes
- `/admin` - Admin Dashboard
- `/admin/profile` - Admin Profile
- `/admin/:entityType/:action` - Entity management pages
- `/admin/:entityType/add-new/form` - Add new entity form

## Components
- `AdminDashboard.jsx` - Main dashboard view
- `AdminManagement.jsx` - Generic management component
- `AdminForm.jsx` - Form for adding/editing entities
- `AdminProfile.jsx` - Admin profile management
- `AdminHeader.jsx` - Header component
- `AdminSidebar.jsx` - Navigation sidebar
- `AdminStats.jsx` - Statistics dashboard
- `AdminProtectedRoute.jsx` - Route protection for admin pages

## Utilities
- `adminUtils.js` - Helper functions for admin operations

## Security
- Admin access is restricted to authorized users only
- All admin routes are protected
- User type and email verification for admin access