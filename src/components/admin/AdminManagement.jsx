// Generic Admin Management Component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { formatAdminDate, getStatusBadgeClass } from '../../utils/adminUtils';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  History, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminManagement = () => {
  const { entityType, action } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // If user is not admin, redirect to dashboard
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Mock data for different entity types
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockData(entityType, action);
      setItems(mockData);
      setLoading(false);
    }, 500);
  }, [entityType, action]);

  const generateMockData = (type, action) => {
    const baseData = {
      medicines: [
        { id: 1, name: 'Paracetamol', category: 'Pain Relief', status: 'approved', createdAt: '2023-01-15' },
        { id: 2, name: 'Amoxicillin', category: 'Antibiotics', status: 'pending', createdAt: '2023-02-20' },
        { id: 3, name: 'Lisinopril', category: 'Blood Pressure', status: 'approved', createdAt: '2023-03-10' }
      ],
      categories: [
        { id: 1, name: 'Pain Relief', itemCount: 25, status: 'approved', createdAt: '2023-01-05' },
        { id: 2, name: 'Antibiotics', itemCount: 18, status: 'pending', createdAt: '2023-02-15' },
        { id: 3, name: 'Vitamins', itemCount: 32, status: 'approved', createdAt: '2023-03-01' }
      ],
      diseases: [
        { id: 1, name: 'Diabetes', category: 'Metabolic', status: 'approved', createdAt: '2023-01-10' },
        { id: 2, name: 'Hypertension', category: 'Cardiovascular', status: 'pending', createdAt: '2023-02-25' },
        { id: 3, name: 'Asthma', category: 'Respiratory', status: 'approved', createdAt: '2023-03-12' }
      ],
      pharmacies: [
        { id: 1, name: 'City Pharmacy', location: 'Downtown', status: 'approved', createdAt: '2023-01-08' },
        { id: 2, name: 'HealthPlus', location: 'Suburb', status: 'pending', createdAt: '2023-02-18' },
        { id: 3, name: 'MediCare', location: 'Central', status: 'approved', createdAt: '2023-03-05' }
      ],
      labs: [
        { id: 1, name: 'City Diagnostics', location: 'Downtown', status: 'approved', createdAt: '2023-01-12' },
        { id: 2, name: 'Health Labs', location: 'Suburb', status: 'pending', createdAt: '2023-02-22' },
        { id: 3, name: 'MediTest', location: 'Central', status: 'approved', createdAt: '2023-03-08' }
      ],
      ambulances: [
        { id: 1, name: 'City Ambulance', location: 'Downtown', status: 'approved', createdAt: '2023-01-14' },
        { id: 2, name: 'Health Rescue', location: 'Suburb', status: 'pending', createdAt: '2023-02-24' },
        { id: 3, name: 'MediTrans', location: 'Central', status: 'approved', createdAt: '2023-03-07' }
      ]
    };

    // Filter based on action
    if (action === 'pending-records') {
      return (baseData[type] || []).filter(item => item.status === 'pending');
    } else if (action === 'approved-records') {
      return (baseData[type] || []).filter(item => item.status === 'approved');
    } else if (action === 'record-history') {
      return (baseData[type] || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return baseData[type] || [];
  };

  const getEntityTitle = (type) => {
    const titles = {
      medicines: 'Medicines',
      categories: 'Categories',
      diseases: 'Diseases',
      pharmacies: 'Pharmacies',
      labs: 'Labs',
      ambulances: 'Ambulances'
    };
    return titles[type] || type;
  };

  const getActionTitle = (action) => {
    const titles = {
      'add-new': 'Add New',
      'pending-records': 'Pending Records',
      'approved-records': 'Approved Records',
      'record-history': 'Record History'
    };
    return titles[action] || action;
  };

  const handleAddNew = () => {
    // Navigate to add new form
    navigate(`/admin/${entityType}/add-new/form`);
  };

  const handleViewDetails = (item) => {
    // Navigate to item details
    console.log('View details for:', item);
  };

  const handleEdit = (item) => {
    // Navigate to edit form
    console.log('Edit item:', item);
  };

  const handleDelete = (item) => {
    // Delete item
    console.log('Delete item:', item);
  };

  const filteredItems = items.filter(item => 
    Object.values(item).some(val => 
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <AdminHeader />
        
        <main className="flex-1 pt-16 pb-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center my-6">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                  {getEntityTitle(entityType)} - {getActionTitle(action)}
                </h1>
                
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {entityType === 'medicines' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          </>
                        )}
                        {entityType === 'categories' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Count</th>
                          </>
                        )}
                        {entityType === 'diseases' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          </>
                        )}
                        {['pharmacies', 'labs', 'ambulances'].includes(entityType) && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          </>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            {entityType === 'medicines' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                              </>
                            )}
                            {entityType === 'categories' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.itemCount}</td>
                              </>
                            )}
                            {entityType === 'diseases' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                              </>
                            )}
                            {['pharmacies', 'labs', 'ambulances'].includes(entityType) && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                              </>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatAdminDate(item.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewDetails(item)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="100%" className="px-6 py-4 text-center text-sm text-gray-500">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminManagement;