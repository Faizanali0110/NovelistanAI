// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NovelLandingPage from "./pages/NovelLandingPage";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthorHandling from './Author/AuthorHandling';
import NotFoundPage from './NotFoundPage';
import CustomerHandling from './Customer/CustomerHandling';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {


  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<NovelLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/AuthorHandling/*" element={<AuthorHandling />} />
          <Route path="/CustomerHandling/*" element={<CustomerHandling />} />
          <Route path="*" element={<NotFoundPage/>} /> {/* Fallback */}
        </Routes>
      </Router>
    </ThemeProvider>);
};

export default App;
