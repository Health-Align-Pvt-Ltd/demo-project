// Firestore service for data operations
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { db } from './config';

export const firestoreService = {
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

  // Medicine orders
  async createMedicineOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'medicineOrders'), {
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'pending'
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
      
      // Sort by creation date on client side
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, data: orders };
    } catch (error) {
      console.error('Error getting medicine orders:', error);
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
  }
};