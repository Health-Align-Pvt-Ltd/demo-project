// Appointment Details & Bill Component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Video,
  MessageCircle,
  CreditCard,
  Receipt,
  Download,
  Share,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Star,
  FileText,
  Shield,
  Banknote,
  Smartphone,
  Building,
  Wallet,
  Info,
  ExternalLink
} from 'lucide-react';

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (appointmentId) {
      loadAppointmentDetails();
    }
  }, [appointmentId]);

  const loadAppointmentDetails = async () => {
    setLoading(true);
    try {
      // Load appointment details
      const appointmentResult = await firestoreService.read('appointments', appointmentId);
      if (appointmentResult.success) {
        setAppointment(appointmentResult.data);
        
        // Load related transaction if exists
        if (appointmentResult.data.transactionId) {
          const transactions = await firestoreService.getUserTransactions(userData.uid);
          if (transactions.success) {
            const relatedTransaction = transactions.data.find(
              t => t.transactionId === appointmentResult.data.transactionId
            );
            setTransaction(relatedTransaction);
          }
        }
      }
    } catch (error) {
      console.error('Error loading appointment details:', error);
    }
    setLoading(false);
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

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const copyTransactionId = () => {
    if (appointment?.transactionId) {
      navigator.clipboard.writeText(appointment.transactionId);
      alert('Transaction ID copied to clipboard');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'upi':
        return <Smartphone className="w-4 h-4" />;
      case 'netbanking':
        return <Building className="w-4 h-4" />;
      case 'wallet':
        return <Wallet className="w-4 h-4" />;
      case 'pay_later':
        return <Clock className="w-4 h-4" />;
      default:
        return <Banknote className="w-4 h-4" />;
    }
  };

  const getAppointmentTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-green-600" />;
      case 'chat':
        return <MessageCircle className="w-5 h-5 text-purple-600" />;
      case 'in-person':
        return <MapPin className="w-5 h-5 text-blue-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const downloadBill = () => {
    window.print();
  };

  const shareAppointment = async () => {
    const shareData = {
      title: 'Health Align - Appointment Details',
      text: `Appointment with ${appointment?.doctorName} on ${formatDate(appointment?.appointmentDate)}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
      alert('Appointment details copied to clipboard');
    }
  };

  if (loading) {
    return (
      <PageLayout title="Appointment Details">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (!appointment) {
    return (
      <PageLayout title="Appointment Not Found">
        <div className="text-center py-20">
          <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Appointment not found</p>
          <button
            onClick={() => navigate('/consultation')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Appointments
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Appointment Details"
      showShare={true}
      onShare={shareAppointment}
    >
      <div className="space-y-4">
        {/* Status Header */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(appointment.status)}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Appointment #{appointment.id?.slice(-8) || 'N/A'}
                </h1>
                <p className="text-sm text-gray-500">
                  {formatDate(appointment.appointmentDate)} at {appointment.timeSlot || formatTime(appointment.appointmentDate)}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm -mx-4">
          <div className="px-4">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('bill')}
                className={`py-3 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'bill'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Bill & Payment
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Doctor & Appointment Info */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Appointment Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{appointment.doctorName}</p>
                    <p className="text-xs text-blue-600">{appointment.specialty}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium">{formatDate(appointment.appointmentDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium">{appointment.timeSlot || formatTime(appointment.appointmentDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getAppointmentTypeIcon(appointment.appointmentType)}
                  <div>
                    <p className="text-xs text-gray-500">Consultation Type</p>
                    <p className="text-sm font-medium capitalize">{appointment.appointmentType?.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Patient Name</span>
                  <span className="font-medium">{userData?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-medium">{userData?.phoneNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{userData?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Appointment Actions */}
            {appointment.status === 'confirmed' && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Steps</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  {appointment.appointmentType === 'video' && (
                    <>
                      <p>• Join the video call 5 minutes before your appointment</p>
                      <p>• Ensure you have a stable internet connection</p>
                      <p>• Keep your medical documents ready</p>
                    </>
                  )}
                  {appointment.appointmentType === 'chat' && (
                    <>
                      <p>• Chat will be available in your appointments section</p>
                      <p>• You can upload images and documents during chat</p>
                    </>
                  )}
                  {appointment.appointmentType === 'in-person' && (
                    <>
                      <p>• Arrive 15 minutes early to the hospital</p>
                      <p>• Bring your medical documents and ID proof</p>
                    </>
                  )}
                </div>
                
                <div className="mt-3 flex space-x-2">
                  {appointment.appointmentType === 'video' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      <Video className="w-4 h-4" />
                      <span>Join Video Call</span>
                    </button>
                  )}
                  {appointment.appointmentType === 'chat' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>Start Chat</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bill' && (
          <div className="space-y-4">
            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Payment Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  appointment.paymentStatus === 'pay_later' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment.paymentStatus === 'paid' ? 'Paid' : 
                   appointment.paymentStatus === 'pay_later' ? 'Pay Later' : 'Pending'}
                </span>
              </div>

              {appointment.paymentStatus === 'pay_later' && appointment.dueDate && (
                <div className="bg-orange-50 rounded-lg p-3 mb-3 border border-orange-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Payment Due</p>
                      <p className="text-xs text-orange-700">
                        Due: {formatDate(appointment.dueDate)} at {formatTime(appointment.dueDate)}
                      </p>
                      <button className="mt-2 text-xs bg-orange-600 text-white px-3 py-1 rounded-full hover:bg-orange-700">
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <div className="flex items-center space-x-2">
                    {getPaymentMethodIcon(appointment.paymentMethod)}
                    <span className="font-medium capitalize">{appointment.paymentMethod?.replace('_', ' ')}</span>
                  </div>
                </div>
                {appointment.transactionId && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Transaction ID</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs">{appointment.transactionId}</span>
                      <button
                        onClick={copyTransactionId}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                {appointment.paymentDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Date</span>
                    <span className="font-medium">
                      {formatDate(appointment.paymentDate)} at {formatTime(appointment.paymentDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bill Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill Details</h3>
              
              {transaction?.metadata ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span>{formatAmount(transaction.metadata.consultationFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span>{formatAmount(transaction.metadata.platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes (18% GST)</span>
                    <span>{formatAmount(transaction.metadata.taxes)}</span>
                  </div>
                  {transaction.metadata.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatAmount(transaction.metadata.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total Amount</span>
                      <span>{formatAmount(transaction.amount)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total Amount</span>
                    <span>{formatAmount(appointment.paymentAmount || 0)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Details */}
            {transaction && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Type</span>
                    <span className="font-medium capitalize">{transaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium">{transaction.currency}</span>
                  </div>
                  {transaction.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description</span>
                      <span className="font-medium text-right max-w-xs">{transaction.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-700">Secure Transaction</p>
                  <p className="text-xs text-gray-600">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 sticky bottom-4 bg-gray-50 -mx-4 p-4 rounded-t-2xl">
          <button
            onClick={downloadBill}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={shareAppointment}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={loadAppointmentDetails}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default AppointmentDetails;