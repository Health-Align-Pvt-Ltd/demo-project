// Map Location Picker Modal Component
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { X, MapPin, CheckCircle, Navigation, Search } from 'lucide-react';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for selected location
const selectedLocationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

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

// Map updater component
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
      // Force map to resize and refresh tiles
      setTimeout(() => {
        map.invalidateSize();
        map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            layer.redraw();
          }
        });
      }, 100);
    }
  }, [center, zoom, map]);
  return null;
}

const MapLocationPicker = ({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  initialLocation = null,
  title = "Select Location" 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [mapCenter, setMapCenter] = useState(initialLocation && initialLocation.lat ? 
    [initialLocation.lat, initialLocation.lng] : [28.6139, 77.2090]); // Default: Delhi
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      setSelectedLocation(initialLocation);
      setMapCenter([initialLocation.lat, initialLocation.lng]);
    } else {
      // Set default location to Delhi if no initial location
      setMapCenter([28.6139, 77.2090]);
    }
  }, [initialLocation]);

  // Force map resize when modal opens
  useEffect(() => {
    if (isOpen && mapInstance) {
      const timer = setTimeout(() => {
        mapInstance.invalidateSize();
      }, 300); // Wait for modal animation to complete
      return () => clearTimeout(timer);
    }
  }, [isOpen, mapInstance]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, []);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setSearchResults([]);
      }
    };
    
    if (searchResults.length > 0) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [searchResults.length]);

  const handleMapClick = async (e) => {
    const clickedLocation = {
      lat: e.latlng.lat,
      lng: e.latlng.lng
    };
    setSelectedLocation(clickedLocation);
    // Clear search when user clicks on map
    setSearchQuery('');
    setSearchResults([]);
    
    // Try to get address for clicked location
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickedLocation.lat}&lon=${clickedLocation.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'HealthAlign/1.0 (https://healthalign.com)',
            'Referer': window.location.origin
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          const address = data.address || {};
          const parts = [];
          
          if (address.house_number) parts.push(address.house_number);
          if (address.road) parts.push(address.road);
          if (address.neighbourhood || address.suburb) parts.push(address.neighbourhood || address.suburb);
          if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
          if (address.state) parts.push(address.state);
          if (address.postcode) parts.push(address.postcode);
          
          const formattedAddress = parts.length > 0 ? parts.join(', ') : data.display_name;
          setSelectedAddress(formattedAddress);
          setSearchQuery(formattedAddress.split(',')[0].trim()); // Show primary address in search
        } else {
          setSelectedAddress(''); // Will be fetched on confirm
        }
      } else {
        setSelectedAddress(''); // Will be fetched on confirm
      }
    } catch (error) {
      console.error('Error getting address for clicked location:', error);
      setSelectedAddress(''); // Will be fetched on confirm
    }
  };

  const getCurrentLocation = () => {
    setIsGettingCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(currentLoc);
          setMapCenter([currentLoc.lat, currentLoc.lng]);
          
          // Try to get address for current location immediately
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLoc.lat}&lon=${currentLoc.lng}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'HealthAlign/1.0 (https://healthalign.com)',
                  'Referer': window.location.origin
                }
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data && data.display_name) {
                const address = data.address || {};
                const parts = [];
                
                if (address.house_number) parts.push(address.house_number);
                if (address.road) parts.push(address.road);
                if (address.neighbourhood || address.suburb) parts.push(address.neighbourhood || address.suburb);
                if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
                if (address.state) parts.push(address.state);
                if (address.postcode) parts.push(address.postcode);
                
                const formattedAddress = parts.length > 0 ? parts.join(', ') : data.display_name;
                setSelectedAddress(formattedAddress);
                setSearchQuery(formattedAddress.split(',')[0].trim()); // Show primary address in search
              } else {
                setSelectedAddress('Current Location');
                setSearchQuery('Current Location');
              }
            } else {
              setSelectedAddress('Current Location');
              setSearchQuery('Current Location');
            }
          } catch (error) {
            console.error('Error getting address for current location:', error);
            setSelectedAddress('Current Location');
            setSearchQuery('Current Location');
          }
          
          setIsGettingCurrentLocation(false);
          // Clear search results
          setSearchResults([]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingCurrentLocation(false);
          alert('Could not get your current location. Please select manually on the map.');
        }
      );
    } else {
      setIsGettingCurrentLocation(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Search for addresses using Nominatim API with better error handling
  const handleAddressSearch = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Add user agent and referer to avoid 403 errors
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&countrycodes=in&extratags=1&namedetails=1`,
        {
          headers: {
            'User-Agent': 'HealthAlign/1.0 (https://healthalign.com)',
            'Referer': window.location.origin
          }
        }
      );
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('Nominatim API rate limit reached, using fallback');
          // Fallback to a simpler search without country restrictions
          const fallbackResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' India')}&limit=5`,
            {
              headers: {
                'User-Agent': 'HealthAlign/1.0',
              }
            }
          );
          
          if (fallbackResponse.ok) {
            const fallbackResults = await fallbackResponse.json();
            setSearchResults(fallbackResults.map(result => ({
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
              display_name: result.display_name,
              place_id: result.place_id || result.osm_id
            })));
            return;
          }
        }
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const results = await response.json();
      
      // Filter and sort results for better relevance
      const filteredResults = results
        .filter(result => {
          // Prioritize results that are addresses, buildings, or places
          const type = result.type;
          const category = result.class;
          return (
            category === 'place' || 
            category === 'building' || 
            category === 'highway' ||
            type === 'house' ||
            type === 'residential' ||
            result.display_name.toLowerCase().includes(query.toLowerCase())
          );
        })
        .slice(0, 6); // Limit to 6 results for better UX
      
      setSearchResults(filteredResults.map(result => ({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name,
        place_id: result.place_id,
        type: result.type,
        class: result.class
      })));
    } catch (error) {
      console.error('Error searching for address:', error);
      setSearchResults([]);
      // Show user-friendly error message
      if (error.message.includes('403')) {
        // Don't show alert for every 403, just log it
        console.warn('Search temporarily unavailable due to rate limiting');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input changes with improved debouncing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Clear results if query is too short
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    // Debounce search with shorter delay for better UX
    window.searchTimeout = setTimeout(() => {
      handleAddressSearch(query);
    }, 300); // Reduced from 800ms to 300ms for faster response
  };

  // Select address from search results
  const selectSearchResult = (result) => {
    setSelectedLocation({ lat: result.lat, lng: result.lng });
    setMapCenter([result.lat, result.lng]);
    
    // Format the address for better display
    const addressParts = result.display_name.split(',');
    const formattedAddress = addressParts.length > 4 ? 
      addressParts.slice(0, 4).join(', ').trim() + ', ' + addressParts[addressParts.length - 2].trim() :
      result.display_name;
    
    setSelectedAddress(formattedAddress);
    setSearchQuery(addressParts[0].trim()); // Show just the primary address in search box
    setSearchResults([]);
  };

  const handleConfirmLocation = async () => {
    if (selectedLocation) {
      try {
        let formattedAddress = selectedAddress;
        
        // Always try reverse geocoding if we don't have a proper address
        if (!selectedAddress || selectedAddress === 'Current Location' || selectedAddress.includes('Location at')) {
          console.log('Fetching address for coordinates:', selectedLocation);
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'HealthAlign/1.0 (https://healthalign.com)',
                  'Referer': window.location.origin
                }
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              console.log('Reverse geocoding response:', data);
              
              if (data && data.display_name) {
                const address = data.address || {};
                const parts = [];
                
                if (address.house_number) parts.push(address.house_number);
                if (address.road) parts.push(address.road);
                if (address.neighbourhood || address.suburb) parts.push(address.neighbourhood || address.suburb);
                if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
                if (address.state) parts.push(address.state);
                if (address.postcode) parts.push(address.postcode);
                
                formattedAddress = parts.length > 0 ? parts.join(', ') : data.display_name;
                console.log('Formatted address:', formattedAddress);
              }
            } else {
              console.warn('Reverse geocoding failed with status:', response.status);
            }
          } catch (reverseError) {
            console.error('Error getting address details:', reverseError);
          }
        }
        
        // Provide fallback if still no address
        if (!formattedAddress || formattedAddress === 'Current Location') {
          formattedAddress = `Location at ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
        }
        
        // Create comprehensive address with coordinates
        const fullAddressWithCoordinates = `${formattedAddress}\n\nCoordinates: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
        
        console.log('Final address being sent:', fullAddressWithCoordinates);
        
        onLocationSelect({
          ...selectedLocation,
          address: fullAddressWithCoordinates,
          formattedAddress: formattedAddress,
          coordinates: `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
        });
        onClose();
      } catch (error) {
        console.error('Error confirming location:', error);
        // Fallback to basic coordinates
        const fallbackAddress = `Location at ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}\n\nCoordinates: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
        onLocationSelect({
          ...selectedLocation,
          address: fallbackAddress,
          formattedAddress: `Location at ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
          coordinates: `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
        });
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  // Debug information
  console.log('Rendering MapLocationPicker with:', {
    isOpen,
    mapCenter,
    selectedLocation,
    initialLocation
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Instructions */}
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex-shrink-0">
            <p className="text-sm text-blue-800 flex items-center">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              Search for an address or tap on the map to select location
            </p>
          </div>

          {/* Address Search */}
          <div className="p-4 border-b border-gray-200 search-container flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for your address..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {isSearching && searchQuery.length >= 3 && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {searchQuery.length >= 3 && (
              <div className="mt-2 relative">
                {isSearching && (
                  <div className="absolute top-0 left-0 right-0 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-10">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Searching addresses...</span>
                    </div>
                  </div>
                )}
                
                {!isSearching && searchResults.length > 0 && (
                  <div className="absolute top-0 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                        Found {searchResults.length} addresses
                      </div>
                      <div className="space-y-1">
                        {searchResults.map((result, index) => {
                          // Extract meaningful parts of the address
                          const addressParts = result.display_name.split(',');
                          const primaryAddress = addressParts[0].trim();
                          const secondaryAddress = addressParts.slice(1, 3).join(',').trim();
                          const locationDetails = addressParts.slice(3).join(',').trim();
                          
                          return (
                            <button
                              key={result.place_id || index}
                              onClick={() => selectSearchResult(result)}
                              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors group"
                            >
                              <div className="space-y-1">
                                <div className="flex items-start space-x-2">
                                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                                      {primaryAddress}
                                    </p>
                                    {secondaryAddress && (
                                      <p className="text-xs text-gray-600 truncate">
                                        {secondaryAddress}
                                      </p>
                                    )}
                                    {locationDetails && (
                                      <p className="text-xs text-gray-500 truncate">
                                        {locationDetails}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {!isSearching && searchQuery.length >= 3 && searchResults.length === 0 && (
                  <div className="absolute top-0 left-0 right-0 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-10">
                    <div className="text-center text-sm text-gray-500">
                      <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-medium">No addresses found</p>
                      <p className="text-xs mt-1">Try searching with different keywords</p>
                      <p className="text-xs text-blue-600 mt-2">Or click on the map to select a location</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="relative bg-gray-200" style={{ minHeight: '280px', height: '280px' }}>
            <div className="absolute inset-0">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '0' }}
                scrollWheelZoom={true}
                zoomControl={true}
                attributionControl={false}
                whenCreated={(map) => {
                  setMapInstance(map);
                  // Force map to resize after container is ready
                  setTimeout(() => {
                    map.invalidateSize();
                    map.eachLayer((layer) => {
                      if (layer instanceof L.TileLayer) {
                        layer.redraw();
                      }
                    });
                  }, 100);
                }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={19}
                />
                <MapUpdater center={mapCenter} zoom={13} />
                <MapClickHandler onMapClick={handleMapClick} />
                
                {/* Selected location marker */}
                {selectedLocation && (
                  <Marker 
                    position={[selectedLocation.lat, selectedLocation.lng]} 
                    icon={selectedLocationIcon}
                  />
                )}
              </MapContainer>
            </div>
            
            {/* Map loading indicator */}
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-lg px-2 py-1">
              <p className="text-xs text-gray-600">Tap to select</p>
            </div>
            
            {/* Map fallback message */}
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-500" id="map-fallback">
              <div className="text-center bg-white rounded-lg p-4 shadow-lg">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Map loading...</p>
                <p className="text-xs text-gray-500 mt-1">Please wait or use address search</p>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="p-4 space-y-3 flex-shrink-0">
            {/* Current Location Button */}
            <button
              onClick={getCurrentLocation}
              disabled={isGettingCurrentLocation}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Navigation className={`w-4 h-4 ${isGettingCurrentLocation ? 'animate-spin' : ''}`} />
              <span className="text-sm">{isGettingCurrentLocation ? 'Getting Location...' : 'Use Current Location'}</span>
            </button>

            {/* Selected Location Display */}
            {selectedLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Location Selected</span>
                </div>
                {selectedAddress && selectedAddress !== 'Current Location' ? (
                  <div className="space-y-1">
                    <p className="text-sm text-green-700 font-medium">
                      {selectedAddress}
                    </p>
                    <p className="text-xs text-green-600">
                      📍 {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {selectedAddress === 'Current Location' && (
                      <p className="text-sm text-green-700 font-medium">
                        Current Location
                      </p>
                    )}
                    <p className="text-xs text-green-600">
                      📍 Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer - Action Buttons */}
        <div className="p-4 pt-0 space-y-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Confirm Selected Location</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapLocationPicker;