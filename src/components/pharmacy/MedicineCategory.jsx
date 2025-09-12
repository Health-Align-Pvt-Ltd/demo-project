// Medicine Category Page Component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Package, 
  Heart, 
  Zap, 
  Shield, 
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  Plus,
  Eye
} from 'lucide-react';

const MedicineCategory = () => {
  const { categoryId } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    brands: [],
    inStock: true,
    prescription: 'all',
    discount: false
  });

  // Category definitions
  const categories = {
    'pain-relief': {
      name: 'Pain Relief',
      description: 'Medicines for pain management and relief',
      icon: '💊',
      color: 'from-red-500 to-red-600'
    },
    'vitamins': {
      name: 'Vitamins & Supplements',
      description: 'Essential vitamins and nutritional supplements',
      icon: '🌿',
      color: 'from-green-500 to-green-600'
    },
    'antibiotics': {
      name: 'Antibiotics',
      description: 'Prescription antibiotics for infections',
      icon: '🛡️',
      color: 'from-blue-500 to-blue-600'
    },
    'skincare': {
      name: 'Skincare',
      description: 'Skincare products and treatments',
      icon: '✨',
      color: 'from-pink-500 to-pink-600'
    },
    'baby-care': {
      name: 'Baby Care',
      description: 'Healthcare products for babies and infants',
      icon: '👶',
      color: 'from-yellow-500 to-yellow-600'
    },
    'diabetes': {
      name: 'Diabetes Care',
      description: 'Diabetes management and monitoring products',
      icon: '🩺',
      color: 'from-purple-500 to-purple-600'
    },
    'ayurveda': {
      name: 'Ayurveda',
      description: 'Traditional Ayurvedic medicines and herbs',
      icon: '🌱',
      color: 'from-green-600 to-green-700'
    }
  };

  // Sample medicines data by category
  const medicinesData = {
    'pain-relief': [
      {
        id: '1',
        name: 'Dolo 650 Tablet',
        genericName: 'Paracetamol',
        brand: 'Micro Labs',
        strength: '650mg',
        form: 'Tablet',
        pack: 'Strip of 15 tablets',
        price: 32.50,
        originalPrice: 45.00,
        discount: 28,
        inStock: true,
        stockCount: 150,
        requiresPrescription: false,
        category: 'pain-relief',
        rating: 4.4,
        reviewsCount: 2847,
        fastDelivery: true,
        isBestseller: true
      },
      {
        id: '7',
        name: 'Combiflam Tablet',
        genericName: 'Ibuprofen + Paracetamol',
        brand: 'Sanofi',
        strength: '400mg+325mg',
        form: 'Tablet',
        pack: 'Strip of 20 tablets',
        price: 68.99,
        originalPrice: 75.00,
        discount: 8,
        inStock: true,
        stockCount: 89,
        requiresPrescription: false,
        category: 'pain-relief',
        rating: 4.3,
        reviewsCount: 1567,
        fastDelivery: true,
        isBestseller: false
      }
    ],
    'vitamins': [
      {
        id: '2',
        name: 'Vitamin D3 60K',
        genericName: 'Cholecalciferol',
        brand: 'HealthKart',
        strength: '60000 IU',
        form: 'Capsule',
        pack: 'Strip of 8 capsules',
        price: 156.99,
        originalPrice: 180.00,
        discount: 13,
        inStock: true,
        stockCount: 89,
        requiresPrescription: false,
        category: 'vitamins',
        rating: 4.6,
        reviewsCount: 1234,
        fastDelivery: true,
        isBestseller: false
      },
      {
        id: '8',
        name: 'Revital H Capsule',
        genericName: 'Multivitamin',
        brand: 'Ranbaxy',
        strength: 'Multi',
        form: 'Capsule',
        pack: 'Strip of 30 capsules',
        price: 289.50,
        originalPrice: 320.00,
        discount: 10,
        inStock: true,
        stockCount: 76,
        requiresPrescription: false,
        category: 'vitamins',
        rating: 4.2,
        reviewsCount: 987,
        fastDelivery: false,
        isBestseller: true
      }
    ],
    'antibiotics': [
      {
        id: '3',
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        brand: 'Cipla',
        strength: '500mg',
        form: 'Capsule',
        pack: 'Strip of 10 capsules',
        price: 89.99,
        originalPrice: 110.00,
        discount: 18,
        inStock: true,
        stockCount: 45,
        requiresPrescription: true,
        category: 'antibiotics',
        rating: 4.2,
        reviewsCount: 856,
        fastDelivery: false,
        isBestseller: false
      }
    ],
    'skincare': [
      {
        id: '4',
        name: 'Cetaphil Gentle Cleanser',
        genericName: 'Cleansing Lotion',
        brand: 'Cetaphil',
        strength: '250ml',
        form: 'Liquid',
        pack: '250ml bottle',
        price: 599.00,
        originalPrice: 650.00,
        discount: 8,
        inStock: true,
        stockCount: 25,
        requiresPrescription: false,
        category: 'skincare',
        rating: 4.5,
        reviewsCount: 3421,
        fastDelivery: true,
        isBestseller: true
      }
    ]
  };

  const currentCategory = categories[categoryId];

  useEffect(() => {
    // Load medicines for the current category
    const categoryMedicines = medicinesData[categoryId] || [];
    setMedicines(categoryMedicines);
    setFilteredMedicines(categoryMedicines);

    // Load cart from Firebase
    const loadCart = async () => {
      if (userData?.uid) {
        const result = await firestoreService.getCartFromFirebase(userData.uid, 'pharmacy');
        if (result.success) {
          setCart(result.data);
        }
      }
    };
    
    loadCart();
  }, [categoryId, userData]);

  useEffect(() => {
    // Filter and sort medicines
    let filtered = medicines.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = medicine.price >= filters.priceRange[0] && medicine.price <= filters.priceRange[1];
      const matchesStock = !filters.inStock || medicine.inStock;
      const matchesPrescription = filters.prescription === 'all' || 
                                 (filters.prescription === 'true' && medicine.requiresPrescription) ||
                                 (filters.prescription === 'false' && !medicine.requiresPrescription);
      const matchesDiscount = !filters.discount || medicine.discount > 0;
      
      return matchesSearch && matchesPrice && matchesStock && matchesPrescription && matchesDiscount;
    });

    // Sort medicines
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default: // popular
        filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    setFilteredMedicines(filtered);
  }, [medicines, searchTerm, sortBy, filters]);

  const addToCart = async (medicine) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.id === medicine.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      toast.success(`${medicine.name} quantity updated`, {
        icon: '🛒',
        duration: 2000
      });
    } else {
      updatedCart.push({ ...medicine, quantity: 1 });
      toast.success(`${medicine.name} added to cart!`, {
        icon: '✅',
        duration: 2000
      });
    }
    
    setCart(updatedCart);
    
    // Save to Firebase
    if (userData?.uid) {
      const result = await firestoreService.saveCartToFirebase(userData.uid, updatedCart, 'pharmacy');
      if (!result.success) {
        console.error('Error saving cart to Firebase:', result.error);
        toast.error('Failed to save cart. Please try again.');
      }
    }
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (!currentCategory) {
    return (
      <PageLayout title="Category Not Found" showBack={true}>
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/pharmacy')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Pharmacy
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={currentCategory.name}
      subtitle={currentCategory.description}
      showBack={true}
      backgroundColor={`bg-gradient-to-r ${currentCategory.color}`}
      textColor="text-white"
      rightActions={
        <button
          onClick={() => navigate('/pharmacy/cart')}
          className="relative p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
          {getCartItemsCount() > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {getCartItemsCount()}
            </span>
          )}
        </button>
      }
    >
      {/* Category Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{currentCategory.icon}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentCategory.name}</h1>
            <p className="text-gray-600">{currentCategory.description}</p>
            <p className="text-sm text-gray-500 mt-1">{filteredMedicines.length} products available</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search in ${currentCategory.name}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="popular">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="discount">Discount</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'all', label: 'All Products' },
          { id: 'bestseller', label: 'Bestsellers' },
          { id: 'discounted', label: 'On Sale' },
          { id: 'prescription', label: 'Prescription' },
          { id: 'otc', label: 'Over Counter' }
        ].map((filter) => (
          <button
            key={filter.id}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredMedicines.length} products in {currentCategory.name}
        </p>
      </div>

      {/* Medicine Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredMedicines.map(medicine => (
          <div 
            key={medicine.id} 
            className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Product Image */}
            <div className={`relative ${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'} bg-gray-100 flex items-center justify-center`}>
              <Package className="w-12 h-12 text-gray-400" />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {medicine.discount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {medicine.discount}% OFF
                  </span>
                )}
                {medicine.isBestseller && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Bestseller
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {medicine.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">{medicine.brand}</p>
                  <p className="text-xs text-gray-500">{medicine.pack}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-2">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-gray-700 ml-1">{medicine.rating}</span>
                </div>
                <span className="text-xs text-gray-500">({medicine.reviewsCount})</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
                {medicine.originalPrice > medicine.price && (
                  <span className="text-sm text-gray-400 line-through">₹{medicine.originalPrice}</span>
                )}
              </div>

              {/* Features */}
              <div className="flex items-center space-x-2 mb-3">
                {medicine.fastDelivery && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">Fast</span>
                  </div>
                )}
                {medicine.requiresPrescription && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                    Prescription
                  </span>
                )}
                {!medicine.inStock && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/pharmacy/${medicine.id}`)}
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
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </PageLayout>
  );
};

export default MedicineCategory;