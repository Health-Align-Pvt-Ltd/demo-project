// Admin Statistics Component
import React from 'react';
import { 
  Package, 
  ClipboardList, 
  FileText, 
  Truck, 
  Microscope, 
  Car,
  Users,
  ShoppingCart,
  CreditCard
} from 'lucide-react';

const AdminStats = () => {
  const stats = [
    { name: 'Total Medicines', value: '1,248', icon: Package, color: 'bg-blue-500' },
    { name: 'Categories', value: '42', icon: ClipboardList, color: 'bg-green-500' },
    { name: 'Diseases', value: '126', icon: FileText, color: 'bg-purple-500' },
    { name: 'Pharmacies', value: '89', icon: Truck, color: 'bg-orange-500' },
    { name: 'Labs', value: '56', icon: Microscope, color: 'bg-red-500' },
    { name: 'Ambulances', value: '34', icon: Car, color: 'bg-indigo-500' },
    { name: 'Users', value: '12,489', icon: Users, color: 'bg-pink-500' },
    { name: 'Orders Today', value: '142', icon: ShoppingCart, color: 'bg-yellow-500' },
    { name: 'Revenue', value: '₹2,48,900', icon: CreditCard, color: 'bg-teal-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;