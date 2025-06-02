import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const AboutPage = () => {
  const { isDark } = useTheme();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Header/Navigation would be here */}
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-800 dark:text-white">About NovelistanAI</h1>
          <p className="text-xl text-primary-600 dark:text-primary-200 max-w-3xl mx-auto">
            Empowering authors and readers through innovative literary technology
          </p>
        </div>
        
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-200">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              At NovelistanAI, we believe that stories have the power to transform lives, connect communities, and inspire change. 
              Our mission is to build a platform that empowers authors to create and share their unique voices with the world, 
              while helping readers discover their next literary adventure.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              We're committed to using technology to break down barriers in publishing, making it more accessible, 
              diverse, and innovative for everyone.
            </p>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center text-primary-700 dark:text-primary-200">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Authors */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary-100 dark:bg-primary-800 p-4 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-primary-700 dark:text-primary-200">For Authors</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Easy book publishing and management
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Reader insights and analytics
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Author community and resources
                </li>
              </ul>
            </div>
            
            {/* For Readers */}
            <div className="bg-secondary-50 dark:bg-secondary-800/40 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-secondary-100 dark:bg-secondary-700 p-4 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-600 dark:text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-secondary-700 dark:text-secondary-200">For Readers</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Discover new books and authors
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Personalized recommendations
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Digital reading experience
                </li>
              </ul>
            </div>
            
            {/* Technology */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary-100 dark:bg-primary-800 p-4 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-primary-700 dark:text-primary-200">Our Technology</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Modern web application
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Secure cloud storage
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Responsive design for all devices
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center text-primary-700 dark:text-primary-200">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-24"></div>
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="rounded-full bg-gray-200 w-24 h-24 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800">
                    <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-12 text-center">
                  <h3 className="text-xl font-bold text-primary-700 dark:text-white">Muhammad Ali</h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">Founder & CEO</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Passionate about literature and technology, leading our mission to transform publishing.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 h-24"></div>
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="rounded-full bg-gray-200 w-24 h-24 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800">
                    <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-12 text-center">
                  <h3 className="text-xl font-bold text-primary-700 dark:text-white">Sarah Johnson</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-2">Head of Content</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Former editor with 10+ years experience in publishing, curating our literary ecosystem.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-primary-400 to-secondary-500 h-24"></div>
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="rounded-full bg-gray-200 w-24 h-24 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800">
                    <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-12 text-center">
                  <h3 className="text-xl font-bold text-primary-700 dark:text-white">David Chen</h3>
                  <p className="text-primary-500 dark:text-primary-400 mb-2">Tech Lead</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Experienced developer building innovative solutions for authors and readers alike.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-200">Ready to join our community?</h2>
          <div className="space-x-4">
            <Link to="/signup" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get Started
            </Link>
            <Link to="/contact" className="inline-block bg-secondary-200 dark:bg-secondary-700 hover:bg-secondary-300 dark:hover:bg-secondary-600 text-secondary-800 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
