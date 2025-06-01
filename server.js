/**
 * Root server entry point for Azure deployment
 * 
 * This file redirects to the actual server implementation in the backend folder
 * to solve Azure deployment issues that expect server.js at the root level
 */

// Simply require the backend server module
require('./backend/server.js');
