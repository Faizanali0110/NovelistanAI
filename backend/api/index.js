// Import the Express app from the server file
const app = require('../server');

// Enhanced handler for serverless environments with error handling
module.exports = async (req, res) => {
  try {
    console.log(`[VERCEL] Incoming request: ${req.method} ${req.url}`);
    
    // For debugging on Vercel
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    // Special handling for root route to ensure it works
    if (req.url === '/' || req.url === '') {
      return res.status(200).json({
        success: true,
        message: 'Novelistan API is running',
        version: '1.0.0',
        serverless: true,
      });
    }
    
    // Special handling for getMessage route
    if (req.url === '/getMessage' || req.url.startsWith('/getMessage?')) {
      return res.status(200).json({
        success: true,
        message: 'API is running...',
        serverless: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // Forward all other requests to the Express app
    return app(req, res);
  } catch (error) {
    console.error('[VERCEL] Error handling request:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error in serverless function',
      error: error.message
    });
  }
};
