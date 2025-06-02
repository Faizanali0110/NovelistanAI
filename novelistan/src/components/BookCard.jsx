import React from 'react';
import API_BASE_URL from '../config';
import { Download } from 'lucide-react';

const BookCard = ({ book, onDownload }) => {
  const { name, genre, author, coverImage, pdfFile } = book;

  return (
    <div className="group bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden transform hover:-translate-y-1">
      <div className="h-48 overflow-hidden">
        <img 
          src={`${API_BASE_URL}/uploads/covers/${coverImage}`} 
          alt={`${name} cover`} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-cover.jpg'; // Fallback image
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{name}</h3>
        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium text-gray-600 dark:text-gray-400">Genre:</span> {genre}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium text-gray-600 dark:text-gray-400">Author:</span> {author}
          </p>
        </div>
        <button 
          className="flex items-center justify-center w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors duration-300 text-sm font-medium" 
          onClick={() => onDownload(`${API_BASE_URL}/uploads/books/${pdfFile}`)}>
          <Download size={16} className="mr-2" />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default BookCard;
