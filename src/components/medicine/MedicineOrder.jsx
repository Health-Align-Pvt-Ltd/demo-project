// Medicine Order Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import { 
  ArrowLeft, 
  Pill, 
  Search, 
  ShoppingCart, 
  Upload,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  CreditCard,
  FileText,
  Plus,
  Minus
} from 'lucide-react';

const MedicineOrder = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // Mock medicines data
  const medicines = [
    {
      id: '1',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      strength: '500mg',
      form: 'Tablet',
      price: 12.99,
      manufacturer: 'PharmaCorp',
      inStock: true,
      requiresPrescription: false
    },
    {
      id: '2',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      strength: '250mg',
      form: 'Capsule',
      price: 24.99,
      manufacturer: 'MediLab',
      inStock: true,
      requiresPrescription: true
    },
    {
      id: '3',
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      strength: '1000 IU',
      form: 'Tablet',
      price: 18.99,
      manufacturer: 'HealthPlus',
      inStock: true,
      requiresPrescription: false
    }
  ];

  // Mock orders data
  const mockOrders = [
    {
      id: 'MED001',
      orderNumber: 'MED001',
      status: 'delivered',
      totalAmount: 45.97,
      items: 2,
      orderDate: '2024-01-10',
      deliveryDate: '2024-01-12'
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => item.id !== medicineId));
    } else {
      setCart(prev => prev.map(item =>
        item.id === medicineId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePrescriptionUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: userData.uid,
        items: cart,
        totalAmount: getTotalAmount(),
        status: 'pending',
        deliveryAddress: 'User Address', // In real app, get from user profile
        prescriptionFile: prescriptionFile ? 'uploaded' : null
      };

      const result = await firestoreService.createMedicineOrder(orderData);
      if (result.success) {
        alert('Order placed successfully!');
        setCart([]);
        setPrescriptionFile(null);
        setActiveTab('orders');
      }
    } catch (error) {
      alert('Error placing order');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button onClick={() => navigate('/dashboard')} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medicine Order</h1>
              <p className="text-gray-600">Order medicines with doorstep delivery</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'browse'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Browse Medicines
            </button>
            <button
              onClick={() => setActiveTab('prescription')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'prescription'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Upload Prescription
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'cart'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Cart ({cart.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              My Orders
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Browse Medicines Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Medicines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(medicine => (
                <div key={medicine.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                      <p className="text-sm text-gray-600">{medicine.genericName}</p>
                      <p className="text-sm text-gray-500">{medicine.strength} - {medicine.form}</p>
                      <p className="text-xs text-gray-500 mt-1">{medicine.manufacturer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${medicine.price}</p>
                      {medicine.requiresPrescription && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          Rx Required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      medicine.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <button
                      onClick={() => addToCart(medicine)}
                      disabled={!medicine.inStock}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prescription Upload Tab */}
        {activeTab === 'prescription' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Prescription</h2>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Upload a clear photo or scan of your prescription. Our pharmacists will verify and prepare your medicines for delivery.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="mb-4">
                      <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePrescriptionUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {prescriptionFile && (
                      <p className="text-sm text-gray-600">
                        Selected: {prescriptionFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => alert('Prescription uploaded! We will contact you soon.')}
                  disabled={!prescriptionFile}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Upload Prescription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Browse Medicines
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.genericName}</p>
                        <p className="text-sm text-gray-500">{item.strength} - {item.form}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${getTotalAmount().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Items</p>
                        <p className="font-medium">{order.items} items</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Amount</p>
                        <p className="font-medium">${order.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Delivery Date</p>
                        <p className="font-medium">
                          {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineOrder;