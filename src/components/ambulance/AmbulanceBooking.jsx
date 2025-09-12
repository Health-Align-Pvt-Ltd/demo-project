// Ambulance Booking Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  AlertTriangle,
  Navigation,
  Activity,
  Heart,
  User,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AmbulanceBooking = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('emergency');
  const [loading, setLoading] = useState(false);
  const [emergencyRequest, setEmergencyRequest] = useState({
    patientName: '',
    patientAge: '',
    condition: '',
    urgency: 'high',
    pickupLocation: '',
    hospitalPreference: '',
    contactNumber: '',
    additionalInfo: ''
  });
  const [userLocation, setUserLocation] = useState(null);
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);

  const urgencyLevels = [
    { value: 'critical', label: 'Critical - Life Threatening', color: 'text-red-600', bgColor: 'bg-red-100' },
    { value: 'high', label: 'High - Urgent Care Needed', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'medium', label: 'Medium - Non-Emergency', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'low', label: 'Low - Routine Transport', color: 'text-green-600', bgColor: 'bg-green-100' }
  ];

  const commonConditions = [
    'Heart Attack',
    'Stroke',
    'Difficulty Breathing',
    'Severe Injury',
    'Unconscious',
    'Severe Pain',
    'Accident',
    'Other Emergency'
  ];

  const nearbyAmbulances = [
    { id: '1', driver: 'John Smith', vehicle: 'AMB-001', eta: '5 mins', distance: '1.2 km', rating: 4.8 },
    { id: '2', driver: 'Maria Garcia', vehicle: 'AMB-002', eta: '8 mins', distance: '2.1 km', rating: 4.9 },
    { id: '3', driver: 'David Johnson', vehicle: 'AMB-003', eta: '12 mins', distance: '2.8 km', rating: 4.7 }
  ];

  useEffect(() => {
    getCurrentLocation();
    loadAmbulanceRequests();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const loadAmbulanceRequests = async () => {
    if (userData?.uid) {
      // In a real app, you'd fetch user-specific ambulance requests
      setAmbulanceRequests([
        {
          id: '1',
          patientName: 'John Doe',
          condition: 'Heart Attack',
          urgency: 'critical',
          status: 'completed',
          requestTime: new Date(Date.now() - 86400000).toISOString(),
          ambulanceId: 'AMB-001'
        }
      ]);
    }
  };

  const handleInputChange = (e) => {
    setEmergencyRequest(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const requestEmergencyAmbulance = async () => {
    setLoading(true);
    try {
      const requestData = {
        ...emergencyRequest,
        userId: userData.uid,
        status: 'pending',
        location: userLocation,
        requestTime: new Date().toISOString()
      };

      const result = await firestoreService.requestAmbulance(requestData);
      if (result.success) {
        alert('Emergency ambulance requested successfully! Help is on the way.');
        setActiveTab('tracking');
      } else {
        alert('Failed to request ambulance. Please try again.');
      }
    } catch (error) {
      alert('Error requesting ambulance');
    }
    setLoading(false);
  };

  const callEmergencyServices = () => {
    window.open('tel:911');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Emergency Ambulance</h1>
              <p className="text-gray-600">Quick ambulance booking for medical emergencies</p>
            </div>
          </div>
          <button
            onClick={callEmergencyServices}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call 911
          </button>
        </div>
      </header>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
          <div>
            <p className="text-sm text-red-700">
              <strong>For life-threatening emergencies, call 911 immediately.</strong> This service is for additional support and coordination.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('emergency')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'emergency'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Emergency Request
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'tracking'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Track Ambulance
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Request History
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Emergency Request Tab */}
        {activeTab === 'emergency' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Ambulance Request</h2>
              
              <form className="space-y-6">
                {/* Patient Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Name *
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={emergencyRequest.patientName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Age *
                      </label>
                      <input
                        type="number"
                        name="patientAge"
                        value={emergencyRequest.patientAge}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical Condition *
                      </label>
                      <select
                        name="condition"
                        value={emergencyRequest.condition}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select condition</option>
                        {commonConditions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level *
                      </label>
                      <div className="space-y-3">
                        {urgencyLevels.map(level => (
                          <label key={level.value} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="urgency"
                              value={level.value}
                              checked={emergencyRequest.urgency === level.value}
                              onChange={handleInputChange}
                              className="mr-3"
                            />
                            <div className={`w-3 h-3 rounded-full ${level.bgColor} mr-3`}></div>
                            <span className={`font-medium ${level.color}`}>{level.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="pickupLocation"
                          value={emergencyRequest.pickupLocation}
                          onChange={handleInputChange}
                          placeholder="Enter pickup address"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hospital Preference (Optional)
                      </label>
                      <input
                        type="text"
                        name="hospitalPreference"
                        value={emergencyRequest.hospitalPreference}
                        onChange={handleInputChange}
                        placeholder="Preferred hospital or nearest available"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="contactNumber"
                        value={emergencyRequest.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={emergencyRequest.additionalInfo}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any additional details about the emergency..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={requestEmergencyAmbulance}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {loading ? 'Requesting Ambulance...' : 'Request Emergency Ambulance'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ambulance Tracking</h2>
            
            {/* Active Request Status */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Request</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  En Route
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500">Ambulance</p>
                  <p className="font-semibold">AMB-001</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">ETA</p>
                  <p className="font-semibold">5 minutes</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Navigation className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="font-semibold">1.2 km</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Driver:</strong> John Smith - Contact: (555) 123-4567
                </p>
              </div>
            </div>

            {/* Nearby Ambulances */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Ambulances</h3>
              <div className="space-y-4">
                {nearbyAmbulances.map(ambulance => (
                  <div key={ambulance.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Truck className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{ambulance.vehicle}</p>
                        <p className="text-sm text-gray-500">{ambulance.driver}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{ambulance.eta}</p>
                      <p className="text-sm text-gray-500">{ambulance.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Request History</h2>
            
            {ambulanceRequests.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No ambulance requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ambulanceRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request.patientName}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(request.requestTime).toLocaleDateString()} at {new Date(request.requestTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {request.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 mr-2" />
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Condition</p>
                        <p className="font-medium">{request.condition}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Urgency</p>
                        <p className={`font-medium ${
                          request.urgency === 'critical' ? 'text-red-600' :
                          request.urgency === 'high' ? 'text-orange-600' :
                          request.urgency === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {request.urgency}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Ambulance</p>
                        <p className="font-medium">{request.ambulanceId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceBooking;