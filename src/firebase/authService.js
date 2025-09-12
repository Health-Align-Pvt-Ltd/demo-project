// Firebase authentication service with phone number and Google support
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { getAuthErrorMessage } from '../utils/authErrors';

export const authService = {
  // Initialize reCAPTCHA verifier with improved DOM element handling
  initializeRecaptcha(containerId = 'recaptcha-container') {
    // Clear existing reCAPTCHA if it exists
    this.clearRecaptcha();
    
    // Ensure DOM element exists
    let container = document.getElementById(containerId);
    if (!container) {
      console.warn(`reCAPTCHA container '${containerId}' not found, creating it`);
      container = document.createElement('div');
      container.id = containerId;
      container.style.display = 'none'; // Hide it since we're using invisible reCAPTCHA
      document.body.appendChild(container);
    }

    // Wait for DOM to be ready
    return new Promise((resolve, reject) => {
      try {
        // Create new reCAPTCHA verifier
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          'size': 'invisible',
          'callback': (response) => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
          },
          'error-callback': (error) => {
            console.log('reCAPTCHA error:', error);
            reject(error);
          }
        });
        
        // Render the reCAPTCHA
        window.recaptchaVerifier.render().then(() => {
          console.log('reCAPTCHA rendered successfully');
          resolve(window.recaptchaVerifier);
        }).catch(reject);
        
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
        reject(error);
      }
    });
  },

  // Clear reCAPTCHA verifier with improved cleanup
  clearRecaptcha() {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        console.log('reCAPTCHA cleared successfully');
      } catch (error) {
        console.log('Error clearing reCAPTCHA:', error);
      }
      window.recaptchaVerifier = null;
    }
    
    // Also remove any lingering reCAPTCHA elements
    const recaptchaElements = document.querySelectorAll('[id^="recaptcha"]');
    recaptchaElements.forEach(element => {
      if (element.id !== 'recaptcha-container') {
        try {
          element.remove();
        } catch (e) {
          console.log('Error removing reCAPTCHA element:', e);
        }
      }
    });
  },

  // Send OTP to phone number
  async sendOTP(phoneNumber) {
    try {
      // Clear any existing reCAPTCHA first
      this.clearRecaptcha();
      
      // Wait a bit for DOM cleanup
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const recaptchaVerifier = await this.initializeRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return { success: true, confirmationResult };
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Clear reCAPTCHA on error
      this.clearRecaptcha();
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  },

  // Verify OTP and sign in
  async verifyOTP(confirmationResult, otp) {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Check if user exists in database
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create new user profile
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          name: '',
          userType: 'patient',
          dateOfBirth: '',
          gender: '',
          address: '',
          createdAt: new Date().toISOString(),
          profileCompleted: false,
          isVerified: true
        });
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  },

  // Register with phone number and additional data
  async registerWithPhone(phoneNumber, userData) {
    try {
      // Clear any existing reCAPTCHA first
      this.clearRecaptcha();
      
      // Wait a bit for DOM cleanup
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const recaptchaVerifier = await this.initializeRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      return { 
        success: true, 
        confirmationResult,
        userData // Pass userData to be used after OTP verification
      };
    } catch (error) {
      console.error('Error during phone registration:', error);
      // Clear reCAPTCHA on error
      this.clearRecaptcha();
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  },

  // Complete registration after OTP verification
  async completeRegistration(confirmationResult, otp, userData) {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Update user profile with additional data
      if (userData.name) {
        await updateProfile(user, {
          displayName: userData.name
        });
      }

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        name: userData.name || '',
        userType: userData.userType || 'patient',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        address: userData.address || '',
        createdAt: new Date().toISOString(),
        profileCompleted: false,
        isVerified: true
      });

      return { success: true, user };
    } catch (error) {
      console.error('Error completing registration:', error);
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  },
  // Login with phone number
  async loginWithPhone(phoneNumber) {
    try {
      // Clear any existing reCAPTCHA first
      this.clearRecaptcha();
      
      // Wait a bit for DOM cleanup
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const recaptchaVerifier = await this.initializeRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return { success: true, confirmationResult };
    } catch (error) {
      console.error('Error during phone login:', error);
      // Clear reCAPTCHA on error
      this.clearRecaptcha();
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  },

  // Google Authentication
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in database
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create new user profile with Google data
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          photoURL: user.photoURL || '',
          userType: 'patient', // Default to patient
          dateOfBirth: '',
          gender: '',
          address: '',
          phoneNumber: user.phoneNumber || '',
          createdAt: new Date().toISOString(),
          profileCompleted: false,
          isVerified: true,
          authProvider: 'google'
        });
      } else {
        // Update last login time
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date().toISOString()
        });
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  },

  // Register with Google
  async registerWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return { success: false, error: 'Account already exists. Please sign in instead.' };
      }
      
      // Create new user profile with Google data
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        photoURL: user.photoURL || '',
        userType: 'patient', // Default to patient, can be updated later
        dateOfBirth: '',
        gender: '',
        address: '',
        phoneNumber: user.phoneNumber || '',
        createdAt: new Date().toISOString(),
        profileCompleted: false,
        isVerified: true,
        authProvider: 'google'
      });
      
      return { success: true, user, isNewUser: true };
    } catch (error) {
      console.error('Error during Google registration:', error);
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  },

  // Get current user data
  async getCurrentUserData() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      // Clear reCAPTCHA verifier on logout
      this.clearRecaptcha();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
};