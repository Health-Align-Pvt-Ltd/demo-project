// Admin Dashboard Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminStats from './AdminStats';
import { 
  Package, 
  ClipboardList, 
  FileText, 
  Truck, 
  Microscope, 
  Car, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const adminSections = [
    {
      id: 'medicines',
      title: 'Medicines',
      icon: Package,
      color: 'bg-blue-500',
      options: ['Add New', 'Pending Records', 'Approved Records', 'Record History']
    },
    {
      id: 'categories',
      title: 'Categories',
      icon: ClipboardList,
      color: 'bg-green-500',
      options: ['Add New', 'Pending Records', 'Approved Records', 'Record History']
    },
    {
      id: 'diseases',
      title: 'Diseases',
      icon: FileText,
      color: 'bg-purple-500',
      options: ['Add New', 'Pending Records', 'Approved Records', 'Record History']
    },
    {
      id: 'pharmacies',
      title: 'Pharmacies',
      icon: Truck,
      color: 'bg-orange-500',
      options: ['Add New', 'Pending Records', 'Approved Records', 'Record History']
    },
    {
      id: 'labs',
      title: 'Labs',
      icon: Microscope,
      color: 'bg-red-500',
      options: ['Add New', 'Pending Records', 'Approved Records', 'Record History']
    },
    {
      id: 'ambulances',
      title: 'Ambulances',
      icon: Car,
      color: 'bg-indigo-500',
      options: ['Add New', 'Pending Records', 'Approved Records', 'Record History']
    }
  ];

  const handleSectionClick = (sectionId, option) => {
    // Navigate to the specific section with the selected option
    navigate(`/admin/${sectionId}/${option.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <AdminHeader />
        
        <main className="flex-1 pt-16 pb-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 mt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Admin</h1>
              <p className="text-gray-600">Manage all aspects of the HealthAlign platform</p>
            </div>

            <AdminStats />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className={`${section.color} p-4`}>
                      <div className="flex items-center space-x-3">
                        <Icon className="w-8 h-8 text-white" />
                        <h2 className="text-xl font-bold text-white">{section.title}</h2>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-3">
                        {section.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleSectionClick(section.id, option)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-gray-700">{option}</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;