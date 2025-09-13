# Health Align - Multi-App Platform

This is a collection of specialized applications for different user roles in the Health Align platform, all connected to a single Firebase backend.

## Project Structure

```
health-align/
├── apps/                    # Individual applications
│   ├── admin/              # Admin application
│   ├── regional-admin/     # Regional Admin application
│   ├── hospital-admin/     # Hospital Admin application
│   ├── hospital-staff/     # Hospital Staff application
│   ├── hospital-accountant/ # Hospital Accountant application
│   ├── hospital-pharmacy/  # Hospital Pharmacy application
│   ├── hospital-lab/       # Hospital Lab application
│   ├── hospital-support/   # Hospital Support application
│   ├── clinic-admin/       # Clinic Admin application
│   ├── clinic-staff/       # Clinic Staff application
│   ├── clinic-accountant/  # Clinic Accountant application
│   ├── pharmacy-admin/     # Pharmacy Admin application
│   ├── pharmacy-staff/     # Pharmacy Staff application
│   ├── pharmacy-accountant/ # Pharmacy Accountant application
│   ├── doctor-admin/       # Doctor Admin application
│   ├── doctor/             # Doctor application
│   ├── doctor-assistant/   # Doctor Assistant application
│   ├── lab-admin/          # Lab Admin application
│   ├── lab-staff/          # Lab Staff application
│   ├── lab-technician/     # Lab Technician application
│   ├── lab-accountant/     # Lab Accountant application
│   ├── delivery-admin/     # Delivery Admin application
│   ├── delivery-agent/     # Delivery Agent application
│   ├── super-admin/        # Super Admin application
│   ├── accountant/         # Accountant application
│   ├── ca/                 # Charted Accountant application
│   ├── user/               # User application
│   └── main/               # Main application that combines all routes
└── ...
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs all applications in development mode concurrently.

### `npm run dev:admin`

Runs the Admin application in development mode on port 3000.

(And so on for all individual apps)

### `npm run build`

Builds all applications for production.

### `npm run build:admin`

Builds the Admin application for production.

(And so on for all individual apps)

## Core Functionality

Each application contains its own core functionality in the `src/core` directory:

### Firebase Services
- Authentication service
- Firestore service

### UI Components
- Button
- Input
- Card
- Modal

## Development

Each application is designed to be worked on independently by different developers. They all contain their own core functionality.

To work on a specific application:
1. Navigate to the app directory: `cd apps/[app-name]`
2. Run the development server: `npm run dev`

## Routing

Each application has its own routing configuration in its `App.jsx` file.

## Fresh Developer Friendly

Each application is structured to be easily understood by new developers:
- Consistent folder structure across all apps
- All core functionality is contained within each app
- Clear separation of concerns
- Well-documented code
- Consistent naming conventions
- Each app contains all its required files locally and can run independently