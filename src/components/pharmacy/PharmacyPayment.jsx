// Pharmacy Payment Gateway Component
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import toast from 'react-hot-toast';
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
  Package,
  Upload,
  FileText
} from 'lucide-react';

const PharmacyPayment = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // Get cart data from navigation state
  const cartItems = location.state?.cartItems || [];
  const totalAmount = location.state?.totalAmount || 0;
  const totalSavings = location.state?.totalSavings || 0;
  const itemsCount = location.state?.itemsCount || 0;
  const appliedPromo = location.state?.appliedPromo || null;

  // Payment methods
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, popular: true },
    { id: 'upi', name: 'UPI', icon: Smartphone, cashback: '₹10 cashback' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2 },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet, cashback: '2% cashback' },
    { id: 'cod', name: 'Cash on Delivery', icon: Package }
  ];

  // Address management
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: userData?.name || '',
    phone: userData?.phone || '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home'
  });

  // Card payment states
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // UPI payment states
  const [upiId, setUpiId] = useState('');

  // Net banking states
  const [selectedBank, setSelectedBank] = useState('');

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank',
    'Bank of Baroda', 'Canara Bank', 'Union Bank', 'Kotak Mahindra Bank', 'IndusInd Bank'
  ];

  useEffect(() => {
    // Redirect if no cart items
    if (cartItems.length === 0) {
      toast.error('No items in cart');
      navigate('/pharmacy/cart');
      return;
    }

    // Load user's saved address from Firebase or set default
    if (userData?.uid) {
      // You could implement getUserAddresses from Firebase here
      // For now, using default values from userData
      setDeliveryAddress(prev => ({
        ...prev,
        fullName: userData.name || '',
        phone: userData.phone || userData.phoneNumber || ''
      }));
    }
  }, [cartItems, navigate, userData]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.error('Please upload an image or PDF file');
        return;
      }
      
      setPrescriptionFile(file);
      toast.success('Prescription uploaded successfully');
    }
  };

  const validateForm = () => {
    if (selectedPaymentMethod === 'card') {
      return cardDetails.number && cardDetails.expiry && cardDetails.cvv && cardDetails.name;
    } else if (selectedPaymentMethod === 'upi') {
      return upiId.includes('@');
    } else if (selectedPaymentMethod === 'netbanking') {
      return selectedBank !== '';
    }
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required payment details');
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode) {
      toast.error('Please provide complete delivery address');
      return;
    }

    // Check if prescription is required for any item
    const requiresPrescription = cartItems.some(item => item.requiresPrescription);
    if (requiresPrescription && !prescriptionFile) {
      toast.error('Please upload prescription for prescription medicines');
      return;
    }

    setOrderProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate order ID
      const newOrderId = 'PH' + Date.now();
      
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
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        pharmacy: {
          name: 'HealthAlign Pharmacy',
          address: 'HealthAlign Pharmacy Network',
          phone: '+91 1800-123-4567'
        },
        delivery: {
          address: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.pincode}`,
          type: 'standard',
          charges: 0
        },
        payment: {
          method: selectedPaymentMethod,
          transactionId: 'TXN' + Date.now(),
          status: 'completed'
        },
        tracking: {
          orderPlaced: new Date().toISOString(),
          orderConfirmed: new Date().toISOString(),
          shipped: null,
          delivered: null
        },
        appliedPromo
      };

      // Save order to Firebase
      const result = await firestoreService.createPharmacyOrderWithPayment(
        orderData,
        {
          amount: totalAmount,
          paymentMethod: selectedPaymentMethod,
          status: 'completed',
          description: `Pharmacy order payment for ${itemsCount} items`
        }
      );
      
      if (result.success) {
        setOrderId(newOrderId);
        setOrderSuccess(true);
        
        // Clear cart from Firebase
        if (userData?.uid) {
          await firestoreService.clearCartFromFirebase(userData.uid, 'pharmacy');
        }
        
        // Save delivery address to user profile in Firebase (optional)
        // You could save this to a user's addresses collection
        
        toast.success('Order placed successfully!', {
          icon: '🎉',
          duration: 4000
        });
      } else {
        throw new Error('Failed to create order');
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

  // Show order success screen
  if (orderSuccess) {
    return (
      <PageLayout 
        title="Order Confirmed"
        showBack={false}
        backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
        textColor="text-white"
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your pharmacy order has been placed successfully
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Order ID:</span>
                <span className="font-medium text-green-900">{orderId}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-green-700">Total Amount:</span>
                <span className="font-medium text-green-900">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-green-700">Items:</span>
                <span className="font-medium text-green-900">{itemsCount} items</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <button
                onClick={() => navigate('/pharmacy/orders')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Track Your Order
              </button>
              <button
                onClick={() => navigate('/pharmacy')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>📧 Order confirmation sent to your email</p>
              <p>📱 You'll receive SMS updates about your order</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <PageLayout title="Payment" showBack={true}>
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No items to pay for</h2>
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/pharmacy')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Medicines
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Payment"
      subtitle="Complete your pharmacy order"
      showBack={true}
      backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
      textColor="text-white"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items ({itemsCount})</span>
              <span className="font-medium">₹{(totalAmount + totalSavings).toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Savings</span>
                <span className="text-green-600 font-medium">-₹{totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Upload */}
        {cartItems.some(item => item.requiresPrescription) && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Prescription</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {prescriptionFile ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 text-green-600 mx-auto" />
                  <p className="text-sm font-medium text-gray-900">{prescriptionFile.name}</p>
                  <p className="text-xs text-gray-500">{(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    onClick={() => setPrescriptionFile(null)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload your prescription</p>
                    <p className="text-xs text-gray-500 mt-1">Required for prescription medicines</p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-green-600 hover:text-green-700 flex items-center space-x-1"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </button>
          </div>
          
          {showAddressForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={deliveryAddress.fullName}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, fullName: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <input
                type="text"
                placeholder="Street Address"
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={deliveryAddress.landmark}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, landmark: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={deliveryAddress.state}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={deliveryAddress.pincode}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, pincode: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <button
                onClick={() => setShowAddressForm(false)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Address
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{deliveryAddress.fullName}</p>
                  <p className="text-sm text-gray-600">{deliveryAddress.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {deliveryAddress.street ? (
                      `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.pincode}`
                    ) : (
                      'Please add delivery address'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <method.icon className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{method.name}</span>
                    {method.popular && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Popular</span>
                    )}
                  </div>
                  {method.cashback && (
                    <p className="text-sm text-green-600">{method.cashback}</p>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Payment Details Forms */}
          {selectedPaymentMethod === 'card' && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium text-gray-900">Card Details</h4>
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {selectedPaymentMethod === 'upi' && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">UPI Details</h4>
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., user@paytm)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {selectedPaymentMethod === 'netbanking' && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Select Bank</h4>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Choose your bank</option>
                {banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Pay Button */}
        <div className="sticky bottom-4">
          <button
            onClick={processPayment}
            disabled={orderProcessing}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            {orderProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Pay ₹{totalAmount.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default PharmacyPayment;