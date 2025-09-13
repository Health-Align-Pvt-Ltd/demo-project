// Address Input Component
import React, { useState, useEffect } from 'react';
import { MapPin, Save } from 'lucide-react';
import { useAddress } from '../../hooks/useAddress';
import { useAuth } from '../../contexts/AuthContext';

const AddressInput = ({ onAddressChange, showSaveButton = true }) => {
  const { address, saveAddress } = useAddress();
  const { user } = useAuth();
  const [localAddress, setLocalAddress] = useState('');

  // Update local address when address from hook changes
  useEffect(() => {
    setLocalAddress(address || '');
  }, [address]);

  // Notify parent component when address changes
  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(localAddress);
    }
  }, [localAddress, onAddressChange]);

  const handleSave = async () => {
    try {
      const result = await saveAddress(localAddress);
      if (result.success) {
        console.log('Address saved successfully');
      } else {
        console.error('Failed to save address:', result.error);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Delivery Address
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <textarea
          value={localAddress}
          onChange={(e) => setLocalAddress(e.target.value)}
          rows={3}
          placeholder="Enter your complete address with pincode"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {showSaveButton && user && (
        <button
          onClick={handleSave}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <Save className="w-4 h-4 mr-1" />
          Save Address
        </button>
      )}
      
      {!user && (
        <p className="text-xs text-gray-500">
          Sign in to save your address for future orders
        </p>
      )}
    </div>
  );
};

export default AddressInput;