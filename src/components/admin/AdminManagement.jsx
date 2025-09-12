// Generic Admin Management Component
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { firestoreService } from '../../firebase/firestoreService';
import { formatAdminDate, getStatusBadgeClass } from '../../utils/adminUtils';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  History, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePagination } from '../../hooks/usePagination';

const AdminManagement = () => {
  const { entityType, action } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);

  // If user is not admin, redirect to dashboard
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Create fetch function based on entity type
  const createFetchFunction = useCallback(() => {
    const collectionMap = {
      medicines: { name: 'products', func: 'getProductsPaginated' },
      categories: { name: 'productCategories', func: 'getProductCategoriesPaginated' },
      diseases: { name: 'diseases', func: 'getDiseasesPaginated' },
      pharmacies: { name: 'pharmacy', func: 'getPharmaciesPaginated' },
      labs: { name: 'labs', func: 'readPaginated' },
      ambulances: { name: 'ambulance', func: 'getAmbulancesPaginated' },
      users: { name: 'users', func: 'getUsersPaginated' }
    };

    const collectionInfo = collectionMap[entityType];
    
    if (!collectionInfo) {
      return null;
    }

    return async (lastDoc, pageSize) => {
      try {
        // For users, pass the action parameter to filter results
        if (entityType === 'users' && firestoreService[collectionInfo.func]) {
          console.log('Fetching users with action:', action);
          const result = await firestoreService[collectionInfo.func](lastDoc, pageSize, action);
          console.log('Users fetch result:', result);
          return result;
        } else if (firestoreService[collectionInfo.func]) {
          console.log('Fetching', entityType, 'with function:', collectionInfo.func);
          const result = await firestoreService[collectionInfo.func](lastDoc, pageSize);
          console.log(entityType, 'fetch result:', result);
          return result;
        } else {
          console.log('Fetching', entityType, 'with readPaginated');
          const result = await firestoreService.readPaginated(
            collectionInfo.name, 
            lastDoc, 
            pageSize
          );
          console.log(entityType, 'readPaginated result:', result);
          return result;
        }
      } catch (error) {
        console.error('Fetch error for', entityType, ':', error);
        return { success: false, error: error.message, data: [], lastDoc: null, hasMore: false };
      }
    };
  }, [entityType, action]);

  // Use pagination hook
  const {
    loading,
    error,
    items: paginatedItems,
    hasMore,
    currentPage,
    resetPagination,
    loadMore,
    goToPage
  } = usePagination(createFetchFunction, [entityType, createFetchFunction]);

  // Update local items state when paginated items change
  useEffect(() => {
    setItems(paginatedItems);
  }, [paginatedItems]);

  // Reset pagination when entity type, action, or search term changes
  useEffect(() => {
    resetPagination();
  }, [entityType, action, searchTerm, resetPagination]);

  const getEntityTitle = (type) => {
    const titles = {
      medicines: 'Medicines',
      categories: 'Categories',
      diseases: 'Diseases',
      pharmacies: 'Pharmacies',
      labs: 'Labs',
      ambulances: 'Ambulances',
      users: 'Users'
    };
    return titles[type] || type;
  };

  const getActionTitle = (action) => {
    const titles = {
      'add-new': 'Add New',
      'pending-records': 'Pending Records',
      'approved-records': 'Approved Records',
      'record-history': 'Record History'
    };
    return titles[action] || action;
  };

  const handleAddNew = () => {
    navigate(`/admin/${entityType}/add-new/form`);
  };

  const handleViewDetails = (item) => {
    console.log('View details for:', item);
  };

  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = async (item) => {
    try {
      const collectionMap = {
        medicines: 'products',
        categories: 'productCategories',
        diseases: 'diseases',
        pharmacies: 'pharmacy',
        labs: 'labs',
        ambulances: 'ambulance',
        users: 'users'
      };
      
      const collectionName = collectionMap[entityType] || entityType;
      
      // Ensure item ID is a string for Firestore operations
      const itemId = item.id.toString();
      
      if (collectionName && itemId) {
        const result = await firestoreService.delete(collectionName, itemId);
        if (result.success) {
          // Remove item from state
          setItems(prevItems => prevItems.filter(i => i.id.toString() !== itemId));
          console.log('Item deleted successfully');
        } else {
          console.error('Failed to delete item:', result.error);
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item => 
    Object.values(item).some(val => 
      val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic for filtered items
  const indexOfLastItem = currentPage * 20;
  const indexOfFirstItem = indexOfLastItem - 20;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / 20);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <AdminHeader />
        
        <main className="flex-1 pt-16 pb-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center my-6">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                  {getEntityTitle(entityType)} - {getActionTitle(action)}
                </h1>
                
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {entityType === 'medicines' && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            </>
                          )}
                          {entityType === 'categories' && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </>
                          )}
                          {entityType === 'diseases' && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            </>
                          )}
                          {['pharmacies', 'labs', 'ambulances'].includes(entityType) && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            </>
                          )}
                          {entityType === 'users' && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            </>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.length > 0 ? (
                          currentItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              {entityType === 'medicines' && (
                                <>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price?.toFixed(2) || 'N/A'}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stockCount || 0}</td>
                                </>
                              )}
                              {entityType === 'categories' && (
                                <>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description?.substring(0, 50) || 'N/A'}{item.description?.length > 50 ? '...' : ''}</td>
                                </>
                              )}
                              {entityType === 'diseases' && (
                                <>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                </>
                              )}
                              {['pharmacies', 'labs', 'ambulances'].includes(entityType) && (
                                <>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name || item.vehicleNumber}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.phone || 'N/A'}</td>
                                </>
                              )}
                              {entityType === 'users' && (
                                <>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.name || item.Name || item.fullname || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.email || item.Email || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.phoneNumber || item.phone || item.Phone || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                      {item.userType || item.UserType || 'patient'}
                                    </span>
                                  </td>
                                </>
                              )}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status || item.Status || (item.isActive !== undefined ? (item.isActive ? 'approved' : 'pending') : 'approved'))}`}>
                                  {item.status || item.Status || (item.isActive !== undefined ? (item.isActive ? 'Active' : 'Inactive') : 'Approved')}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.createdAt || item.created_at || item.CreatedAt || item.time ? formatAdminDate(item.createdAt || item.created_at || item.CreatedAt || item.time) : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewDetails(item)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="100%" className="px-6 py-4 text-center text-sm text-gray-500">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button
                          onClick={() => goToPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            if (hasMore && currentPage * 20 >= items.length) {
                              loadMore();
                            } else {
                              goToPage(Math.min(totalPages, currentPage + 1));
                            }
                          }}
                          disabled={currentPage === totalPages && !hasMore}
                          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{Math.min(indexOfFirstItem + 1, filteredItems.length)}</span> to{' '}
                            <span className="font-medium">{Math.min(indexOfLastItem, filteredItems.length)}</span> of{' '}
                            <span className="font-medium">{filteredItems.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                              onClick={() => goToPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
                            >
                              <span className="sr-only">Previous</span>
                              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            
                            {/* Page numbers */}
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => goToPage(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    currentPage === pageNum
                                      ? 'z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                            
                            <button
                              onClick={() => {
                                if (hasMore && currentPage * 20 >= items.length) {
                                  loadMore();
                                } else {
                                  goToPage(Math.min(totalPages, currentPage + 1));
                                }
                              }}
                              disabled={currentPage === totalPages && !hasMore}
                              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                              <span className="sr-only">Next</span>
                              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {action === 'add-new' && (
                <div className="mt-6">
                  <button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New {getEntityTitle(entityType)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminManagement;