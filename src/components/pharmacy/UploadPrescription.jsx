// Upload Prescription Page Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import toast from 'react-hot-toast';
import { 
  Upload, 
  Camera, 
  FileText, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Store, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Package, 
  CreditCard,
  X,
  Search,
  Filter,
  Navigation,
  Award,
  Users,
  ThumbsUp
} from 'lucide-react';

const UploadPrescription = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(false);

  // Sample pharmacy data
  const pharmacies = [
    {
      id: '1',
      name: 'Apollo Pharmacy',
      address: '123 Main Street, Downtown Area, Mumbai',
      distance: '0.5 km',
      rating: 4.8,
      reviewsCount: 2847,
      isOpen: true,
      closingTime: '22:00',
      deliveryTime: '30-45 mins',
      services: ['Prescription', 'Home Delivery', '24/7 Support'],
      specialOffers: ['Free delivery on orders above ₹500', '10% discount on generic medicines'],
      phone: '+91 98765 43210',
      verified: true,
      fastDelivery: true,
      prescriptionDelivery: true,
      cashOnDelivery: true,
      image: '/api/placeholder/80/80'
    },
    {
      id: '2',
      name: 'MedPlus Pharmacy',
      address: '456 Business Park, Sector 5, Mumbai',
      distance: '1.2 km',
      rating: 4.6,
      reviewsCount: 1834,
      isOpen: true,
      closingTime: '21:30',
      deliveryTime: '45-60 mins',
      services: ['Prescription', 'Online Consultation', 'Medicine Refill'],
      specialOffers: ['Buy 2 Get 1 Free on vitamins', 'Same day delivery available'],
      phone: '+91 98765 43211',
      verified: true,
      fastDelivery: false,
      prescriptionDelivery: true,
      cashOnDelivery: true,
      image: '/api/placeholder/80/80'
    },
    {
      id: '3',
      name: 'Wellness Pharmacy',
      address: '789 Health Complex, Central Mumbai',
      distance: '2.1 km',
      rating: 4.4,
      reviewsCount: 967,
      isOpen: false,
      closingTime: '20:00',
      deliveryTime: '60-90 mins',
      services: ['Prescription', 'Health Checkup', 'Medicine Delivery'],
      specialOffers: ['Free health consultation with prescription'],
      phone: '+91 98765 43212',
      verified: true,
      fastDelivery: false,
      prescriptionDelivery: true,
      cashOnDelivery: false,
      image: '/api/placeholder/80/80'
    },
    {
      id: '4',
      name: '1mg Quick Pharmacy',
      address: '321 Express Lane, Andheri, Mumbai',
      distance: '3.5 km',
      rating: 4.7,
      reviewsCount: 3456,
      isOpen: true,
      closingTime: '23:59',
      deliveryTime: '20-30 mins',
      services: ['24/7 Delivery', 'Express Prescription', 'Emergency Medicine'],
      specialOffers: ['24/7 delivery available', 'Express delivery in 20 mins'],
      phone: '+91 98765 43213',
      verified: true,
      fastDelivery: true,
      prescriptionDelivery: true,
      cashOnDelivery: true,
      image: '/api/placeholder/80/80'
    },
    {
      id: '5',
      name: 'Guardian Pharmacy',
      address: '654 Care Center, Bandra, Mumbai',
      distance: '4.2 km',
      rating: 4.3,
      reviewsCount: 1245,
      isOpen: true,
      closingTime: '20:30',
      deliveryTime: '40-60 mins',
      services: ['Prescription', 'Medicine Counseling', 'Health Products'],
      specialOffers: ['Senior citizen discount 15%', 'Free medicine counseling'],
      phone: '+91 98765 43214',
      verified: false,
      fastDelivery: false,
      prescriptionDelivery: true,
      cashOnDelivery: true,
      image: '/api/placeholder/80/80'
    }
  ];

  // Filter pharmacies based on search and filters
  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' ||
                         (filterBy === 'open' && pharmacy.isOpen) ||
                         (filterBy === 'fast' && pharmacy.fastDelivery) ||
                         (filterBy === 'verified' && pharmacy.verified);
    
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid file type. Please upload images or PDF files.`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Please upload files smaller than 10MB.`);
        return false;
      }
      
      return true;
    });

    setPrescriptionFiles(prev => [...prev, ...validFiles]);
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) uploaded successfully!`);
    }
  };

  const removeFile = (index) => {
    setPrescriptionFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setCurrentStep(2);
    toast.success(`${pharmacy.name} selected!`);
  };

  const handlePrescriptionSubmit = async () => {
    if (prescriptionFiles.length === 0) {
      toast.error('Please upload at least one prescription image');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);

    try {
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const prescriptionData = {
        userId: userData.uid,
        pharmacyId: selectedPharmacy.id,
        pharmacyName: selectedPharmacy.name,
        prescriptionFiles: prescriptionFiles.map(file => file.name),
        notes: prescriptionNotes,
        deliveryAddress,
        urgentDelivery,
        status: 'submitted',
        estimatedDelivery: urgentDelivery ? '2-4 hours' : selectedPharmacy.deliveryTime,
        submittedAt: new Date().toISOString()
      };

      // Save prescription data
      const result = await firestoreService.savePrescription(prescriptionData);
      
      if (result.success) {
        toast.success('Prescription submitted successfully!');
        navigate('/prescription-confirmation', { 
          state: { 
            prescriptionId: result.id,
            pharmacy: selectedPharmacy,
            estimatedDelivery: prescriptionData.estimatedDelivery
          } 
        });
      } else {
        throw new Error('Failed to submit prescription');
      }
      
    } catch (error) {
      console.error('Prescription submission error:', error);
      toast.error('Failed to submit prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Pharmacy Selection
  const renderPharmacySelection = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search pharmacies by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Pharmacies' },
            { id: 'open', label: 'Open Now' },
            { id: 'fast', label: 'Fast Delivery' },
            { id: 'verified', label: 'Verified' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterBy(filter.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterBy === filter.id
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pharmacy List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Available Pharmacies ({filteredPharmacies.length})
        </h2>
        
        {filteredPharmacies.map((pharmacy) => (
          <div 
            key={pharmacy.id} 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handlePharmacySelect(pharmacy)}
          >
            <div className="flex items-start space-x-4">
              {/* Pharmacy Image */}
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Store className="w-8 h-8 text-gray-400" />
              </div>

              {/* Pharmacy Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{pharmacy.name}</h3>
                      {pharmacy.verified && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{pharmacy.address}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{pharmacy.rating}</span>
                      <span className="text-xs text-gray-500">({pharmacy.reviewsCount})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{pharmacy.distance}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Delivery Info */}
                <div className="flex items-center space-x-4 mb-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    pharmacy.isOpen 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${pharmacy.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{pharmacy.isOpen ? `Open until ${pharmacy.closingTime}` : 'Closed'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Truck className="w-3 h-3" />
                    <span>{pharmacy.deliveryTime}</span>
                  </div>

                  {pharmacy.fastDelivery && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      <span>Fast</span>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {pharmacy.services.slice(0, 3).map((service, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Special Offers */}
                {pharmacy.specialOffers.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                    <p className="text-xs text-orange-800">
                      💡 {pharmacy.specialOffers[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPharmacies.length === 0 && (
        <div className="text-center py-12">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pharmacies found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );

  // Step 2: Upload Prescription
  const renderPrescriptionUpload = () => (
    <div className="space-y-6">
      {/* Selected Pharmacy Info */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">{selectedPharmacy?.name}</h3>
            <p className="text-sm text-green-700">Selected Pharmacy</p>
          </div>
          <button
            onClick={() => setCurrentStep(1)}
            className="ml-auto text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Change
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Prescription</h3>
        
        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Upload className="w-12 h-12 text-gray-400" />
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Prescription Images
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Take a clear photo or upload scanned copy of your prescription
                </p>
                
                <label className="cursor-pointer inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Choose Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                
                <p className="text-xs text-gray-500 mt-2">
                  Supported: JPG, PNG, PDF (Max 10MB each)
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {prescriptionFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Uploaded Files</h4>
              {prescriptionFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={prescriptionNotes}
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              placeholder="Any special instructions or notes for the pharmacist..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address *
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your complete delivery address..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={2}
              required
            />
          </div>

          {/* Urgent Delivery Option */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <input
              type="checkbox"
              id="urgentDelivery"
              checked={urgentDelivery}
              onChange={(e) => setUrgentDelivery(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="urgentDelivery" className="flex-1">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Urgent Delivery (2-4 hours)</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">Additional charges may apply</p>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handlePrescriptionSubmit}
            disabled={loading || prescriptionFiles.length === 0}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting Prescription...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Submit Prescription</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout 
      title="Upload Prescription"
      subtitle="Select pharmacy and upload your prescription"
      showBack={true}
      backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
      textColor="text-white"
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-medium">1</span>}
              </div>
              <span className="text-sm font-medium">Select Pharmacy</span>
            </div>
            
            <div className={`h-px flex-1 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="text-sm font-medium">Upload Prescription</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderPharmacySelection()}
        {currentStep === 2 && renderPrescriptionUpload()}
      </div>
    </PageLayout>
  );
};

export default UploadPrescription;