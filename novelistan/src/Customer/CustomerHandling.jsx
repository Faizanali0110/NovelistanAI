import React from "react";
import { Routes, Route } from "react-router-dom";
import AddReview from './AddReview.jsx'; // Import AddReview component with explicit extension
import ViewBooks from './ViewBooks'; // Import ViewBooks component
import UserDeshboard from "./UserDeshboard"; // Import UserDashboard component
import Header from "../components/Header"; // Import Header component
import Footer from "../components/Footer"; // Import Footer component
import Cookies from 'js-cookie';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

function CustomerHandling() {
    // Define the checkCookies function
    const checkCookies = () => {
        console.log("Checking cookies...");
        console.log(Cookies.get('customerId'));
    };

    const { isDark } = useTheme();
    
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-primary-100 dark:from-secondary-900 dark:to-secondary-800 transition-colors duration-300">
            <ThemeToggle position="relative" className="self-end m-4" />
            
            <main className="flex-grow container mx-auto px-4 py-6">
                <Routes>
                    <Route path="/" element={<UserDeshboard />} /> {/* Default route */}
                    <Route path="/add-review/:bookId" element={<AddReview />} />
                    <Route path="/books" element={<ViewBooks />} />
                    <Route path="/books/:bookId" element={<ViewBooks />} />
                </Routes>
            </main>
            <button onClick={checkCookies} className="mx-auto mb-6 p-2 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 transition-colors duration-300 shadow-md hover:shadow-lg">
                Check Cookies
            </button>
            
        </div>
    );
}

export default CustomerHandling;
