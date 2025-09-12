// Wallet Component
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { firestoreService } from '../../firebase/firestoreService';
import PageLayout from '../common/PageLayout';
import {
  Wallet,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Gift,
  RefreshCw,
  Eye,
  EyeOff,
  History,
  TrendingUp,
  Smartphone
} from 'lucide-react';

const WalletComponent = () => {
  const { userData } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userData?.uid) {
      loadWalletData();
    }
  }, [userData]);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      // Load wallet details
      const walletResult = await firestoreService.getUserWallet(userData.uid);
      if (walletResult.success) {
        setWallet(walletResult.data);
      }

      // Load user transactions
      const transactionsResult = await firestoreService.getUserTransactions(userData.uid);
      if (transactionsResult.success) {
        setTransactions(transactionsResult.data);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
    setLoading(false);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type, paymentMethod) => {
    if (type === 'credit') return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
    if (type === 'debit') return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    if (paymentMethod === 'upi') return <Smartphone className="w-4 h-4 text-blue-600" />;
    return <CreditCard className="w-4 h-4 text-gray-600" />;
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <PageLayout title="My Wallet">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="My Wallet">
      <div className="space-y-4">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-6 h-6" />
              <span className="text-sm font-medium">Wallet Balance</span>
            </div>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-1 hover:bg-white/20 rounded-full"
            >
              {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-3xl font-bold">
              {balanceVisible ? formatAmount(wallet?.balance || 0) : '••••••'}
            </p>
            <p className="text-blue-100 text-sm">Available Balance</p>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-white/30 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Money</span>
            </button>
            <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-white/30 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">Send Money</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">This Month</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatAmount(transactions.filter(t => 
                new Date(t.createdAt).getMonth() === new Date().getMonth()
              ).reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : 0), 0))}
            </p>
            <p className="text-xs text-gray-500">Cashback Earned</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-2 mb-2">
              <History className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Total Transactions</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{transactions.length}</p>
            <p className="text-xs text-gray-500">All Time</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm -mx-4">
          <div className="px-4">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-3 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Transactions
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className="text-blue-600 text-xs font-medium"
                >
                  View All
                </button>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-6">
                  <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type, transaction.paymentMethod)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description || 'Transaction'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)} • {transaction.paymentMethod || transaction.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{formatTime(transaction.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No transactions found</p>
                <p className="text-gray-400 text-xs mt-1">Your transactions will appear here when you make payments</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type, transaction.paymentMethod)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description || 'Transaction'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Transaction ID: {transaction.transactionId}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{formatDate(transaction.createdAt)}</span>
                          <span>{formatTime(transaction.createdAt)}</span>
                          <span className="capitalize">{transaction.paymentMethod || transaction.type}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={loadWalletData}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium text-sm hover:bg-gray-200 flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    </PageLayout>
  );
};

export default WalletComponent;