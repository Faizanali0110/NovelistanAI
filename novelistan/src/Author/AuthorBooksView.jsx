import React, { useState, useEffect } from 'react';

const AuthorBooksView = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get author ID from localStorage
  const authorId = localStorage.getItem('authorId');

  useEffect(() => {
    fetchAuthorBooks();
  }, []);

  const fetchAuthorBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/book/authorBook/${authorId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (isbn) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/book/${isbn}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Refresh the books list
          fetchAuthorBooks();
          alert('Book deleted successfully');
        } else {
          throw new Error('Failed to delete book');
        }
      } catch (err) {
        alert('Error deleting book: ' + err.message);
      }
    }
  };

  const handleUpdate = async (book) => {
    // Store the selected book for editing
    localStorage.setItem('editBook', JSON.stringify(book));
    // You can implement navigation to edit form or show edit modal
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-md">Error: {error}</div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">My Library</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">Manage your published works and create new literary masterpieces</p>
        
        <div className="text-center py-16 bg-blue-50 dark:bg-gray-800/30 rounded-xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300 dark:text-blue-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Your bookshelf is empty</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-sm mx-auto">Start your literary journey by adding your first book</p>
          <button onClick={() => {/* Implement add book logic */}} className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-all transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Your First Book
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-white">My Library</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">Manage your published works and create new literary masterpieces</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <div key={book.isbn} className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/60 transition-all duration-300 border border-blue-100/80 dark:border-gray-700 transform hover:-translate-y-1">
            {book.image && (
              <div className="h-52 overflow-hidden">
                <img
                  src={`/api/book/BookImage${book.id}`}
                  alt={book.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-5">
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{book.name}</h3>
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
                  onClick={() => handleUpdate(book)}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.isbn)}
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

      {/* Add Book Button */}
      <div className="fixed bottom-8 right-8 z-10">
        <button 
          onClick={() => {/* Implement add book logic */}}
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

export default AuthorBooksView;