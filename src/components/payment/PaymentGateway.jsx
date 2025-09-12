// Payment Gateway Component
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import {
  CreditCard,
  Smartphone,
  Building,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock,
  Wallet,
  Calendar,
  Info,
  Gift
} from 'lucide-react';

const PaymentGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  
  // Get booking details from navigation state
  const bookingDetails = location.state?.bookingDetails || null;
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showPayLater, setShowPayLater] = useState(true);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    // If no booking details, redirect back
    if (!bookingDetails) {
      navigate('/consultation');
      return;
    }
  }, [bookingDetails, navigate]);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      discount: '2% cashback'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'GPay, PhonePe, Paytm',
      discount: '₹20 instant discount'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks',
      discount: 'No charges'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, Amazon Pay',
      discount: '5% cashback'
    }
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'
  ];

  const calculateTotal = () => {
    const consultationFee = bookingDetails?.consultationFee || 0;
    const taxes = Math.round(consultationFee * 0.18); // 18% GST
    const platformFee = 50; // Fixed platform fee
    const discount = selectedPaymentMethod === 'upi' ? 20 : 0;
    
    return {
      consultationFee,
      taxes,
      platformFee,
      discount,
      total: consultationFee + taxes + platformFee - discount
    };
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Validate payment method specific details
    if (selectedPaymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert('Please fill all card details');
        return;
      }
    } else if (selectedPaymentMethod === 'upi') {
      if (!upiId) {
        alert('Please enter UPI ID');
        return;
      }
    } else if (selectedPaymentMethod === 'netbanking') {
      if (!selectedBank) {
        alert('Please select a bank');
        return;
      }
    }

    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionId = `TXN${Date.now()}`;
      const totalAmount = calculateTotal().total;
      
      // Prepare appointment data
      const appointmentData = {
        ...bookingDetails,
        paymentStatus: 'paid',
        paymentMethod: selectedPaymentMethod,
        paymentAmount: totalAmount,
        paymentDate: new Date().toISOString(),
        transactionId: transactionId,
        status: 'confirmed'
      };

      // Prepare transaction data
      const transactionData = {
        transactionId: transactionId,
        type: 'payment',
        amount: totalAmount,
        currency: 'INR',
        paymentMethod: selectedPaymentMethod,
        status: 'completed',
        description: `Payment for ${bookingDetails.appointmentType} consultation with ${bookingDetails.doctorName}`,
        metadata: {
          doctorName: bookingDetails.doctorName,
          specialty: bookingDetails.specialty,
          appointmentType: bookingDetails.appointmentType,
          consultationFee: bookingDetails.consultationFee,
          taxes: calculateTotal().taxes,
          platformFee: calculateTotal().platformFee,
          discount: calculateTotal().discount
        }
      };

      // Prepare wallet data (for cashback/rewards)
      let walletData = null;
      if (selectedPaymentMethod === 'upi' || selectedPaymentMethod === 'card') {
        const cashbackAmount = selectedPaymentMethod === 'upi' ? 10 : Math.round(totalAmount * 0.02); // 2% for card
        walletData = {
          type: 'credit',
          amount: cashbackAmount,
          description: `Cashback for ${selectedPaymentMethod} payment`,
          source: 'cashback',
          reference: transactionId
        };
      }

      // Save all data to Firebase
      const result = await firestoreService.bookAppointmentWithPayment(
        appointmentData,
        transactionData,
        walletData
      );
      
      if (result.success) {
        // Redirect to success page
        navigate('/payment-success', {
          state: {
            appointmentData: {
              ...appointmentData,
              id: result.appointmentId
            },
            transactionId: transactionId,
            transactionData: {
              ...transactionData,
              id: result.transactionId
            },
            cashbackAmount: walletData?.amount || 0
          }
        });
      } else {
        throw new Error(result.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert(`Payment failed: ${error.message}. Please try again.`);
      setProcessing(false);
    }
  };

  const handlePayLater = async () => {
    setProcessing(true);
    
    try {
      const transactionId = `PLT${Date.now()}`; // Pay Later Transaction
      const totalAmount = calculateTotal().total;
      const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      
      // Prepare appointment data for pay later
      const appointmentData = {
        ...bookingDetails,
        paymentStatus: 'pay_later',
        paymentMethod: 'pay_later',
        paymentAmount: totalAmount,
        dueDate: dueDate.toISOString(),
        transactionId: transactionId,
        status: 'confirmed'
      };

      // Prepare transaction data for pay later
      const transactionData = {
        transactionId: transactionId,
        type: 'pay_later',
        amount: totalAmount,
        currency: 'INR',
        paymentMethod: 'pay_later',
        status: 'pending',
        dueDate: dueDate.toISOString(),
        description: `Pay Later for ${bookingDetails.appointmentType} consultation with ${bookingDetails.doctorName}`,
        metadata: {
          doctorName: bookingDetails.doctorName,
          specialty: bookingDetails.specialty,
          appointmentType: bookingDetails.appointmentType,
          consultationFee: bookingDetails.consultationFee,
          taxes: calculateTotal().taxes,
          platformFee: calculateTotal().platformFee,
          discount: calculateTotal().discount
        }
      };

      // Save appointment and transaction data to Firebase
      const result = await firestoreService.bookAppointmentWithPayment(
        appointmentData,
        transactionData
      );
      
      if (result.success) {
        // Redirect to success page
        navigate('/payment-success', {
          state: {
            appointmentData: {
              ...appointmentData,
              id: result.appointmentId
            },
            transactionData: {
              ...transactionData,
              id: result.transactionId
            },
            payLater: true
          }
        });
      } else {
        throw new Error(result.error || 'Failed to process pay later request');
      }
    } catch (error) {
      console.error('Pay later processing error:', error);
      alert(`Booking failed: ${error.message}. Please try again.`);
      setProcessing(false);
    }
  };

  if (!bookingDetails) {
    return null;
  }

  const totals = calculateTotal();

  return (
    <PageLayout 
      title="Payment"
      showBack={true}
      onBack={() => navigate(-1)}
    >
      <div className="space-y-4">
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Doctor</span>
              <span className="font-medium">{bookingDetails.doctorName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Specialty</span>
              <span className="font-medium">{bookingDetails.specialty}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Consultation Type</span>
              <span className="font-medium capitalize">{bookingDetails.appointmentType.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">{new Date().toLocaleDateString()} - {bookingDetails.timeSlot || 'Available Now'}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="relative">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <method.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                    {method.discount && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {method.discount}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Details */}
        {selectedPaymentMethod === 'card' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Card Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'upi' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">UPI Payment</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'netbanking' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Bank</h3>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {banks.map((bank) => (
                <label key={bank} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input
                    type="radio"
                    name="bank"
                    value={bank}
                    checked={selectedBank === bank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">{bank}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Bill Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Consultation Fee</span>
              <span>₹{totals.consultationFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Fee</span>
              <span>₹{totals.platformFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes (18% GST)</span>
              <span>₹{totals.taxes}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-₹{totals.discount}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-base font-semibold">
                <span>Total Amount</span>
                <span>₹{totals.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-900">100% Secure Payment</p>
              <p className="text-xs text-blue-700">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="space-y-3 sticky bottom-4 bg-gray-50 -mx-4 p-4 rounded-t-2xl">
          <button
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{totals.total}</span>
              </>
            )}
          </button>

          {showPayLater && (
            <button
              onClick={handlePayLater}
              disabled={processing}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border border-gray-200"
            >
              <Clock className="w-4 h-4" />
              <span>Pay Later (Due in 24 hours)</span>
            </button>
          )}

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Info className="w-3 h-3" />
            <span>Pay later option available for 24 hours only</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentGateway;