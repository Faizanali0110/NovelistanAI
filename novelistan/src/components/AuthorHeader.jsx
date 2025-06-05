import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Plus, User, LogOut } from 'lucide-react';

const AuthorHeader = ({ activeLink = 'books' }) => {
  const navigate = useNavigate();

  const isActive = (link) => activeLink === link;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">NovelistanAI</h1>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link 
              to="/author/dashboard" 
              className={`flex items-center text-sm md:text-base ${
                isActive('dashboard') 
                  ? 'text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 dark:border-blue-400 pb-1' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              } transition-colors`}
            >
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
            <Link 
              to="/author/books" 
              className={`flex items-center text-sm md:text-base ${
                isActive('books')
                  ? 'text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 dark:border-blue-400 pb-1'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              } transition-colors`}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              My Books
            </Link>
            <Link 
              to="/author/add-book" 
              className={`flex items-center text-sm md:text-base ${
                isActive('add-book')
                  ? 'text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 dark:border-blue-400 pb-1'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              } transition-colors`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Book
            </Link>
            <Link 
              to="/author/profile" 
              className={`flex items-center text-sm md:text-base ${
                isActive('profile')
                  ? 'text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 dark:border-blue-400 pb-1'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              } transition-colors`}
            >
              <User className="h-4 w-4 mr-1" />
              Profile
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('authorId');
                navigate('/login');
              }}
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center text-sm md:text-base"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AuthorHeader;
