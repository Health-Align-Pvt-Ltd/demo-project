// Medicine Search Page Component
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Clock, 
  TrendingUp,
  History,
  X,
  Eye,
  Zap,
  Shield,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronRight
} from 'lucide-react';

const MedicineSearch = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    prescription: 'all',
    inStock: true,
    discount: false
  });

  // Sample medicines data
  const allMedicines = [
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
      isBestseller: true,
      keywords: ['paracetamol', 'fever', 'headache', 'pain', 'dolo']
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
      isBestseller: false,
      keywords: ['vitamin', 'd3', 'bone', 'immunity', 'cholecalciferol']
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
      isBestseller: false,
      keywords: ['amoxicillin', 'antibiotic', 'infection', 'bacteria']
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
      isBestseller: true,
      keywords: ['cetaphil', 'cleanser', 'skincare', 'face wash', 'gentle']
    },
    {
      id: '5',
      name: 'Crocin Pain Relief',
      genericName: 'Paracetamol',
      brand: 'GSK',
      strength: '500mg',
      form: 'Tablet',
      pack: 'Strip of 20 tablets',
      price: 28.50,
      originalPrice: 32.00,
      discount: 11,
      inStock: true,
      stockCount: 89,
      requiresPrescription: false,
      category: 'pain-relief',
      rating: 4.3,
      reviewsCount: 1967,
      fastDelivery: true,
      isBestseller: false,
      keywords: ['crocin', 'paracetamol', 'fever', 'headache', 'pain']
    }
  ];

  useEffect(() => {
    // Load recent searches from Firebase (you can implement this later)
    // For now, keeping localStorage for recent searches as it's user-specific browser data
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Set popular searches
    setPopularSearches([
      'Paracetamol', 'Vitamin D3', 'Amoxicillin', 'Crocin', 'Dolo 650',
      'Cetaphil', 'Insulin', 'Omeprazole', 'Azithromycin', 'Metformin'
    ]);

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

    // Check if there's a search query from navigation
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }

    // Focus search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location.search, userData]);

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = allMedicines.filter(medicine => {
        const searchText = query.toLowerCase();
        return (
          medicine.name.toLowerCase().includes(searchText) ||
          medicine.genericName.toLowerCase().includes(searchText) ||
          medicine.brand.toLowerCase().includes(searchText) ||
          medicine.keywords.some(keyword => keyword.includes(searchText))
        );
      });

      // Sort results by relevance
      results.sort((a, b) => {
        const aScore = getRelevanceScore(a, query);
        const bScore = getRelevanceScore(b, query);
        return bScore - aScore;
      });

      setSearchResults(results);
      setIsSearching(false);

      // Save to recent searches
      saveRecentSearch(query);
    }, 500);
  };

  const getRelevanceScore = (medicine, query) => {
    const searchText = query.toLowerCase();
    let score = 0;

    // Exact name match gets highest score
    if (medicine.name.toLowerCase() === searchText) score += 100;
    else if (medicine.name.toLowerCase().includes(searchText)) score += 50;

    // Generic name match
    if (medicine.genericName.toLowerCase().includes(searchText)) score += 40;

    // Brand match
    if (medicine.brand.toLowerCase().includes(searchText)) score += 30;

    // Keyword match
    medicine.keywords.forEach(keyword => {
      if (keyword.includes(searchText)) score += 20;
    });

    // Boost popular items
    if (medicine.isBestseller) score += 10;
    if (medicine.rating >= 4.5) score += 5;

    return score;
  };

  const saveRecentSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecentSearches(prev => {
      const updated = [trimmed, ...prev.filter(item => item !== trimmed)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const generateSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const searchText = query.toLowerCase();
    const suggestionSet = new Set();

    // Add medicine name suggestions
    allMedicines.forEach(medicine => {
      if (medicine.name.toLowerCase().includes(searchText)) {
        suggestionSet.add(medicine.name);
      }
      if (medicine.genericName.toLowerCase().includes(searchText)) {
        suggestionSet.add(medicine.genericName);
      }
      if (medicine.brand.toLowerCase().includes(searchText)) {
        suggestionSet.add(medicine.brand);
      }
    });

    setSuggestions(Array.from(suggestionSet).slice(0, 8));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    generateSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      performSearch(searchTerm);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
    toast.success('Recent searches cleared', {
      icon: '🧹',
      duration: 1500
    });
  };

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

  return (
    <PageLayout 
      title="Search Medicines"
      subtitle="Find your medicines quickly"
      showBack={true}
      backgroundColor="bg-gradient-to-r from-blue-600 to-blue-700"
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
            ref={searchInputRef}
            type="text"
            placeholder="Search medicines, brands, symptoms..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-900"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSuggestions([]);
                setSearchResults([]);
                setShowSuggestions(false);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchTerm(suggestion);
                  setShowSuggestions(false);
                  performSearch(suggestion);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isSearching ? 'Searching...' : `Results for "${searchTerm}"`}
              </h2>
              {!isSearching && (
                <p className="text-sm text-gray-600">{searchResults.length} products found</p>
              )}
            </div>
            
            {searchResults.length > 0 && (
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="popularity">Popularity</option>
                </select>
                
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 bg-white border border-gray-200 rounded-lg"
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isSearching && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Search Results Grid */}
          {!isSearching && searchResults.length > 0 && (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {searchResults.map(medicine => (
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
          )}

          {/* No Results */}
          {!isSearching && searchResults.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">Try searching with different keywords</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.slice(0, 5).map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchTerm(suggestion);
                      performSearch(suggestion);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Default State - No Search */}
      {!searchTerm && (
        <div className="space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Recent Searches</span>
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(search);
                      performSearch(search);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Clock className="w-3 h-3" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Popular Searches</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(search);
                    performSearch(search);
                  }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{search}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Search Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Search by medicine name, brand, or generic name</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Use symptoms like "fever", "headache", "cold" to find medicines</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Try brand names like "Dolo", "Crocin", "Cetaphil"</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Search for categories like "vitamins", "antibiotics", "skincare"</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default MedicineSearch;