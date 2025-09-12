// My Orders Page Component for Pharmacy
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import toast from 'react-hot-toast';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  X, 
  Star, 
  MapPin, 
  Calendar, 
  Phone,
  RefreshCw,
  Search,
  Filter,
  Eye,
  ArrowRight,
  ShoppingCart,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MyOrders = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Sample orders data
  const sampleOrders = [
    {
      id: 'PH001',
      orderNumber: 'PH001',
      status: 'delivered',
      totalAmount: 285.50,
      items: [
        {
          id: '1',
          name: 'Dolo 650 Tablet',
          genericName: 'Paracetamol',
          strength: '650mg',
          form: 'Tablet',
          quantity: 2,
          price: 32.50,
          image: '/api/placeholder/60/60'
        },
        {
          id: '2',
          name: 'Vitamin D3 60K',
          genericName: 'Cholecalciferol',
          strength: '60000 IU',
          form: 'Capsule',
          quantity: 1,
          price: 156.99,
          image: '/api/placeholder/60/60'
        }
      ],
      orderDate: '2024-01-15T10:30:00Z',
      deliveryDate: '2024-01-16T15:45:00Z',
      estimatedDelivery: '2024-01-16T18:00:00Z',
      pharmacy: {
        name: 'Apollo Pharmacy',
        address: '123 Main Street, Downtown Area',
        phone: '+91 98765 43210'
      },
      delivery: {
        address: '456 Home Street, Residential Area, Mumbai',
        type: 'standard',
        charges: 0
      },
      payment: {
        method: 'UPI',
        transactionId: 'TXN123456789',
        status: 'completed'
      },
      tracking: {
        orderPlaced: '2024-01-15T10:30:00Z',
        orderConfirmed: '2024-01-15T10:45:00Z',
        shipped: '2024-01-16T09:30:00Z',
        delivered: '2024-01-16T15:45:00Z'
      }
    },
    {
      id: 'PH002',
      orderNumber: 'PH002',
      status: 'shipped',
      totalAmount: 599.00,
      items: [
        {
          id: '4',
          name: 'Cetaphil Gentle Cleanser',
          genericName: 'Cleansing Lotion',
          strength: '250ml',
          form: 'Liquid',
          quantity: 1,
          price: 599.00,
          image: '/api/placeholder/60/60'
        }
      ],
      orderDate: '2024-01-20T14:20:00Z',
      deliveryDate: null,
      estimatedDelivery: '2024-01-21T18:00:00Z',
      pharmacy: {
        name: 'MedPlus Pharmacy',
        address: '789 Health Complex, Central Mumbai',
        phone: '+91 98765 43211'
      },
      delivery: {
        address: '456 Home Street, Residential Area, Mumbai',
        type: 'express',
        charges: 50
      },
      payment: {
        method: 'Credit Card',
        transactionId: 'TXN987654321',
        status: 'completed'
      },
      tracking: {
        orderPlaced: '2024-01-20T14:20:00Z',
        orderConfirmed: '2024-01-20T14:35:00Z',
        shipped: '2024-01-21T08:15:00Z',
        delivered: null
      }
    },
    {
      id: 'PH003',
      orderNumber: 'PH003',
      status: 'confirmed',
      totalAmount: 89.99,
      items: [
        {
          id: '3',
          name: 'Amoxicillin 500mg',
          genericName: 'Amoxicillin',
          strength: '500mg',
          form: 'Capsule',
          quantity: 1,
          price: 89.99,
          image: '/api/placeholder/60/60'
        }
      ],
      orderDate: '2024-01-22T09:15:00Z',
      deliveryDate: null,
      estimatedDelivery: '2024-01-23T17:00:00Z',
      pharmacy: {
        name: '1mg Quick Pharmacy',
        address: '321 Express Lane, Andheri, Mumbai',
        phone: '+91 98765 43213'
      },
      delivery: {
        address: '456 Home Street, Residential Area, Mumbai',
        type: 'standard',
        charges: 0
      },
      payment: {
        method: 'Cash on Delivery',
        transactionId: null,
        status: 'pending'
      },
      tracking: {
        orderPlaced: '2024-01-22T09:15:00Z',
        orderConfirmed: '2024-01-22T09:30:00Z',
        shipped: null,
        delivered: null
      }
    }
  ];

  useEffect(() => {
    loadOrders();
  }, [userData]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // In a real app, load from Firebase
      // const result = await firestoreService.getMedicineOrders(userData.uid);
      // if (result.success) {
      //   setOrders(result.data);
      // }
      
      // For demo, use sample data
      setTimeout(() => {
        setOrders(sampleOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'confirmed':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const orderFilters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  if (loading) {
    return (
      <PageLayout 
        title="My Orders"
        subtitle="Track your medicine orders"
        showBack={true}
        backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
        textColor="text-white"
      >
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <PageLayout 
        title="My Orders"
        subtitle="Track your medicine orders"
        showBack={true}
        backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
        textColor="text-white"
      >
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
          <button
            onClick={() => navigate('/pharmacy')}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="My Orders"
      subtitle={`${orders.length} total orders`}
      showBack={true}
      backgroundColor="bg-gradient-to-r from-green-600 to-green-700"
      textColor="text-white"
      rightActions={
        <button
          onClick={loadOrders}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number or medicine name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {orderFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">Placed on {formatDate(order.orderDate)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-1">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-600">{order.pharmacy.name}</p>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {order.status === 'shipped' && (
                      <div className="flex items-center space-x-1 text-sm text-blue-600">
                        <Truck className="w-4 h-4" />
                        <span>Expected by {formatDate(order.estimatedDelivery)}</span>
                      </div>
                    )}
                    {order.status === 'delivered' && (
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Delivered on {formatDate(order.deliveryDate)}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium">View Details</span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">{item.strength} • {item.form}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                              <p className="text-xs text-gray-500">₹{item.price} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4">
                      {/* Pharmacy Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Pharmacy Details</h4>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-medium text-gray-900">{order.pharmacy.name}</p>
                          <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{order.pharmacy.address}</span>
                          </p>
                          <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{order.pharmacy.phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Delivery Details</h4>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-900 mb-2">{order.delivery.address}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Delivery Type:</span>
                            <span className="font-medium capitalize">{order.delivery.type}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-gray-600">Delivery Charges:</span>
                            <span className="font-medium">
                              {order.delivery.charges === 0 ? 'FREE' : `₹${order.delivery.charges}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-medium">{order.payment.method}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`font-medium ${
                              order.payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {order.payment.status === 'completed' ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          {order.payment.transactionId && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Transaction ID:</span>
                              <span className="font-medium text-xs">{order.payment.transactionId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                    {order.status === 'delivered' && (
                      <>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Star className="w-4 h-4" />
                          <span>Rate Order</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Reorder</span>
                        </button>
                      </>
                    )}
                    {order.status === 'shipped' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Truck className="w-4 h-4" />
                        <span>Track Order</span>
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <X className="w-4 h-4" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>Contact Support</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MyOrders;