// Admin Utilities

/**
 * Check if a user is an admin
 * @param {Object} user - Firebase user object
 * @param {Object} userData - User data from Firestore
 * @returns {boolean} - True if user is admin
 */
export const isAdminUser = (user, userData) => {
  if (!user || !userData) return false;
  
  // Check if user has admin userType
  if (userData.userType === 'admin') return true;
  
  // Check if user has admin email
  const adminEmail = 'kanaishil501@gmail.com';
  if (user.email === adminEmail) return true;
  
  return false;
};

/**
 * Check if a user can access admin features
 * @param {Object} user - Firebase user object
 * @param {Object} userData - User data from Firestore
 * @returns {boolean} - True if user can access admin features
 */
export const canAccessAdmin = (user, userData) => {
  return isAdminUser(user, userData);
};

/**
 * Format date for admin display
 * @param {string} date - Date string
 * @returns {string} - Formatted date
 */
export const formatAdminDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format currency for admin display
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency
 */
export const formatAdminCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Get status badge class for admin display
 * @param {string} status - Status string
 * @returns {string} - CSS classes for status badge
 */
export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};