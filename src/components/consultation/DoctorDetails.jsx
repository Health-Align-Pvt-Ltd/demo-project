// Doctor Details Page Component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Video,
  MessageCircle,
  Heart,
  Award,
  Users,
  ThumbsUp,
  Share,
  BookOpen,
  GraduationCap,
  Stethoscope,
  CheckCircle
} from 'lucide-react';

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock doctor data - in real app, fetch from API
  const mockDoctor = {
    id: doctorId,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    subSpecialty: 'Interventional Cardiology',
    rating: 4.8,
    totalRatings: 324,
    experience: 12,
    consultationFee: 800,
    videoCallFee: 600,
    chatFee: 400,
    location: 'Apollo Hospital, Mumbai',
    address: 'Sahar Road, Andheri East, Mumbai - 400099',
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Marathi'],
    education: [
      'MBBS - Grant Medical College, Mumbai (2008)',
      'MD Cardiology - AIIMS, New Delhi (2012)',
      'Fellowship in Interventional Cardiology - Harvard Medical School (2015)'
    ],
    experience_details: [
      'Senior Consultant Cardiologist - Apollo Hospital (2018 - Present)',
      'Associate Consultant - Fortis Hospital (2015 - 2018)',
      'Resident Doctor - AIIMS New Delhi (2012 - 2015)'
    ],
    about: 'Dr. Sarah Johnson is a highly experienced interventional cardiologist with over 12 years of expertise in treating complex cardiovascular conditions. She specializes in minimally invasive cardiac procedures and has successfully performed over 2000 angioplasties. Known for her compassionate approach and excellent patient care.',
    services: [
      'Cardiac Consultation',
      'ECG & Echo Interpretation',
      'Angioplasty & Stenting',
      'Pacemaker Implantation',
      'Heart Disease Prevention',
      'Hypertension Management'
    ],
    awards: [
      'Best Doctor Award - Apollo Hospital (2022)',
      'Excellence in Cardiology - Indian Medical Association (2021)',
      'Outstanding Service Award - Maharashtra Medical Council (2020)'
    ],
    nextAvailable: '2:00 PM Today',
    timeSlots: [
      { time: '2:00 PM', available: true },
      { time: '2:30 PM', available: true },
      { time: '3:00 PM', available: false },
      { time: '3:30 PM', available: true },
      { time: '4:00 PM', available: true },
      { time: '4:30 PM', available: false }
    ],
    reviews: [
      {
        id: 1,
        patientName: 'Rajesh Kumar',
        rating: 5,
        date: '2 days ago',
        comment: 'Excellent doctor! Very thorough examination and clear explanation of my condition. Highly recommended.'
      },
      {
        id: 2,
        patientName: 'Priya Sharma',
        rating: 4,
        date: '1 week ago',
        comment: 'Dr. Johnson is very knowledgeable and patient. The treatment plan worked perfectly for my father.'
      },
      {
        id: 3,
        patientName: 'Amit Patel',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Outstanding experience. The doctor explained everything in detail and the procedure was successful.'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoctor(mockDoctor);
      setLoading(false);
    }, 500);
  }, [doctorId]);

  const bookAppointment = async (appointmentType, fee) => {
    // Redirect to payment gateway with booking details
    const bookingDetails = {
      patientId: userData.uid,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      appointmentType,
      appointmentDate: new Date().toISOString(),
      consultationFee: fee,
      timeSlot: doctor.nextAvailable
    };

    navigate('/payment', {
      state: { bookingDetails }
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <PageLayout title="Doctor Details">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (!doctor) {
    return (
      <PageLayout title="Doctor Not Found">
        <div className="text-center py-20">
          <p className="text-gray-500">Doctor not found</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={doctor.name}
      showShare={true}
      onShare={() => {}}
    >
      {/* Doctor Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-10 h-10 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900">{doctor.name}</h1>
            <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
            <p className="text-xs text-gray-500">{doctor.subSpecialty}</p>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                {renderStars(doctor.rating)}
                <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                <span className="text-xs text-gray-500">({doctor.totalRatings} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center">
                <GraduationCap className="w-3 h-3 mr-1" />
                {doctor.experience}+ years
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {doctor.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Book Consultation</h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => bookAppointment('in-person', doctor.consultationFee)}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">In-Person Visit</p>
                <p className="text-xs text-gray-500">Hospital consultation</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">₹{doctor.consultationFee}</p>
              <p className="text-xs text-green-600">{doctor.nextAvailable}</p>
            </div>
          </button>
          
          <button
            onClick={() => bookAppointment('video', doctor.videoCallFee)}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Video Consultation</p>
                <p className="text-xs text-gray-500">Online video call</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">₹{doctor.videoCallFee}</p>
              <p className="text-xs text-green-600">Available now</p>
            </div>
          </button>
          
          <button
            onClick={() => bookAppointment('chat', doctor.chatFee)}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Chat Consultation</p>
                <p className="text-xs text-gray-500">Text-based consultation</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">₹{doctor.chatFee}</p>
              <p className="text-xs text-green-600">Available now</p>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4 -mx-4">
        <div className="px-4">
          <div className="flex space-x-6 overflow-x-auto">
            {['overview', 'experience', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* About */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{doctor.about}</p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Services Offered</h3>
              <div className="grid grid-cols-2 gap-2">
                {doctor.services.map((service, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Location</h3>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doctor.location}</p>
                  <p className="text-xs text-gray-500">{doctor.address}</p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            {/* Education */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Education</h3>
              <div className="space-y-3">
                {doctor.education.map((edu, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <GraduationCap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{edu}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Experience</h3>
              <div className="space-y-3">
                {doctor.experience_details.map((exp, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Stethoscope className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{exp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Awards & Recognition</h3>
              <div className="space-y-3">
                {doctor.awards.map((award, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Award className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{award}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Rating Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{doctor.rating}</p>
                  <div className="flex items-center justify-center">
                    {renderStars(doctor.rating)}
                  </div>
                  <p className="text-xs text-gray-500">{doctor.totalRatings} reviews</p>
                </div>
                <div className="flex-1">
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 w-2">{stars}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-yellow-400 h-1 rounded-full" 
                            style={{ 
                              width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                          {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '5%' : stars === 2 ? '3%' : '2%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-3">
              {doctor.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{review.patientName}</p>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DoctorDetails;