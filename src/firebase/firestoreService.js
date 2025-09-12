// Firestore service for data operations
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  query, 
  where, 
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from './config';

export const firestoreService = {
  // Cart operations
  async saveCartToFirebase(userId, cartItems, cartType = 'medicine') {
    try {
      const cartRef = doc(db, 'cart', `${userId}_${cartType}`);
      await setDoc(cartRef, {
        userId,
        cartType,
        items: cartItems,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving cart to Firebase:', error);
      return { success: false, error: error.message };
    }
  },

  async getCartFromFirebase(userId, cartType = 'medicine') {
    try {
      const cartRef = doc(db, 'cart', `${userId}_${cartType}`);
      const cartSnap = await getDoc(cartRef);
      
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        return { success: true, data: cartData.items || [] };
      } else {
        return { success: true, data: [] };
      }
    } catch (error) {
      console.error('Error getting cart from Firebase:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async clearCartFromFirebase(userId, cartType = 'medicine') {
    try {
      const cartRef = doc(db, 'cart', `${userId}_${cartType}`);
      await deleteDoc(cartRef);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart from Firebase:', error);
      return { success: false, error: error.message };
    }
  },

  // Products operations
  async getProducts() {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: products };
    } catch (error) {
      console.error('Error getting products:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }
  },

  // Product Categories operations
  async getProductCategories() {
    try {
      const categoriesRef = collection(db, 'productCategories');
      const snapshot = await getDocs(categoriesRef);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: categories };
    } catch (error) {
      console.error('Error getting product categories:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Diseases operations
  async getDiseases() {
    try {
      const diseasesRef = collection(db, 'diseases');
      const snapshot = await getDocs(diseasesRef);
      const diseases = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: diseases };
    } catch (error) {
      console.error('Error getting diseases:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Pharmacy operations
  async getPharmacies() {
    try {
      const pharmaciesRef = collection(db, 'pharmacy');
      const snapshot = await getDocs(pharmaciesRef);
      const pharmacies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: pharmacies };
    } catch (error) {
      console.error('Error getting pharmacies:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Delivery Status operations
  async updateDeliveryStatus(orderId, status, location = null) {
    try {
      const statusRef = doc(db, 'delivery_status', orderId);
      await setDoc(statusRef, {
        orderId,
        status,
        location,
        updatedAt: new Date().toISOString(),
        timestamp: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating delivery status:', error);
      return { success: false, error: error.message };
    }
  },

  async getDeliveryStatus(orderId) {
    try {
      const statusRef = doc(db, 'delivery_status', orderId);
      const statusSnap = await getDoc(statusRef);
      
      if (statusSnap.exists()) {
        return { success: true, data: statusSnap.data() };
      } else {
        return { success: false, error: 'Delivery status not found' };
      }
    } catch (error) {
      console.error('Error getting delivery status:', error);
      return { success: false, error: error.message };
    }
  },

  // Ambulance operations
  async getAmbulances() {
    try {
      const ambulancesRef = collection(db, 'ambulance');
      const snapshot = await getDocs(ambulancesRef);
      const ambulances = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: ambulances };
    } catch (error) {
      console.error('Error getting ambulances:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Ambulance Bookings operations
  async createAmbulanceBooking(bookingData) {
    try {
      const docRef = await addDoc(collection(db, 'ambulance_bookings'), {
        ...bookingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: bookingData.status || 'pending'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating ambulance booking:', error);
      return { success: false, error: error.message };
    }
  },

  async getAmbulanceBookings(userId) {
    try {
      const bookingsRef = collection(db, 'ambulance_bookings');
      const q = query(bookingsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: bookings };
    } catch (error) {
      console.error('Error getting ambulance bookings:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Ambulance Drivers operations
  async getAmbulanceDrivers() {
    try {
      const driversRef = collection(db, 'ambulance_drivers');
      const snapshot = await getDocs(driversRef);
      const drivers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: drivers };
    } catch (error) {
      console.error('Error getting ambulance drivers:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async updateDriverLocation(driverId, location) {
    try {
      const driverRef = doc(db, 'ambulance_drivers', driverId);
      await updateDoc(driverRef, {
        location,
        lastLocationUpdate: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating driver location:', error);
      return { success: false, error: error.message };
    }
  },
  // Appointments
  async bookAppointment(appointmentData) {
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error booking appointment:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserAppointments(userId) {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('patientId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort appointments by date on the client side
      appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
      
      return { success: true, data: appointments };
    } catch (error) {
      console.error('Error getting appointments:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async updateAppointment(appointmentId, updates) {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating appointment:', error);
      return { success: false, error: error.message };
    }
  },

  // Blood requests
  async createBloodRequest(requestData) {
    try {
      const docRef = await addDoc(collection(db, 'bloodRequests'), {
        ...requestData,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating blood request:', error);
      return { success: false, error: error.message };
    }
  },

  async getBloodRequests(userId) {
    try {
      const q = query(
        collection(db, 'bloodRequests'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by creation date on client side
      requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, data: requests };
    } catch (error) {
      console.error('Error getting blood requests:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Pharmacy orders (separate from medicine orders)
  async createPharmacyOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'pharmacyOrders'), {
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: orderData.status || 'confirmed'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating pharmacy order:', error);
      return { success: false, error: error.message };
    }
  },

  async getPharmacyOrders(userId) {
    try {
      console.log('Firebase getPharmacyOrders called with userId:', userId);
      
      // Using simple query without orderBy to avoid index requirement
      const q = query(
        collection(db, 'pharmacyOrders'),
        where('userId', '==', userId)
      );
      
      console.log('Executing Firebase query for pharmacyOrders...');
      const querySnapshot = await getDocs(q);
      console.log('Firebase query completed, processing results...');
      
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      
      console.log('Raw orders from Firebase:', orders.length, 'documents');
      
      // Sort orders by createdAt on the client side to avoid index requirement
      orders.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // descending order (newest first)
      });
      
      console.log('Orders sorted on client side');
      return { success: true, data: orders };
    } catch (error) {
      console.error('Error getting pharmacy orders:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async updatePharmacyOrder(orderId, updates) {
    try {
      await updateDoc(doc(db, 'pharmacyOrders', orderId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating pharmacy order:', error);
      return { success: false, error: error.message };
    }
  },

  // Test function to create a sample order
  async createTestOrder(userId) {
    try {
      const testOrder = {
        userId: userId,
        items: [
          {
            id: 'test-1',
            name: 'Test Medicine',
            quantity: 2,
            price: 50.00
          }
        ],
        totalAmount: 100.00,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await this.createPharmacyOrder(testOrder);
      return result;
    } catch (error) {
      console.error('Error creating test order:', error);
      return { success: false, error: error.message };
    }
  },

  // Pharmacy order with payment processing
  async createPharmacyOrderWithPayment(orderData, paymentData) {
    try {
      // Create pharmacy order
      const orderResult = await this.createPharmacyOrder(orderData);
      if (!orderResult.success) {
        throw new Error('Failed to create pharmacy order');
      }

      // Create payment transaction
      const transactionResult = await this.createTransaction({
        ...paymentData,
        orderId: orderResult.id,
        userId: orderData.userId,
        type: 'pharmacy_order',
        status: 'completed'
      });
      
      if (!transactionResult.success) {
        console.warn('Failed to create transaction record, but order created');
      }

      return { 
        success: true, 
        orderId: orderResult.id,
        transactionId: transactionResult.id
      };
    } catch (error) {
      console.error('Error in pharmacy order with payment:', error);
      return { success: false, error: error.message };
    }
  },

  // Medicine orders
  async createMedicineOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'medicineOrders'), {
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: orderData.status || 'confirmed'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating medicine order:', error);
      return { success: false, error: error.message };
    }
  },

  async getMedicineOrders(userId) {
    try {
      const q = query(
        collection(db, 'medicineOrders'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort orders by createdAt on the client side to avoid index requirement
      orders.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // descending order (newest first)
      });
      
      return { success: true, data: orders };
    } catch (error) {
      console.error('Error getting medicine orders:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async updateMedicineOrder(orderId, updates) {
    try {
      await updateDoc(doc(db, 'medicineOrders', orderId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating medicine order:', error);
      return { success: false, error: error.message };
    }
  },

  async getMedicineOrderById(orderId) {
    try {
      const docRef = doc(db, 'medicineOrders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Order not found' };
      }
    } catch (error) {
      console.error('Error getting medicine order by ID:', error);
      return { success: false, error: error.message };
    }
  },

  // Medicine order with payment processing
  async createMedicineOrderWithPayment(orderData, paymentData) {
    try {
      // Create medicine order
      const orderResult = await this.createMedicineOrder(orderData);
      if (!orderResult.success) {
        throw new Error('Failed to create medicine order');
      }

      // Create payment transaction
      const transactionResult = await this.createTransaction({
        ...paymentData,
        orderId: orderResult.id,
        userId: orderData.userId,
        type: 'medicine_order',
        status: 'completed'
      });
      
      if (!transactionResult.success) {
        console.warn('Failed to create transaction record, but order created');
      }

      return { 
        success: true, 
        orderId: orderResult.id,
        transactionId: transactionResult.id
      };
    } catch (error) {
      console.error('Error in medicine order with payment:', error);
      return { success: false, error: error.message };
    }
  },

  // Medicine inventory management
  async updateMedicineStock(medicineId, quantity) {
    try {
      const medicineRef = doc(db, 'medicines', medicineId);
      const medicineSnap = await getDoc(medicineRef);
      
      if (medicineSnap.exists()) {
        const currentStock = medicineSnap.data().stockCount || 0;
        const newStock = Math.max(0, currentStock - quantity);
        
        await updateDoc(medicineRef, {
          stockCount: newStock,
          inStock: newStock > 0,
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, newStock };
      } else {
        return { success: false, error: 'Medicine not found' };
      }
    } catch (error) {
      console.error('Error updating medicine stock:', error);
      return { success: false, error: error.message };
    }
  },

  // Prescription management
  async savePrescription(prescriptionData) {
    try {
      const docRef = await addDoc(collection(db, 'prescriptions'), {
        ...prescriptionData,
        createdAt: new Date().toISOString(),
        status: 'pending_verification'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving prescription:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserPrescriptions(userId) {
    try {
      const q = query(
        collection(db, 'prescriptions'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const prescriptions = [];
      querySnapshot.forEach((doc) => {
        prescriptions.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort prescriptions by createdAt on the client side to avoid index requirement
      prescriptions.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // descending order (newest first)
      });
      
      return { success: true, data: prescriptions };
    } catch (error) {
      console.error('Error getting prescriptions:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Ambulance bookings
  async bookAmbulance(bookingData) {
    try {
      const docRef = await addDoc(collection(db, 'ambulanceBookings'), {
        ...bookingData,
        createdAt: new Date().toISOString(),
        status: 'requested'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error booking ambulance:', error);
      return { success: false, error: error.message };
    }
  },

  async getAmbulanceBookings(userId) {
    try {
      const q = query(
        collection(db, 'ambulanceBookings'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by creation date on client side
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, data: bookings };
    } catch (error) {
      console.error('Error getting ambulance bookings:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async updateAmbulanceBooking(bookingId, updates) {
    try {
      await updateDoc(doc(db, 'ambulanceBookings', bookingId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating ambulance booking:', error);
      return { success: false, error: error.message };
    }
  },

  // Transactions
  async createTransaction(transactionData) {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserTransactions(userId) {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by creation date on client side
      transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, data: transactions };
    } catch (error) {
      console.error('Error getting transactions:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async updateTransaction(transactionId, updates) {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { success: false, error: error.message };
    }
  },

  // Wallet operations
  async createOrUpdateWallet(userId, walletData) {
    try {
      const walletRef = doc(db, 'wallets', userId);
      const walletSnap = await getDoc(walletRef);
      
      if (walletSnap.exists()) {
        // Update existing wallet
        const currentData = walletSnap.data();
        await updateDoc(walletRef, {
          ...walletData,
          balance: (currentData.balance || 0) + (walletData.balanceChange || 0),
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new wallet
        await addDoc(collection(db, 'wallets'), {
          userId,
          ...walletData,
          balance: walletData.balance || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Error creating/updating wallet:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserWallet(userId) {
    try {
      const walletRef = doc(db, 'wallets', userId);
      const walletSnap = await getDoc(walletRef);
      
      if (walletSnap.exists()) {
        return { success: true, data: { id: walletSnap.id, ...walletSnap.data() } };
      } else {
        // Create default wallet if doesn't exist
        const defaultWallet = {
          userId,
          balance: 0,
          currency: 'INR',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await addDoc(collection(db, 'wallets'), defaultWallet);
        return { success: true, data: defaultWallet };
      }
    } catch (error) {
      console.error('Error getting wallet:', error);
      return { success: false, error: error.message };
    }
  },

  async addWalletTransaction(userId, transactionData) {
    try {
      // Add transaction to wallet_transactions subcollection
      const walletTransactionRef = collection(db, 'wallets', userId, 'transactions');
      const docRef = await addDoc(walletTransactionRef, {
        ...transactionData,
        createdAt: new Date().toISOString()
      });
      
      // Update wallet balance
      const walletRef = doc(db, 'wallets', userId);
      const walletSnap = await getDoc(walletRef);
      
      if (walletSnap.exists()) {
        const currentBalance = walletSnap.data().balance || 0;
        const newBalance = transactionData.type === 'credit' 
          ? currentBalance + transactionData.amount 
          : currentBalance - transactionData.amount;
          
        await updateDoc(walletRef, {
          balance: newBalance,
          updatedAt: new Date().toISOString()
        });
      }
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding wallet transaction:', error);
      return { success: false, error: error.message };
    }
  },

  // Combined booking with payment and transaction
  async bookAppointmentWithPayment(appointmentData, transactionData, walletData = null) {
    try {
      // Create appointment
      const appointmentResult = await this.bookAppointment(appointmentData);
      if (!appointmentResult.success) {
        throw new Error('Failed to create appointment');
      }

      // Create transaction record
      const transactionResult = await this.createTransaction({
        ...transactionData,
        appointmentId: appointmentResult.id,
        userId: appointmentData.patientId
      });
      if (!transactionResult.success) {
        throw new Error('Failed to create transaction');
      }

      // Update wallet if wallet data provided
      if (walletData) {
        const walletResult = await this.addWalletTransaction(appointmentData.patientId, {
          ...walletData,
          appointmentId: appointmentResult.id,
          transactionId: transactionResult.id
        });
        if (!walletResult.success) {
          console.warn('Failed to update wallet, but appointment and transaction created');
        }
      }

      return { 
        success: true, 
        appointmentId: appointmentResult.id,
        transactionId: transactionResult.id
      };
    } catch (error) {
      console.error('Error in combined booking operation:', error);
      return { success: false, error: error.message };
    }
  },

  // Generic CRUD operations
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  async read(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      console.error(`Error reading document from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  async update(collectionName, docId, data) {
    try {
      await updateDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  async delete(collectionName, docId) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Helper function to initialize Firebase collections with sample data
  async initializeCollections() {
    try {
      // Sample products data
      const sampleProducts = [
        {
          name: 'Paracetamol 500mg',
          genericName: 'Acetaminophen',
          brand: 'Generic',
          strength: '500mg',
          form: 'Tablet',
          price: 45.50,
          originalPrice: 52.00,
          category: 'pain-relief',
          inStock: true,
          stockCount: 150,
          requiresPrescription: false,
          rating: 4.5,
          reviewsCount: 1205
        },
        {
          name: 'Vitamin D3',
          genericName: 'Cholecalciferol',
          brand: 'HealthKart',
          strength: '60000 IU',
          form: 'Capsule',
          price: 156.99,
          originalPrice: 180.00,
          category: 'vitamins',
          inStock: true,
          stockCount: 89,
          requiresPrescription: false,
          rating: 4.6,
          reviewsCount: 1234
        }
      ];

      // Sample product categories
      const sampleCategories = [
        {
          id: 'pain-relief',
          name: 'Pain Relief',
          description: 'Medicines for pain management and relief',
          icon: '💊'
        },
        {
          id: 'vitamins',
          name: 'Vitamins & Supplements',
          description: 'Essential vitamins and nutritional supplements',
          icon: '🌿'
        },
        {
          id: 'antibiotics',
          name: 'Antibiotics',
          description: 'Prescription antibiotics for infections',
          icon: '🛡️'
        }
      ];

      // Sample diseases data
      const sampleDiseases = [
        {
          name: 'Diabetes',
          category: 'Endocrine',
          description: 'A group of metabolic disorders characterized by high blood sugar',
          symptoms: ['Frequent urination', 'Increased thirst', 'Weight loss'],
          medicines: ['Metformin', 'Insulin', 'Glipizide']
        },
        {
          name: 'Hypertension',
          category: 'Cardiovascular',
          description: 'High blood pressure condition',
          symptoms: ['Headaches', 'Dizziness', 'Chest pain'],
          medicines: ['Amlodipine', 'Losartan', 'Hydrochlorothiazide']
        }
      ];

      // Sample pharmacy data
      const samplePharmacies = [
        {
          name: 'HealthAlign Main Pharmacy',
          address: '123 Main Street, Health District',
          phone: '+91 1800-123-4567',
          rating: 4.8,
          isOpen: true,
          workingHours: '24/7',
          services: ['Prescription', 'OTC Medicines', 'Health Consultation']
        },
        {
          name: 'HealthAlign Express',
          address: '456 Express Lane, Medical Hub',
          phone: '+91 1800-123-4568',
          rating: 4.6,
          isOpen: true,
          workingHours: '6:00 AM - 10:00 PM',
          services: ['Quick Delivery', 'Emergency Medicines']
        }
      ];

      // Sample ambulance data
      const sampleAmbulances = [
        {
          vehicleNumber: 'AMB-001',
          type: 'Advanced Life Support',
          location: { lat: 28.6139, lng: 77.2090 },
          isAvailable: true,
          rating: 4.9,
          equipment: ['Ventilator', 'Defibrillator', 'Oxygen Support'],
          contactNumber: '+91 9876543210'
        },
        {
          vehicleNumber: 'AMB-002',
          type: 'Basic Life Support',
          location: { lat: 28.7041, lng: 77.1025 },
          isAvailable: true,
          rating: 4.7,
          equipment: ['First Aid Kit', 'Oxygen Support', 'Stretcher'],
          contactNumber: '+91 9876543211'
        }
      ];

      // Sample ambulance drivers
      const sampleDrivers = [
        {
          name: 'Rajesh Kumar',
          licenseNumber: 'DL123456789',
          phone: '+91 9876543210',
          experience: '5 years',
          rating: 4.8,
          currentLocation: { lat: 28.6139, lng: 77.2090 },
          ambulanceId: 'AMB-001',
          isOnDuty: true
        },
        {
          name: 'Suresh Singh',
          licenseNumber: 'DL987654321',
          phone: '+91 9876543211',
          experience: '8 years',
          rating: 4.6,
          currentLocation: { lat: 28.7041, lng: 77.1025 },
          ambulanceId: 'AMB-002',
          isOnDuty: true
        }
      ];

      // Initialize collections (only if they don't exist)
      console.log('Initializing Firebase collections with sample data...');

      // Add sample data to collections
      const collections = [
        { name: 'products', data: sampleProducts },
        { name: 'productCategories', data: sampleCategories },
        { name: 'diseases', data: sampleDiseases },
        { name: 'pharmacy', data: samplePharmacies },
        { name: 'ambulance', data: sampleAmbulances },
        { name: 'ambulance_drivers', data: sampleDrivers }
      ];

      for (const col of collections) {
        for (const item of col.data) {
          await this.create(col.name, item);
        }
      }

      console.log('Firebase collections initialized successfully!');
      return { success: true, message: 'Collections initialized' };
    } catch (error) {
      console.error('Error initializing collections:', error);
      return { success: false, error: error.message };
    }
  },

  // Paginated Products operations
  async getProductsPaginated(lastDoc = null, pageSize = 20) {
    try {
      let q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { 
        success: true, 
        data: products,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error getting products:', error);
      return { success: false, error: error.message, data: [], lastDoc: null, hasMore: false };
    }
  },

  // Paginated Product Categories operations
  async getProductCategoriesPaginated(lastDoc = null, pageSize = 20) {
    try {
      let q = query(
        collection(db, 'productCategories'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { 
        success: true, 
        data: categories,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error getting product categories:', error);
      return { success: false, error: error.message, data: [], lastDoc: null, hasMore: false };
    }
  },

  // Paginated Diseases operations
  async getDiseasesPaginated(lastDoc = null, pageSize = 20) {
    try {
      let q = query(
        collection(db, 'diseases'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const diseases = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { 
        success: true, 
        data: diseases,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error getting diseases:', error);
      return { success: false, error: error.message, data: [], lastDoc: null, hasMore: false };
    }
  },

  // Paginated Pharmacy operations
  async getPharmaciesPaginated(lastDoc = null, pageSize = 20) {
    try {
      let q = query(
        collection(db, 'pharmacy'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const pharmacies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { 
        success: true, 
        data: pharmacies,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error getting pharmacies:', error);
      return { success: false, error: error.message, data: [], lastDoc: null, hasMore: false };
    }
  },

  // Paginated Ambulance operations
  async getAmbulancesPaginated(lastDoc = null, pageSize = 20) {
    try {
      let q = query(
        collection(db, 'ambulance'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const ambulances = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { 
        success: true, 
        data: ambulances,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error getting ambulances:', error);
      return { success: false, error: error.message, data: [], lastDoc: null, hasMore: false };
    }
  },

  // Paginated Users operations
  async getUsersPaginated(lastDoc = null, pageSize = 20, action = 'all') {
    try {
      // Create base query
      let baseQuery = collection(db, 'users');
      
      // Simple query - just get all users ordered by document ID to avoid field-related issues
      let q = query(
        baseQuery,
        orderBy('__name__', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      
      // Process users data to handle inconsistent field types
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Normalize user data to handle inconsistent fields
        const normalizedData = {
          id: doc.id,
          ...data
        };
        
        // Handle name field variations
        if (!normalizedData.name && data.Name) normalizedData.name = data.Name;
        if (!normalizedData.name && data.fullname) normalizedData.name = data.fullname;
        if (!normalizedData.name) normalizedData.name = 'N/A';
        
        // Handle email field variations
        if (!normalizedData.email && data.Email) normalizedData.email = data.Email;
        if (!normalizedData.email) normalizedData.email = data.email || 'N/A';
        
        // Handle phone field variations
        if (!normalizedData.phoneNumber && data.phone) normalizedData.phoneNumber = data.phone;
        if (!normalizedData.phoneNumber && data.Phone) normalizedData.phoneNumber = data.Phone;
        if (!normalizedData.phoneNumber) normalizedData.phoneNumber = data.phoneNumber || 'N/A';
        
        // Handle user type variations
        if (!normalizedData.userType && data.UserType) normalizedData.userType = data.UserType;
        if (!normalizedData.userType) normalizedData.userType = data.userType || 'patient';
        
        // Handle date of birth variations
        if (!normalizedData.dateOfBirth && data.date) normalizedData.dateOfBirth = data.date;
        if (!normalizedData.dateOfBirth && data.Date) normalizedData.dateOfBirth = data.Date;
        if (!normalizedData.dateOfBirth) normalizedData.dateOfBirth = 'N/A';
        
        // Handle gender variations
        if (!normalizedData.gender && data.Gender) normalizedData.gender = data.Gender;
        if (!normalizedData.gender) normalizedData.gender = data.gender || 'N/A';
        
        // Handle status variations
        if (!normalizedData.status && data.Status) normalizedData.status = data.Status;
        if (!normalizedData.status && data.isActive !== undefined) {
          normalizedData.status = data.isActive ? 'Active' : 'Inactive';
        }
        if (!normalizedData.status) normalizedData.status = data.status || 'Active';
        
        // Handle creation date variations
        if (!normalizedData.createdAt && data.created_at) normalizedData.createdAt = data.created_at;
        if (!normalizedData.createdAt && data.CreatedAt) normalizedData.createdAt = data.CreatedAt;
        if (!normalizedData.createdAt && data.time) normalizedData.createdAt = data.time;
        if (!normalizedData.createdAt) normalizedData.createdAt = data.createdAt || null;
        
        // Handle last login variations
        if (!normalizedData.lastLoginAt && data.last_login) normalizedData.lastLoginAt = data.last_login;
        if (!normalizedData.lastLoginAt && data.LastLogin) normalizedData.lastLoginAt = data.LastLogin;
        if (!normalizedData.lastLoginAt) normalizedData.lastLoginAt = data.lastLoginAt || null;
        
        // Handle verification status variations
        if (normalizedData.isVerified === undefined && data.verified !== undefined) {
          normalizedData.isVerified = (data.verified === 'Yes' || data.verified === true);
        }
        if (normalizedData.isVerified === undefined) normalizedData.isVerified = data.isVerified !== undefined ? data.isVerified : true;
        
        return normalizedData;
      });
      
      return { 
        success: true, 
        data: users,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: error.message, data: [], lastDoc: null, hasMore: false };
    }
  },

  // Generic paginated read function
  async readPaginated(collectionName, lastDoc = null, pageSize = 20, orderByField = 'createdAt') {
    try {
      let q = query(
        collection(db, collectionName),
        orderBy(orderByField, 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { 
        success: true, 
        data: data,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error(`Error getting ${collectionName}:`, error);
      return { success: false, error: error.message, data: [], lastDoc: null, hasMore: false };
    }
  }
};

export default firestoreService;
