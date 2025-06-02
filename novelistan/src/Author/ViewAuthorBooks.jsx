import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2, BookOpen, Plus, Eye, Loader, X, AlertTriangle } from 'lucide-react';
import API_BASE_URL from '../config';

const ViewAuthorBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const authorId = Cookies.get('authorId');

      if (!token || !authorId) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/book/authorBook/${authorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message || 'An error occurred while fetching your books');
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = (bookId) => {
    setDeleteConfirm(bookId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const token = Cookies.get('token');
      const response = await fetch(`${API_BASE_URL}/api/book/${deleteConfirm}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      // Remove the deleted book from the state
      setBooks(books.filter(book => book._id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting book:', err);
      alert(`Error deleting book: ${err.message}`);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const viewPdf = (book) => {
    setViewingPdf(book);
  };

  const closePdfViewer = () => {
    setViewingPdf(null);
  };

  const handleImageError = (bookId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [bookId]: true
    }));
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    fetchBooks();
  };

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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Something went wrong</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={retryFetch}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300 flex items-center justify-center"
          >
            <Loader className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">My Library</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">Manage your published works and create new literary masterpieces</p>
      
      {books.length === 0 ? (
        <div className="text-center py-16 bg-blue-50 dark:bg-gray-800/30 rounded-xl shadow-sm">
          <BookOpen className="h-16 w-16 mx-auto text-blue-300 dark:text-blue-200 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Your bookshelf is empty</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-sm mx-auto">Start your literary journey by adding your first book</p>
          <button 
            onClick={() => navigate('/author/add-book')} 
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-all transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Book
          </button>
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
                    className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="fixed bottom-8 right-8 z-10">
        <button
          onClick={() => navigate('/author/add-book')}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Add new book"
        >
          <Plus className="w-6 h-6" />
        </button>
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
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded shadow-lg max-w-4xl mx-auto h-full">
              <iframe
                src={`${API_BASE_URL}/api/book/pdf/${viewingPdf._id}`}
                title={`${viewingPdf.name} PDF`}
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 flex justify-end">
            <a
              href={`${API_BASE_URL}/api/book/pdf/${viewingPdf._id}`}
              download={`${viewingPdf.name}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAuthorBooks;
