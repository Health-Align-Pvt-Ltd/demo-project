// Common Bottom Navigation Bar
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, Calendar, User, Stethoscope, Pill, ShoppingCart, Search, Grid3X3, Package } from 'lucide-react';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is in pharmacy section
  const isPharmacySection = location.pathname.startsWith('/pharmacy');

  const defaultNavItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      path: '/dashboard',
      activeColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: Activity, 
      path: '/consultation',
      activeColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: Calendar, 
      path: '/ambulance',
      activeColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      id: 'health', 
      label: 'Health', 
      icon: Stethoscope, 
      path: '/blood-request',
      activeColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      path: '/profile',
      activeColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const pharmacyNavItems = [
    { 
      id: 'pharmacy-home', 
      label: 'Shop', 
      icon: Grid3X3, 
      path: '/pharmacy',
      activeColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'pharmacy-search', 
      label: 'Search', 
      icon: Search, 
      path: '/pharmacy/search',
      activeColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'pharmacy-categories', 
      label: 'Categories', 
      icon: Pill, 
      path: '/pharmacy',
      activeColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: 'categories'
    },
    { 
      id: 'pharmacy-orders', 
      label: 'My Orders', 
      icon: Package, 
      path: '/pharmacy/orders',
      activeColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'pharmacy-cart', 
      label: 'Cart', 
      icon: ShoppingCart, 
      path: '/pharmacy/cart',
      activeColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const navItems = isPharmacySection ? pharmacyNavItems : defaultNavItems;

  const isActive = (path, action) => {
    if (action) {
      // For pharmacy actions, check if we're on pharmacy page
      return location.pathname === '/pharmacy';
    }
    return location.pathname === path;
  };

  const handleNavigation = (item) => {
    if (item.action) {
      // Handle pharmacy-specific actions
      switch (item.action) {
        case 'categories':
          // Scroll to categories section
          navigate('/pharmacy');
          setTimeout(() => {
            const categoriesSection = document.querySelector('[data-section="categories"]');
            if (categoriesSection) categoriesSection.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          break;
        default:
          navigate(item.path);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-pb z-40">
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const active = isActive(item.path, item.action);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                active 
                  ? `${item.activeColor} ${item.bgColor}` 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;