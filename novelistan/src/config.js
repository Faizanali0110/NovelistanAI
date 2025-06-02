// Intelligently detect environment and use appropriate backend URLs
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8082' 
  : 'https://novelistanai-backend-bmf0hadkhzc5hcct.canadacentral-01.azurewebsites.net';

console.log(`Using API base URL: ${API_BASE_URL} (${isDevelopment ? 'development' : 'production'} mode)`);

export default API_BASE_URL;
