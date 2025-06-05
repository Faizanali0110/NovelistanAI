import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Send, BookOpen, PenTool, Award, HelpCircle, FileText, Clock, Shield, MessageSquare, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const { isDark } = useTheme();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-300 border-t border-gray-200 dark:border-gray-700 mt-16">
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-700 dark:to-primary-800 text-white py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Ready to start your writing journey?
            </h2>
            <p className="text-lg md:text-xl text-primary-100 dark:text-primary-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of authors who are already sharing their stories with the world.
              Publish your work and connect with readers globally.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link 
                to="/author/register" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-transparent text-base font-semibold rounded-full text-primary-600 bg-white hover:bg-gray-50 hover:shadow-lg md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:scale-105"
              >
                Become an Author <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/author/login" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/80 text-base font-semibold rounded-full text-white hover:bg-white/10 hover:border-white/100 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Author Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 lg:gap-12">
          {/* About */}
          <div className="col-span-2">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                <BookOpen className="h-7 w-7 mr-2 text-primary-500" />
                NovelistanAI
              </h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-base leading-relaxed">
              Empowering writers to create, publish, and share their stories with the world. 
              Join our community of passionate authors and readers today.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* For Writers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">For Writers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/AuthorHandling/writing" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center group py-1.5">
                  <PenTool className="h-4 w-4 mr-2.5 text-primary-500 dark:text-primary-400 group-hover:translate-x-0.5 transition-transform" />
                  <span className="font-medium">Start Writing</span>
                </Link>
              </li>
              <li>
                <Link to="/publishing" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Publishing
                </Link>
              </li>
              <li>
                <Link to="/author/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Author Dashboard
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Writing Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="md:flex md:items-center md:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              &copy; {currentYear} NovelistanAI. All rights reserved.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 md:gap-6 md:mt-0">
              <Link to="/sitemap" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors hover:underline">
                Sitemap
              </Link>
              <Link to="/accessibility" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors hover:underline">
                Accessibility
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors hover:underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors hover:underline">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors hover:underline">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;