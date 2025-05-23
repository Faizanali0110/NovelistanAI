import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import ViewBooks from "./ViewBooks";
import axios from "axios";
import Cookies from 'js-cookie';
import { Book, Star, Clock, Heart, BookOpen, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDeshboard = () => {
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = Cookies.get('customerId'); // Corrected cookie name as a string

  useEffect(() => {
    // Check if userId is available, if not, handle the case (e.g., redirect or show a message)
    if (!userId) {
      console.error("User ID is not available.");
      return; // Prevent further execution
    }

    // Import API_BASE_URL for consistency
    const API_BASE_URL = "http://localhost:8082";
    
    // Fetch User image from API
    axios
      .get(`${API_BASE_URL}/api/user/customerImage/${userId}`, { responseType: "arraybuffer" }) // Try the /api/user endpoint
      .then((response) => {
        const imageBlob = new Blob([response.data], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(imageBlob);
        setUserImage(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching user image", error);
        // Set a default image or handle error state
        setUserImage('/default-profile.png');
      })
      .finally(() => setLoading(false));

    // Fetch username from API
    axios
      .get(`${API_BASE_URL}/api/user/UserName/${userId}`)
      .then((response) => {
        setUserName(response.data);
      })
      .catch((error) => {
        console.error("Error fetching username", error);
        // Set a default username or handle error state
        setUserName('User');
      });
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <UserHeader userImage={userImage} userName={userName} loading={loading} />
      <div className="container mx-auto px-3 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 mb-4">
          <div className="flex items-center gap-3">
            {userImage ? (
              <img src={userImage} alt="Profile" className="w-12 h-12 rounded-full border border-yellow-400 shadow-sm object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full border border-yellow-400 bg-yellow-100 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                <span className="text-xl text-yellow-500 dark:text-yellow-300">{userName ? userName.charAt(0).toUpperCase() : 'U'}</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-base font-bold text-yellow-800 dark:text-yellow-300">Hello{userName ? `, ${userName}` : ''}!</h2>
                <div className="flex gap-1">
                  <Link to="/books/recommended" className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-0.5 rounded text-xs flex items-center gap-0.5 transition-colors">
                    <BookOpen className="w-3 h-3" />
                    <span>Recommended</span>
                  </Link>
                  <Link to="/books/search" className="bg-transparent border border-yellow-500 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-gray-700 px-2 py-0.5 rounded text-xs flex items-center gap-0.5 transition-colors">
                    <Search className="w-3 h-3" />
                    <span>Search</span>
                  </Link>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Discover new stories and share your thoughts</p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm border border-yellow-100 dark:border-gray-700 hover:shadow transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Book className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] leading-tight">Books</p>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-tight">24</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm border border-yellow-100 dark:border-gray-700 hover:shadow transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Star className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] leading-tight">Reviews</p>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-tight">12</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm border border-yellow-100 dark:border-gray-700 hover:shadow transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Heart className="w-3 h-3 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] leading-tight">Favorites</p>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-tight">8</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm border border-yellow-100 dark:border-gray-700 hover:shadow transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] leading-tight">Reading</p>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-tight">5</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-yellow-800 dark:text-yellow-300">Explore Books</h2>
          <Link to="/books/all" className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 flex items-center gap-0.5 text-xs font-medium">
            View all
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      <div className="px-0">
        <ViewBooks />
      </div>
      <Footer />
    </div>
  </div>
  );
};

export default UserDeshboard;