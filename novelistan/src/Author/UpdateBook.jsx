import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { Edit2, BookOpen, Search, X, Loader, FileText, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import API_BASE_URL from '../config';

const UpdateBook = () => {
  const { isDark } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookImages, setBookImages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    isbn: '',
    genre: '',
  });
  const [newImage, setNewImage] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAuthorBooks();
    return () => {
      Object.values(bookImages).forEach((url, index) => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  useEffect(() => {
    // Load images for all books
    books.forEach((book, index) => {
      if (book._id && !bookImages[book._id]) {
        fetchBookImage(book._id);
      }
    });
  }, [books, bookImages]);

  const fetchAuthorBooks = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const authorId = Cookies.get('authorId');

      if (!token || !authorId) {
        throw new Error('Authentication token or author ID is missing. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/api/book/authorBook/${authorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized access. Please log in again.');
        }
        throw new Error(`Failed to fetch books. Status: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookImage = async (bookId) => {
    try {
      if (!bookId) return;
      const token = Cookies.get('token');
      const response = await fetch(`${API_BASE_URL}/api/book/cover/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setBookImages((prev) => ({
        ...prev,
        [bookId]: imageUrl,
      }));
    } catch (err) {
      console.error(`Error fetching image for book ${bookId}:`, err);
      setBookImages((prev) => ({
        ...prev,
        [bookId]: null,
      }));
    }
  };

  const viewPdf = async (bookId) => {
    try {
      if (!bookId) {
        setError('Book ID is missing');
        return;
      }
      const token = Cookies.get('token');
      const response = await fetch(`${API_BASE_URL}/api/book/pdf/${bookId}`, {
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
    } catch (err) {
      console.error(`Error fetching PDF for book ${bookId}:`, err);
      setError('Failed to load PDF. Please try again.');
    }
  };

  const handleUpdateClick = (book) => {
    setSelectedBook(book);
    setUpdateFormData({
      name: book.name,
      isbn: book.isbn,
      genre: book.genre,
    });
    setShowUpdateModal(true);
    setError(null);
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFiles = () => {
    if (newImage && !newImage.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return false;
    }

    if (newFile && newFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return false;
    }

    const maxSize = 5 * 1024 * 1024;
    if (newImage && newImage.size > maxSize) {
      setError('Image file size should be less than 5MB');
      return false;
    }

    if (newFile && newFile.size > maxSize) {
      setError('PDF file size should be less than 5MB');
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      const imageUrl = URL.createObjectURL(file);
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(imageUrl);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!selectedBook || isSubmitting) return;

    if (!validateFiles()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess('');

    try {
      const formData = new FormData();
      const bookData = {
        ...updateFormData,
        author: selectedBook.author,
      };
      
      formData.append('book', JSON.stringify(bookData));
      
      if (newImage) {
        formData.append('coverImage', newImage);
      }
      
      if (newFile) {
        formData.append('bookFile', newFile);
      }

      const token = Cookies.get('token');
      const response = await fetch(`${API_BASE_URL}/api/book/${selectedBook._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const responseData = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
      } catch (e) {
        parsedData = responseData;
      }

      if (!response.ok) {
        throw new Error(typeof parsedData === 'string' ? parsedData : 'Failed to update book');
      }

      setBooks(books.map((book) => 
        book._id === selectedBook._id ? parsedData : book
      ));
      
      if (bookImages[selectedBook._id]?.startsWith('blob:')) {
        URL.revokeObjectURL(bookImages[selectedBook._id]);
      }
      
      await fetchBookImage(selectedBook._id);
      
      setSuccess('Book updated successfully!');
      
      setTimeout(() => {
        setShowUpdateModal(false);
        setSelectedBook(null);
        setNewImage(null);
        setNewFile(null);
        setPreviewImage(null);
        setSuccess('');
      }, 1500);

    } catch (err) {
      console.error('Error updating book:', err);
      setError(err.message || 'Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPdf = async (bookId) => {
    try {
      if (!bookId) {
        setError('Book ID is missing');
        return;
      }
      const token = Cookies.get('token');
      const response = await fetch(`${API_BASE_URL}/api/book/pdf/${bookId}`, {
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

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (err) {
      console.error('Error fetching PDF:', err);
      setError('Failed to open PDF');
    }
  };

  if (loading) {
    return (
      <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="text-lg animate-pulse">Loading books...</div>
      </div>
    );
  }

  // Ensure we have books and all books have valid _id fields
  const validBooks = books.filter(book => book && book._id);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
            Your Literary Collection
          </span>
        </h1>
        
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by title, genre, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-300"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded-lg flex items-center" role="alert">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {validBooks
          .filter(book =>
            book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.isbn.toString().includes(searchQuery)
          )
          .map((book) => (
            <div
              key={book._id}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transform hover:-translate-y-1"
            >
              <div className="h-56 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                {bookImages[book._id] ? (
                  <img
                    src={bookImages[book._id]}
                    alt={book.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 shadow-inner"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-cover.jpg';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-blue-500/80 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {book.genre}
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{book.name}</h2>
                <div className="flex items-center mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md px-2 py-1">ISBN {book.isbn}</span>
                  <span className="ml-auto text-sm text-gray-600 dark:text-gray-400 italic">Click to edit</span>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => book._id && handleViewPdf(book._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2.5 px-3 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
                    aria-label="View PDF"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleUpdateClick(book)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white py-2.5 px-3 rounded-lg hover:bg-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md"
                    aria-label="Update book"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={(e) => {
          if (e.target === e.currentTarget) {
            if (!isSubmitting) {
              setShowUpdateModal(false);
              setSelectedBook(null);
              setNewImage(null);
              setNewFile(null);
              setPreviewImage(null);
              setError('');
              setSuccess('');
            }
          }
        }}>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl max-w-2xl w-full mx-auto shadow-2xl transform transition-all duration-300 animate-fadeIn border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <Edit2 className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                Update Your Book
              </h2>
              <button
                onClick={() => {
                  if (!isSubmitting) {
                    setShowUpdateModal(false);
                    setSelectedBook(null);
                    setNewImage(null);
                    setNewFile(null);
                    setPreviewImage(null);
                    setError('');
                    setSuccess('');
                  }
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="flex items-center p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 animate-fadeIn">
                  <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="flex items-center p-4 mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 animate-fadeIn">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmitUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6 md:col-span-1">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Book Title</label>
                      <input
                        type="text"
                        name="name"
                        value={updateFormData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 transition-colors duration-300 shadow-sm"
                        placeholder="Enter book title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">ISBN</label>
                      <input
                        type="number"
                        name="isbn"
                        value={updateFormData.isbn}
                        onChange={handleInputChange}
                        className="w-full p-3 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 transition-colors duration-300 shadow-sm"
                        placeholder="Enter ISBN number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Genre</label>
                      <input
                        type="text"
                        name="genre"
                        value={updateFormData.genre}
                        onChange={handleInputChange}
                        className="w-full p-3 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 transition-colors duration-300 shadow-sm"
                        placeholder="Enter book genre"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-6 md:col-span-1">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <span>Cover Image</span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(optional)</span>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="cover-upload"
                        />
                        <label
                          htmlFor="cover-upload"
                          className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                          <div className="flex flex-col items-center justify-center text-center">
                            <Upload className="w-8 h-8 mb-2 text-blue-500 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload cover image</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                          </div>
                        </label>
                      </div>
                      {previewImage && (
                        <div className="mt-4 relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg shadow-md transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <span>PDF File</span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(optional)</span>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <label
                          htmlFor="pdf-upload"
                          className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                          <div className="flex flex-col items-center justify-center text-center">
                            <FileText className="w-8 h-8 mb-2 text-blue-500 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload PDF</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF files up to 50MB</span>
                          </div>
                        </label>
                      </div>
                      {newFile && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{newFile.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewFile(null)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedBook(null);
                      setNewImage(null);
                      setNewFile(null);
                      setPreviewImage(null);
                      setError('');
                      setSuccess('');
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Update Book</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateBook;