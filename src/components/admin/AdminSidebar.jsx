// Admin Sidebar Component
import React from 'react';
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
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'profile', name: 'Profile', icon: User, path: '/admin/profile' },
    { id: 'medicines', name: 'Medicines', icon: Package, path: '/admin/medicines' },
    { id: 'categories', name: 'Categories', icon: ClipboardList, path: '/admin/categories' },
    { id: 'diseases', name: 'Diseases', icon: FileText, path: '/admin/diseases' },
    { id: 'pharmacies', name: 'Pharmacies', icon: Truck, path: '/admin/pharmacies' },
    { id: 'labs', name: 'Labs', icon: Microscope, path: '/admin/labs' },
    { id: 'ambulances', name: 'Ambulances', icon: Car, path: '/admin/ambulances' }
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
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-gray-900 text-white border-l-4 border-green-500' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
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