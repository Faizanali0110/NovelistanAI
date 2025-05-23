import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=ffe066&color=7d5a00&rounded=true&size=96";
const DEFAULT_AVATAR_DARK = "https://ui-avatars.com/api/?name=User&background=5f4d00&color=ffe066&rounded=true&size=96";

const UserHeader = ({ userImage, userName, loading }) => {
  const { isDark } = useTheme();
  return (
    <header className="bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-700 dark:to-primary-900 text-white shadow-md py-1 px-3 flex items-center justify-between transition-colors duration-300">
      {/* Left Section: Logo/Title */}
      <div className="flex items-center">
        {loading ? (
          <div className="w-8 h-8 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-primary-800 dark:text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        ) : (
          <img
            src={userImage || (isDark ? DEFAULT_AVATAR_DARK : DEFAULT_AVATAR)}
            alt="User Profile"
            className="w-6 h-6 rounded-full border border-white dark:border-primary-300 shadow-sm transition-colors duration-300"
            onError={e => { e.target.onerror = null; e.target.src = isDark ? DEFAULT_AVATAR_DARK : DEFAULT_AVATAR; }}
          />
        )}
        <div className="ml-2 flex flex-col justify-center">
          <h1 className="text-sm font-bold leading-tight">Novelistan</h1>
          <p className="text-xs text-primary-200 dark:text-primary-300 transition-colors duration-300 leading-tight">Hi, {userName || 'User'}</p>
        </div>
      </div>

      {/* Right Section: Navigation or Extra Info */}
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 text-xs bg-primary-500 dark:bg-primary-600 text-white rounded hover:bg-primary-700 dark:hover:bg-primary-800 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default UserHeader;
