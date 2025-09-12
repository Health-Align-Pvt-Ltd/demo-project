# Firebase Configuration Guide for HealthAlign

## Setting up Firebase for HealthAlign

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "HealthAlign" or your preferred name
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Phone" provider
3. Configure reCAPTCHA settings:
   - For development: Use test phone numbers if needed
   - For production: Configure your domain in authorized domains
4. Optionally enable other providers (Email/Password, Google, Facebook, etc.)

### 3. Set up Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" for development
3. Select your preferred location

### 4. Set up Storage
1. Go to "Storage" → "Get started"
2. Use default security rules for now
3. Select your preferred location

### 5. Enable Cloud Messaging (Optional)
1. Go to "Cloud Messaging"
2. Generate a new key pair for push notifications

### 6. Get Configuration Keys
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web app icon
4. Register your app with nickname "HealthAlign Web"
5. Copy the Firebase configuration object

### 7. Update Configuration File
Replace the configuration in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 8. Set up Firestore Security Rules
Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.patientId || 
         request.auth.uid == resource.data.doctorId);
    }
    
    // Blood requests - read by authenticated users
    match /bloodRequests/{requestId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Medicine orders
    match /medicineOrders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Ambulance requests
    match /ambulanceRequests/{requestId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Doctors collection - read by all authenticated users
    match /doctors/{doctorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == doctorId;
    }
  }
}
```

### 9. Set up Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /prescriptions/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 10. Environment Variables (Optional)
For production, consider using environment variables:

Create `.env` file:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

Then update config.js to use environment variables:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

### 11. Testing
1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Register a new account
4. Test the authentication flow
5. Verify data is being saved to Firestore

### Sample Data Structure
The app expects the following Firestore collections:

- `users/` - User profiles and medical information
- `doctors/` - Doctor profiles and availability
- `appointments/` - Doctor appointment bookings
- `bloodRequests/` - Emergency blood requests
- `bloodDonors/` - Blood donor registrations
- `medicineOrders/` - Medicine orders and prescriptions
- `ambulanceRequests/` - Emergency ambulance requests
- `pharmacies/` - Pharmacy locations and inventory

### Production Deployment
1. Build the app: `npm run build`
2. Deploy to Firebase Hosting: `firebase deploy`
3. Update security rules for production
4. Set up proper CORS and domain restrictions

### Troubleshooting
- Check Firebase Console for any authentication errors
- Ensure all required APIs are enabled
- Verify security rules allow your operations
- Check browser console for detailed error messages