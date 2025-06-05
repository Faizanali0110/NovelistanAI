import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Edit, Trash2, BookOpen, Plus, Eye, Loader, X, 
  AlertTriangle, Home, User, LogOut, LogIn, RefreshCw, RotateCw, CheckCircle2, AlertCircle 
} from 'lucide-react';
import API_BASE_URL from '../config';

const ViewAuthorBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const navigate = useNavigate();
  
  const getPdfUrl = (bookId) => {
    return `${API_BASE_URL}/api/book/pdf/${bookId}`;
  };
  
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = new Error('Request failed');
      error.response = response;
      throw error;
    }
    
    return response.json();
  };

  const fetchBooks = useCallback(async () => {
    try {
      const authorId = Cookies.get('authorId') || localStorage.getItem('authorId');
      
      if (!authorId) {
        throw new Error('Author ID not found. Please log in again.');
      }

      console.log('Fetching books for author:', authorId);
      
      const data = await fetchWithAuth(`/api/book/authorBook/${authorId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: {
          _t: Date.now() // Cache buster
        }
      });

      console.log('Fetched books:', data);
      setBooks(Array.isArray(data) ? data : []);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchBooks:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        response: err.response?.data
      });
      
      // User-friendly error messages
      let errorMessage = 'An error occurred while fetching your books. Please try again.';
      let errorStatus = null;
      
      if (err.response) {
        // Handle HTTP error responses
        errorStatus = err.response.status;
        if (errorStatus === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
          // Clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('authorId');
        } else if (errorStatus === 403) {
          errorMessage = 'You do not have permission to view these books.';
        } else if (errorStatus === 404) {
          errorMessage = 'No books found for this author.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (err.message) {
        // Something happened in setting up the request
        errorMessage = err.message;
      }
      
      setError({ message: errorMessage, status: errorStatus });
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await fetchWithAuth(`/api/book/${deleteConfirm}`, {
        method: 'DELETE'
      });
      
      setBooks(prevBooks => prevBooks.filter(book => book._id !== deleteConfirm));
      setDeleteConfirm(null);
      
      setError({
        type: 'success',
        message: 'Book deleted successfully!'
      });
      
      setTimeout(() => setError(null), 3000);
      
    } catch (error) {
      console.error('Error deleting book:', error);
      
      let errorMessage = 'Failed to delete book. Please try again.';
      let errorStatus = null;
      
      if (error.response) {
        errorStatus = error.response.status;
        if (errorStatus === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
          localStorage.removeItem('token');
          localStorage.removeItem('authorId');
          navigate('/login');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError({ 
        message: errorMessage,
        status: errorStatus,
        type: 'error'
      });
    }
  };
  
  const handleDelete = (bookId) => {
    setDeleteConfirm(bookId);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const viewPdf = (book) => {
    setPdfLoading(true);
    setPdfError(null);
    setViewingPdf(book);
  };

  const closePdfViewer = () => {
    setViewingPdf(null);
    setPdfLoading(false);
    setPdfError(null);
  };

  const handleImageError = useCallback((bookId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [bookId]: true
    }));
  }, []);

  const retryFetch = useCallback(() => {
    setError(null);
    fetchBooks();
  }, [fetchBooks]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mr-3" />
          <p className="text-gray-700 dark:text-gray-200 text-lg">Loading your books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isError = typeof error === 'string' || error.type !== 'success';
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className={`w-full max-w-md p-6 rounded-lg shadow-md ${
          isError ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'
        }`}>
          <div className="flex items-center justify-center mb-4">
            {isError ? (
              <AlertCircle className="h-12 w-12 text-red-500" />
            ) : (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">
            {isError ? 'Something went wrong' : 'Success!'}
          </h2>
          
          <p className={`text-center mb-6 ${
            isError ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
          }`}>
            {errorMessage}
          </p>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2 px-4 bg-white hover:bg-gray-100 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </button>
              
              {isError && (
                <button
                  onClick={fetchBooks}
                  className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300 flex items-center justify-center"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Retry
                </button>
              )}
            </div>
            
            {isError && errorMessage.includes('session has expired') && (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('authorId');
                  navigate('/login');
                }}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Go to Login
              </button>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Still having trouble? Contact support at{' '}
                <a 
                  href="mailto:support@novelistan.com" 
                  className="text-blue-500 hover:underline"
                >
                  support@novelistan.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">My Library</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">Manage your published works and create new literary masterpieces</p>
      
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-2xl w-full">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Books Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You haven't published any books yet. Get started by creating your first book!
            </p>
            <button
              onClick={() => navigate('/author/dashboard')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300 flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Book
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div 
              key={book._id}
              className="group bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/60 transition-all duration-300 border border-blue-100/80 dark:border-gray-700 transform hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                <img 
                  src={`${API_BASE_URL}/api/book/cover/${book._id}`}
                  alt={book.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-cover.jpg';
                    handleImageError(book._id);
                  }}
                />
                <button
                  onClick={() => viewPdf(book)}
                  className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/70 hover:bg-black/90 text-white text-xs rounded-full px-3 py-1 transition-colors duration-300"
                >
                  <Eye className="h-3 w-3" />
                  <span>Preview</span>
                </button>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {book.name}
                </h2>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/70 px-2 py-1 rounded-md">ISBN</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">{book.isbn}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/70 px-2 py-1 rounded-md">Genre</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">{book.genre}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-blue-100 dark:border-gray-700">
                  <button
                    onClick={() => navigate(`/author/update-book/${book._id}`)}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => viewPdf(book)}
                    className="flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className={`flex items-center ${
                      deleteConfirm === book._id 
                        ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300'
                        : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                    } transition-colors`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deleteConfirm === book._id ? 'Confirm' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="fixed bottom-8 right-8 z-10">
        <Link
          to="/author/add-book"
          className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Add new book"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 bg-black/80 flex flex-col z-50">
          <div className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {viewingPdf.name} - PDF Preview
            </h3>
            <button
              onClick={closePdfViewer}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close preview"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded shadow-lg max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                {pdfLoading && (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Loader className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Loading PDF preview...</p>
                  </div>
                )}
                {pdfError && (
                  <div className="p-8 text-center">
                    <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Preview Unavailable</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {pdfError}
                    </p>
                    <button
                      onClick={() => window.open(getPdfUrl(viewingPdf._id), '_blank')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Open PDF in New Tab
                    </button>
                  </div>
                )}
                <div className={`w-full h-full ${pdfLoading || pdfError ? 'hidden' : 'block'}`}>
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(getPdfUrl(viewingPdf._id))}&embedded=true`}
                    className="w-full h-[70vh] border-0"
                    onLoad={() => setPdfLoading(false)}
                    onError={() => {
                      setPdfLoading(false);
                      setPdfError('Unable to load PDF preview. The file might be corrupted or in an unsupported format.');
                    }}
                    title={`PDF Preview: ${viewingPdf.name}`}
                    aria-label={`PDF Preview of ${viewingPdf.name}`}
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {viewingPdf.name}.pdf
                  </p>
                  <a
                    href={getPdfUrl(viewingPdf._id)}
                    download={`${viewingPdf.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAuthorBooks;
