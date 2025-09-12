// Blood Request Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import { 
  ArrowLeft, 
  Droplet, 
  MapPin, 
  Phone, 
  Calendar,
  Heart,
  User
} from 'lucide-react';

const BloodRequest = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('request');
  const [loading, setLoading] = useState(false);
  const [bloodRequest, setBloodRequest] = useState({
    patientName: '',
    bloodType: '',
    unitsNeeded: '1',
    urgency: 'normal',
    hospitalName: '',
    contactNumber: '',
    requiredBy: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'critical', label: 'Critical - Within hours', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent - Within 24 hours', color: 'text-orange-600' },
    { value: 'normal', label: 'Normal - Within a week', color: 'text-yellow-600' }
  ];

  // Mock data
  const mockBloodRequests = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      bloodType: 'O+',
      unitsNeeded: '2',
      urgency: 'critical',
      hospitalName: 'City General Hospital',
      contactNumber: '+1 (555) 123-4567'
    }
  ];

  const handleInputChange = (e) => {
    setBloodRequest(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const submitBloodRequest = async () => {
    setLoading(true);
    try {
      const result = await firestoreService.createBloodRequest({
        ...bloodRequest,
        userId: userData.uid,
        status: 'active'
      });
      if (result.success) {
        alert('Blood request submitted successfully!');
      }
    } catch (error) {
      alert('Error submitting blood request');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button onClick={() => navigate('/dashboard')} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blood Request & Donation</h1>
              <p className="text-gray-600">Connect blood donors with those in need</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('request')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'request'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Request Blood
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'browse'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Browse Requests
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Request Blood Tab */}
        {activeTab === 'request' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Blood Request</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={bloodRequest.patientName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type *
                    </label>
                    <select
                      name="bloodType"
                      value={bloodRequest.bloodType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select blood type</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Units Needed *
                    </label>
                    <select
                      name="unitsNeeded"
                      value={bloodRequest.unitsNeeded}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      {[1,2,3,4,5].map(unit => (
                        <option key={unit} value={unit}>{unit} unit{unit > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required By *
                    </label>
                    <input
                      type="date"
                      name="requiredBy"
                      value={bloodRequest.requiredBy}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <div className="space-y-3">
                    {urgencyLevels.map(level => (
                      <label key={level.value} className="flex items-center p-3 border rounded-lg cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value={level.value}
                          checked={bloodRequest.urgency === level.value}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className={`font-medium ${level.color}`}>{level.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={bloodRequest.hospitalName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={bloodRequest.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={submitBloodRequest}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Blood Request'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Browse Requests Tab */}
        {activeTab === 'browse' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Blood Requests</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockBloodRequests.map(request => (
                <div key={request.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.patientName}</h3>
                      <p className="text-sm text-gray-500">{request.hospitalName}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-2">
                        <Droplet className="w-5 h-5 text-red-600 mr-1" />
                        <span className="text-lg font-bold text-red-600">{request.bloodType}</span>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        {request.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Droplet className="w-4 h-4 mr-2" />
                      <span>{request.unitsNeeded} unit{parseInt(request.unitsNeeded) > 1 ? 's' : ''} needed</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(`tel:${request.contactNumber}`)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Contact Hospital
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodRequest;