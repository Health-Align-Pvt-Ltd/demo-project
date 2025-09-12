// Authentication Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../firebase/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        setUser(user);
        const userInfo = await authService.getCurrentUserData();
        setUserData(userInfo);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithPhone = async (phoneNumber) => {
    setLoading(true);
    try {
      const result = await authService.loginWithPhone(phoneNumber);
      if (result.success) {
        return { success: true, confirmationResult: result.confirmationResult };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const registerWithPhone = async (phoneNumber, userData) => {
    setLoading(true);
    try {
      const result = await authService.registerWithPhone(phoneNumber, userData);
      if (result.success) {
        return { success: true, confirmationResult: result.confirmationResult, userData: result.userData };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (confirmationResult, otp) => {
    setLoading(true);
    try {
      const result = await authService.verifyOTP(confirmationResult, otp);
      if (result.success) {
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('OTP verification failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (confirmationResult, otp, userData) => {
    setLoading(true);
    try {
      const result = await authService.completeRegistration(confirmationResult, otp, userData);
      if (result.success) {
        toast.success('Registration successful!');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await authService.signInWithGoogle();
      if (result.success) {
        toast.success('Google sign-in successful!');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Google sign-in failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await authService.registerWithGoogle();
      if (result.success) {
        toast.success('Google registration successful!');
        return { success: true, isNewUser: result.isNewUser };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Google registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (data) => {
    try {
      const result = await authService.updateUserProfile(data);
      if (result.success) {
        const updatedUserData = await authService.getCurrentUserData();
        setUserData(updatedUserData);
        toast.success('Profile updated successfully');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Profile update failed');
      return { success: false, error: error.message };
    }
  };

  // Update user address and save to cookie
  const updateAddress = async (address) => {
    try {
      if (!user?.uid) {
        toast.error('User not authenticated');
        return { success: false, error: 'User not authenticated' };
      }

      const result = await authService.updateUserAddress(user.uid, address);
      if (result.success) {
        // Update the local userData state
        const updatedUserData = await authService.getCurrentUserData();
        setUserData(updatedUserData);
        toast.success('Address updated successfully');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Address update failed');
      return { success: false, error: error.message };
    }
  };

  // Get address from cookie
  const getAddressFromCookie = () => {
    return authService.getAddressFromCookie();
  };

  const resetPassword = async (email) => {
    try {
      const result = await authService.resetPassword(email);
      if (result.success) {
        toast.success('Password reset email sent');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Password reset failed');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userData,
    loading,
    loginWithPhone,
    registerWithPhone,
    verifyOTP,
    completeRegistration,
    signInWithGoogle,
    registerWithGoogle,
    logout,
    updateProfile,
    updateAddress,
    getAddressFromCookie,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};