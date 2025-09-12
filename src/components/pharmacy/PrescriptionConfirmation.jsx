// Prescription Confirmation Page Component
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../common/PageLayout';
import toast from 'react-hot-toast';
import { 
  CheckCircle, 
  Clock, 
  Phone, 
  MapPin, 
  Truck, 
  Store, 
  FileText, 
  Star,
  ArrowRight,
  Calendar,
  User,
  Package
} from 'lucide-react';

const PrescriptionConfirmation = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const { prescriptionId, pharmacy, estimatedDelivery } = location.state || {};

  useEffect(() => {
    // Show success toast when component mounts
    toast.success('Prescription submitted successfully!', {
      icon: '🎉',
      duration: 4000
    });
  }, []);

  // If no data is provided, redirect to upload page
  if (!prescriptionId || !pharmacy) {
    return (
      <PageLayout title="Prescription Status" showBack={true}>
        <div className="text-center py-20">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Prescription Not Found</h2>
          <p className="text-gray-600 mb-6">No prescription data available.</p>
          <button
            onClick={() => navigate('/upload-prescription')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Upload Prescription
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Prescription Submitted"
      subtitle="Your prescription has been received"
      showBack={true}
      backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
      textColor="text-white"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Prescription Submitted!</h1>
          <p className="text-gray-600 mb-4">
            Your prescription has been successfully submitted and is being reviewed by our pharmacists.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Prescription ID:</strong> {prescriptionId}
            </p>
          </div>
        </div>

        {/* Selected Pharmacy Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Pharmacy</h2>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{pharmacy.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{pharmacy.address}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{pharmacy.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{pharmacy.distance}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{pharmacy.phone}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>{estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Prescription Review</h3>
                <p className="text-sm text-gray-600">
                  Our licensed pharmacists will review your prescription within 30 minutes
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-green-600">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Verification Call</h3>
                <p className="text-sm text-gray-600">
                  We may call you to verify prescription details and delivery address
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Order Preparation</h3>
                <p className="text-sm text-gray-600">
                  Your medicines will be prepared and packaged for delivery
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-orange-600">4</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your medicines will be delivered to your address in {estimatedDelivery}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
              <span>Keep your prescription ID handy for any inquiries</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
              <span>Payment will be collected at the time of delivery</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
              <span>Please have a valid ID ready during delivery</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
              <span>Contact the pharmacy directly for urgent inquiries</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/pharmacy')}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Store className="w-5 h-5" />
            <span>Browse More Medicines</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Call Customer Support</p>
                <p className="text-sm text-gray-600">+91 1800-123-4567 (24/7)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Contact Pharmacy</p>
                <p className="text-sm text-gray-600">{pharmacy.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrescriptionConfirmation;