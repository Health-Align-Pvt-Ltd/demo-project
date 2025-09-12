// Medicine Payment Gateway Component
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Shield, 
  MapPin, 
  Edit3,
  Plus,
  Trash2,
  AlertCircle,
  Lock,
  Star,
  Gift,
  Truck,
  Package
} from 'lucide-react';

const MedicinePayment = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Get cart data from navigation state
  const cartItems = location.state?.cartItems || [];
  const totalAmount = location.state?.totalAmount || 0;
  const totalSavings = location.state?.totalSavings || 0;
  const itemsCount = location.state?.itemsCount || 0;
  const prescriptionFile = location.state?.prescriptionFile || null;

  // Form states
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: userData?.name || '',
    phone: userData?.phoneNumber || '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [savedAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street, Downtown Area, Mumbai, Maharashtra 400001',
      phone: '+91 9876543210',
      isDefault: true
    },
    {
      id: 2,
      name: 'Office',
      address: '456 Business Park, Sector 5, Pune, Maharashtra 411001',
      phone: '+91 9876543210',
      isDefault: false
    }
  ]);

  useEffect(() => {
    // Redirect if no cart items
    if (cartItems.length === 0) {
      navigate('/medicine');
      return;
    }

    // Set default address if available
    const defaultAddress = savedAddresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      const addressParts = defaultAddress.address.split(', ');
      setDeliveryAddress(prev => ({
        ...prev,
        street: addressParts[0] || '',
        area: addressParts[1] || '',
        city: addressParts[2] || '',
        state: addressParts[3] || '',
        pincode: addressParts[4] || '',
        phone: defaultAddress.phone
      }));
    }
  }, [cartItems, navigate, savedAddresses]);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Rupay',
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
      popular: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'All major banks supported'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, Amazon Pay, etc.'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Package,
      description: 'Pay when you receive'
    }
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'
  ];

  const handleCardInputChange = (field, value) => {
    if (field === 'number') {
      // Format card number with spaces
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.replace(/\s/g, '').length > 16) return;
    } else if (field === 'expiry') {
      // Format expiry as MM/YY
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (value.length > 5) return;
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) return;
    }
    
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (selectedPaymentMethod === 'card') {
      return cardDetails.number.replace(/\s/g, '').length === 16 &&
             cardDetails.expiry.length === 5 &&
             cardDetails.cvv.length === 3 &&
             cardDetails.name.trim() !== '';
    } else if (selectedPaymentMethod === 'upi') {
      return upiId.includes('@') && upiId.length > 5;
    } else if (selectedPaymentMethod === 'netbanking') {
      return selectedBank !== '';
    }
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) {
      alert('Please fill all required payment details');
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode) {
      alert('Please provide complete delivery address');
      return;
    }

    setOrderProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate order ID
      const newOrderId = 'MED' + Date.now();
      
      // Prepare order data
      const orderData = {
        orderId: newOrderId,
        userId: userData.uid,
        items: cartItems,
        totalAmount,
        totalSavings,
        itemsCount,
        paymentMethod: selectedPaymentMethod,
        deliveryAddress,
        prescriptionFile: prescriptionFile ? prescriptionFile.name : null,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
      };

      // Save order to Firebase
      const result = await firestoreService.createMedicineOrderWithPayment(
        orderData,
        {
          amount: totalAmount,
          paymentMethod: selectedPaymentMethod,
          status: 'completed',
          description: `Medicine order payment for ${itemsCount} items`
        }
      );
      
      if (result.success) {
        setOrderId(newOrderId);
        setOrderSuccess(true);
      } else {
        throw new Error('Failed to create order');
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleBackToMedicine = () => {
    navigate('/medicine');
  };

  // Show order success screen
  if (orderSuccess) {
    return (
      <PageLayout 
        title="Order Confirmed"
        showBack={false}
        className="bg-gray-50"
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your medicine order has been placed successfully</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-lg font-semibold text-gray-900">{orderId}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Estimated Delivery</span>
                </div>
                <p className="text-sm text-gray-600">2-3 business days</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Total Amount</span>
                </div>
                <p className="text-sm text-gray-600">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/medicine', { state: { tab: 'orders' } })}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Track Order
              </button>
              <button
                onClick={handleBackToMedicine}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Payment"
      showBack={true}
      className="bg-gray-50"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            {cartItems.slice(0, 2).map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            {cartItems.length > 2 && (
              <p className="text-sm text-gray-600">+{cartItems.length - 2} more items</p>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items ({itemsCount})</span>
              <span>₹{(totalAmount + totalSavings).toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Savings</span>
                <span className="text-green-600">-₹{totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              {showAddressForm ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {!showAddressForm ? (
            <div className="space-y-3">
              {savedAddresses.map(address => (
                <div key={address.id} className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  address.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{address.name}</p>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    </div>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={deliveryAddress.name}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={deliveryAddress.phone}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Street Address"
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Area/Locality"
                value={deliveryAddress.area}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, area: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="City"
                value={deliveryAddress.city}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="State"
                value={deliveryAddress.state}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={deliveryAddress.pincode}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, pincode: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={deliveryAddress.landmark}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, landmark: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
          
          <div className="space-y-3 mb-6">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${
                      selectedPaymentMethod === method.id ? 'text-green-600' : 'text-gray-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{method.name}</p>
                        {method.popular && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedPaymentMethod === method.id 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-white -m-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Form */}
          {selectedPaymentMethod === 'card' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={(e) => handleCardInputChange('number', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardDetails.name}
                onChange={(e) => handleCardInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {selectedPaymentMethod === 'upi' && (
            <div>
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., username@paytm)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {selectedPaymentMethod === 'netbanking' && (
            <div>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select your bank</option>
                {banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
          )}

          {selectedPaymentMethod === 'cod' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Cash on Delivery available. Pay ₹{totalAmount.toFixed(2)} when your order arrives.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              Your payment information is secure and encrypted. We never store your card details.
            </p>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
          <button
            onClick={processPayment}
            disabled={orderProcessing || !validateForm()}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {orderProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Place Order - ₹{totalAmount.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicinePayment;