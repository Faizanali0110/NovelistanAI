// Load environment variables
try {
  require('dotenv').config();
  console.log('Environment setup complete');
  // Print important environment variables (without sensitive values)
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('MongoDB connection available:', !!process.env.MONGODB_URI);
  console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
  console.log('Azure Storage available:', !!process.env.AZURE_STORAGE_ACCOUNT_NAME);
} catch (err) {
  console.error('Error loading environment variables:', err);
}

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authorToolsRoutes = require('./routes/authorToolsRoutes');
const readingExperienceRoutes = require('./routes/readingExperienceRoutes');

// Import models
const User = require('./models/User');
const Customer = require('./models/Customer');
const { error } = require('console');
const { uploadUserProfile, processProfileUpload } = require('./middleware/upload');

// Initialize Express app
const app = express();

// ======================
// 1. Configuration
// ======================
const PORT = process.env.PORT || 8082;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novelistan';

// MongoDB Connection Function
async function connectDB() {
  try {
    console.log('Attempting to connect to MongoDB with URI:', MONGODB_URI.substring(0, 20) + '...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // In production, don't crash the server if DB is unreachable temporarily
    if (process.env.NODE_ENV === 'production') {
      console.warn('Running without database in production mode - some features will be limited');
      return false;
    } else {
      throw error; // In development, we want to fail fast
    }
  }
}

// ======================
// 2. Middleware
// ======================

// Use standard CORS middleware for simplicity and reliability
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://novelistan-ai-ewj8.vercel.app',
      'https://novelistanai.azurewebsites.net',
      'https://novelistanai-ecdfcwewg5brgucz.canadacentral-01.azurewebsites.net'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Request logging middleware (keeping this one)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories if they don't exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Ensure all upload directories exist
ensureDir(path.join(__dirname, 'uploads'));
ensureDir(path.join(__dirname, 'uploads', 'books'));
ensureDir(path.join(__dirname, 'uploads', 'covers'));
ensureDir(path.join(__dirname, 'uploads', 'profiles'));
ensureDir(path.join(__dirname, 'public'));

// Serve static files from various directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add a proxy route to handle both Azure and local files
app.get('/api/files/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;
    const localPath = path.join(__dirname, 'uploads', type, filename);
    
    // Check if the file exists locally first
    if (fs.existsSync(localPath)) {
      console.log(`Serving local file: ${localPath}`);
      return res.sendFile(localPath);
    }
    
    // If not local, try to proxy from Azure
    const azureUrl = `https://novelistanupload.blob.core.windows.net/uploads/${type}-${filename}`;
    console.log(`Proxying to Azure: ${azureUrl}`);
    
    // Redirect to Azure URL
    return res.redirect(azureUrl);
  } catch (error) {
    console.error('Error serving file:', error);
    return res.status(404).json({ message: 'File not found' });
  }
});

app.use('/uploads/books', express.static(path.join(__dirname, 'uploads', 'books')));
app.use('/uploads/covers', express.static(path.join(__dirname, 'uploads', 'covers')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads', 'profiles')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Create a route to serve Azure blob storage files directly
app.get('/azure/file', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ message: 'URL parameter is required' });
    }
    
    // Validate the URL to ensure it's from our Azure storage account
    if (!url.includes('novelistanupload.blob.core.windows.net')) {
      return res.status(400).json({ message: 'Invalid URL' });
    }
    
    console.log(`Proxying request to Azure for: ${url}`);
    
    // Import axios
    const axios = require('axios');
    
    // Make the request to Azure
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    
    // Set appropriate headers
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    // Send the file data
    return res.send(response.data);
  } catch (error) {
    console.error(`Error proxying file from Azure: ${error.message}`);
    return res.status(500).json({ message: 'Error retrieving file from storage' });
  }
});

// Add a catch-all route for any URLs that look like Azure URLs
app.get('*/https://novelistanupload.blob.core.windows.net/*', (req, res) => {
  try {
    // Extract the Azure URL from the request URL
    const fullPath = req.originalUrl;
    const azureUrlMatch = fullPath.match(/(https:\/\/novelistanupload\.blob\.core\.windows\.net\/.+)/);
    
    if (!azureUrlMatch || !azureUrlMatch[1]) {
      return res.status(400).json({ message: 'Invalid Azure URL' });
    }
    
    // Get the Azure URL and redirect to our proxy
    const azureUrl = azureUrlMatch[1];
    console.log(`Redirecting Azure URL request to proxy: ${azureUrl}`);
    
    // Redirect to our proxy endpoint
    return res.redirect(`/azure/file?url=${encodeURIComponent(azureUrl)}`);
  } catch (error) {
    console.error(`Error handling Azure URL redirect: ${error.message}`);
    return res.status(500).json({ message: 'Error handling request' });
  }
});

// Create a route to serve Azure blob storage files directly
app.get('/uploads/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;
    const axios = require('axios');
    
    // Form the Azure URL based on the container and filename
    const azureUrl = `https://novelistanupload.blob.core.windows.net/uploads/${filename}`;
    
    console.log(`Proxying request to Azure for: ${azureUrl}`);
    
    const response = await axios.get(azureUrl, {
      responseType: 'arraybuffer'
    });
    
    // Set appropriate headers
    const contentType = response.headers['content-type'] || 
      (type === 'books' ? 'application/pdf' : 'image/jpeg');
    res.set('Content-Type', contentType);
    
    if (type === 'books') {
      res.set('Content-Disposition', `inline; filename="${filename}"`);
    } else {
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    }
    
    // Send the file data
    return res.send(response.data);
  } catch (error) {
    console.error(`Error proxying file from Azure: ${error.message}`);
    return res.status(500).json({ message: 'Error retrieving file from storage' });
  }
});

// ======================
// 3. Database Connection
// ======================
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// ======================
// 4. Routes
// ======================

// API Routes
app.use('/api/book', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/user', userRoutes);
// Create a separate customer routes from userRoutes
const customerRoutes = express.Router();

// Customer registration route with Azure Blob Storage for profile image
customerRoutes.post('/register', uploadUserProfile, processProfileUpload, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`Processing customer registration for ${name} (${email})`);

    // Check if customer already exists in either User or Customer models
    let existingCustomer = await Customer.findOne({ email });
    let existingUser = await User.findOne({ email });
    let existingAuthor = await mongoose.model('Author').findOne({ email }).catch(() => null);

    if (existingCustomer || existingUser || existingAuthor) {
      console.log(`Registration failed: Email ${email} already exists`);
      return res.status(400).json({ message: 'Email already registered. Please login or use a different email.' });
    }

    // Create new customer with Azure Blob Storage profile image URL if provided
    const customer = new Customer({
      name,
      email,
      password,
      profilePicture: req.file ? req.file.path : undefined
    });

    await customer.save();
    console.log(`Customer ${name} registered successfully with ID: ${customer._id}`);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: customer._id, role: 'customer' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    
    // Don't send password in response
    customer.password = undefined;
    
    res.status(201).json({ token, user: customer._id, role: 'customer' });
  } catch (error) {
    console.error('Customer registration error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already registered. Please login or use a different email.', 
        error: 'Duplicate email' 
      });
    }
    
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});
// Define customer login route
customerRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if customer exists
    let user = await Customer.findOne({ email });
    
    // If no user is found
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'customer' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    // Don't send password in response
    user.password = undefined;

    res.json({
      token,
      user: user._id,
      role: 'customer'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add customer image route
customerRoutes.get('/customerImage/:userId', async (req, res) => {
  try {
    // Find the customer by ID
    const customer = await Customer.findById(req.params.userId).select('profilePicture');
    
    // Default profile image URL (points to Gravatar default image)
    const defaultProfileUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    
    if (!customer) {
      console.log('Customer not found, redirecting to default profile image');
      return res.redirect(defaultProfileUrl);
    }
    
    // If no profile picture, redirect to default
    if (!customer.profilePicture) {
      console.log('No customer profile picture, redirecting to default');
      return res.redirect(defaultProfileUrl);
    }
    
    // If the profile picture is an Azure URL (starts with https://), redirect to it
    if (customer.profilePicture.startsWith('https://')) {
      return res.redirect(customer.profilePicture);
    }
    
    // For backward compatibility - if it's a local path, try to serve it
    try {
      const imagePath = path.resolve(customer.profilePicture);
      const fs = require('fs');
      
      if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
      } else {
        console.log('Customer profile picture not found, redirecting to default');
        return res.redirect(defaultProfileUrl);
      }
    } catch (error) {
      console.error('Error serving local profile picture:', error);
      return res.redirect(defaultProfileUrl);
    }
  } catch (error) {
    console.error('Error fetching customer image:', error);
    res.redirect(defaultProfileUrl);
  }
});

app.use('/api/Customer', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/author-tools', authorToolsRoutes);
app.use('/api/reading', readingExperienceRoutes);

// Public Routes
app.post('/addUser', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    // Remove sensitive data before sending response
    user.password = undefined;
    
    res.status(201).json({ 
      success: true,
      token, 
      user 
    });
    
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// ======================
// 5. Error Handling
// ======================

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files for the React frontend
// Check for different possible build output locations
const possibleFrontendPaths = [
  path.join(__dirname, 'public', 'frontend'),  // Azure deployment from GitHub Actions
  path.join(__dirname, 'public'),              // Direct build output
  path.join(__dirname, '..', 'novelistan', 'build'), // Local development
  path.join(__dirname, '..', 'novelistan', 'dist')   // Vite build output
];

// Find the first path that exists and log all paths checked
console.log('Checking for frontend build paths:');
possibleFrontendPaths.forEach(path => console.log(` - ${path}`));

// Frontend path variable will be defined later
let frontendBuildPath = null;
for (const pathToCheck of possibleFrontendPaths) {
  if (fs.existsSync(pathToCheck)) {
    console.log(`✅ Frontend build found at: ${pathToCheck}`);
    frontendBuildPath = pathToCheck;
    break;
  }
}

if (frontendBuildPath) {
  // Serve static files
  console.log(`Serving static files from: ${frontendBuildPath}`);
  app.use(express.static(frontendBuildPath));
  
  // Catch-all route for SPA client-side routing
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ 
        success: false, 
        message: 'API route not found', 
        path: req.originalUrl
      });
    }
    
    // Serve the React app for all other routes
    console.log(`Serving frontend for path: ${req.originalUrl}`);
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  console.warn('WARNING: No frontend build found! The application will only serve API endpoints.');
  
  // 404 Handler for API routes only
  app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
      success: false, 
      message: 'Route not found', 
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ======================
// 6. Start Server
// ======================
const startServer = async () => {
  try {
    // Try to connect to MongoDB but don't crash the server in production if it fails
    let dbConnected = false;
    try {
      dbConnected = await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      if (process.env.NODE_ENV !== 'production') {
        // Only exit in development to fail fast
        console.error('Exiting due to database connection failure in development mode');
        process.exit(1);
      }
    }

    // Start the Express server
    app.listen(PORT, () => {
      console.log('===============================================');
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📦 Database connected: ${dbConnected ? 'Yes' : 'No'}`);
      console.log(`🔐 Authentication enabled: ${!!process.env.JWT_SECRET}`);
      console.log(`📁 Azure Storage configured: ${!!process.env.AZURE_STORAGE_ACCOUNT_NAME}`);
      console.log('===============================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    // In production, we'll log the error but try to keep the server running if possible
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Root route for API health check
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API is running', 
    version: '1.0.0' 
  });
});

// getMessage route that was changed earlier
app.get('/getMessage', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API is running...' 
  });
});

// Production static file serving - MUST be before starting the server
console.log('Setting up static file serving...');

// Check if we're in the Azure deployment environment
const frontendPath = path.join(__dirname, 'public', 'frontend');
const buildPath = path.join(__dirname, '..', 'novelistan', 'build');

// Debug paths for Azure troubleshooting
console.log('Current directory:', __dirname);
console.log('Checking frontend path:', frontendPath);
console.log('Checking build path:', buildPath);
console.log('Directory exists - frontend:', fs.existsSync(frontendPath));
console.log('Directory exists - build:', fs.existsSync(buildPath));

// First try the Azure deployment path (public/frontend)
if (fs.existsSync(frontendPath)) {
  console.log('Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath, { maxAge: '1d' }));
  app.get('*', (req, res) => {
    try {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
      }
    } catch (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
} 
// Then try the local build path
else if (fs.existsSync(buildPath)) {
  console.log('Serving frontend from:', buildPath);
  app.use(express.static(buildPath, { maxAge: '1d' }));
  app.get('*', (req, res) => {
    try {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(buildPath, 'index.html'));
      }
    } catch (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
} else {
  console.log('WARNING: No frontend build directory found!');
}

// Final error handler - must be after all other middleware and routes
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // In production, don't exit the process as it would crash the server
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

