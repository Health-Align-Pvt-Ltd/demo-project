// Doctor Consultation Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  Calendar,
  Video,
  MessageCircle,
  Phone,
  User,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Activity
} from 'lucide-react';

const DoctorConsultation = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('find-doctor');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(false);

  const specialties = [
    { name: 'Cardiology', icon: Heart, count: 24 },
    { name: 'Neurology', icon: Brain, count: 18 },
    { name: 'Ophthalmology', icon: Eye, count: 15 },
    { name: 'Orthopedics', icon: Bone, count: 22 },
    { name: 'Pediatrics', icon: Baby, count: 20 },
    { name: 'General Medicine', icon: Stethoscope, count: 35 },
    { name: 'Dermatology', icon: User, count: 12 },
    { name: 'Psychiatry', icon: Brain, count: 8 }
  ];

  // Mock doctors data
  const mockDoctors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.8,
      experience: 12,
      consultationFee: 800,
      location: 'Mumbai, MH',
      availability: 'Available Now',
      image: null,
      languages: ['English', 'Spanish'],
      education: 'Harvard Medical School'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      rating: 4.9,
      experience: 15,
      consultationFee: 1000,
      location: 'Delhi, DL',
      availability: 'Available in 30 mins',
      image: null,
      languages: ['English', 'Mandarin'],
      education: 'Stanford University School of Medicine'
    },
    {
      id: '3',
      name: 'Dr. Emily Davis',
      specialty: 'Pediatrics',
      rating: 4.7,
      experience: 8,
      consultationFee: 600,
      location: 'Bangalore, KA',
      availability: 'Available Now',
      image: null,
      languages: ['English'],
      education: 'Johns Hopkins School of Medicine'
    }
  ];

  useEffect(() => {
    setDoctors(mockDoctors);
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    if (userData?.uid) {
      const result = await firestoreService.getUserAppointments(userData.uid);
      if (result.success) {
        setAppointments(result.data);
      }
    }
  };

  const bookAppointment = async (doctor, appointmentType) => {
    // Redirect to payment gateway with booking details
    const bookingDetails = {
      patientId: userData.uid,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      appointmentType,
      appointmentDate: new Date().toISOString(),
      consultationFee: doctor.consultationFee,
      timeSlot: doctor.availability
    };

    navigate('/payment', {
      state: { bookingDetails }
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <PageLayout 
      title="Doctor Consultation"
      showSearch={true}
      onSearch={() => {}}
    >
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4 -mx-4">
        <div className="px-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('find-doctor')}
              className={`py-3 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'find-doctor'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Find Doctor
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-3 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Appointments
            </button>
            <button
              onClick={() => setActiveTab('specialties')}
              className={`py-3 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'specialties'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Specialties
            </button>
          </div>
        </div>
      </div>

      <div>
        {/* Find Doctor Tab */}
        {activeTab === 'find-doctor' && (
          <div>
            {/* Search and Filters */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Specialty Filter Buttons */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Specialties</h3>
                  <p className="text-xs text-gray-400">Scroll →</p>
                </div>
                <div className="overflow-x-auto horizontal-scroll px-1">
                  <div className="flex space-x-3 pb-2" style={{ minWidth: 'max-content' }}>
                  <button
                    onClick={() => setSelectedSpecialty('')}
                    className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      !selectedSpecialty
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    All Specialists
                  </button>
                  {specialties.map(specialty => (
                    <button
                      key={specialty.name}
                      onClick={() => setSelectedSpecialty(specialty.name)}
                      className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                        selectedSpecialty === specialty.name
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <specialty.icon className="w-3 h-3" />
                      <span>{specialty.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedSpecialty === specialty.name
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>{specialty.count}</span>
                    </button>
                  ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Doctors List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredDoctors.map(doctor => (
                <div 
                  key={doctor.id} 
                  onClick={() => navigate(`/doctor/${doctor.id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-gray-900 truncate">{doctor.name}</h3>
                          <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
                          <p className="text-xs text-gray-500 truncate">{doctor.education}</p>
                        </div>
                        <div className="text-right ml-2">
                          <div className="flex items-center mb-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="ml-1 text-xs font-medium">{doctor.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{doctor.experience}y exp</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{doctor.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{doctor.availability}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Consultation Fee</p>
                          <p className="text-sm font-bold text-gray-900">₹{doctor.consultationFee}</p>
                        </div>
                        <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => bookAppointment(doctor, 'video')}
                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Video
                          </button>
                          <button
                            onClick={() => bookAppointment(doctor, 'chat')}
                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">My Appointments</h2>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No appointments scheduled yet</p>
                <button
                  onClick={() => setActiveTab('find-doctor')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{appointment.doctorName}</h3>
                        <p className="text-blue-600 text-sm">{appointment.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.appointmentType}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Specialties Tab */}
        {activeTab === 'specialties' && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Medical Specialties</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {specialties.map(specialty => (
                <button
                  key={specialty.name}
                  onClick={() => {
                    setSelectedSpecialty(specialty.name);
                    setActiveTab('find-doctor');
                  }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 text-center"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <specialty.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{specialty.name}</h3>
                  <p className="text-xs text-gray-500">{specialty.count} doctors</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DoctorConsultation;