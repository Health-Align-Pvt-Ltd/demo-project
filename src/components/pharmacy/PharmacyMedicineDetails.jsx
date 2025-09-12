// Pharmacy Medicine Details Page Component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../common/PageLayout';
import toast from 'react-hot-toast';
import { 
  Star, 
  Heart, 
  Shield, 
  Clock, 
  CheckCircle, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Package,
  AlertTriangle,
  Info,
  Truck,
  ArrowRight,
  Share2,
  Bookmark,
  Award,
  Users,
  ThumbsUp,
  MessageCircle,
  Store,
  MapPin,
  Phone,
  Tag,
  Zap
} from 'lucide-react';

const PharmacyMedicineDetails = () => {
  const { medicineId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Sample medicines data for pharmacy section
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
      images: ['/api/placeholder/400/400'],
      description: 'Dolo 650 Tablet is a medicine used to relieve pain and reduce fever. It contains paracetamol as the active ingredient. It is used to treat many conditions such as headache, muscle ache, arthritis, backache, toothaches, colds, and fevers.',
      manufacturer: 'Micro Labs Ltd',
      tags: ['Fever', 'Pain Relief', 'Headache'],
      isBestseller: true,
      deliveryTime: '2-4 hours',
      uses: ['Fever reduction', 'Pain relief', 'Headache', 'Muscle pain', 'Dental pain', 'Cold symptoms'],
      sideEffects: ['Nausea', 'Vomiting', 'Stomach pain', 'Loss of appetite', 'Skin rash (rare)'],
      dosage: 'Adults: 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.',
      warnings: 'Do not exceed the recommended dose. Consult doctor if symptoms persist beyond 3 days.',
      composition: 'Each tablet contains Paracetamol 650mg',
      storageInstructions: 'Store below 30°C in a dry place. Keep away from children.',
      expiryDate: '2025-12-31',
      reviews: [
        { id: 1, user: 'Rajesh Kumar', rating: 5, comment: 'Very effective for fever. Works quickly.', date: '2024-01-15', verified: true },
        { id: 2, user: 'Priya Sharma', rating: 4, comment: 'Good medicine, reasonable price.', date: '2024-01-10', verified: true },
        { id: 3, user: 'Amit Singh', rating: 5, comment: 'Trusted brand, always works for headaches.', date: '2024-01-08', verified: false }
      ],
      alternatives: [
        { id: '2', name: 'Crocin 650', price: 28.50, brand: 'GSK' },
        { id: '3', name: 'Paracip 650', price: 24.80, brand: 'Cipla' }
      ]
    },
    // ... other medicines would be here
  ];

  // Load medicine data and cart from localStorage
  useEffect(() => {
    const foundMedicine = medicines.find(med => med.id === medicineId);
    setMedicine(foundMedicine);
    setLoading(false);

    // Load cart and wishlist from localStorage
    const savedCart = localStorage.getItem('pharmacyCart');
    const savedWishlist = localStorage.getItem('pharmacyWishlist');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, [medicineId]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('pharmacyCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pharmacyWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (medicine && newQuantity > medicine.stockCount) return medicine.stockCount;
      return newQuantity;
    });
  };

  const handleAddToCart = async () => {
    if (!medicine || !medicine.inStock) return;

    setAddingToCart(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setCart(prev => {
        const existingItem = prev.find(item => item.id === medicine.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > medicine.stockCount) {
            toast.error(`Only ${medicine.stockCount} items available in stock`);
            return prev;
          }
          
          toast.success(`Updated quantity to ${newQuantity}`, {
            icon: '🛒',
            duration: 2000
          });
          
          return prev.map(item =>
            item.id === medicine.id 
              ? { ...item, quantity: newQuantity }
              : item
          );
        } else {
          toast.success(`${medicine.name} added to cart!`, {
            icon: '✅',
            duration: 2000
          });
          
          return [...prev, { ...medicine, quantity }];
        }
      });

      setQuantity(1);
      
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    setWishlist(prev => {
      const isInWishlist = prev.find(item => item.id === medicine.id);
      if (isInWishlist) {
        toast.success('Removed from wishlist', { icon: '💔' });
        return prev.filter(item => item.id !== medicine.id);
      }
      toast.success('Added to wishlist!', { icon: '❤️' });
      return [...prev, medicine];
    });
  };

  const isInWishlist = wishlist.find(item => item?.id === medicine?.id);

  if (loading) {
    return (
      <PageLayout title="Medicine Details" showBack={true}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (!medicine) {
    return (
      <PageLayout title="Medicine Not Found" showBack={true}>
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Medicine Not Found</h2>
          <p className="text-gray-600 mb-6">The medicine you're looking for doesn't exist.</p>
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
      title="Medicine Details" 
      showBack={true}
      rightActions={
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={toggleWishlist}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'text-red-300 fill-current' : 'text-white'}`} />
          </button>
        </div>
      }
      backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
      textColor="text-white"
    >
      <div className="max-w-4xl mx-auto">
        {/* Medicine Images */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="aspect-square w-full max-w-sm mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4 relative">
            <Package className="w-20 h-20 text-gray-400" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {medicine.discount > 0 && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  {medicine.discount}% OFF
                </span>
              )}
              {medicine.isBestseller && (
                <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  Bestseller
                </span>
              )}
              {medicine.fastDelivery && (
                <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-medium flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Fast
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Medicine Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
              <p className="text-lg text-gray-600 mb-1">{medicine.genericName}</p>
              <p className="text-gray-500 mb-1">{medicine.strength} • {medicine.form}</p>
              <p className="text-gray-400 text-sm">by {medicine.brand}</p>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < Math.floor(medicine.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-900">{medicine.rating}</span>
              <span className="text-gray-500">({medicine.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">95% recommend</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl font-bold text-green-600">₹{medicine.price}</span>
            {medicine.originalPrice > medicine.price && (
              <span className="text-xl text-gray-400 line-through">₹{medicine.originalPrice}</span>
            )}
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Save ₹{(medicine.originalPrice - medicine.price).toFixed(2)}
            </span>
          </div>

          {/* Pack Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pack Size</p>
                <p className="font-medium text-gray-900">{medicine.pack}</p>
                <p className="text-xs text-gray-500">₹{(medicine.price / 15).toFixed(2)} per tablet</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Delivery</p>
                <div className="flex items-center space-x-1">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600">{medicine.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-3 mb-6">
            <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
              medicine.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {medicine.inStock ? `✓ In Stock (${medicine.stockCount} available)` : 'Out of Stock'}
            </span>
            {medicine.requiresPrescription && (
              <span className="bg-orange-100 text-orange-800 text-sm px-3 py-2 rounded-lg font-medium flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Prescription Required
              </span>
            )}
          </div>
        </div>

        {/* Quantity Selector and Add to Cart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= medicine.stockCount}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Price</p>
              <p className="text-2xl font-bold text-green-600">₹{(medicine.price * quantity).toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!medicine.inStock || addingToCart}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {addingToCart ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Adding to Cart...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'details', label: 'Details', icon: Info },
              { id: 'reviews', label: 'Reviews', icon: MessageCircle },
              { id: 'alternatives', label: 'Alternatives', icon: Package }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {showFullDescription ? medicine.description : `${medicine.description.substring(0, 200)}...`}
                  </p>
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-green-600 text-sm font-medium mt-2 hover:text-green-700"
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                </div>

                {/* Uses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Uses & Benefits</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {medicine.uses.map((use, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{use}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dosage */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dosage & Administration</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-800 text-sm">{medicine.dosage}</p>
                    </div>
                  </div>
                </div>

                {/* Side Effects */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Side Effects</h3>
                  <div className="space-y-2">
                    {medicine.sideEffects.map((effect, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Warnings & Precautions</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-800 text-sm">{medicine.warnings}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                  <button className="text-green-600 text-sm font-medium hover:text-green-700">
                    Write Review
                  </button>
                </div>

                <div className="space-y-4">
                  {medicine.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-gray-900">{review.user}</p>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives Tab */}
            {activeTab === 'alternatives' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Similar Products</h3>
                <div className="space-y-3">
                  {medicine.alternatives.map((alt) => (
                    <div key={alt.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{alt.name}</p>
                        <p className="text-sm text-gray-600">by {alt.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">₹{alt.price}</p>
                        <button className="text-green-600 text-sm font-medium hover:text-green-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PharmacyMedicineDetails;