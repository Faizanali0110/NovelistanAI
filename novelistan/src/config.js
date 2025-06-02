// Determine if we're running on a deployed site or locally
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Choose API URL based on environment
// Using environment variable if available, otherwise use local development URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isLocalhost ? 'http://localhost:8082' : 'https://your-new-backend-url.com/');

// Frontend URL on Vercel: https://novelistan-ai-ewj8.vercel.app

export default API_BASE_URL;
