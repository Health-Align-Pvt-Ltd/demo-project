// Register Component with Phone Number Authentication
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Phone, User, Lock, Heart, Calendar } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState('details'); // 'details', 'phone', 'otp'
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    userType: 'patient',
    dateOfBirth: '',
    gender: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const { registerWithPhone, completeRegistration, registerWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Cleanup reCAPTCHA on component unmount
  useEffect(() => {
    // Ensure reCAPTCHA container exists
    const ensureRecaptchaContainer = () => {
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.display = 'none';
        document.body.appendChild(container);
      }
    };
    
    ensureRecaptchaContainer();
    
    return () => {
      // Comprehensive cleanup on unmount
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      }
      
      // Remove any lingering reCAPTCHA elements
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
    };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }
    setStep('phone');
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with country code, use as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    // If it's a 10-digit US number, add +1
    if (cleaned.length === 10) {
      return '+1' + cleaned;
    }
    
    // If it's 11 digits and starts with 1, assume US number
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return '+' + cleaned;
    }
    
    // Otherwise, assume it needs +1 prefix
    return '+1' + cleaned;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    const phoneNumber = formatPhoneNumber(formData.phoneNumber);

    setLoading(true);
    const userData = {
      name: formData.name,
      userType: formData.userType,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender
    };

    const result = await registerWithPhone(phoneNumber, userData);
    
    if (result.success) {
      setConfirmationResult(result.confirmationResult);
      setStep('otp');
    } else {
      alert(result.error || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      alert('Please enter the OTP');
      return;
    }

    setLoading(true);
    const userData = {
      name: formData.name,
      userType: formData.userType,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender
    };

    const result = await completeRegistration(confirmationResult, formData.otp, userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.error || 'Invalid OTP');
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const result = await registerWithGoogle();
    
    if (result.success) {
      if (result.isNewUser) {
        navigate('/dashboard');
      } else {
        // Account already exists, redirect to login
        alert('Account already exists. Redirecting to sign in.');
        navigate('/login');
      }
    } else {
      alert(result.error || 'Google registration failed');
    }
    setLoading(false);
  };

  const goBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setFormData(prev => ({ ...prev, otp: '' }));
      setConfirmationResult(null);
    } else if (step === 'phone') {
      setStep('details');
    }
    
    // Clear any existing reCAPTCHA when going back
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      } catch (error) {
        console.log('Error clearing reCAPTCHA:', error);
      }
    }
    
    // Remove any lingering reCAPTCHA elements
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">
            {step === 'details' && 'Join HealthAlign for better healthcare'}
            {step === 'phone' && 'Verify your phone number'}
            {step === 'otp' && `Enter OTP sent to ${formData.phoneNumber}`}
          </p>
        </div>

        {/* Step 1: Personal Details */}
        {step === 'details' && (
          <form onSubmit={handleNextStep} className="space-y-4">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="userType"
                    value="patient"
                    checked={formData.userType === 'patient'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Patient</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="userType"
                    value="doctor"
                    checked={formData.userType === 'doctor'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Doctor</span>
                </label>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +1 for US)
              </p>
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Continue
            </button>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            {/* Google Registration Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full bg-white text-gray-700 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{loading ? 'Creating account...' : 'Continue with Google'}</span>
            </button>
          </form>
        )}

        {/* Step 2: Phone Verification */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="text-center">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">
                We'll send a verification code to <br />
                <strong>{formData.phoneNumber}</strong>
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="123456"
                  maxLength="6"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
        
        {/* reCAPTCHA container */}
        <div id="recaptcha-container" className="flex justify-center mt-4"></div>
      </div>
    </div>
  );
};

export default Register;