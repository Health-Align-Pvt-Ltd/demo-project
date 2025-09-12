// Medicine Order Component
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import toast from 'react-hot-toast';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Upload,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  CreditCard,
  FileText,
  Plus,
  Minus,
  Eye,
  X,
  Star,
  Heart,
  Shield,
  Truck
} from 'lucide-react';

const MedicineOrder = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    requiresPrescription: '',
    inStock: true
  });

  // Extended medicines data with more details
  const medicines = [
    {
      id: '1',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      strength: '500mg',
      form: 'Tablet',
      price: 45.50,
      originalPrice: 52.00,
      manufacturer: 'PharmaCorp',
      inStock: true,
      stockCount: 150,
      requiresPrescription: false,
      category: 'Pain Relief',
      description: 'Effective pain relief and fever reducer. Suitable for headaches, muscle aches, and fever reduction.',
      uses: ['Headache', 'Fever', 'Muscle pain', 'Dental pain'],
      sideEffects: ['Nausea', 'Stomach upset', 'Allergic reactions (rare)'],
      dosage: 'Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.',
      warnings: 'Do not exceed recommended dose. Consult doctor if symptoms persist.',
      expiryDate: '2025-12-31',
      rating: 4.5,
      reviews: 1205,
      discount: 12
    },
    {
      id: '2',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      strength: '250mg',
      form: 'Capsule',
      price: 89.99,
      originalPrice: 95.00,
      manufacturer: 'MediLab',
      inStock: true,
      stockCount: 75,
      requiresPrescription: true,
      category: 'Antibiotic',
      description: 'Broad-spectrum antibiotic for bacterial infections. Effective against various bacterial strains.',
      uses: ['Respiratory infections', 'Skin infections', 'Urinary tract infections'],
      sideEffects: ['Nausea', 'Diarrhea', 'Allergic reactions'],
      dosage: 'As prescribed by physician. Usually 250-500mg every 8 hours.',
      warnings: 'Complete the full course as prescribed. Inform doctor of any allergies.',
      expiryDate: '2025-08-15',
      rating: 4.3,
      reviews: 856,
      discount: 5
    },
    {
      id: '3',
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      strength: '1000 IU',
      form: 'Tablet',
      price: 125.99,
      originalPrice: 140.00,
      manufacturer: 'HealthPlus',
      inStock: true,
      stockCount: 200,
      requiresPrescription: false,
      category: 'Vitamin Supplement',
      description: 'Essential vitamin D3 supplement for bone health and immune system support.',
      uses: ['Bone health', 'Immune support', 'Vitamin D deficiency'],
      sideEffects: ['Mild stomach upset (rare)', 'Headache (with overdose)'],
      dosage: 'One tablet daily with food or as directed by healthcare provider.',
      warnings: 'Do not exceed recommended dose. Consult doctor if pregnant or nursing.',
      expiryDate: '2026-03-20',
      rating: 4.7,
      reviews: 2341,
      discount: 10
    },
    {
      id: '4',
      name: 'Omeprazole',
      genericName: 'Omeprazole',
      strength: '20mg',
      form: 'Capsule',
      price: 67.50,
      originalPrice: 75.00,
      manufacturer: 'GastroMed',
      inStock: true,
      stockCount: 120,
      requiresPrescription: false,
      category: 'Gastric Relief',
      description: 'Proton pump inhibitor for acid reflux and gastric ulcer treatment.',
      uses: ['Acid reflux', 'Gastric ulcers', 'GERD', 'Heartburn'],
      sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Stomach pain'],
      dosage: 'One capsule daily before breakfast or as directed.',
      warnings: 'Not recommended for children under 12. Consult doctor for long-term use.',
      expiryDate: '2025-11-10',
      rating: 4.4,
      reviews: 967,
      discount: 10
    },
    {
      id: '5',
      name: 'Cetirizine',
      genericName: 'Cetirizine HCl',
      strength: '10mg',
      form: 'Tablet',
      price: 38.25,
      originalPrice: 45.00,
      manufacturer: 'AllerCare',
      inStock: true,
      stockCount: 180,
      requiresPrescription: false,
      category: 'Antihistamine',
      description: 'Antihistamine for allergy relief including hay fever and urticaria.',
      uses: ['Allergic rhinitis', 'Urticaria', 'Hay fever', 'Skin allergies'],
      sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
      dosage: 'One tablet daily or as directed by physician.',
      warnings: 'May cause drowsiness. Avoid alcohol. Consult doctor if pregnant.',
      expiryDate: '2025-09-30',
      rating: 4.2,
      reviews: 743,
      discount: 15
    },
    {
      id: '6',
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      strength: '75mg',
      form: 'Tablet',
      price: 28.75,
      originalPrice: 32.00,
      manufacturer: 'CardioMed',
      inStock: false,
      stockCount: 0,
      requiresPrescription: false,
      category: 'Cardiovascular',
      description: 'Low-dose aspirin for cardiovascular protection and blood thinning.',
      uses: ['Heart attack prevention', 'Stroke prevention', 'Blood clot prevention'],
      sideEffects: ['Stomach irritation', 'Bleeding risk', 'Nausea'],
      dosage: 'One tablet daily with food or as prescribed.',
      warnings: 'Not suitable for children under 16. Risk of bleeding. Consult doctor.',
      expiryDate: '2025-07-22',
      rating: 4.1,
      reviews: 524,
      discount: 10
    }
  ];

  // Mock orders data
  const mockOrders = [
    {
      id: 'MED001',
      orderNumber: 'MED001',
      status: 'delivered',
      totalAmount: 45.97,
      items: 2,
      orderDate: '2024-01-10',
      deliveryDate: '2024-01-12'
    }
  ];

  // Load user's medicine orders
  useEffect(() => {
    if (userData?.uid) {
      loadMedicineOrders();
    }
  }, [userData]);

  // Check for navigation state to determine active tab
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('medicineCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [location.state]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('medicineCart', JSON.stringify(cart));
  }, [cart]);

  const loadMedicineOrders = async () => {
    try {
      const result = await firestoreService.getMedicineOrders(userData.uid);
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !searchFilters.category || medicine.category === searchFilters.category;
    const matchesPrescription = searchFilters.requiresPrescription === '' || 
                               medicine.requiresPrescription.toString() === searchFilters.requiresPrescription;
    const matchesStock = !searchFilters.inStock || medicine.inStock;
    
    return matchesSearch && matchesCategory && matchesPrescription && matchesStock;
  });

  const addToCart = (medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        const newQuantity = existing.quantity + 1;
        if (newQuantity > medicine.stockCount) {
          toast.error(`Only ${medicine.stockCount} items available in stock`);
          return prev;
        }
        
        toast.success(`Updated ${medicine.name} quantity to ${newQuantity}`, {
          icon: '🛒',
          duration: 2000
        });
        
        return prev.map(item =>
          item.id === medicine.id 
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      toast.success(`${medicine.name} added to cart!`, {
        icon: '✅',
        duration: 2000
      });
      
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prev => {
        const removedItem = prev.find(item => item.id === medicineId);
        if (removedItem) {
          toast.success(`${removedItem.name} removed from cart`, {
            icon: '🗑️',
            duration: 1500
          });
        }
        return prev.filter(item => item.id !== medicineId);
      });
    } else {
      setCart(prev => prev.map(item =>
        item.id === medicineId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const showMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailsModal(true);
  };

  const closeMedicineDetails = () => {
    setShowDetailsModal(false);
    setSelectedMedicine(null);
  };

  const handlePrescriptionUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  // Helper functions for cart calculations
  const getItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalSavings = () => {
    return cart.reduce((total, item) => {
      const savings = (item.originalPrice - item.price) * item.quantity;
      return total + savings;
    }, 0);
  };

  const getCategories = () => {
    const categories = [...new Set(medicines.map(med => med.category))];
    return categories.sort();
  };

  const proceedToPayment = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Navigate to medicine payment gateway
    navigate('/medicine-payment', {
      state: {
        cartItems: cart,
        totalAmount: getTotalAmount(),
        totalSavings: getTotalSavings(),
        itemsCount: getItemsCount(),
        prescriptionFile: prescriptionFile
      }
    });
  };

  return (
    <PageLayout 
      title="Medicine Order"
      showBack={true}
      className="bg-gray-50"
    >

      {/* Header with cart button */}
      <div className="bg-white shadow-sm border-b mb-4 -mx-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Medicine Order</h2>
            <p className="text-sm text-gray-600">Order medicines with doorstep delivery</p>
          </div>
          <button
            onClick={() => setActiveTab('cart')}
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <ShoppingCart className="w-6 h-6" />
            {getItemsCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                {getItemsCount()}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm border-b mb-4 -mx-4">
        <div className="px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Browse Medicines
            </button>
            <button
              onClick={() => setActiveTab('prescription')}
              className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'prescription'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Upload Prescription
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'cart'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Cart ({getItemsCount()})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              My Orders
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Browse Medicines Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Search */}
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search medicines by name, generic name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {/* Filter Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={searchFilters.category}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={searchFilters.requiresPrescription}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, requiresPrescription: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                >
                  <option value="">All Medicines</option>
                  <option value="false">Over the Counter</option>
                  <option value="true">Prescription Required</option>
                </select>
                
                <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg">
                  <input
                    type="checkbox"
                    checked={searchFilters.inStock}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Medicines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMedicines.map(medicine => (
                <div key={medicine.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 cursor-pointer"
                     onClick={() => navigate(`/medicine/${medicine.id}`)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">{medicine.name}</h3>
                        {medicine.discount > 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            {medicine.discount}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{medicine.genericName}</p>
                      <p className="text-xs text-gray-500">{medicine.strength} • {medicine.form}</p>
                      <p className="text-xs text-gray-400 mt-1">{medicine.manufacturer}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-1 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < Math.floor(medicine.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">{medicine.rating}</span>
                        <span className="text-xs text-gray-400">({medicine.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-bold text-green-600">₹{medicine.price}</p>
                        {medicine.originalPrice > medicine.price && (
                          <p className="text-sm text-gray-400 line-through">₹{medicine.originalPrice}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          medicine.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {medicine.inStock ? `In Stock (${medicine.stockCount})` : 'Out of Stock'}
                        </span>
                        {medicine.requiresPrescription && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                            Rx Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/medicine/${medicine.id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => addToCart(medicine)}
                      disabled={!medicine.inStock}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredMedicines.length === 0 && (
              <div className="text-center py-12">
                <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No medicines found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Prescription Upload Tab */}
        {activeTab === 'prescription' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Prescription</h2>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Upload a clear photo or scan of your prescription. Our pharmacists will verify and prepare your medicines for delivery.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="mb-4">
                      <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePrescriptionUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {prescriptionFile && (
                      <p className="text-sm text-gray-600">
                        Selected: {prescriptionFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => alert('Prescription uploaded! We will contact you soon.')}
                  disabled={!prescriptionFile}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Upload Prescription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Browse Medicines
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart Items */}
                {cart.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                          {item.discount > 0 && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              {item.discount}% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.genericName}</p>
                        <p className="text-xs text-gray-500 mb-2">{item.strength} • {item.form}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-10 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <p className="text-lg font-bold text-green-600">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.originalPrice > item.price && (
                                <p className="text-sm text-gray-400 line-through">
                                  ₹{(item.originalPrice * item.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">₹{item.price} per {item.form.toLowerCase()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items ({getItemsCount()})</span>
                      <span className="font-medium">₹{cart.reduce((total, item) => total + (item.originalPrice * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    
                    {getTotalSavings() > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Savings</span>
                        <span className="font-medium text-green-600">-₹{getTotalSavings().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-600">
                            ₹{getTotalAmount().toFixed(2)}
                          </span>
                          {getTotalSavings() > 0 && (
                            <p className="text-xs text-green-600">You saved ₹{getTotalSavings().toFixed(2)}!</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prescription Required Notice */}
                  {cart.some(item => item.requiresPrescription) && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-800">
                          Some items require prescription. Upload before checkout.
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={proceedToPayment}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderId || order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'confirmed' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Items</p>
                        <p className="font-medium">{order.itemsCount || order.items?.length || 0} items</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Amount</p>
                        <p className="font-medium">₹{order.totalAmount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Delivery Date</p>
                        <p className="font-medium">
                          {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Items Ordered:</p>
                        <div className="space-y-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Order Actions */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          View Details
                        </button>
                        {order.status === 'confirmed' && (
                          <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                            Track Order
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <button className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                            Rate & Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Medicine Details Modal */}
      {showDetailsModal && selectedMedicine && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMedicine.name}</h2>
                  <p className="text-sm text-gray-600">{selectedMedicine.genericName}</p>
                </div>
                <button
                  onClick={closeMedicineDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Medicine Overview */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Strength</p>
                    <p className="font-semibold text-gray-900">{selectedMedicine.strength}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Form</p>
                    <p className="font-semibold text-gray-900">{selectedMedicine.form}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Manufacturer</p>
                    <p className="font-semibold text-gray-900">{selectedMedicine.manufacturer}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900">{selectedMedicine.category}</p>
                  </div>
                </div>
                
                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">₹{selectedMedicine.price}</span>
                      {selectedMedicine.originalPrice > selectedMedicine.price && (
                        <span className="text-lg text-gray-400 line-through">₹{selectedMedicine.originalPrice}</span>
                      )}
                      {selectedMedicine.discount > 0 && (
                        <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full font-medium">
                          {selectedMedicine.discount}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">₹{selectedMedicine.price} per {selectedMedicine.form.toLowerCase()}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedMedicine.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{selectedMedicine.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{selectedMedicine.reviews} reviews</p>
                  </div>
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedMedicine.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedMedicine.inStock ? `In Stock (${selectedMedicine.stockCount} available)` : 'Out of Stock'}
                  </span>
                  {selectedMedicine.requiresPrescription && (
                    <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
                      Prescription Required
                    </span>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedMedicine.description}</p>
              </div>
              
              {/* Uses */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Uses</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMedicine.uses.map((use, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{use}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dosage */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dosage & Administration</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">{selectedMedicine.dosage}</p>
                </div>
              </div>
              
              {/* Side Effects */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Side Effects</h3>
                <div className="space-y-2">
                  {selectedMedicine.sideEffects.map((effect, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{effect}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Warnings */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Warnings & Precautions</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{selectedMedicine.warnings}</p>
                  </div>
                </div>
              </div>
              
              {/* Expiry Date */}
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Expiry Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedMedicine.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Add to Cart Section */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 -mx-6 px-6 pb-6">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closeMedicineDetails}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      addToCart(selectedMedicine);
                      closeMedicineDetails();
                    }}
                    disabled={!selectedMedicine.inStock}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default MedicineOrder;