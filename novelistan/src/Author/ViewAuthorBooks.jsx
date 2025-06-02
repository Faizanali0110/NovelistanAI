import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const ViewAuthorBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('token');
        const authorId = Cookies.get('authorId');
        
        // Validate token and authorId
        if (!token || !authorId) {
          // Redirect to login if no token
          window.location.href = '/login';
          return;
        }

        // Check token expiration
        const tokenExpiration = Cookies.get('tokenExpiration');
        if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
          // Token expired, redirect to login
          window.location.href = '/login';
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/book/authorBook/${authorId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              // Unauthorized or forbidden, redirect to login
              window.location.href = '/login';
              return;
            }
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
          }

          const data = await response.json();
          setBooks(data);
        } catch (error) {
          setError(error.message || 'Failed to load books. Please try again later.');
          console.error('Error fetching books:', error);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        setError(error.message || 'Failed to load books. Please try again later.');
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, []);
  
  const handleDelete = async (bookId) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${API_BASE_URL}/api/book/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the book.');
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete the book. Please try again later.');
    }
  };

  const viewPdf = async (book) => {
    try {
      if (!book || !book._id) {
        throw new Error('Book information not available');
        return;
      }
      
      const token = Cookies.get('token');
      const response = await fetch(`${API_BASE_URL}/api/book/pdf/${book._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
      
      // Clean up the Blob URL after opening
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      console.error('Error viewing PDF:', error);
      alert('Failed to open PDF. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">My Library</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">Manage your published works and create new literary masterpieces</p>
      
      {books.length === 0 ? (
        <div className="text-center py-16 bg-blue-50 dark:bg-gray-800/30 rounded-xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300 dark:text-blue-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Your bookshelf is empty</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-sm mx-auto">Start your literary journey by adding your first book</p>
          <button onClick={() => navigate('/author/add-book')} className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-all transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div 
              key={book._id}
              className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/60 transition-all duration-300 border border-blue-100/80 dark:border-gray-700 transform hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={`${API_BASE_URL}/api/book/cover/${book._id}`} 
                  alt={book.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/placeholder-book.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                  <button 
                    onClick={() => viewPdf(book)}
                    className="mb-4 px-5 py-2 bg-white/90 text-blue-700 hover:bg-white rounded-full font-medium text-sm flex items-center space-x-1 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Preview</span>
                  </button>
                </div>
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => viewPdf(book)}
                    className="flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
          className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Add new book"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ViewAuthorBooks;
