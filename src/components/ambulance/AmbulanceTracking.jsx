// Ambulance Tracking Component (Moved from Ambulance Booking)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import PageLayout from '../common/PageLayout';
import {
  Truck,
  Clock,
  Navigation,
  Phone,
  AlertTriangle,
  Navigation2,
  Route,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Calendar,
  CheckCircle,
  XCircle,
  Home
} from 'lucide-react';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/679/679922.png',
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

const AmbulanceTracking = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [activeAmbulance, setActiveAmbulance] = useState(null);
  const [ambulanceRoute, setAmbulanceRoute] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [userLocation, setUserLocation] = useState(null);

  // Mock ambulance data
  const nearbyAmbulances = [
    { id: '1', driver: 'John Smith', vehicle: 'AMB-001', eta: '5 mins', distance: '1.2 km', rating: 4.8, lat: 28.6149, lng: 77.2100 },
    { id: '2', driver: 'Maria Garcia', vehicle: 'AMB-002', eta: '8 mins', distance: '2.1 km', rating: 4.9, lat: 28.6129, lng: 77.2080 },
    { id: '3', driver: 'David Johnson', vehicle: 'AMB-003', eta: '12 mins', distance: '2.8 km', rating: 4.7, lat: 28.6159, lng: 77.2110 }
  ];

  useEffect(() => {
    loadAmbulanceRequests();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setMapCenter([coords.lat, coords.lng]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }
  };

  const loadAmbulanceRequests = async () => {
    if (userData?.uid) {
      const result = await firestoreService.getAmbulanceBookings(userData.uid);
      if (result.success) {
        setAmbulanceRequests(result.data);
      }
    }
  };

  // Live ambulance tracking functions
  const startLiveTracking = (ambulanceId) => {
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
      
      const currentLat = prev.currentLocation.lat;
      const currentLng = prev.currentLocation.lng;
      const targetLat = userLocation.lat;
      const targetLng = userLocation.lng;
      
      const stepSize = 0.004;
      const latDiff = targetLat - currentLat;
      const lngDiff = targetLng - currentLng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      
      if (distance < stepSize) {
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
      
      const newLat = currentLat + (latDiff / distance) * stepSize;
      const newLng = currentLng + (lngDiff / distance) * stepSize;
      
      const remainingDistance = calculateDistance(newLat, newLng, targetLat, targetLng);
      const etaMinutes = Math.max(1, Math.round(remainingDistance * 2));
      
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
      const waypoints = [];
      const steps = 10;
      
      for (let i = 0; i <= steps; i++) {
        const lat = startLat + (endLat - startLat) * (i / steps);
        const lng = startLng + (endLng - startLng) * (i / steps);
        waypoints.push([lat, lng]);
      }
      
      setAmbulanceRoute(waypoints);
      
      const totalDistance = calculateDistance(startLat, startLng, endLat, endLng);
      const etaMinutes = Math.round(totalDistance * 2);
      setEstimatedArrival(new Date(Date.now() + etaMinutes * 60000));
      
    } catch (error) {
      console.error('Error generating route:', error);
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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
      title="Ambulance Tracking"
      showBack={true}
      onBack={() => navigate('/dashboard')}
    >
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
              onClick={() => navigate('/ambulance')}
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
        )}

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
    </PageLayout>
  );
};

export default AmbulanceTracking;