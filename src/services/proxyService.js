// Proxy service to handle external API calls and avoid CORS issues
import axios from 'axios';

// Create axios instance with default configuration
const proxyService = axios.create({
  // In a production environment, this would point to your backend proxy server
  // For development, we'll use a CORS proxy service
  baseURL: 'https://corsproxy.io/?', // CORS proxy service
  timeout: 15000,
  headers: {
    'User-Agent': 'HealthAlign/1.0 (https://healthalign.com)',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Function to make proxied requests to external APIs
export const makeProxiedRequest = async (url, options = {}) => {
  try {
    // For Nominatim OpenStreetMap API requests
    if (url.includes('nominatim.openstreetmap.org')) {
      // Use the CORS proxy
      const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const response = await fetch(proxiedUrl, {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'HealthAlign/1.0 (https://healthalign.com)',
          'Referer': window.location.origin,
          ...options.headers
        },
        ...options
      });
      return response;
    }
    
    // For Overpass API requests
    if (url.includes('overpass-api.de')) {
      // Use the CORS proxy
      const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const response = await fetch(proxiedUrl, {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'HealthAlign/1.0 (https://healthalign.com)',
          ...options.headers
        },
        ...options
      });
      return response;
    }
    
    // For other requests, try direct fetch first, then fall back to proxy
    try {
      const response = await fetch(url, options);
      return response;
    } catch (directError) {
      // If direct fetch fails, try with CORS proxy
      const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const response = await fetch(proxiedUrl, options);
      return response;
    }
  } catch (error) {
    console.error('Error making proxied request:', error);
    throw error;
  }
};

// Alternative implementation using axios for better error handling
export const makeProxiedRequestAxios = async (url, options = {}) => {
  try {
    // Configure the proxy URL
    const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    
    // Make the request with axios
    const response = await proxyService({
      url: proxiedUrl,
      method: options.method || 'GET',
      ...options
    });
    
    return response;
  } catch (error) {
    console.error('Error making proxied request with axios:', error);
    throw error;
  }
};

export default {
  makeProxiedRequest,
  makeProxiedRequestAxios
};