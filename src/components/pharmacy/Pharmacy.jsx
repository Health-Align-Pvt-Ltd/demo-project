// Pharmacy - Modern E-commerce Interface
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import toast from 'react-hot-toast';
import { 
  Search, 
  ShoppingCart, 
  Filter, 
  Star, 
  Heart, 
  Zap, 
  Truck, 
  Shield, 
  Clock, 
  ChevronDown, 
  Package, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  MapPin,
  Percent,
  Tag,
  ArrowUpDown,
  ChevronRight,
  Plus,
  Pill
} from 'lucide-react';

const Pharmacy = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    brands: [],
    inStock: true,
    prescription: 'all',
    discount: false
  });

  // Medicine Categories
  const categories = [
    { id: 'all', name: 'All Categories', icon: Grid3X3, count: 156 },
    { id: 'pain-relief', name: 'Pain Relief', icon: Pill, count: 45 },
    { id: 'vitamins', name: 'Vitamins & Supplements', icon: Shield, count: 32 },
    { id: 'antibiotics', name: 'Antibiotics', icon: Shield, count: 28 },
    { id: 'skincare', name: 'Skincare', icon: Heart, count: 25 },
    { id: 'baby-care', name: 'Baby Care', icon: Heart, count: 18 },
    { id: 'diabetes', name: 'Diabetes Care', icon: Pill, count: 15 },
    { id: 'ayurveda', name: 'Ayurveda', icon: Pill, count: 12 }
  ];

  // Sample medicines data with e-commerce style information
  const medicines = [
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
      images: ['/api/placeholder/150/150'],
      description: 'Effective fever and pain relief',
      manufacturer: 'Micro Labs Ltd',
      tags: ['Fever', 'Pain Relief', 'Headache'],
      isBestseller: true,
      deliveryTime: '2-4 hours'
    },
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
      images: ['/api/placeholder/150/150'],
      description: 'Supports bone health and immunity',
      manufacturer: 'HealthKart HerbalLife',
      tags: ['Vitamin D', 'Bone Health', 'Immunity'],
      isBestseller: false,
      deliveryTime: '1-2 days'
    },
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
      images: ['/api/placeholder/150/150'],
      description: 'Broad spectrum antibiotic',
      manufacturer: 'Cipla Ltd',
      tags: ['Antibiotic', 'Infection', 'Prescription'],
      isBestseller: false,
      deliveryTime: '4-6 hours'
    },
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
      images: ['/api/placeholder/150/150'],
      description: 'Gentle daily facial cleanser',
      manufacturer: 'Galderma India',
      tags: ['Skincare', 'Cleanser', 'Sensitive Skin'],
      isBestseller: true,
      deliveryTime: '2-4 hours'
    },
    {
      id: '5',
      name: 'Glucon-D Orange',
      genericName: 'Glucose',
      brand: 'Heinz',
      strength: '1kg',
      form: 'Powder',
      pack: '1kg jar',
      price: 285.00,
      originalPrice: 320.00,
      discount: 11,
      inStock: true,
      stockCount: 67,
      requiresPrescription: false,
      category: 'vitamins',
      rating: 4.3,
      reviewsCount: 1876,
      fastDelivery: true,
      images: ['/api/placeholder/150/150'],
      description: 'Instant energy glucose drink',
      manufacturer: 'Heinz India',
      tags: ['Energy', 'Glucose', 'Sports'],
      isBestseller: false,
      deliveryTime: '1-2 days'
    },
    {
      id: '6',
      name: 'Baby Dove Soap',
      genericName: 'Baby Soap',
      brand: 'Dove',
      strength: '75g',
      form: 'Soap',
      pack: 'Pack of 3 soaps',
      price: 165.00,
      originalPrice: 180.00,
      discount: 8,
      inStock: true,
      stockCount: 120,
      requiresPrescription: false,
      category: 'baby-care',
      rating: 4.7,
      reviewsCount: 2156,
      fastDelivery: true,
      images: ['/api/placeholder/150/150'],
      description: 'Gentle moisturizing baby soap',
      manufacturer: 'Hindustan Unilever',
      tags: ['Baby Care', 'Gentle', 'Moisturizing'],
      isBestseller: true,
      deliveryTime: '2-4 hours'
    }
  ];

  // Brand list
  const brands = ['Cipla', 'Sun Pharma', 'Dr. Reddy\'s', 'Lupin', 'Aurobindo', 'Micro Labs', 'Mankind'];

  // Load cart and wishlist from Firebase
  useEffect(() => {
    const loadCartAndWishlist = async () => {
      if (userData?.uid) {
        // Load cart from Firebase
        const cartResult = await firestoreService.getCartFromFirebase(userData.uid, 'pharmacy');
        if (cartResult.success) {
          setCart(cartResult.data);
        }
        
        // Load wishlist from Firebase
        const wishlistResult = await firestoreService.getCartFromFirebase(userData.uid, 'pharmacy_wishlist');
        if (wishlistResult.success) {
          setWishlist(wishlistResult.data);
        }
      }
    };
    
    loadCartAndWishlist();
  }, [userData]);

  // Save cart to Firebase
  const saveCartToFirebase = async (cartData) => {
    if (userData?.uid) {
      const result = await firestoreService.saveCartToFirebase(userData.uid, cartData, 'pharmacy');
      if (!result.success) {
        console.error('Error saving cart to Firebase:', result.error);
        toast.error('Failed to save cart. Please try again.');
      }
    }
  };

  // Save wishlist to Firebase
  const saveWishlistToFirebase = async (wishlistData) => {
    if (userData?.uid) {
      const result = await firestoreService.saveCartToFirebase(userData.uid, wishlistData, 'pharmacy_wishlist');
      if (!result.success) {
        console.error('Error saving wishlist to Firebase:', result.error);
        toast.error('Failed to save wishlist. Please try again.');
      }
    }
  };

  // Filter medicines based on search, category, and filters
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    const matchesStock = !filters.inStock || medicine.inStock;
    const matchesPrescription = filters.prescription === 'all' || 
                               (filters.prescription === 'rx' && medicine.requiresPrescription) ||
                               (filters.prescription === 'otc' && !medicine.requiresPrescription);
    const matchesDiscount = !filters.discount || medicine.discount > 0;
    const matchesPrice = medicine.price >= filters.priceRange[0] && medicine.price <= filters.priceRange[1];
    const matchesBrands = filters.brands.length === 0 || filters.brands.includes(medicine.brand);

    return matchesSearch && matchesCategory && matchesStock && matchesPrescription && 
           matchesDiscount && matchesPrice && matchesBrands;
  });

  // Sort medicines
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'discount': return b.discount - a.discount;
      default: return b.reviewsCount - a.reviewsCount; // popular
    }
  });

  const addToCart = async (medicine) => {
    const newCart = (() => {
      const existing = cart.find(item => item.id === medicine.id);
      if (existing) {
        toast.success(`Updated ${medicine.name} quantity`, { icon: '🛒' });
        return cart.map(item =>
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${medicine.name} added to cart!`, { icon: '✅' });
      return [...cart, { ...medicine, quantity: 1 }];
    })();
    
    setCart(newCart);
    await saveCartToFirebase(newCart);
  };

  const toggleWishlist = async (medicine) => {
    const newWishlist = (() => {
      const isInWishlist = wishlist.find(item => item.id === medicine.id);
      if (isInWishlist) {
        toast.success('Removed from wishlist', { icon: '💔' });
        return wishlist.filter(item => item.id !== medicine.id);
      }
      toast.success('Added to wishlist!', { icon: '❤️' });
      return [...wishlist, medicine];
    })();
    
    setWishlist(newWishlist);
    await saveWishlistToFirebase(newWishlist);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <PageLayout 
      title="Pharmacy"
      subtitle="Order medicines & healthcare products"
      showBack={false}
      showDrawer={true}
      backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
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
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search medicines, brands, symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => navigate('/pharmacy/search')}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                navigate(`/pharmacy/search?q=${encodeURIComponent(searchTerm)}`);
              }
            }}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Express Delivery</p>
              <p className="text-xs text-blue-100">Within 2-4 hours</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/upload-prescription')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white w-full text-left hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Upload Prescription</p>
              <p className="text-xs text-purple-100">Get medicines</p>
            </div>
          </div>
        </button>
      </div>

      {/* Partner Pharmacies - Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Partner Pharmacies</h2>
          <button className="text-green-600 text-sm font-medium hover:text-green-700">
            View All
          </button>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            {
              id: '1',
              name: 'Apollo Pharmacy',
              logo: '🏥',
              rating: 4.8,
              deliveryTime: '30 min',
              distance: '0.5 km',
              offers: 'Free delivery above ₹500'
            },
            {
              id: '2',
              name: 'MedPlus',
              logo: '💊',
              rating: 4.6,
              deliveryTime: '45 min',
              distance: '1.2 km',
              offers: 'Buy 2 Get 1 Free'
            },
            {
              id: '3',
              name: '1mg Pharmacy',
              logo: '🏪',
              rating: 4.7,
              deliveryTime: '25 min',
              distance: '0.8 km',
              offers: '24/7 delivery'
            },
            {
              id: '4',
              name: 'Wellness Pharmacy',
              logo: '🌿',
              rating: 4.4,
              deliveryTime: '60 min',
              distance: '2.1 km',
              offers: 'Ayurveda specialist'
            },
            {
              id: '5',
              name: 'Guardian Pharmacy',
              logo: '🛡️',
              rating: 4.3,
              deliveryTime: '40 min',
              distance: '1.8 km',
              offers: 'Senior discount 15%'
            }
          ].map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/upload-prescription')}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{pharmacy.logo}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{pharmacy.name}</h3>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-gray-700">{pharmacy.rating}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{pharmacy.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{pharmacy.distance}</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="text-xs text-green-700 font-medium">{pharmacy.offers}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6" data-section="categories">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  if (category.id === 'all') {
                    setSelectedCategory(category.id);
                  } else {
                    navigate(`/pharmacy/category/${category.id}`);
                  }
                }}
                className={`flex-shrink-0 flex flex-col items-center space-y-2 p-3 rounded-xl transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedCategory === category.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${
                    selectedCategory === category.id ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-500">({category.count})</p>
                </div>
              </button>
            );
          })}
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

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {sortedMedicines.length} results
          {selectedCategory !== 'all' && (
            <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
          )}
        </p>
      </div>

      {/* Medicine Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {sortedMedicines.map(medicine => (
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

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(medicine)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Heart className={`w-4 h-4 ${
                  wishlist.find(item => item.id === medicine.id) 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-400'
                }`} />
              </button>
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
                    Rx
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {medicine.deliveryTime}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/pharmacy/${medicine.id}`)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => addToCart(medicine)}
                  disabled={!medicine.inStock}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedMedicines.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No medicines found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setFilters({
                priceRange: [0, 1000],
                brands: [],
                inStock: true,
                prescription: 'all',
                discount: false
              });
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </PageLayout>
  );
};

export default Pharmacy;