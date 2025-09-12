// Medicine Cart Page Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import AddressInput from '../common/AddressInput'; // Add this import
import toast from 'react-hot-toast';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  ArrowRight, 
  Tag, 
  Clock, 
  Truck,
  Shield,
  CreditCard,
  MapPin,
  Percent,
  Gift,
  X
} from 'lucide-react';

const MedicineCart = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false); // Track if cart has been loaded from Firebase
  const [deliveryAddress, setDeliveryAddress] = useState(''); // Add this state

  // Load cart from Firebase
  useEffect(() => {
    const loadCartFromFirebase = async () => {
      if (userData?.uid) {
        console.log('Loading pharmacy cart from Firebase for user:', userData.uid);
        const result = await firestoreService.getCartFromFirebase(userData.uid, 'pharmacy');
        console.log('Pharmacy cart load result:', result);
        if (result.success) {
          setCart(result.data || []);
          console.log('Pharmacy cart loaded:', result.data);
        } else {
          console.error('Error loading cart from Firebase:', result.error);
          // Only set empty cart if there's a real error, not if document doesn't exist
          if (result.error !== 'Document not found') {
            setCart([]);
          }
        }
        setCartLoaded(true); // Mark cart as loaded
      }
    };
    
    loadCartFromFirebase();
  }, [userData?.uid]);

  // Save cart to Firebase whenever cart changes (but only after initial load)
  useEffect(() => {
    const saveCartToFirebase = async () => {
      // Only save if cart has been loaded and user is authenticated
      if (userData?.uid && cartLoaded) {
        console.log('Saving pharmacy cart to Firebase:', cart);
        const result = await firestoreService.saveCartToFirebase(userData.uid, cart, 'pharmacy');
        console.log('Pharmacy cart save result:', result);
        if (!result.success) {
          console.error('Error saving cart to Firebase:', result.error);
        }
      }
    };
    
    saveCartToFirebase();
  }, [cart, userData?.uid, cartLoaded]); // Added cartLoaded to dependencies

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

  const removeItem = (medicineId) => {
    updateQuantity(medicineId, 0);
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared', {
      icon: '🧹',
      duration: 1500
    });
  };

  const applyPromoCode = () => {
    const validPromoCodes = {
      'SAVE10': { discount: 10, type: 'percentage', description: '10% off on all medicines' },
      'FIRST50': { discount: 50, type: 'fixed', description: '₹50 off on first order' },
      'HEALTH20': { discount: 20, type: 'percentage', description: '20% off on health products' }
    };

    if (validPromoCodes[promoCode]) {
      setAppliedPromo(validPromoCodes[promoCode]);
      toast.success(`Promo code "${promoCode}" applied!`, {
        icon: '🎉',
        duration: 2000
      });
    } else {
      toast.error('Invalid promo code', {
        icon: '❌',
        duration: 1500
      });
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('Promo code removed', {
      icon: '🗑️',
      duration: 1500
    });
  };

  // Calculate totals
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getOriginalTotal = () => {
    return cart.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
  };

  const getTotalSavings = () => {
    return getOriginalTotal() - getSubtotal();
  };

  const getPromoDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.type === 'percentage') {
      return (getSubtotal() * appliedPromo.discount) / 100;
    } else {
      return Math.min(appliedPromo.discount, getSubtotal());
    }
  };

  const getFinalTotal = () => {
    return Math.max(0, getSubtotal() - getPromoDiscount());
  };

  const getItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check if delivery address is provided
    if (!deliveryAddress || deliveryAddress.trim() === '') {
      toast.error('Please enter your delivery address');
      return;
    }

    navigate('/pharmacy/payment', {
      state: {
        cartItems: cart,
        totalAmount: getFinalTotal(),
        totalSavings: getTotalSavings() + getPromoDiscount(),
        itemsCount: getItemsCount(),
        appliedPromo: appliedPromo,
        deliveryAddress: deliveryAddress
      }
    });
  };

  if (cart.length === 0) {
    return (
      <PageLayout 
        title="Medicine Cart"
        subtitle="Review your selected medicines"
        showBack={true}
        backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
        textColor="text-white"
      >
        <div className="text-center py-20">
          {/* Debug Info for Empty Cart */}
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-left">
            <p><strong>Debug Info:</strong></p>
            <p>User ID: {userData?.uid || 'Not logged in'}</p>
            <p>Cart Loaded: {cartLoaded ? 'Yes' : 'No'}</p>
            <p>Cart length: {cart.length}</p>
            <button
              onClick={async () => {
                if (userData?.uid) {
                  console.log('Manual pharmacy cart reload...');
                  const result = await firestoreService.getCartFromFirebase(userData.uid, 'pharmacy');
                  console.log('Manual reload result:', result);
                  if (result.success) {
                    setCart(result.data || []);
                    toast.success('Pharmacy cart reloaded from Firebase');
                  } else {
                    toast.error('Failed to reload pharmacy cart');
                  }
                }
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Reload Cart from Firebase
            </button>
          </div>
          
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add medicines to get started with your order</p>
          <button
            onClick={() => navigate('/pharmacy')}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Browse Medicines
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={`Cart (${getItemsCount()} items)`}
      subtitle="Review your selected medicines"
      showBack={true}
      backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
      textColor="text-white"
      rightActions={
        <button
          onClick={clearCart}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-white" />
        </button>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Debug Info Panel */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>User ID: {userData?.uid || 'Not logged in'}</p>
          <p>Cart Loaded: {cartLoaded ? 'Yes' : 'No'}</p>
          <p>Cart length: {cart.length}</p>
          <p>Cart items: {JSON.stringify(cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity })))}</p>
          <button
            onClick={async () => {
              if (userData?.uid) {
                console.log('Manual pharmacy cart reload...');
                const result = await firestoreService.getCartFromFirebase(userData.uid, 'pharmacy');
                console.log('Manual reload result:', result);
                if (result.success) {
                  setCart(result.data || []);
                  toast.success('Pharmacy cart reloaded from Firebase');
                } else {
                  toast.error('Failed to reload pharmacy cart');
                }
              }
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Reload Cart from Firebase
          </button>
        </div>
        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Medicines</h2>
            <span className="text-sm text-gray-600">{getItemsCount()} items</span>
          </div>
          
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.genericName}</p>
                        <p className="text-xs text-gray-500">{item.strength} • {item.form}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.manufacturer}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {item.requiresPrescription && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Shield className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-600 font-medium">Prescription Required</span>
                      </div>
                    )}
                    
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
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Promo Code</h3>
          
          {appliedPromo ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">{appliedPromo.description}</p>
                  <p className="text-sm text-green-700">
                    You saved ₹{getPromoDiscount().toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={removePromoCode}
                className="text-green-600 hover:text-green-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={applyPromoCode}
                disabled={!promoCode.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-2">
            {['SAVE10', 'FIRST50', 'HEALTH20'].map(code => (
              <button
                key={code}
                onClick={() => {
                  setPromoCode(code);
                  setTimeout(() => applyPromoCode(), 100);
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({getItemsCount()} items)</span>
              <span className="font-medium">₹{getSubtotal().toFixed(2)}</span>
            </div>
            
            {getTotalSavings() > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Product Savings</span>
                <span className="text-green-600 font-medium">-₹{getTotalSavings().toFixed(2)}</span>
              </div>
            )}
            
            {appliedPromo && getPromoDiscount() > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Promo Discount</span>
                <span className="text-green-600 font-medium">-₹{getPromoDiscount().toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{getFinalTotal().toFixed(2)}
                  </span>
                  {(getTotalSavings() + getPromoDiscount()) > 0 && (
                    <p className="text-xs text-green-600">
                      You saved ₹{(getTotalSavings() + getPromoDiscount()).toFixed(2)}!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Notice */}
        {cart.some(item => item.requiresPrescription) && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-900">Prescription Required</p>
                <p className="text-xs text-orange-700 mt-1">
                  Some items in your cart require a valid prescription. Please upload your prescription during checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Free Delivery</p>
              <p className="text-xs text-blue-700 mt-1">
                Your order qualifies for free delivery. Estimated delivery time: 2-4 hours
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <AddressInput 
            onAddressChange={setDeliveryAddress}
            showSaveButton={true}
          />
        </div>

        {/* Checkout Button */}
        <div className="sticky bottom-4">
          <button
            onClick={proceedToCheckout}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicineCart;