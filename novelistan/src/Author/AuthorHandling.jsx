import React from "react";
import { Routes, Route } from "react-router-dom";
import AddBook from "./AddBook";
import UpdateBook from "./UpdateBook";
import DeleteBook from "./DeleteBook";
import Dashboard from "./Dashboard";
import ViewBooks from "./ViewAuthorBooks";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Cookies from 'js-cookie';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';


const AuthorHandling = () => {
    function checkCookies()
    {
        console.log(Cookies.get('authorId'))
    }
    
    const { isDark } = useTheme();
    
    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-primary-100 dark:from-secondary-900 dark:to-secondary-800 transition-colors duration-300">
      <div className="relative">
        <Header />
        <ThemeToggle position="relative" className="absolute top-4 right-4" />
      </div>
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} /> {/* Default route */}
          <Route path="add-book" element={<AddBook />} />
          <Route path="view-books" element={<ViewBooks />} />
          <Route path="update-book" element={<UpdateBook />} />
          <Route path="delete-book" element={<DeleteBook />} />
        </Routes>
       
      </main>
      <button onClick={checkCookies} className="mx-auto mb-4 p-2 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 transition-colors duration-300 shadow-md hover:shadow-lg">Check Cookies</button>
      <Footer />
    </div>
  );
};

export default AuthorHandling;
