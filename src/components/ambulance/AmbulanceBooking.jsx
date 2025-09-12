// Enhanced Ambulance Booking Component with OpenStreetMap
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import Cookies from 'js-cookie';
import PageLayout from '../common/PageLayout';
import MapLocationPicker from '../common/MapLocationPicker';
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

// Map click handler component
function MapClickHandler({ onMapClick }) {
  const map = useMap();
  useEffect(() => {
    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [map, onMapClick]);
  return null;
}

const AmbulanceBooking = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState('');
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [patientLocationMarker, setPatientLocationMarker] = useState(null);
  const [isManualLocationMode, setIsManualLocationMode] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState(0);
  const [calculatedFare, setCalculatedFare] = useState(500);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const urgencyLevels = [
    { value: 'critical', label: 'Critical - Life Threatening', color: 'text-red-600', bgColor: 'bg-red-100' },
    { value: 'high', label: 'High - Urgent Care Needed', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'medium', label: 'Medium - Non-Emergency', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'low', label: 'Low - Routine Transport', color: 'text-green-600', bgColor: 'bg-green-100' }
  ];

  const mockHospitals = [
    { id: 1, name: 'AIIMS Delhi', type: 'Hospital', lat: 28.5672, lng: 77.2100, address: 'Ansari Nagar, New Delhi' },
    { id: 2, name: 'Safdarjung Hospital', type: 'Hospital', lat: 28.5740, lng: 77.2060, address: 'Safdarjung, New Delhi' },
    { id: 3, name: 'Apollo Hospital', type: 'Hospital', lat: 28.5355, lng: 77.2490, address: 'Sarita Vihar, New Delhi' },
    { id: 4, name: 'Max Hospital Saket', type: 'Hospital', lat: 28.5244, lng: 77.2066, address: 'Saket, New Delhi' },
    { id: 5, name: 'Fortis Hospital', type: 'Hospital', lat: 28.5562, lng: 77.2410, address: 'Shalimar Bagh, New Delhi' },
    { id: 6, name: 'Mercy Nursing Home', type: 'Nursing Home', lat: 28.6280, lng: 77.2197, address: 'Connaught Place, New Delhi' },
    { id: 7, name: 'Care Nursing Home', type: 'Nursing Home', lat: 28.6450, lng: 77.2160, address: 'Karol Bagh, New Delhi' },
    { id: 8, name: 'City Hospital', type: 'Hospital', lat: 28.6890, lng: 77.2194, address: 'Civil Lines, New Delhi' },
    { id: 9, name: 'Metro Hospital', type: 'Hospital', lat: 28.4595, lng: 77.0266, address: 'Gurgaon, Haryana' },
    { id: 10, name: 'Sunrise Nursing Home', type: 'Nursing Home', lat: 28.6692, lng: 77.4538, address: 'Noida, UP' }
  ];

  const calculateFareFromDistance = (distanceKm) => {
    const baseFare = 500; // Minimum fare ₹500
    if (distanceKm <= 0) return baseFare;
    
    // ₹18 per km after base fare
    const additionalFare = distanceKm * 18;
    return Math.max(baseFare, baseFare + additionalFare);
  };

  const filteredHospitals = mockHospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(hospitalSearchQuery.toLowerCase()) ||
    hospital.type.toLowerCase().includes(hospitalSearchQuery.toLowerCase())
  );

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

  const handleMapClick = (e) => {
    if (isManualLocationMode) {
      const clickedLocation = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };
      setPatientLocationMarker(clickedLocation);
      setUserLocation(clickedLocation);
      reverseGeocode(clickedLocation.lat, clickedLocation.lng);
      
      // Calculate distance and fare if hospital is selected
      if (selectedHospital) {
        const distance = calculateDistance(
          clickedLocation.lat, 
          clickedLocation.lng, 
          selectedHospital.lat, 
          selectedHospital.lng
        );
        setCalculatedDistance(distance);
        setCalculatedFare(calculateFareFromDistance(distance));
      }
    }
  };

  const handleMapLocationSelect = (locationData) => {
    setPatientLocationMarker({
      lat: locationData.lat,
      lng: locationData.lng
    });
    setUserLocation({
      lat: locationData.lat,
      lng: locationData.lng
    });
    setEmergencyRequest(prev => ({
      ...prev,
      pickupLocation: locationData.address
    }));
    
    // Calculate distance and fare if hospital is selected
    if (selectedHospital) {
      const distance = calculateDistance(
        locationData.lat, 
        locationData.lng, 
        selectedHospital.lat, 
        selectedHospital.lng
      );
      setCalculatedDistance(distance);
      setCalculatedFare(calculateFareFromDistance(distance));
    }
  };

  const selectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setEmergencyRequest(prev => ({
      ...prev,
      hospitalPreference: hospital.name
    }));
    setShowHospitalDropdown(false);
    setHospitalSearchQuery(hospital.name);
    
    // Calculate distance and fare if patient location is available
    const patientLoc = patientLocationMarker || userLocation;
    if (patientLoc) {
      const distance = calculateDistance(
        patientLoc.lat, 
        patientLoc.lng, 
        hospital.lat, 
        hospital.lng
      );
      setCalculatedDistance(distance);
      setCalculatedFare(calculateFareFromDistance(distance));
    }
  };
    const nearbyAmbulances = [
    { id: '1', driver: 'John Smith', vehicle: 'AMB-001', eta: '5 mins', distance: '1.2 km', rating: 4.8, lat: 28.6149, lng: 77.2100 },
    { id: '2', driver: 'Maria Garcia', vehicle: 'AMB-002', eta: '8 mins', distance: '2.1 km', rating: 4.9, lat: 28.6129, lng: 77.2080 },
    { id: '3', driver: 'David Johnson', vehicle: 'AMB-003', eta: '12 mins', distance: '2.8 km', rating: 4.7, lat: 28.6159, lng: 77.2110 }
  ];

  useEffect(() => {
    loadPatientDataFromCookies();
    getCurrentLocation();
    loadAmbulanceRequests();
    
    // Check if we should switch to a specific tab from navigation state
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.hospital-search-container')) {
        setShowHospitalDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location.state]);

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
        
        // Calculate distance for pricing
        const finalPatientLocation = patientLocationMarker || userLocation;
        const finalDistance = selectedHospital && finalPatientLocation ? 
          calculateDistance(finalPatientLocation.lat, finalPatientLocation.lng, selectedHospital.lat, selectedHospital.lng) : 
          calculatedDistance || 5; // Default 5km if no selection
        
        const finalFare = calculateFareFromDistance(finalDistance);
        
        // Redirect to ambulance payment gateway
        navigate('/ambulance-payment', {
          state: {
            ambulanceBookingDetails: {
              ...requestData,
              bookingId: result.id,
              estimatedDistance: finalDistance,
              selectedHospital: selectedHospital,
              estimatedFare: finalFare,
              patientLocation: finalPatientLocation
            }
          }
        });
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

  const selectHospitalFromNearby = (hospital) => {
    setEmergencyRequest(prev => ({
      ...prev,
      hospitalPreference: hospital.name
    }));
    setSelectedHospital({
      id: hospital.id,
      name: hospital.name,
      lat: hospital.lat,
      lng: hospital.lng,
      type: 'Hospital',
      address: hospital.address
    });
    setHospitalSearchQuery(hospital.name);
    
    // Calculate distance and fare
    const patientLoc = patientLocationMarker || userLocation;
    if (patientLoc) {
      const distance = calculateDistance(
        patientLoc.lat, 
        patientLoc.lng, 
        hospital.lat, 
        hospital.lng
      );
      setCalculatedDistance(distance);
      setCalculatedFare(calculateFareFromDistance(distance));
    }
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
                {/* Patient Location Mode Toggle */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Patient Location
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsManualLocationMode(false);
                        setPatientLocationMarker(null);
                        getCurrentLocation();
                      }}
                      className={`px-3 py-2 text-xs rounded-lg font-medium ${
                        !isManualLocationMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Auto Detect
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className={`px-3 py-2 text-xs rounded-lg font-medium ${
                        isManualLocationMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Select on Map
                    </button>
                  </div>
                  {isManualLocationMode && (
                    <p className="text-xs text-blue-600 mt-1">
                      Click on the map below to select patient location
                    </p>
                  )}
                </div>

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

                {/* Hospital/Nursing Home Search */}
                <div className="relative hospital-search-container">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Destination Hospital/Nursing Home *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={hospitalSearchQuery}
                      onChange={(e) => {
                        setHospitalSearchQuery(e.target.value);
                        setShowHospitalDropdown(true);
                      }}
                      onFocus={() => setShowHospitalDropdown(true)}
                      placeholder="Search hospitals or nursing homes..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                    
                    {/* Search Dropdown */}
                    {showHospitalDropdown && filteredHospitals.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredHospitals.map((hospital) => (
                          <button
                            key={hospital.id}
                            type="button"
                            onClick={() => selectHospital(hospital)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{hospital.name}</p>
                              <p className="text-xs text-blue-600">{hospital.type}</p>
                              <p className="text-xs text-gray-500">{hospital.address}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedHospital && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-xs text-green-800">
                        <strong>Selected:</strong> {selectedHospital.name} ({selectedHospital.type})
                      </p>
                      {calculatedDistance > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-green-700">
                            <strong>Distance:</strong> {calculatedDistance.toFixed(1)} km
                          </p>
                          <p className="text-xs text-green-700">
                            <strong>Estimated Fare:</strong> ₹{calculatedFare} (Base ₹500 + ₹18/km)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
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
                    <MapClickHandler onMapClick={handleMapClick} />
                    
                    {/* Patient location marker */}
                    {(patientLocationMarker || userLocation) && (
                      <Marker 
                        position={[
                          (patientLocationMarker || userLocation).lat, 
                          (patientLocationMarker || userLocation).lng
                        ]} 
                        icon={userIcon}
                      >
                        <Popup>
                          <strong>Patient Location</strong><br />
                          {isManualLocationMode ? 'Manually Selected' : 'Auto Detected'}<br />
                          {emergencyRequest.pickupLocation || 'Current Position'}
                        </Popup>
                      </Marker>
                    )}
                    
                    {/* Selected hospital marker */}
                    {selectedHospital && (
                      <Marker 
                        position={[selectedHospital.lat, selectedHospital.lng]} 
                        icon={hospitalIcon}
                      >
                        <Popup>
                          <div className="text-sm">
                            <strong>{selectedHospital.name}</strong><br />
                            Type: {selectedHospital.type}<br />
                            {calculatedDistance > 0 && (
                              <>
                                Distance: {calculatedDistance.toFixed(1)} km<br />
                                Fare: ₹{calculatedFare}
                              </>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    
                    {/* Route line between patient and selected hospital */}
                    {selectedHospital && (patientLocationMarker || userLocation) && (
                      <Polyline
                        positions={[
                          [(patientLocationMarker || userLocation).lat, (patientLocationMarker || userLocation).lng],
                          [selectedHospital.lat, selectedHospital.lng]
                        ]}
                        color="blue"
                        weight={4}
                        opacity={0.7}
                        dashArray="10, 10"
                      />
                    )}
                    
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
                              onClick={() => selectHospitalFromNearby(hospital)}
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
                          onClick={() => selectHospitalFromNearby(hospital)}
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
      </div>
      
      {/* Map Location Picker Modal */}
      <MapLocationPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onLocationSelect={handleMapLocationSelect}
        initialLocation={(() => {
          const location = patientLocationMarker || userLocation;
          return location ? { lat: location.lat, lng: location.lng } : null;
        })()}
        title="Select Patient Pickup Location"
      />
    </PageLayout>
  );
};

export default AmbulanceBooking;