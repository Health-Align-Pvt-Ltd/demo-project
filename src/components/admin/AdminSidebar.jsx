// Admin Sidebar Component
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  FileText, 
  Truck, 
  Microscope, 
  Car,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle,
  History
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [openMenus, setOpenMenus] = useState({});

  // Toggle submenu visibility
  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Check if a menu item is active
  const isMenuItemActive = (path, subItems = []) => {
    // If the item has a direct path, check if it matches current location
    if (path && (location.pathname === path || location.pathname.startsWith(path + '/'))) {
      return true;
    }
    
    // If the item has subitems, check if any subitem is active
    if (subItems && subItems.length > 0) {
      return subItems.some(subItem => 
        subItem.path && (location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/'))
      );
    }
    
    return false;
  };

  // Check if a submenu is active
  const isSubMenuActive = (menuId) => {
    return openMenus[menuId];
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'profile', name: 'Profile', icon: User, path: '/admin/profile' },
    {
      id: 'medicines',
      name: 'Medicines',
      icon: Package,
      path: null, // No direct path, will toggle submenu
      subItems: [
        { id: 'add-medicine', name: 'Add New', icon: Plus, path: '/admin/medicines/add-new/form' },
        { id: 'pending-medicines', name: 'Pending Records', icon: Clock, path: '/admin/medicines/pending-records' },
        { id: 'approved-medicines', name: 'Approved Records', icon: CheckCircle, path: '/admin/medicines/approved-records' },
        { id: 'medicine-history', name: 'Record History', icon: History, path: '/admin/medicines/record-history' }
      ]
    },
    {
      id: 'categories',
      name: 'Categories',
      icon: ClipboardList,
      path: null, // No direct path, will toggle submenu
      subItems: [
        { id: 'add-category', name: 'Add New', icon: Plus, path: '/admin/categories/add-new/form' },
        { id: 'pending-categories', name: 'Pending Records', icon: Clock, path: '/admin/categories/pending-records' },
        { id: 'approved-categories', name: 'Approved Records', icon: CheckCircle, path: '/admin/categories/approved-records' },
        { id: 'category-history', name: 'Record History', icon: History, path: '/admin/categories/record-history' }
      ]
    },
    {
      id: 'diseases',
      name: 'Diseases',
      icon: FileText,
      path: null, // No direct path, will toggle submenu
      subItems: [
        { id: 'add-disease', name: 'Add New', icon: Plus, path: '/admin/diseases/add-new/form' },
        { id: 'pending-diseases', name: 'Pending Records', icon: Clock, path: '/admin/diseases/pending-records' },
        { id: 'approved-diseases', name: 'Approved Records', icon: CheckCircle, path: '/admin/diseases/approved-records' },
        { id: 'disease-history', name: 'Record History', icon: History, path: '/admin/diseases/record-history' }
      ]
    },
    {
      id: 'pharmacies',
      name: 'Pharmacies',
      icon: Truck,
      path: null, // No direct path, will toggle submenu
      subItems: [
        { id: 'add-pharmacy', name: 'Add New', icon: Plus, path: '/admin/pharmacies/add-new/form' },
        { id: 'pending-pharmacies', name: 'Pending Records', icon: Clock, path: '/admin/pharmacies/pending-records' },
        { id: 'approved-pharmacies', name: 'Approved Records', icon: CheckCircle, path: '/admin/pharmacies/approved-records' },
        { id: 'pharmacy-history', name: 'Record History', icon: History, path: '/admin/pharmacies/record-history' }
      ]
    },
    {
      id: 'labs',
      name: 'Labs',
      icon: Microscope,
      path: null, // No direct path, will toggle submenu
      subItems: [
        { id: 'add-lab', name: 'Add New', icon: Plus, path: '/admin/labs/add-new/form' },
        { id: 'pending-labs', name: 'Pending Records', icon: Clock, path: '/admin/labs/pending-records' },
        { id: 'approved-labs', name: 'Approved Records', icon: CheckCircle, path: '/admin/labs/approved-records' },
        { id: 'lab-history', name: 'Record History', icon: History, path: '/admin/labs/record-history' }
      ]
    },
    {
      id: 'ambulances',
      name: 'Ambulances',
      icon: Car,
      path: null, // No direct path, will toggle submenu
      subItems: [
        { id: 'add-ambulance', name: 'Add New', icon: Plus, path: '/admin/ambulances/add-new/form' },
        { id: 'pending-ambulances', name: 'Pending Records', icon: Clock, path: '/admin/ambulances/pending-records' },
        { id: 'approved-ambulances', name: 'Approved Records', icon: CheckCircle, path: '/admin/ambulances/approved-records' },
        { id: 'ambulance-history', name: 'Record History', icon: History, path: '/admin/ambulances/record-history' }
      ]
    },
    {
      id: 'users',
      name: 'Users',
      icon: User,
      path: null, // No direct path, will toggle submenu
      subItems: [
        { id: 'add-user', name: 'Add New', icon: Plus, path: '/admin/users/add-new/form' },
        { id: 'pending-users', name: 'Pending Records', icon: Clock, path: '/admin/users/pending-records' },
        { id: 'approved-users', name: 'Approved Records', icon: CheckCircle, path: '/admin/users/approved-records' },
        { id: 'user-history', name: 'Record History', icon: History, path: '/admin/users/record-history' }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen fixed left-0 top-0 bottom-0 z-10">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">HealthAlign Admin</h1>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isMenuOpen = isSubMenuActive(item.id);
            const isItemActive = isMenuItemActive(item.path, item.subItems);
            
            return (
              <li key={item.id}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                      isItemActive 
                        ? 'bg-gray-900 text-white border-l-4 border-green-500' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={(e) => {
                      if (hasSubItems) {
                        e.preventDefault();
                        toggleMenu(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                    {hasSubItems && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                ) : (
                  <div
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                      isItemActive 
                        ? 'bg-gray-900 text-white border-l-4 border-green-500' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => {
                      if (hasSubItems) {
                        toggleMenu(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                    {hasSubItems && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                )}
                
                {hasSubItems && (
                  <ul className={`pl-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'}`}>
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubItemActive = isMenuItemActive(subItem.path);
                      
                      return (
                        <li key={subItem.id}>
                          <Link
                            to={subItem.path}
                            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                              isSubItemActive 
                                ? 'text-green-400 border-l-2 border-green-400' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <SubIcon className="w-4 h-4 mr-2" />
                            {subItem.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;