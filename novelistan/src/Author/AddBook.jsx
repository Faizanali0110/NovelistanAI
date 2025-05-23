import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useTheme } from '../contexts/ThemeContext';

const AddBook = () => {
  const { isDark } = useTheme();
  const [book, setBook] = useState({
    name: '',
    isbn: '',
    genre: ''
  });
  const [bookFile, setBookFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: name === 'isbn' ? parseInt(value) : value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'book') {
      setBookFile(file);
    } else {
      setCoverImage(file);
    }
  };

  const validateForm = () => {
    if (!book.name || !book.isbn || !book.genre) {
      setError('Please fill in all fields');
      return false;
    }
    if (!bookFile) {
      setError('Please upload a book file');
      return false;
    }
    if (!coverImage) {
      setError('Please upload a cover image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('book', JSON.stringify({
        name: book.name,
        isbn: String(book.isbn), // Convert to string to avoid ObjectId casting issues
        genre: book.genre
      }));
      formData.append('bookFile', bookFile, bookFile.name); // Include filename
      formData.append('coverImage', coverImage, coverImage.name); // Include filename

      console.log('Submitting book...', {
        book: book,
        bookFile: bookFile.name,
        coverImage: coverImage.name
      });

      const token = Cookies.get('token') || localStorage.getItem('token');
      console.log('Token:', token); // Log token for debugging

      const response = await fetch('http://localhost:8082/api/book/addBook', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      console.log('Full response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = { message: 'No JSON response', error: err.message };
      }
      console.log('Response data:', data);

      if (response.ok) {
        setSuccess('Book added successfully!');
        setError('');
        setBook({
          name: '',
          isbn: '',
          genre: ''
        });
        setBookFile(null);
        setCoverImage(null);
        document.getElementById('bookFile').value = '';
        document.getElementById('coverImage').value = '';
      } else {
        setError(data.message || `Failed to add book. Status: ${response.status}`);
        setSuccess('');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.message || 'Error adding book. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-50 dark:bg-secondary-950 py-8 px-2 transition-colors duration-300">
      <section className="w-full max-w-lg mx-auto bg-white dark:bg-secondary-900 rounded-2xl shadow-2xl p-8 border border-primary-100 dark:border-secondary-800 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary-100 dark:bg-primary-700 rounded-full p-4 mb-2 transition-colors duration-300">
            <svg className="w-10 h-10 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5A5.5 5.5 0 0112 9v11" /></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-secondary-800 dark:text-primary-300 mb-1 transition-colors duration-300">Add a New Book</h1>
          <p className="text-secondary-500 dark:text-secondary-400 text-center text-sm md:text-base transition-colors duration-300">Fill out the details below to add your book to the library. All fields are required.</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 animate-fade-in">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 animate-fade-in">
            <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4">
            <label htmlFor="name" className="font-medium text-secondary-700 dark:text-primary-300">Book Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={book.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-primary-100 focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-500 focus:outline-none transition-colors duration-300"
              placeholder="e.g. The Art of HCI"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="isbn" className="font-medium text-secondary-700 dark:text-primary-300">ISBN</label>
            <input
              id="isbn"
              name="isbn"
              type="number"
              value={book.isbn}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-primary-100 focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-500 focus:outline-none transition-colors duration-300"
              placeholder="e.g. 9781234567890"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="genre" className="font-medium text-secondary-700 dark:text-primary-300">Genre</label>
            <input
              id="genre"
              name="genre"
              type="text"
              value={book.genre}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-primary-100 focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-500 focus:outline-none transition-colors duration-300"
              placeholder="e.g. Science Fiction"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="bookFile" className="font-medium text-secondary-700 dark:text-primary-300 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Book File (PDF)
            </label>
            <input
              id="bookFile"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 'book')}
              className="w-full px-4 py-2 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-primary-100 file:bg-primary-100 dark:file:bg-primary-700 file:text-primary-800 dark:file:text-primary-300 file:rounded-full file:px-3 file:py-1 file:border-0 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-colors duration-300"
              required
            />
            <span className="text-xs text-secondary-500 dark:text-secondary-400">PDF only. Max size: 5MB.</span>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="coverImage" className="font-medium text-secondary-700 dark:text-primary-300 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Cover Image
            </label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'cover')}
              className="w-full px-4 py-2 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-primary-100 file:bg-primary-100 dark:file:bg-primary-700 file:text-primary-800 dark:file:text-primary-300 file:rounded-full file:px-3 file:py-1 file:border-0 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-colors duration-300"
              required
            />
            <span className="text-xs text-secondary-500 dark:text-secondary-400">JPG, PNG or GIF. Max size: 2MB.</span>
            {coverImage && (
              <div className="mt-2 flex justify-center">
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="Cover Preview"
                  className="h-32 w-auto rounded-md shadow border border-secondary-200 dark:border-secondary-700 object-contain"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-6 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AddBook;