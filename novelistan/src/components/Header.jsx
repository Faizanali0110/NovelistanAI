import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Menu, X, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-700 dark:to-primary-800 text-white shadow-lg transition-colors duration-300">
      {/* Main Header */}
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Book className="w-6 h-6 drop-shadow-md" />
          <h1 className="text-xl font-bold tracking-wide hidden md:block drop-shadow-md">
            Novelistan
          </h1>
          <h1 className="text-xl font-bold tracking-wide md:hidden drop-shadow-md">LMS</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="hover:text-white/80 transition-colors relative group py-6"
            >
              Dashboard
              <span className="absolute bottom-4 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link 
              to="/view-books" 
              className="hover:text-white/80 transition-colors relative group py-6"
            >
              View Books
              <span className="absolute bottom-4 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
          </div>

          {/* User Profile */}
          <button className="p-2 rounded-full hover:bg-white/20 transition-colors active:scale-95">
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20 animate-fade-in">
          <div className="container mx-auto p-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/view-books" 
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                View Books
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;