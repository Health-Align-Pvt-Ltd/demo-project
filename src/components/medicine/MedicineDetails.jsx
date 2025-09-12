// Medicine Details Page Component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
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
  Eye,
  X
} from 'lucide-react';

const MedicineDetails = () => {
  const { medicineId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Sample medicines data (in real app, this would come from API/Firebase)
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
      description: 'Effective pain relief and fever reducer. Suitable for headaches, muscle aches, and fever reduction. This medicine is widely used and trusted by healthcare professionals worldwide.',
      uses: ['Headache', 'Fever', 'Muscle pain', 'Dental pain', 'Post-operative pain', 'Arthritis pain'],
      sideEffects: ['Nausea', 'Stomach upset', 'Allergic reactions (rare)', 'Skin rash (uncommon)', 'Dizziness (rare)'],
      dosage: 'Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours. Children: As prescribed by physician.',
      warnings: 'Do not exceed recommended dose. Consult doctor if symptoms persist beyond 3 days. Not recommended for children under 6 years without medical supervision.',
      expiryDate: '2025-12-31',
      rating: 4.5,
      reviews: 1205,
      discount: 12,
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      composition: 'Each tablet contains: Paracetamol 500mg',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Keep out of reach of children.'
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
      description: 'Broad-spectrum antibiotic for bacterial infections. Effective against various bacterial strains including respiratory, skin, and urinary tract infections.',
      uses: ['Respiratory infections', 'Skin infections', 'Urinary tract infections', 'Dental infections', 'Ear infections'],
      sideEffects: ['Nausea', 'Diarrhea', 'Allergic reactions', 'Stomach upset', 'Vomiting'],
      dosage: 'As prescribed by physician. Usually 250-500mg every 8 hours. Complete the full course as directed.',
      warnings: 'Complete the full course as prescribed. Inform doctor of any allergies. Not suitable for patients allergic to penicillin.',
      expiryDate: '2025-08-15',
      rating: 4.3,
      reviews: 856,
      discount: 5,
      images: ['/api/placeholder/300/300'],
      composition: 'Each capsule contains: Amoxicillin 250mg',
      storageInstructions: 'Store below 25°C in original container. Protect from moisture.'
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
      description: 'Essential vitamin D3 supplement for bone health and immune system support. Helps in calcium absorption and maintains healthy bones and teeth.',
      uses: ['Bone health', 'Immune support', 'Vitamin D deficiency', 'Calcium absorption', 'Muscle function'],
      sideEffects: ['Mild stomach upset (rare)', 'Headache (with overdose)', 'Nausea (if taken on empty stomach)'],
      dosage: 'One tablet daily with food or as directed by healthcare provider. Best taken with meals containing fat.',
      warnings: 'Do not exceed recommended dose. Consult doctor if pregnant or nursing. Regular monitoring recommended for long-term use.',
      expiryDate: '2026-03-20',
      rating: 4.7,
      reviews: 2341,
      discount: 10,
      images: ['/api/placeholder/300/300'],
      composition: 'Each tablet contains: Vitamin D3 (Cholecalciferol) 1000 IU',
      storageInstructions: 'Store in cool, dry place. Avoid direct sunlight and heat.'
    }
  ];

  // Load medicine data and cart from Firebase
  useEffect(() => {
    const foundMedicine = medicines.find(med => med.id === medicineId);
    setMedicine(foundMedicine);
    setLoading(false);

    // Load cart from Firebase
    const loadCart = async () => {
      if (userData?.uid) {
        const result = await firestoreService.getCartFromFirebase(userData.uid, 'medicine');
        if (result.success) {
          setCart(result.data);
        }
      }
    };
    
    loadCart();
  }, [medicineId, userData]);

  // Save cart to Firebase
  const saveCartToFirebase = async (cartData) => {
    if (userData?.uid) {
      const result = await firestoreService.saveCartToFirebase(userData.uid, cartData, 'medicine');
      if (!result.success) {
        console.error('Error saving cart to Firebase:', result.error);
        toast.error('Failed to save cart. Please try again.');
      }
    }
  };

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newCart = (() => {
        const existingItem = cart.find(item => item.id === medicine.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > medicine.stockCount) {
            toast.error(`Only ${medicine.stockCount} items available in stock`);
            return cart;
          }
          
          toast.success(`Updated quantity to ${newQuantity}`, {
            icon: '🛒',
            duration: 2000
          });
          
          return cart.map(item =>
            item.id === medicine.id 
              ? { ...item, quantity: newQuantity }
              : item
          );
        } else {
          toast.success(`${medicine.name} added to cart!`, {
            icon: '✅',
            duration: 2000
          });
          
          return [...cart, { ...medicine, quantity }];
        }
      })();
      
      setCart(newCart);
      await saveCartToFirebase(newCart);

      // Reset quantity to 1 after adding
      setQuantity(1);
      
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const updateCartQuantity = async (medicineId, newQuantity) => {
    let newCart;
    if (newQuantity === 0) {
      newCart = cart.filter(item => item.id !== medicineId);
      toast.success('Item removed from cart', {
        icon: '🗑️',
        duration: 1500
      });
    } else {
      newCart = cart.map(item =>
        item.id === medicineId 
          ? { ...item, quantity: newQuantity }
          : item
      );
    }
    
    setCart(newCart);
    await saveCartToFirebase(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    navigate('/medicine-payment', {
      state: {
        cartItems: cart,
        totalAmount: getCartTotal(),
        totalSavings: cart.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0),
        itemsCount: getCartItemsCount()
      }
    });
  };

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
            onClick={() => navigate('/medicine')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Medicines
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={medicine.name} 
      showBack={true}
      rightActions={
        <button
          onClick={() => setShowCart(!showCart)}
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
      backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
      textColor="text-white"
    >
      <div className="max-w-4xl mx-auto">
        {/* Medicine Images */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
            <Package className="w-20 h-20 text-gray-400" />
          </div>
        </div>

        {/* Medicine Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{medicine.name}</h1>
                {medicine.discount > 0 && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                    {medicine.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600 mb-1">{medicine.genericName}</p>
              <p className="text-gray-500">{medicine.strength} • {medicine.form}</p>
              <p className="text-gray-400 text-sm mt-1">by {medicine.manufacturer}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
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
            <span className="text-gray-500">({medicine.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl font-bold text-green-600">₹{medicine.price}</span>
            {medicine.originalPrice > medicine.price && (
              <span className="text-xl text-gray-400 line-through">₹{medicine.originalPrice}</span>
            )}
            <span className="text-green-600 font-medium">
              You save ₹{(medicine.originalPrice - medicine.price).toFixed(2)}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-3 mb-6">
            <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
              medicine.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {medicine.inStock ? `In Stock (${medicine.stockCount} available)` : 'Out of Stock'}
            </span>
            {medicine.requiresPrescription && (
              <span className="bg-orange-100 text-orange-800 text-sm px-3 py-2 rounded-lg font-medium flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Prescription Required
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-6">
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
            <span className="text-gray-500 text-sm">
              Max: {medicine.stockCount}
            </span>
          </div>

          {/* Add to Cart Button */}
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
                <span>Add to Cart - ₹{(medicine.price * quantity).toFixed(2)}</span>
              </>
            )}
          </button>
        </div>

        {/* Medicine Details Sections */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{medicine.description}</p>
          </div>

          {/* Uses */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Uses & Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medicine.uses.map((use, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{use}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dosage */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Dosage & Administration</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-800">{medicine.dosage}</p>
              </div>
            </div>
          </div>

          {/* Side Effects */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Side Effects</h2>
            <div className="space-y-2">
              {medicine.sideEffects.map((effect, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">{effect}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Warnings & Precautions</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{medicine.warnings}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Composition</p>
                <p className="font-medium text-gray-900">{medicine.composition}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-medium text-gray-900">{medicine.category}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Storage</p>
                <p className="font-medium text-gray-900">{medicine.storageInstructions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Expiry Date:</span>
                </div>
                <p className="font-medium text-gray-900">
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowCart(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Shopping Cart ({getCartItemsCount()})
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.strength} • {item.form}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">₹{item.price} each</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default MedicineDetails;