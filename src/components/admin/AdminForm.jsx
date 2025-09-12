// Admin Form Component for Adding/Editing Entities
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { ChevronLeft, Save, X } from 'lucide-react';

const AdminForm = () => {
  const { entityType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const getEntityTitle = (type) => {
    const titles = {
      medicines: 'Medicine',
      categories: 'Category',
      diseases: 'Disease',
      pharmacies: 'Pharmacy',
      labs: 'Lab',
      ambulances: 'Ambulance'
    };
    return titles[type] || type;
  };

  const getFormFields = (type) => {
    const fields = {
      medicines: [
        { name: 'name', label: 'Medicine Name', type: 'text', required: true },
        { name: 'genericName', label: 'Generic Name', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Pain Relief', 'Antibiotics', 'Vitamins', 'Cardiovascular', 'Respiratory'] },
        { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'stock', label: 'Stock Quantity', type: 'number' },
        { name: 'requiresPrescription', label: 'Requires Prescription', type: 'checkbox' }
      ],
      categories: [
        { name: 'name', label: 'Category Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'isActive', label: 'Active', type: 'checkbox' }
      ],
      diseases: [
        { name: 'name', label: 'Disease Name', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Infectious', 'Chronic', 'Genetic', 'Autoimmune', 'Degenerative'] },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'symptoms', label: 'Symptoms', type: 'textarea' },
        { name: 'treatment', label: 'Treatment', type: 'textarea' }
      ],
      pharmacies: [
        { name: 'name', label: 'Pharmacy Name', type: 'text', required: true },
        { name: 'address', label: 'Address', type: 'textarea' },
        { name: 'phone', label: 'Phone Number', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'licenseNumber', label: 'License Number', type: 'text' },
        { name: 'isActive', label: 'Active', type: 'checkbox' }
      ],
      labs: [
        { name: 'name', label: 'Lab Name', type: 'text', required: true },
        { name: 'address', label: 'Address', type: 'textarea' },
        { name: 'phone', label: 'Phone Number', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'licenseNumber', label: 'License Number', type: 'text' },
        { name: 'testsOffered', label: 'Tests Offered', type: 'textarea' },
        { name: 'isActive', label: 'Active', type: 'checkbox' }
      ],
      ambulances: [
        { name: 'name', label: 'Service Name', type: 'text', required: true },
        { name: 'provider', label: 'Provider', type: 'text' },
        { name: 'phone', label: 'Phone Number', type: 'text' },
        { name: 'vehicleNumber', label: 'Vehicle Number', type: 'text' },
        { name: 'licenseNumber', label: 'License Number', type: 'text' },
        { name: 'available247', label: 'Available 24/7', type: 'checkbox' },
        { name: 'isActive', label: 'Active', type: 'checkbox' }
      ]
    };
    return fields[type] || [];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      // Navigate back to the entity management page
      navigate(`/admin/${entityType}/approved-records`);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/${entityType}/approved-records`);
  };

  const fields = getFormFields(entityType);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <AdminHeader />
        
        <main className="flex-1 pt-16 pb-6">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center my-6">
              <button
                onClick={() => navigate(`/admin/${entityType}/approved-records`)}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span>Back to {getEntityTitle(entityType)}</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Add New {getEntityTitle(entityType)}
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required={field.required}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required={field.required}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name={field.name}
                            checked={formData[field.name] || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            {field.label}
                          </label>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminForm;