// Admin Form Component for Adding/Editing Entities
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { firestoreService } from '../../firebase/firestoreService';
import imageCompression from 'browser-image-compression';
import { ChevronLeft, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

const AdminForm = () => {
  const { entityType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const getEntityTitle = (type) => {
    const titles = {
      medicines: 'Medicine',
      categories: 'Category',
      diseases: 'Disease',
      pharmacies: 'Pharmacy',
      labs: 'Lab',
      ambulances: 'Ambulance',
      users: 'User'
    };
    return titles[type] || type;
  };

  const getCollectionName = (type) => {
    const collections = {
      medicines: 'products',
      categories: 'productCategories',
      diseases: 'diseases',
      pharmacies: 'pharmacy',
      labs: 'labs',
      ambulances: 'ambulance',
      users: 'users'
    };
    return collections[type] || type;
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
        { name: 'stockCount', label: 'Stock Quantity', type: 'number' },
        { name: 'requiresPrescription', label: 'Requires Prescription', type: 'checkbox' },
        { name: 'inStock', label: 'In Stock', type: 'checkbox' }
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
        { name: 'isOpen', label: 'Is Open', type: 'checkbox' },
        { name: 'rating', label: 'Rating', type: 'number' }
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
        { name: 'vehicleNumber', label: 'Vehicle Number', type: 'text', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['Basic Life Support', 'Advanced Life Support', 'Neonatal', 'Cardiac'] },
        { name: 'provider', label: 'Provider', type: 'text' },
        { name: 'phone', label: 'Phone Number', type: 'text' },
        { name: 'licenseNumber', label: 'License Number', type: 'text' },
        { name: 'isAvailable', label: 'Available', type: 'checkbox' },
        { name: 'rating', label: 'Rating', type: 'number' }
      ],
      users: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
        { name: 'userType', label: 'User Type', type: 'select', options: ['patient', 'doctor', 'admin'], required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'suspended'], required: true },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other', 'prefer-not-to-say'] },
        { name: 'address', label: 'Address', type: 'textarea' }
      ]
    };
    
    // Add image field for medicines
    if (type === 'medicines') {
      fields.medicines.splice(4, 0, { name: 'image', label: 'Medicine Image', type: 'file' });
    }
    
    return fields[type] || [];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle file input separately
    if (type === 'file' && name === 'image') {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Please upload a valid image file (JPEG, PNG, etc.)');
          return;
        }
        
        // Remove file size limit - only validate for extremely large files (50MB+)
        if (file.size > 50 * 1024 * 1024) { // 50MB limit instead of 5MB
          setError('File size is too large. Please select an image smaller than 50MB.');
          return;
        }
        
        setImage(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
      return;
    }
    
    setFormData(prev => {
      let newValue;
      
      if (type === 'checkbox') {
        newValue = checked;
      } else if (type === 'number') {
        newValue = value === '' ? '' : Number(value);
      } else {
        newValue = value;
      }
      
      return {
        ...prev,
        [name]: newValue
      };
    });
  };

  const compressImage = async (file) => {
    // As per requirements, we're not compressing images anymore
    // Just return the original file
    console.log('Skipping image compression as requested');
    return file;
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      // Use the original file without compression
      const uploadFile = await compressImage(file);
      
      // Create FormData for PHP API upload
      const formData = new FormData();
      formData.append('doc', uploadFile);
      formData.append('UPLOAD_DOC', 'true'); // Add action parameter
      
      // Upload to PHP API
      const response = await fetch('https://api.devsecit.com/upload/index.php', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image to server');
      }
      
      const result = await response.json();
      
      if (result.err === "false" && result.success === "true") {
        return result.uri; // Return the URI from the PHP API response
      } else {
        throw new Error('Failed to upload image: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for saving
      const collectionName = getCollectionName(entityType);
      let dataToSave = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Handle image upload for medicines
      if (entityType === 'medicines' && image) {
        try {
          const imageURL = await uploadImage(image);
          dataToSave.imageURL = imageURL;
        } catch (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
      }

      // Special handling for certain fields
      if (entityType === 'medicines') {
        // Ensure price is a number
        if (dataToSave.price) {
          dataToSave.price = Number(dataToSave.price);
        }
        // Ensure stockCount is a number
        if (dataToSave.stockCount !== undefined && dataToSave.stockCount !== '') {
          dataToSave.stockCount = Number(dataToSave.stockCount);
        } else {
          dataToSave.stockCount = 0; // Default to 0 if not provided
        }
      }

      // Special handling for users
      if (entityType === 'users') {
        // Set default values for users if not provided
        dataToSave.profileCompleted = dataToSave.profileCompleted || false;
        dataToSave.isVerified = dataToSave.isVerified || true;
      }

      console.log('Saving to collection:', collectionName, 'Data:', dataToSave);
      
      // Save to Firebase
      const result = await firestoreService.create(collectionName, dataToSave);
      
      if (result.success) {
        console.log('Form submitted successfully:', result);
        // Navigate back to the entity management page
        navigate(`/admin/${entityType}/approved-records`);
      } else {
        throw new Error(result.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Failed to save data. Please try again.');
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
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
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
                      ) : field.type === 'file' ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF (MAX. 50MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                name={field.name}
                                onChange={handleChange}
                                accept="image/*"
                                className="hidden"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Images will be uploaded directly without compression. 
                            For best results, optimize images before uploading.
                          </p>
                          {imagePreview && (
                            <div className="mt-2">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                              />
                            </div>
                          )}
                          {uploading && (
                            <div className="text-sm text-gray-500">
                              Uploading image...
                            </div>
                          )}
                        </div>
                      ) : field.type === 'number' ? (
                        <input
                          type="number"
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required={field.required}
                          step={field.name === 'price' || field.name === 'rating' ? '0.01' : '1'}
                          min={field.name === 'price' || field.name === 'rating' ? '0' : undefined}
                        />
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
                    disabled={loading || uploading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading || uploading ? (
                      uploading ? 'Uploading Image...' : 'Saving...'
                    ) : 'Save'}
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