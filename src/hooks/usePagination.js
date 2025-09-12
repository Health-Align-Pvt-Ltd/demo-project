import { useState, useEffect, useCallback } from 'react';

export const usePagination = (fetchFunction, dependencies = []) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(
        currentPage === 1 ? null : lastDoc,
        itemsPerPage
      );
      
      if (result.success) {
        if (currentPage === 1) {
          setItems(result.data || []);
        } else {
          setItems(prevItems => [...prevItems, ...result.data]);
        }
        
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      } else {
        setError(result.error || 'Failed to fetch data');
        setItems([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, lastDoc]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setLastDoc(null);
    setHasMore(true);
    setItems([]);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return {
    loading,
    error,
    items,
    hasMore,
    currentPage,
    resetPagination,
    loadMore,
    goToPage
  };
};