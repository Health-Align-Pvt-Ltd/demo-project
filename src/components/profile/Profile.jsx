// Profile Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../common/PageLayout';
import { 
  User, 
  Edit3,
  Save,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  FileText,
  Shield,
  Bell,
  Camera,
  Stethoscope,
  Truck,
  Pill,
  Wallet,
  Navigation,
  Settings,
  HelpCircle,
  Star,
  Clock,
  CreditCard,
  Download,
  Share,
  LogOut,
  ChevronRight,
  Activity,
  BarChart3,
  Gift
} from 'lucide-react';

const Profile = () => {
  const { userData, user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: '',
    medications: '',
    medicalConditions: ''
  });

  // Quick links data
  const quickActions = [
    {
      id: 'consultation',
      title: 'Book Consultation',
      description: 'Schedule appointment with doctors',
      icon: Stethoscope,
      color: 'bg-blue-500',
      path: '/consultation'
    },
    {
      id: 'ambulance',
      title: 'Emergency Ambulance',
      description: 'Request immediate medical help',
      icon: Truck,
      color: 'bg-red-500',
      path: '/ambulance'
    },
    {
      id: 'track-ambulance',
      title: 'Track Ambulance',
      description: 'Live ambulance tracking',
      icon: Navigation,
      color: 'bg-orange-500',
      path: '/track-ambulance'
    },
    {
      id: 'medicine',
      title: 'Order Medicine',
      description: 'Get prescription medicines',
      icon: Pill,
      color: 'bg-green-500',
      path: '/medicine'
    },
    {
      id: 'blood-request',
      title: 'Blood Request',
      description: 'Emergency blood donation',
      icon: Heart,
      color: 'bg-pink-500',
      path: '/blood-request'
    },
    {
      id: 'wallet',
      title: 'Wallet & Payments',
      description: 'Manage your transactions',
      icon: Wallet,
      color: 'bg-purple-500',
      path: '/wallet'
    }
  ];

  const accountOptions = [
    {
      id: 'appointments',
      title: 'My Appointments',
      description: 'View booking history',
      icon: Calendar,
      path: '/appointments'
    },
    {
      id: 'medical-records',
      title: 'Medical Records',
      description: 'Health history & reports',
      icon: FileText,
      path: '/medical-records'
    },
    {
      id: 'health-metrics',
      title: 'Health Metrics',
      description: 'Track your health stats',
      icon: Activity,
      path: '/health-metrics'
    },
    {
      id: 'insurance',
      title: 'Insurance & Claims',
      description: 'Manage insurance coverage',
      icon: Shield,
      path: '/insurance'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alerts & reminders',
      icon: Bell,
      path: '/notifications'
    },
    {
      id: 'settings',
      title: 'App Settings',
      description: 'Privacy & preferences',
      icon: Settings,
      path: '/settings'
    }
  ];

  const supportOptions = [
    {
      id: 'help',
      title: 'Help & Support',
      description: '24/7 customer assistance',
      icon: HelpCircle,
      path: '/help'
    },
    {
      id: 'emergency-contacts',
      title: 'Emergency Contacts',
      description: 'Quick access numbers',
      icon: Phone,
      path: '/emergency-contacts'
    },
    {
      id: 'share-app',
      title: 'Share HealthAlign',
      description: 'Invite friends & family',
      icon: Share,
      action: 'share'
    }
  ];

  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || '',
        phoneNumber: userData.phoneNumber || user?.phoneNumber || '',
        email: userData.email || user?.email || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        address: userData.address || '',
        emergencyContact: userData.emergencyContact || '',
        bloodType: userData.bloodType || '',
        allergies: userData.allergies || '',
        medications: userData.medications || '',
        medicalConditions: userData.medicalConditions || ''
      });
    }
  }, [userData, user]);

  const handleNavigation = (path) => {
    if (path.includes('track-ambulance')) {
      navigate('/ambulance', { state: { tab: 'tracking' } });
    } else {
      navigate(path);
    }
  };

  const handleAction = (item) => {
    if (item.action === 'share') {
      if (navigator.share) {
        navigator.share({
          title: 'HealthAlign - Complete Healthcare Solution',
          text: 'Join me on HealthAlign for better healthcare management!',
          url: window.location.origin
        });
      } else {
        navigator.clipboard.writeText(window.location.origin);
        alert('App link copied to clipboard!');
      }
    } else if (item.path) {
      handleNavigation(item.path);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <PageLayout title="Profile">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4 -mx-4">
        <div className="px-4">
          <div className="flex space-x-6 overflow-x-auto">
            {['overview', 'personal', 'medical', 'account'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Overview Tab - Quick Links */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{profileData.name || 'User'}</h2>
                  <p className="text-blue-100">{profileData.phoneNumber}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span className="text-sm">4.8 Health Score</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm">₹250 Cashback</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('personal')}
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action)}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{action.title}</p>
                          <p className="text-xs text-gray-500 truncate">{action.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Management */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account & Settings</h3>
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                {accountOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAction(option)}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-gray-400" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{option.title}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Support & Help */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support & Help</h3>
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                {supportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAction(option)}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-gray-400" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{option.title}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sign Out */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="max-w-2xl mx-auto">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                {editing && (
                  <button className="flex items-center mx-auto px-4 py-2 text-sm text-blue-600 hover:text-blue-800">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </button>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        disabled={true}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Phone number cannot be changed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <select
                      name="bloodType"
                      value={profileData.bloodType}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="">Select Blood Type</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Name and phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!editing}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {editing && (
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Medical History Tab */}
        {activeTab === 'medical' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Medical History</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={profileData.allergies}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={3}
                    placeholder="List any known allergies..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    name="medications"
                    value={profileData.medications}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={3}
                    placeholder="List current medications and dosages..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions
                  </label>
                  <textarea
                    name="medicalConditions"
                    value={profileData.medicalConditions}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={3}
                    placeholder="List any chronic conditions or past medical history..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                {editing && (
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    {loading ? 'Saving...' : 'Save Medical Info'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Appointment Reminders</span>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Health Tips</span>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Two-Factor Authentication</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">Enable</button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Download My Data</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">Download</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Profile;