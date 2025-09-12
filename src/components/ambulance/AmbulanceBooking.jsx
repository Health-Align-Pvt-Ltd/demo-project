// Enhanced Ambulance Booking Component with OpenStreetMap
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import Cookies from 'js-cookie';
import PageLayout from '../common/PageLayout';
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
  XCircle,
  Crosshair,
  RefreshCw,
  Map,
  Building,
  Navigation2,
  Loader,
  Route,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different markers
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/679/679922.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063081.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Map component to handle location updates
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const AmbulanceBooking = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('emergency');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [emergencyRequest, setEmergencyRequest] = useState({
    patientName: '',
    patientAge: '',
    condition: '',
    urgency: 'high',
    pickupLocation: '',
    hospitalPreference: '',
    contactNumber: '',
    email: '',
    additionalInfo: ''
  });
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: Delhi
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [addressDetails, setAddressDetails] = useState(null);
  const [activeAmbulance, setActiveAmbulance] = useState(null);
  const [ambulanceRoute, setAmbulanceRoute] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);

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
    { id: '1', driver: 'John Smith', vehicle: 'AMB-001', eta: '5 mins', distance: '1.2 km', rating: 4.8, lat: 28.6149, lng: 77.2100 },
    { id: '2', driver: 'Maria Garcia', vehicle: 'AMB-002', eta: '8 mins', distance: '2.1 km', rating: 4.9, lat: 28.6129, lng: 77.2080 },
    { id: '3', driver: 'David Johnson', vehicle: 'AMB-003', eta: '12 mins', distance: '2.8 km', rating: 4.7, lat: 28.6159, lng: 77.2110 }
  ];

  useEffect(() => {
    loadPatientDataFromCookies();
    getCurrentLocation();
    loadAmbulanceRequests();
  }, []);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      fetchNearbyHospitals(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  // Load patient data from cookies
  const loadPatientDataFromCookies = () => {
    const savedPatientData = {
      patientName: Cookies.get('patient_name') || userData?.name || '',
      contactNumber: Cookies.get('patient_phone') || userData?.phoneNumber || '',
      email: Cookies.get('patient_email') || userData?.email || ''
    };
    
    setEmergencyRequest(prev => ({
      ...prev,
      ...savedPatientData
    }));
  };

  // Save patient data to cookies
  const savePatientDataToCookies = (data) => {
    Cookies.set('patient_name', data.patientName, { expires: 365 });
    Cookies.set('patient_phone', data.contactNumber, { expires: 365 });
    Cookies.set('patient_email', data.email, { expires: 365 });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          
          // Reverse geocoding to get address
          await reverseGeocode(coords.lat, coords.lng);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          // Fallback to Delhi coordinates
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setLocationLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Reverse geocoding using OpenStreetMap Nominatim API
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddressDetails(data);
        const formattedAddress = formatAddress(data);
        setEmergencyRequest(prev => ({
          ...prev,
          pickupLocation: formattedAddress
        }));
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  };

  // Format address from geocoding response
  const formatAddress = (data) => {
    const address = data.address || {};
    const parts = [];
    
    if (address.house_number) parts.push(address.house_number);
    if (address.road) parts.push(address.road);
    if (address.neighbourhood || address.suburb) parts.push(address.neighbourhood || address.suburb);
    if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
    if (address.state) parts.push(address.state);
    if (address.postcode) parts.push(address.postcode);
    
    return parts.join(', ');
  };

  // Fetch nearby hospitals using Overpass API
  const fetchNearbyHospitals = async (lat, lng) => {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:5000,${lat},${lng});
          way["amenity"="hospital"](around:5000,${lat},${lng});
          relation["amenity"="hospital"](around:5000,${lat},${lng});
        );
        out center meta;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      });
      
      const data = await response.json();
      
      const hospitals = data.elements.map(element => {
        const lat = element.lat || element.center?.lat;
        const lng = element.lon || element.center?.lon;
        const name = element.tags?.name || 'Unknown Hospital';
        const phone = element.tags?.phone || 'Not available';
        const address = element.tags?.['addr:full'] || 'Address not available';
        
        return {
          id: element.id,
          name,
          lat,
          lng,
          phone,
          address,
          distance: calculateDistance(userLocation.lat, userLocation.lng, lat, lng)
        };
      }).filter(h => h.lat && h.lng).sort((a, b) => a.distance - b.distance).slice(0, 10);
      
      setNearbyHospitals(hospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      // Fallback to mock hospital data
      setNearbyHospitals([
        { id: 1, name: 'AIIMS Delhi', lat: 28.5672, lng: 77.2100, phone: '+91-11-26588500', address: 'Ansari Nagar, New Delhi', distance: 2.3 },
        { id: 2, name: 'Safdarjung Hospital', lat: 28.5740, lng: 77.2060, phone: '+91-11-26165060', address: 'Safdarjung, New Delhi', distance: 3.1 },
        { id: 3, name: 'Ram Manohar Lohia Hospital', lat: 28.6330, lng: 77.2140, phone: '+91-11-23362520', address: 'Connaught Place, New Delhi', distance: 4.2 }
      ]);
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const loadAmbulanceRequests = async () => {
    if (userData?.uid) {
      const result = await firestoreService.getAmbulanceBookings(userData.uid);
      if (result.success) {
        setAmbulanceRequests(result.data);
      }
    }
  };

  const handleInputChange = (e) => {
    const newData = {
      ...emergencyRequest,
      [e.target.name]: e.target.value
    };
    setEmergencyRequest(newData);
    
    // Save to cookies when patient data changes
    if (['patientName', 'contactNumber', 'email'].includes(e.target.name)) {
      savePatientDataToCookies(newData);
    }
  };

  const requestEmergencyAmbulance = async () => {
    setLoading(true);
    try {
      const requestData = {
        ...emergencyRequest,
        userId: userData.uid,
        status: 'pending',
        location: userLocation,
        addressDetails: addressDetails,
        requestTime: new Date().toISOString()
      };

      const result = await firestoreService.bookAmbulance(requestData);
      if (result.success) {
        // Save patient data to cookies
        savePatientDataToCookies(emergencyRequest);
        alert('Emergency ambulance requested successfully! Help is on the way.');
        
        // Start live tracking automatically
        startLiveTracking('1');
        
        setActiveTab('tracking');
        loadAmbulanceRequests();
      } else {
        alert('Failed to request ambulance. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting ambulance:', error);
      alert('Error requesting ambulance');
    }
    setLoading(false);
  };

  const callEmergencyServices = () => {
    window.open('tel:102'); // Indian ambulance number
  };

  const selectHospital = (hospital) => {
    setEmergencyRequest(prev => ({
      ...prev,
      hospitalPreference: hospital.name
    }));
  };

  // Live ambulance tracking functions
  const startLiveTracking = (ambulanceId) => {
    // Simulate finding the ambulance that was dispatched
    const ambulance = nearbyAmbulances.find(amb => amb.id === ambulanceId) || nearbyAmbulances[0];
    setActiveAmbulance({
      ...ambulance,
      currentLocation: { lat: ambulance.lat, lng: ambulance.lng },
      status: 'en_route',
      destination: userLocation,
      startTime: new Date().toISOString()
    });
    
    // Generate initial route
    if (userLocation) {
      generateRoute(ambulance.lat, ambulance.lng, userLocation.lat, userLocation.lng);
    }
    
    setIsTracking(true);
    
    // Start real-time updates every 5 seconds
    const interval = setInterval(() => {
      updateAmbulanceLocation();
    }, 5000);
    
    setTrackingInterval(interval);
  };

  const stopLiveTracking = () => {
    setIsTracking(false);
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
  };

  const updateAmbulanceLocation = () => {
    if (!activeAmbulance || !userLocation) return;
    
    setActiveAmbulance(prev => {
      if (!prev) return null;
      
      // Simulate ambulance movement towards user location
      const currentLat = prev.currentLocation.lat;
      const currentLng = prev.currentLocation.lng;
      const targetLat = userLocation.lat;
      const targetLng = userLocation.lng;
      
      // Calculate movement step (roughly 500m per update)
      const stepSize = 0.004; // approximately 500m in degrees
      const latDiff = targetLat - currentLat;
      const lngDiff = targetLng - currentLng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      
      if (distance < stepSize) {
        // Ambulance has arrived
        setIsTracking(false);
        clearInterval(trackingInterval);
        alert('Ambulance has arrived at your location!');
        return {
          ...prev,
          currentLocation: { lat: targetLat, lng: targetLng },
          status: 'arrived',
          eta: '0 mins'
        };
      }
      
      // Move ambulance towards target
      const newLat = currentLat + (latDiff / distance) * stepSize;
      const newLng = currentLng + (lngDiff / distance) * stepSize;
      
      // Calculate new ETA based on remaining distance
      const remainingDistance = calculateDistance(newLat, newLng, targetLat, targetLng);
      const etaMinutes = Math.max(1, Math.round(remainingDistance * 2)); // Assume 30 km/h average speed
      
      return {
        ...prev,
        currentLocation: { lat: newLat, lng: newLng },
        eta: `${etaMinutes} mins`,
        distance: `${remainingDistance.toFixed(1)} km`
      };
    });
  };

  const generateRoute = async (startLat, startLng, endLat, endLng) => {
    try {
      // Use OpenRouteService or generate a simple route
      // For demo purposes, we'll create a simple route with some waypoints
      const waypoints = [];
      const steps = 10;
      
      for (let i = 0; i <= steps; i++) {
        const lat = startLat + (endLat - startLat) * (i / steps);
        const lng = startLng + (endLng - startLng) * (i / steps);
        waypoints.push([lat, lng]);
      }
      
      setAmbulanceRoute(waypoints);
      
      // Calculate estimated arrival time
      const totalDistance = calculateDistance(startLat, startLng, endLat, endLng);
      const etaMinutes = Math.round(totalDistance * 2); // Assume 30 km/h average speed
      setEstimatedArrival(new Date(Date.now() + etaMinutes * 60000));
      
    } catch (error) {
      console.error('Error generating route:', error);
    }
  };

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

  return (
    <PageLayout 
      title="Emergency Ambulance"
      showBack={true}
      onBack={() => navigate('/dashboard')}
    >

      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
          <div>
            <p className="text-sm text-red-700">
              <strong>For life-threatening emergencies, call 102 immediately.</strong> This service is for additional support.
            </p>
            <button
              onClick={callEmergencyServices}
              className="mt-2 flex items-center px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
            >
              <Phone className="w-3 h-3 mr-1" />
              Call 102
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4 -mx-4">
        <div className="px-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('emergency')}
              className={`py-3 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'emergency'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Emergency Request
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`py-3 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'map'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Nearby Hospitals
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`py-3 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'tracking'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Track Ambulance
            </button>
          </div>
        </div>
      </div>

      <div>
        {/* Emergency Request Tab */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            {/* Current Location Card */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Current Location</h3>
                <button
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  {locationLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                  <span className="text-xs">{locationLoading ? 'Locating...' : 'Update'}</span>
                </button>
              </div>
              
              {userLocation ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <MapPin className="w-4 h-4" />
                    <span>Location detected</span>
                  </div>
                  {addressDetails && (
                    <p className="text-sm text-gray-600">{emergencyRequest.pickupLocation}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>Click update to get your location</span>
                </div>
              )}
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={emergencyRequest.patientName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Patient Age *
                    </label>
                    <input
                      type="number"
                      name="patientAge"
                      value={emergencyRequest.patientAge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={emergencyRequest.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={emergencyRequest.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Details */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Emergency Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Medical Condition *
                  </label>
                  <select
                    name="condition"
                    value={emergencyRequest.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select condition</option>
                    {commonConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Urgency Level *
                  </label>
                  <div className="space-y-2">
                    {urgencyLevels.map(level => (
                      <label key={level.value} className="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="urgency"
                          value={level.value}
                          checked={emergencyRequest.urgency === level.value}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <div className={`w-3 h-3 rounded-full ${level.bgColor} mr-2`}></div>
                        <span className={`text-sm font-medium ${level.color}`}>{level.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Location Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Pickup Location *
                  </label>
                  <textarea
                    name="pickupLocation"
                    value={emergencyRequest.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="Address will be filled automatically or enter manually"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Hospital Preference (Optional)
                  </label>
                  <input
                    type="text"
                    name="hospitalPreference"
                    value={emergencyRequest.hospitalPreference}
                    onChange={handleInputChange}
                    placeholder="Select from nearby hospitals or enter preferred hospital"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Check 'Nearby Hospitals' tab to see available options</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Additional Information (Optional)
              </label>
              <textarea
                name="additionalInfo"
                value={emergencyRequest.additionalInfo}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional details about the emergency, allergies, medications, etc."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={requestEmergencyAmbulance}
              disabled={loading || !emergencyRequest.patientName || !emergencyRequest.condition || !emergencyRequest.pickupLocation}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Requesting Ambulance...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Request Emergency Ambulance</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Map Tab - Nearby Hospitals */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Nearby Hospitals Map</h3>
              {userLocation ? (
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={mapCenter} zoom={13} />
                    
                    {/* User location marker */}
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                      <Popup>
                        <strong>Your Location</strong><br />
                        {emergencyRequest.pickupLocation || 'Current Position'}
                      </Popup>
                    </Marker>
                    
                    {/* Hospital markers */}
                    {nearbyHospitals.map(hospital => (
                      <Marker 
                        key={hospital.id} 
                        position={[hospital.lat, hospital.lng]} 
                        icon={hospitalIcon}
                      >
                        <Popup>
                          <div className="text-sm">
                            <strong>{hospital.name}</strong><br />
                            Distance: {hospital.distance.toFixed(1)} km<br />
                            Phone: {hospital.phone}<br />
                            <button 
                              onClick={() => selectHospital(hospital)}
                              className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              Select Hospital
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* Ambulance markers */}
                    {nearbyAmbulances.map(ambulance => (
                      <Marker 
                        key={ambulance.id} 
                        position={[ambulance.lat, ambulance.lng]} 
                        icon={ambulanceIcon}
                      >
                        <Popup>
                          <div className="text-sm">
                            <strong>{ambulance.vehicle}</strong><br />
                            Driver: {ambulance.driver}<br />
                            ETA: {ambulance.eta}<br />
                            Distance: {ambulance.distance}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Allow location access to see nearby hospitals</p>
                    <button
                      onClick={getCurrentLocation}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Get Location
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hospitals List */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Nearby Hospitals</h3>
              {nearbyHospitals.length > 0 ? (
                <div className="space-y-3">
                  {nearbyHospitals.map(hospital => (
                    <div key={hospital.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <Building className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{hospital.name}</p>
                          <p className="text-xs text-gray-500">{hospital.address}</p>
                          <p className="text-xs text-gray-500">Phone: {hospital.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{hospital.distance.toFixed(1)} km</p>
                        <button
                          onClick={() => selectHospital(hospital)}
                          className="mt-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No hospitals found nearby</p>
                  <button
                    onClick={() => userLocation && fetchNearbyHospitals(userLocation.lat, userLocation.lng)}
                    className="mt-2 flex items-center space-x-1 mx-auto text-blue-600 hover:text-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">Refresh</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            {/* Live Tracking Map */}
            {isTracking && activeAmbulance && userLocation && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Live Ambulance Tracking</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                </div>
                
                <div className="h-64 rounded-lg overflow-hidden mb-4">
                  <MapContainer
                    center={[activeAmbulance.currentLocation.lat, activeAmbulance.currentLocation.lng]}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Route line */}
                    {ambulanceRoute.length > 0 && (
                      <Polyline
                        positions={ambulanceRoute}
                        color="blue"
                        weight={4}
                        opacity={0.7}
                        dashArray="10, 10"
                      />
                    )}
                    
                    {/* User location marker */}
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                      <Popup>
                        <strong>Your Location</strong><br />
                        Pickup Point
                      </Popup>
                    </Marker>
                    
                    {/* Active ambulance marker */}
                    <Marker 
                      position={[activeAmbulance.currentLocation.lat, activeAmbulance.currentLocation.lng]} 
                      icon={ambulanceIcon}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{activeAmbulance.vehicle}</strong><br />
                          Driver: {activeAmbulance.driver}<br />
                          Status: {activeAmbulance.status.replace('_', ' ')}<br />
                          ETA: {activeAmbulance.eta}<br />
                          Distance: {activeAmbulance.distance}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
                
                {/* Tracking Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => isTracking ? stopLiveTracking() : startLiveTracking('1')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                        isTracking 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {isTracking ? (
                        <><PauseCircle className="w-4 h-4" /><span>Stop Tracking</span></>
                      ) : (
                        <><PlayCircle className="w-4 h-4" /><span>Start Tracking</span></>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (activeAmbulance) {
                          setMapCenter([activeAmbulance.currentLocation.lat, activeAmbulance.currentLocation.lng]);
                        }
                      }}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium"
                    >
                      <Navigation2 className="w-4 h-4" />
                      <span>Center on Ambulance</span>
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Last updated</p>
                    <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Active Request Status */}
            {activeAmbulance ? (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Active Request</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeAmbulance.status === 'en_route' ? 'bg-blue-100 text-blue-800' :
                    activeAmbulance.status === 'arrived' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activeAmbulance.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-500">Ambulance</p>
                    <p className="text-sm font-semibold">{activeAmbulance.vehicle}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500">ETA</p>
                    <p className="text-sm font-semibold">{activeAmbulance.eta}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Navigation className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-semibold">{activeAmbulance.distance}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Route className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-semibold">{isTracking ? 'Tracking' : 'Stopped'}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Driver:</strong> {activeAmbulance.driver}
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Contact:</strong> +91-98765-43210
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Started:</strong> {new Date(activeAmbulance.startTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-green-800">
                      <strong>Estimated Arrival:</strong> {estimatedArrival ? estimatedArrival.toLocaleTimeString() : 'Calculating...'}
                    </p>
                  </div>
                </div>
                
                {/* Emergency Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>Call Driver</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Update Emergency</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                    <RotateCcw className="w-4 h-4" />
                    <span>Cancel Request</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm mb-2">No active ambulance requests</p>
                <p className="text-gray-400 text-xs mb-4">Request an ambulance to start live tracking</p>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Request Ambulance
                </button>
                
                {/* Demo button for testing */}
                <div className="mt-4">
                  <button
                    onClick={() => startLiveTracking('1')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Start Demo Tracking
                  </button>
                </div>
              </div>
            )}"

            {/* Nearby Ambulances */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Nearby Ambulances</h3>
              <div className="space-y-3">
                {nearbyAmbulances.map(ambulance => (
                  <div key={ambulance.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{ambulance.vehicle}</p>
                        <p className="text-xs text-gray-500">{ambulance.driver}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{ambulance.eta}</p>
                      <p className="text-xs text-gray-500">{ambulance.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request History */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Request History</h3>
              {ambulanceRequests.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No previous requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ambulanceRequests.map(request => (
                    <div key={request.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{request.patientName}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(request.requestTime || request.createdAt).toLocaleDateString()} at {new Date(request.requestTime || request.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {request.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'completed' ? 'bg-green-100 text-green-800' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
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
                          <p className="font-medium">{request.ambulanceId || 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AmbulanceBooking;