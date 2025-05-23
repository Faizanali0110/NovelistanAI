const multer = require('multer');
const path = require('path');

// Configure storage for book files
const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/books/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for cover images
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/covers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for book files
const bookFileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.epub', '.mobi'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, EPUB, and MOBI files are allowed for books'), false);
  }
};

// File filter for cover images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for covers'), false);
  }
};

// Initialize multer uploads
const uploadBook = multer({
  storage: bookStorage,
  fileFilter: bookFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

const uploadCover = multer({
  storage: coverStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware for handling multiple file uploads
const uploadBookFiles = (req, res, next) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname === 'bookFile') {
          cb(null, 'uploads/books/');
        } else if (file.fieldname === 'coverImage') {
          cb(null, 'uploads/covers/');
        } else {
          cb(new Error('Invalid file type'), null);
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        if (file.fieldname === 'bookFile') {
          cb(null, 'book-' + uniqueSuffix + ext);
        } else if (file.fieldname === 'coverImage') {
          cb(null, 'cover-' + uniqueSuffix + ext);
        } else {
          cb(new Error('Invalid file type'), null);
        }
      }
    }),
    fileFilter: (req, file, cb) => {
      const bookAllowedTypes = ['.pdf', '.epub', '.mobi'];
      const imageAllowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
      const ext = path.extname(file.originalname).toLowerCase();

      if (file.fieldname === 'bookFile' && bookAllowedTypes.includes(ext)) {
        cb(null, true);
      } else if (file.fieldname === 'coverImage' && imageAllowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'), false);
      }
    },
    limits: {
      fileSize: 20 * 1024 * 1024 // 20MB limit for book, 5MB for cover
    }
  }).fields([
    { name: 'bookFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]);

  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Configure storage for user profile images
const userProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadUserProfile = multer({
  storage: userProfileStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Storage configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/covers'));
  },
  filename: (req, file, cb) => {
    cb(null, `cover-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

// Storage configuration for PDFs
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/books'));
  },
  filename: (req, file, cb) => {
    cb(null, `book-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image file.'), false);
  }
};

// File filter for PDFs
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Not a PDF! Please upload a PDF file.'), false);
  }
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
});

const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
});

module.exports = {
  uploadBook,
  uploadCover,
  uploadBookFiles,
  uploadUserProfile,
  uploadImage,
  uploadPDF
};
