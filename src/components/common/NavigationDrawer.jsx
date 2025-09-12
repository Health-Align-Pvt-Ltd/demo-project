// Navigation Drawer Component
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  X,
  Home,
  Stethoscope,
  Truck,
  Heart,
  Pill,
  User,
  Wallet,
  Navigation,
  Settings,
  HelpCircle,
  LogOut,
  Phone,
  Calendar,
  CreditCard,
  Star,
  Shield,
  Bell
} from 'lucide-react';

const NavigationDrawer = ({ isOpen = false, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useAuth();

  // Use external state if provided, otherwise use internal state
  const drawerIsOpen = onToggle !== undefined ? isOpen : internalIsOpen;
  const setDrawerOpen = onToggle !== undefined ? onToggle : setInternalIsOpen;

  const mainMenuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      path: '/dashboard',
      description: 'Overview & Quick Actions'
    },
    { 
      id: 'consultation', 
      label: 'Doctor Consultation', 
      icon: Stethoscope, 
      path: '/consultation',
      description: 'Book appointments with doctors'
    },
    { 
      id: 'ambulance', 
      label: 'Emergency Ambulance', 
      icon: Truck, 
      path: '/ambulance',
      description: 'Request emergency services'
    },
    { 
      id: 'track-ambulance', 
      label: 'Track Ambulance', 
      icon: Navigation, 
      path: '/ambulance?tab=tracking',
      description: 'Live ambulance tracking',
      isNew: true
    },
    { 
      id: 'blood-request', 
      label: 'Blood Request', 
      icon: Heart, 
      path: '/blood-request',
      description: 'Emergency blood donation'
    },
    { 
      id: 'medicine', 
      label: 'Medicine Order', 
      icon: Pill, 
      path: '/medicine',
      description: 'Order prescription medicines'
    }
  ];

  const accountMenuItems = [
    { 
      id: 'profile', 
      label: 'Profile & Settings', 
      icon: User, 
      path: '/profile',
      description: 'Manage your account'
    },
    { 
      id: 'wallet', 
      label: 'Wallet & Payments', 
      icon: Wallet, 
      path: '/wallet',
      description: 'Manage payments & cashback'
    },
    { 
      id: 'appointments', 
      label: 'My Appointments', 
      icon: Calendar, 
      path: '/appointments',
      description: 'View booking history'
    }
  ];

  const supportMenuItems = [
    { 
      id: 'help', 
      label: 'Help & Support', 
      icon: HelpCircle, 
      path: '/help',
      description: '24/7 customer support'
    },
    { 
      id: 'emergency', 
      label: 'Emergency Contacts', 
      icon: Phone, 
      path: '/emergency-contacts',
      description: 'Quick emergency numbers'
    }
  ];

  const handleNavigation = (path) => {
    if (path.includes('?')) {
      const [routePath, queryString] = path.split('?');
      const params = new URLSearchParams(queryString);
      const tab = params.get('tab');
      
      navigate(routePath, { state: { tab } });
    } else {
      navigate(path);
    }
    setDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setDrawerOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerIsOpen);
  };

  const isActiveRoute = (path) => {
    if (path.includes('?')) {
      const [routePath] = path.split('?');
      return location.pathname === routePath;
    }
    return location.pathname === path;
  };

  const MenuSection = ({ title, items, showDivider = true }) => (
    <>
      {title && (
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="space-y-1 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors relative ${
                isActive
                  ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                  {item.label}
                  {item.isNew && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                      New
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 truncate">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      {showDivider && <div className="border-t border-gray-200 my-3" />}
    </>
  );

  return (
    <>
      {/* Menu Button - Only show if no external control */}
      {onToggle === undefined && (
        <button
          onClick={handleToggleDrawer}
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Overlay */}
      {drawerIsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          drawerIsOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">HealthAlign</h2>
              <p className="text-xs text-blue-100">Complete Healthcare Solution</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData?.phoneNumber || userData?.email || 'user@example.com'}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
              <p className="text-xs text-gray-500">Health Score</p>
            </div>
          </div>
        </div>

        {/* Menu Content - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 min-h-0" style={{scrollbarWidth: 'thin'}}>
          <MenuSection title="Main Services" items={mainMenuItems} />
          <MenuSection title="Account" items={accountMenuItems} />
          <MenuSection title="Support" items={supportMenuItems} showDivider={false} />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              HealthAlign v1.0.0
            </p>
            <p className="text-xs text-gray-400 text-center">
              © 2024 HealthAlign. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;