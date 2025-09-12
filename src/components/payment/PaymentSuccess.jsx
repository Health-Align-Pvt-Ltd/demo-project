// Payment Success Component
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../common/PageLayout';
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  CreditCard,
  Download,
  Share,
  Home,
  MessageCircle,
  Phone,
  MapPin,
  Copy,
  ExternalLink,
  Gift,
  FileText
} from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { appointmentData, transactionId, transactionData, payLater, cashbackAmount } = location.state || {};

  useEffect(() => {
    // If no appointment data, redirect to home
    if (!appointmentData) {
      navigate('/dashboard');
    }
  }, [appointmentData, navigate]);

  const copyTransactionId = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      // You could add a toast notification here
      alert('Transaction ID copied to clipboard');
    }
  };

  const shareAppointment = async () => {
    const shareData = {
      title: 'Health Align - Appointment Booked',
      text: `Appointment booked with ${appointmentData?.doctorName} for ${appointmentData?.specialty}`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `${shareData.text} - ${shareData.url}`;
      navigator.clipboard.writeText(text);
      alert('Appointment details copied to clipboard');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!appointmentData) {
    return null;
  }

  return (
    <PageLayout 
      title={payLater ? "Booking Confirmed" : "Payment Successful"}
      showBack={false}
    >
      <div className="space-y-6">
        {/* Success Animation/Icon */}
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {payLater ? 'Booking Confirmed!' : 'Payment Successful!'}
          </h1>
          <p className="text-sm text-gray-600">
            {payLater 
              ? 'Your appointment has been booked. Payment due in 24 hours.'
              : 'Your appointment has been confirmed and payment processed successfully.'
            }
          </p>
        </div>

        {/* Cashback Notification */}
        {!payLater && cashbackAmount > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <Gift className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-green-900 mb-1">Cashback Earned! 🎉</h3>
                <p className="text-sm text-green-800 mb-2">
                  You've earned ₹{cashbackAmount} cashback which has been added to your wallet.
                </p>
                <p className="text-xs text-green-700">
                  Use this cashback for your next booking or withdraw to your bank account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Details */}
        {!payLater && transactionId && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Transaction Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transaction ID</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono font-medium">{transactionId}</span>
                  <button
                    onClick={copyTransactionId}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-medium">₹{appointmentData.paymentAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium capitalize">{appointmentData.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">
                  {formatDate(appointmentData.paymentDate)} at {formatTime(appointmentData.paymentDate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pay Later Details */}
        {payLater && (
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-orange-900 mb-1">Payment Due</h3>
                <p className="text-sm text-orange-800 mb-2">
                  Please complete payment of ₹{appointmentData.paymentAmount} within 24 hours to confirm your appointment.
                </p>
                <p className="text-xs text-orange-700">
                  Due: {formatDate(appointmentData.dueDate)} at {formatTime(appointmentData.dueDate)}
                </p>
                <button className="mt-2 text-xs bg-orange-600 text-white px-3 py-1 rounded-full hover:bg-orange-700">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{appointmentData.doctorName}</p>
                <p className="text-xs text-blue-600">{appointmentData.specialty}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{formatDate(appointmentData.appointmentDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="font-medium">{appointmentData.timeSlot || 'Available Now'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-4 flex items-center justify-center">
                {appointmentData.appointmentType === 'video' && <MessageCircle className="w-4 h-4 text-green-600" />}
                {appointmentData.appointmentType === 'chat' && <MessageCircle className="w-4 h-4 text-purple-600" />}
                {appointmentData.appointmentType === 'in-person' && <MapPin className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <p className="text-gray-600">Consultation Type</p>
                <p className="font-medium capitalize">{appointmentData.appointmentType.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">What's Next?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            {appointmentData.appointmentType === 'video' && (
              <>
                <p>• You'll receive a video call link 15 minutes before your appointment</p>
                <p>• Please ensure you have a stable internet connection</p>
                <p>• Keep your medical documents ready</p>
              </>
            )}
            {appointmentData.appointmentType === 'chat' && (
              <>
                <p>• Chat consultation will be available in your appointments section</p>
                <p>• Doctor will respond within the scheduled time</p>
                <p>• You can upload images and documents during chat</p>
              </>
            )}
            {appointmentData.appointmentType === 'in-person' && (
              <>
                <p>• Please arrive 15 minutes early to the hospital</p>
                <p>• Bring your medical documents and ID proof</p>
                <p>• Follow hospital safety protocols</p>
              </>
            )}
            <p>• You'll receive appointment reminders via SMS and email</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareAppointment}
              className="flex items-center justify-center space-x-2 py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
          
          <button
            onClick={() => navigate(`/appointment/${appointmentData.id}`)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>View Appointment Details</span>
          </button>
          
          <button
            onClick={() => navigate('/consultation')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium text-sm hover:bg-gray-200 flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium text-sm hover:bg-gray-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Support */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 mb-2">Need help with your appointment?</p>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700">
              <Phone className="w-3 h-3" />
              <span>Call Support</span>
            </button>
            <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700">
              <MessageCircle className="w-3 h-3" />
              <span>Live Chat</span>
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentSuccess;