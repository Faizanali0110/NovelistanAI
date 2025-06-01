// Determine if we're running on a deployed site or locally
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Choose API URL based on environment
// Using environment variable if available, otherwise use local development URL
const API_BASE_URL =  'https://novelistanai-backend-deployment-gkhae2hca5acf4b5.canadacentral-01.azurewebsites.net';


export default API_BASE_URL;