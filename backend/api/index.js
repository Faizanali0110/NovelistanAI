// Import the Express app from the server file
const app = require('../server');

// In serverless environments, we need to handle each request individually
// This ensures that all Express middleware and routes are properly processed
module.exports = async (req, res) => {
  // Forward the request to the Express app
  return app(req, res);
};
