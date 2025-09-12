// Ambulance Payment Success Component
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import {
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  Phone,
  Share,
  Download,
  Home,
  Navigation,
  AlertTriangle,
  Shield,
  Heart,
  Star,
  Gift,
  Wallet
} from 'lucide-react';

const AmbulancePaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  const [paymentData, setPaymentData] = useState(null);
  const [ambulanceDetails, setAmbulanceDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get payment data from navigation state
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
      initializeAmbulanceTracking(location.state.paymentData);
    } else {
      // Redirect if no payment data
      navigate('/ambulance');
    }
  }, [location.state, navigate]);

  const initializeAmbulanceTracking = async (payment) => {
    try {
      // Simulate ambulance assignment and dispatch
      const assignedAmbulance = {
        id: 'AMB-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        driver: 'Rajesh Kumar',
        vehicle: 'AMB-001',
        phone: '+91-98765-43210',
        eta: calculateETA(payment.urgency),
        status: 'dispatched',
        location: { lat: 28.6149, lng: 77.2100 },
        rating: 4.8
      };

      setAmbulanceDetails(assignedAmbulance);

      // Update the ambulance booking in Firebase
      if (payment.bookingId) {
        await firestoreService.updateAmbulanceBooking(payment.bookingId, {
          status: 'confirmed',
          paymentStatus: 'paid',
          ambulanceId: assignedAmbulance.id,
          driverName: assignedAmbulance.driver,
          driverPhone: assignedAmbulance.phone,
          estimatedArrival: assignedAmbulance.eta,
          paymentDetails: payment
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error initializing ambulance tracking:', error);
      setLoading(false);
    }
  };

  const calculateETA = (urgency) => {
    switch (urgency) {
      case 'critical': return '3-5 minutes';
      case 'high': return '5-8 minutes';
      case 'medium': return '10-15 minutes';
      case 'low': return '15-25 minutes';
      default: return '5-10 minutes';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ambulance Booking Confirmed',
        text: `Emergency ambulance booked successfully. Booking ID: ${paymentData?.bookingId}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Ambulance booking confirmed! Booking ID: ${paymentData?.bookingId}`);
      alert('Booking details copied to clipboard');
    }
  };

  const handleDownload = () => {
    // Generate a simple text receipt
    const receipt = `
AMBULANCE BOOKING RECEIPT
========================
Booking ID: ${paymentData?.bookingId}
Patient: ${paymentData?.patientName}
Emergency: ${paymentData?.condition}
Urgency: ${paymentData?.urgency}
Amount Paid: ₹${paymentData?.finalAmount}
Payment Method: ${paymentData?.paymentMethod}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Ambulance Details:
Vehicle: ${ambulanceDetails?.vehicle}
Driver: ${ambulanceDetails?.driver}
ETA: ${ambulanceDetails?.eta}

HealthAlign - Emergency Services
    `;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `ambulance-receipt-${paymentData?.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <PageLayout title="Processing...">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Booking Confirmed">
      <div className="space-y-4">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Ambulance Booked Successfully!</h1>
          <p className="text-sm text-gray-600 mb-4">
            Your emergency request has been confirmed and an ambulance is on the way.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Booking ID:</strong> {paymentData?.bookingId}
            </p>
          </div>
        </div>

        {/* Ambulance Details */}
        {ambulanceDetails && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Ambulance Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{ambulanceDetails.vehicle}</p>
                    <p className="text-xs text-gray-600">Driver: {ambulanceDetails.driver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">ETA: {ambulanceDetails.eta}</p>
                  <p className="text-xs text-gray-500">Status: {ambulanceDetails.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  onClick={() => window.open(`tel:${ambulanceDetails.phone}`)}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Call Driver</span>
                </button>
                
                <button 
                  onClick={() => navigate('/ambulance', { state: { tab: 'tracking' } })}
                  className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Navigation className="w-4 h-4" />
                  <span className="text-sm">Track Live</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Emergency Type:</span>
              <span className="font-medium">{paymentData?.condition}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Urgency Level:</span>
              <span className={`font-medium capitalize ${
                paymentData?.urgency === 'critical' ? 'text-red-600' :
                paymentData?.urgency === 'high' ? 'text-orange-600' :
                paymentData?.urgency === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {paymentData?.urgency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Charge:</span>
              <span>₹{paymentData?.baseAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distance Charge:</span>
              <span>₹{paymentData?.distanceCharge}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Urgency Charge:</span>
              <span>₹{paymentData?.urgencyCharge}</span>
            </div>
            {paymentData?.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="text-green-600">-₹{paymentData?.discount}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Total Paid:</span>
                <span>₹{paymentData?.finalAmount}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{paymentData?.paymentMethod}</span>
            </div>
            {paymentData?.paymentMethod === 'Financial Aid' && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-xs text-green-800">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Financial assistance approved - {paymentData?.subsidyPercentage}% subsidy applied
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Guidelines */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Important Guidelines</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Have all necessary documents ready (ID, insurance cards, medical history)
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Keep the patient calm and follow any first aid instructions if trained
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Phone className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Stay available on the contact number provided for driver communication
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Ensure clear access to the pickup location for the ambulance
              </p>
            </div>
          </div>
        </div>

        {/* Cashback/Rewards (if applicable) */}
        {paymentData?.cashback > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Cashback Earned!</p>
                <p className="text-xs opacity-90">₹{paymentData.cashback} added to your wallet</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Share className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center space-x-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </button>
        </div>

        {/* Rating Prompt */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Rate Your Experience</h3>
          <p className="text-xs text-gray-600 mb-3">Help us improve our emergency services</p>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-yellow-50"
              >
                <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AmbulancePaymentSuccess;