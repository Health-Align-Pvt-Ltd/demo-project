# HealthAlign - Complete Healthcare Solution

🏥 A comprehensive mobile-first healthcare application built with React, Firebase, and modern web technologies.

## Features

### 🩺 Doctor Consultation
- Browse doctors by specialty
- Book video consultations and chat sessions
- View doctor profiles with ratings and experience
- Manage appointment history
- Real-time appointment scheduling

### 🚑 Emergency Ambulance
- Request emergency ambulance services
- Real-time ambulance tracking
- Priority-based booking (Critical, High, Medium, Low)
- Emergency contact integration
- Location-based ambulance dispatch

### 🩸 Blood Request & Donation
- Create urgent blood requests
- Register as a blood donor
- Browse active blood requests by type and location
- Connect donors with recipients
- Emergency blood request notifications

### 💊 Medicine Ordering
- Browse medicine catalog
- Upload prescription images
- Order medicines with doorstep delivery
- Track order status and delivery
- Pharmacy integration

### 👤 Profile Management
- Comprehensive user profiles
- Medical history tracking
- Emergency contacts
- Prescription management
- Privacy and security settings

### 📱 Progressive Web App (PWA)
- Install as mobile app
- Offline functionality
- Push notifications
- App shortcuts for emergency services
- Cross-platform compatibility

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router DOM
- **UI Components**: Lucide React Icons
- **Notifications**: React Hot Toast
- **PWA**: Service Worker, Web App Manifest
- **State Management**: React Context API

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/health-align.git
   cd health-align
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Follow the detailed guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Update `src/firebase/config.js` with your Firebase configuration

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Main dashboard
│   ├── consultation/       # Doctor consultation
│   ├── ambulance/          # Emergency ambulance
│   ├── blood/              # Blood request system
│   ├── medicine/           # Medicine ordering
│   ├── profile/            # User profile
│   └── pwa/                # PWA components
├── contexts/               # React contexts
├── firebase/               # Firebase configuration
└── App.jsx                 # Main app component
```

## Firebase Collections

The app uses the following Firestore collections:

- **users**: User profiles and medical information
- **doctors**: Doctor profiles and availability
- **appointments**: Medical appointments
- **bloodRequests**: Blood donation requests
- **bloodDonors**: Blood donor profiles
- **medicineOrders**: Medicine orders and prescriptions
- **ambulanceRequests**: Emergency ambulance requests

## PWA Features

- **Installable**: Can be installed as a native app
- **Offline Support**: Basic offline functionality
- **App Shortcuts**: Quick access to emergency services
- **Push Notifications**: Real-time updates (when configured)
- **Responsive**: Works on desktop, tablet, and mobile

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the [Firebase Setup Guide](./FIREBASE_SETUP.md)
- Review the documentation

---

**Note**: This is a demo application for educational purposes. For production use, implement proper security measures, medical compliance (HIPAA), and thorough testing.