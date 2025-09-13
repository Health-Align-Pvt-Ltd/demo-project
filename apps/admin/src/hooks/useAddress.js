// Custom hook for managing user addresses
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAddress = () => {
  const { userData, user, updateAddress, getAddressFromCookie } = useAuth();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load address on component mount
  useEffect(() => {
    loadAddress();
  }, [userData, user]);

  const loadAddress = () => {
    setLoading(true);
    try {
      // First, try to get address from user data (Firebase)
      if (userData?.address) {
        setAddress(userData.address);
        setLoading(false);
        return;
      }

      // If not in user data, try to get from cookie
      const cookieAddress = getAddressFromCookie();
      if (cookieAddress) {
        setAddress(cookieAddress);
        setLoading(false);
        return;
      }

      // If no address found, set to empty
      setAddress('');
    } catch (error) {
      console.error('Error loading address:', error);
      setAddress('');
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (newAddress) => {
    try {
      // Save to Firebase and cookie if user is authenticated
      if (user?.uid) {
        const result = await updateAddress(newAddress);
        if (result.success) {
          setAddress(newAddress);
          return { success: true };
        } else {
          throw new Error(result.error);
        }
      } else {
        // If not authenticated, only save to cookie
        document.cookie = `userAddress=${encodeURIComponent(JSON.stringify(newAddress))}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
        setAddress(newAddress);
        return { success: true };
      }
    } catch (error) {
      console.error('Error saving address:', error);
      return { success: false, error: error.message };
    }
  };

  const clearAddress = () => {
    try {
      // Clear cookie
      document.cookie = 'userAddress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setAddress('');
    } catch (error) {
      console.error('Error clearing address:', error);
    }
  };

  return {
    address,
    loading,
    saveAddress,
    clearAddress,
    loadAddress
  };
};

export default useAddress;