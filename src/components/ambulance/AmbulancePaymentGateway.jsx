// Ambulance Payment Gateway Component
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
  Lock,
  Wallet,
  Info,
  Gift,
  Heart,
  HelpCircle,
  FileText,
  Truck,
  MapPin,
  Phone,
  User
} from 'lucide-react';

const AmbulancePaymentGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  
  // Get ambulance booking details from navigation state
  const ambulanceBookingDetails = location.state?.ambulanceBookingDetails || null;
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [financialAidApplication, setFinancialAidApplication] = useState({
    reason: '',
    monthlyIncome: '',
    familySize: '',
    documents: []
  });

  useEffect(() => {
    // If no booking details, redirect back
    if (!ambulanceBookingDetails) {
      navigate('/ambulance');
      return;
    }
  }, [ambulanceBookingDetails, navigate]);

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
      discount: '₹50 instant discount'
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
    },
    {
      id: 'financial_aid',
      name: 'Financial Assistance',
      icon: Heart,
      description: 'Government & NGO support',
      discount: 'Up to 90% subsidy'
    }
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'
  ];

  const urgencyPricing = {
    critical: { basePrice: 2000, multiplier: 2.0, label: 'Critical Emergency' },
    high: { basePrice: 1500, multiplier: 1.5, label: 'High Priority' },
    medium: { basePrice: 1000, multiplier: 1.2, label: 'Medium Priority' },
    low: { basePrice: 800, multiplier: 1.0, label: 'Low Priority' }
  };

  const calculateTotal = () => {
    const urgencyLevel = ambulanceBookingDetails?.urgency || 'medium';
    const pricing = urgencyPricing[urgencyLevel];
    
    // New pricing structure: Base fare ₹500 + ₹18 per km
    const baseFare = 500; // Minimum fare ₹500
    const distance = ambulanceBookingDetails?.estimatedDistance || 5; // Default 5km
    const distanceCharge = distance * 18; // ₹18 per km
    
    const ambulanceFee = Math.max(baseFare, baseFare + distanceCharge);
    const emergencyResponseFee = pricing.basePrice - baseFare; // Additional emergency fee based on urgency
    const taxes = Math.round((ambulanceFee + emergencyResponseFee) * 0.18); // 18% GST
    
    let discount = 0;
    if (selectedPaymentMethod === 'upi') discount = 50;
    else if (selectedPaymentMethod === 'card') discount = Math.round(ambulanceFee * 0.02);
    else if (selectedPaymentMethod === 'financial_aid') discount = Math.round((ambulanceFee + emergencyResponseFee + taxes) * 0.9); // 90% subsidy
    
    return {
      ambulanceFee,
      distanceCharge,
      emergencyResponseFee,
      taxes,
      discount,
      total: Math.max(0, ambulanceFee + emergencyResponseFee + taxes - discount)
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
    } else if (selectedPaymentMethod === 'financial_aid') {
      if (!financialAidApplication.reason || !financialAidApplication.monthlyIncome) {
        alert('Please fill all financial aid application details');
        return;
      }
    }

    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionId = `AMB${Date.now()}`;
      const totalAmount = calculateTotal().total;
      
      // Prepare ambulance booking data
      const bookingData = {
        ...ambulanceBookingDetails,
        paymentStatus: selectedPaymentMethod === 'financial_aid' ? 'financial_aid_pending' : 'paid',
        paymentMethod: selectedPaymentMethod,
        paymentAmount: totalAmount,
        paymentDate: new Date().toISOString(),
        transactionId: transactionId,
        status: 'confirmed',
        financialAidDetails: selectedPaymentMethod === 'financial_aid' ? financialAidApplication : null
      };

      // Prepare transaction data
      const transactionData = {
        transactionId: transactionId,
        type: selectedPaymentMethod === 'financial_aid' ? 'financial_aid' : 'payment',
        amount: totalAmount,
        currency: 'INR',
        paymentMethod: selectedPaymentMethod,
        status: selectedPaymentMethod === 'financial_aid' ? 'pending_approval' : 'completed',
        description: `Ambulance booking for ${ambulanceBookingDetails.condition} emergency`,
        metadata: {
          urgency: ambulanceBookingDetails.urgency,
          condition: ambulanceBookingDetails.condition,
          patientName: ambulanceBookingDetails.patientName,
          ambulanceFee: calculateTotal().ambulanceFee,
          distanceCharge: calculateTotal().distanceCharge,
          emergencyResponseFee: calculateTotal().emergencyResponseFee,
          taxes: calculateTotal().taxes,
          discount: calculateTotal().discount
        }
      };

      // Prepare wallet data (for cashback/rewards)
      let walletData = null;
      if (selectedPaymentMethod === 'upi' || selectedPaymentMethod === 'card') {
        const cashbackAmount = selectedPaymentMethod === 'upi' ? 25 : Math.round(totalAmount * 0.02);
        walletData = {
          type: 'credit',
          amount: cashbackAmount,
          description: `Cashback for ${selectedPaymentMethod} ambulance payment`,
          source: 'cashback',
          reference: transactionId
        };
      }

      // Save ambulance booking data to Firebase
      const bookingResult = await firestoreService.updateAmbulanceBooking(
        ambulanceBookingDetails.bookingId,
        {
          paymentStatus: selectedPaymentMethod === 'financial_aid' ? 'financial_aid_pending' : 'paid',
          paymentMethod: selectedPaymentMethod,
          paymentAmount: totalAmount,
          paymentDate: new Date().toISOString(),
          transactionId: transactionId,
          status: 'confirmed',
          financialAidDetails: selectedPaymentMethod === 'financial_aid' ? financialAidApplication : null
        }
      );
      
      // Create transaction record
      const transactionResult = await firestoreService.createTransaction({
        ...transactionData,
        userId: userData.uid,
        bookingId: ambulanceBookingDetails.bookingId
      });
      
      // Add cashback to wallet if applicable
      if (walletData) {
        await firestoreService.addWalletTransaction(userData.uid, walletData);
      }
      
      if (bookingResult.success && transactionResult.success) {
        // Prepare payment data for success page
        const paymentData = {
          bookingId: ambulanceBookingDetails.bookingId,
          transactionId: transactionId,
          patientName: ambulanceBookingDetails.patientName,
          condition: ambulanceBookingDetails.condition,
          urgency: ambulanceBookingDetails.urgency,
          paymentMethod: selectedPaymentMethod,
          baseAmount: totals.ambulanceFee,
          distanceCharge: totals.distanceCharge,
          urgencyCharge: totals.emergencyResponseFee,
          discount: totals.discount,
          finalAmount: totals.total,
          cashback: walletData?.amount || 0,
          subsidyPercentage: selectedPaymentMethod === 'financial_aid' ? '90%' : null
        };
        
        // Redirect to success page
        navigate('/ambulance-payment-success', {
          state: { paymentData }
        });
      } else {
        throw new Error('Failed to process payment - booking or transaction update failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert(`Payment failed: ${error.message}. Please try again.`);
      setProcessing(false);
    }
  };

  if (!ambulanceBookingDetails) {
    return null;
  }

  const totals = calculateTotal();

  return (
    <PageLayout 
      title="Ambulance Payment"
      showBack={true}
      onBack={() => navigate(-1)}
    >
      <div className="space-y-4">
        {/* Emergency Booking Summary */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Truck className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-semibold text-red-900">Emergency Ambulance Booking</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-red-700">Patient</span>
              <span className="font-medium text-red-900">{ambulanceBookingDetails.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700">Condition</span>
              <span className="font-medium text-red-900">{ambulanceBookingDetails.condition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700">Urgency</span>
              <span className={`font-medium ${
                ambulanceBookingDetails.urgency === 'critical' ? 'text-red-900' :
                ambulanceBookingDetails.urgency === 'high' ? 'text-orange-700' :
                'text-yellow-700'
              }`}>
                {urgencyPricing[ambulanceBookingDetails.urgency]?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700">Pickup Location</span>
              <span className="font-medium text-red-900 text-right max-w-xs truncate">
                {ambulanceBookingDetails.pickupLocation}
              </span>
            </div>
            {ambulanceBookingDetails.selectedHospital && (
              <div className="flex justify-between">
                <span className="text-red-700">Destination</span>
                <span className="font-medium text-red-900 text-right max-w-xs truncate">
                  {ambulanceBookingDetails.selectedHospital.name}
                </span>
              </div>
            )}
            {ambulanceBookingDetails.estimatedDistance && (
              <div className="flex justify-between">
                <span className="text-red-700">Distance</span>
                <span className="font-medium text-red-900">
                  {ambulanceBookingDetails.estimatedDistance.toFixed(1)} km
                </span>
              </div>
            )}
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
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      method.id === 'financial_aid' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <method.icon className={`w-4 h-4 ${
                        method.id === 'financial_aid' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                    {method.discount && (
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        method.id === 'financial_aid' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-900">{bank}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'financial_aid' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Financial Assistance Application</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Reason for Financial Aid *</label>
                <select
                  value={financialAidApplication.reason}
                  onChange={(e) => setFinancialAidApplication({...financialAidApplication, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select reason</option>
                  <option value="below_poverty_line">Below Poverty Line (BPL)</option>
                  <option value="senior_citizen">Senior Citizen (65+)</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                  <option value="medical_emergency">Medical Emergency</option>
                  <option value="natural_disaster">Natural Disaster Victim</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Monthly Income *</label>
                  <select
                    value={financialAidApplication.monthlyIncome}
                    onChange={(e) => setFinancialAidApplication({...financialAidApplication, monthlyIncome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select income</option>
                    <option value="0-5000">₹0 - ₹5,000</option>
                    <option value="5001-10000">₹5,001 - ₹10,000</option>
                    <option value="10001-15000">₹10,001 - ₹15,000</option>
                    <option value="15001-25000">₹15,001 - ₹25,000</option>
                    <option value="above-25000">Above ₹25,000</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Family Size</label>
                  <input
                    type="number"
                    placeholder="4"
                    value={financialAidApplication.familySize}
                    onChange={(e) => setFinancialAidApplication({...financialAidApplication, familySize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-xs text-yellow-800">
                    <p className="font-medium mb-1">Required Documents (Submit later):</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Income certificate</li>
                      <li>BPL card (if applicable)</li>
                      <li>Aadhaar card</li>
                      <li>Medical emergency certificate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bill Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ambulance Service Fee</span>
              <span>₹{totals.ambulanceFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Emergency Response Fee</span>
              <span>₹{totals.emergencyResponseFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distance Charge ({ambulanceBookingDetails?.estimatedDistance || 5} km)</span>
              <span>₹{totals.distanceCharge}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes (18% GST)</span>
              <span>₹{totals.taxes}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>{selectedPaymentMethod === 'financial_aid' ? 'Financial Assistance' : 'Discount'}</span>
                <span>-₹{totals.discount}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-base font-semibold">
                <span>Total Amount</span>
                <span>₹{totals.total}</span>
              </div>
              {selectedPaymentMethod === 'financial_aid' && (
                <p className="text-xs text-red-600 mt-1">
                  * Subject to approval by financial assistance committee
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-900">Emergency Service Guarantee</p>
              <p className="text-xs text-blue-700">
                {selectedPaymentMethod === 'financial_aid' 
                  ? 'Financial assistance applications are processed within 2 hours for emergencies'
                  : 'Your payment is secure and ambulance will be dispatched immediately'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="sticky bottom-4 bg-gray-50 -mx-4 p-4 rounded-t-2xl">
          <button
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || processing}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {selectedPaymentMethod === 'financial_aid' 
                    ? `Apply for Financial Aid (₹${totals.total})`
                    : `Confirm Emergency Booking (₹${totals.total})`
                  }
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-2">
            <HelpCircle className="w-3 h-3" />
            <span>
              {selectedPaymentMethod === 'financial_aid' 
                ? 'Application reviewed within 2 hours for emergencies'
                : 'Ambulance dispatched immediately after payment'
              }
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AmbulancePaymentGateway;