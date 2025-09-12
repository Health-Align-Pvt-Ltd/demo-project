// Modern Mobile Dashboard Component - MyJio Style
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../common/PageLayout';
import { 
  Stethoscope, 
  Truck, 
  Droplet, 
  Pill, 
  User, 
  Bell, 
  Menu,
  X,
  Calendar,
  Clock,
  Heart,
  Activity,
  Users,
  Shield,
  ChevronRight,
  Plus,
  Search,
  Home,
  BookOpen,
  Settings,
  Phone,
  MapPin,
  Star,
  Zap,
  Wallet,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate loading notifications
    setNotifications([
      { id: 1, message: 'Appointment confirmed for tomorrow 2 PM', type: 'appointment', time: '2h ago' },
      { id: 2, message: 'Medicine order delivered successfully', type: 'medicine', time: '1d ago' },
      { id: 3, message: 'Health checkup reminder', type: 'health', time: '3d ago' }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Doctor Consultation',
      subtitle: 'Book appointment',
      icon: Stethoscope,
      gradient: 'from-blue-400 to-blue-600',
      path: '/consultation',
      badge: 'Online'
    },
    {
      title: 'Emergency',
      subtitle: 'Ambulance booking',
      icon: Truck,
      gradient: 'from-red-400 to-red-600',
      path: '/ambulance',
      badge: '24/7'
    },
    {
      title: 'Blood Bank',
      subtitle: 'Request blood',
      icon: Droplet,
      gradient: 'from-pink-400 to-pink-600',
      path: '/blood-request',
      badge: 'Urgent'
    },
    {
      title: 'Pharmacy',
      subtitle: 'Order medicines',
      icon: Pill,
      gradient: 'from-green-400 to-green-600',
      path: '/pharmacy',
      badge: 'Fast'
    }
  ];

  const services = [
    { title: 'Lab Tests', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100', path: '/lab-tests' },
    { title: 'Upload Prescription', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', path: '/upload-prescription' },
    { title: 'My Wallet', icon: Wallet, color: 'text-green-600', bg: 'bg-green-100', path: '/wallet' },
    { title: 'Health Records', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100', path: '/health-records' },
    { title: 'Insurance', icon: Shield, color: 'text-orange-600', bg: 'bg-orange-100', path: '/insurance' },
    { title: 'Emergency', icon: Phone, color: 'text-red-600', bg: 'bg-red-100', path: '/emergency' }
  ];

  const recentActivities = [
    { 
      title: 'Consultation Completed', 
      subtitle: 'Dr. Sarah Johnson - Cardiology', 
      time: '2 hours ago',
      icon: Stethoscope,
      color: 'bg-blue-500'
    },
    { 
      title: 'Medicine Delivered', 
      subtitle: 'Order #12345 - Blood pressure tablets', 
      time: '1 day ago',
      icon: Pill,
      color: 'bg-green-500'
    },
    { 
      title: 'Blood Donation', 
      subtitle: 'Thank you for saving lives!', 
      time: '3 days ago',
      icon: Droplet,
      color: 'bg-red-500'
    }
  ];

  const handleNotificationClick = () => {
    // Handle notification click - could open notification panel
    console.log('Notifications clicked');
  };

  const handleSearchClick = () => {
    // Handle search click - could open search overlay
    console.log('Search clicked');
  };

  const customRightActions = (
    <>
      <button 
        onClick={handleSearchClick}
        className="p-2 rounded-full hover:bg-white/20 transition-colors"
      >
        <Search className="w-5 h-5 text-white" />
      </button>
      <button 
        onClick={handleNotificationClick}
        className="relative p-2 rounded-full hover:bg-white/20 transition-colors"
      >
        <Bell className="w-5 h-5 text-white" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
    </>
  );

  return (
    <PageLayout 
      title={`Hi, ${userData?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'User'}!`}
      subtitle="Stay healthy, stay happy"
      showBack={false}
      showDrawer={true}
      backgroundColor="bg-gradient-to-r from-blue-600 to-blue-700"
      textColor="text-white"
      rightActions={customRightActions}
      className="bg-gray-50"
    >
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900 font-semibold text-sm">
              Welcome back, {userData?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-gray-600 text-xs">
              How are you feeling today? Let's keep track of your health.
            </p>
          </div>
        </div>
      </div>

      {/* Health Score Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Health Score</p>
            <p className="text-gray-900 text-2xl font-bold">85%</p>
            <p className="text-green-600 text-xs flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Excellent
            </p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#10b981"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${85 * 1.76} 176`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
            <button className="text-blue-600 text-xs font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                className={`relative rounded-2xl p-4 cursor-pointer transform transition-transform active:scale-95 bg-gradient-to-br ${action.gradient}`}
              >
                <div className="flex flex-col h-24">
                  <div className="flex items-center justify-between mb-2">
                    <action.icon className="w-6 h-6 text-white" />
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {action.badge}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-xs mb-1">{action.title}</h3>
                    <p className="text-white/80 text-xs">{action.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">All Services</h2>
            <button className="text-blue-600 text-xs font-medium">
              Explore
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {services.map((service, index) => (
              <div 
                key={index} 
                onClick={() => service.path && navigate(service.path)}
                className="flex flex-col items-center space-y-2 cursor-pointer"
              >
                <div className={`w-12 h-12 ${service.bg} rounded-2xl flex items-center justify-center`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <span className="text-xs text-gray-600 text-center">{service.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Recent Activities</h2>
            <button className="text-blue-600 text-xs font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-xs text-gray-500">{activity.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{activity.time}</p>
                  <button 
                    onClick={() => navigate('/consultation')}
                    className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Tips Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1 text-sm">Daily Health Tip</h3>
              <p className="text-xs text-white/90">Drink at least 8 glasses of water daily to stay hydrated and healthy.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;