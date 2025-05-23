import React, { useState } from 'react';
import { UserPlus, BookOpen, ShoppingCart, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

const SuccessCard = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
      <div className="text-center relative z-10">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-200" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-yellow-100 mb-2">{message}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">You will be redirected to login page shortly.</p>
        <button
          onClick={onClose}
          className="bg-yellow-500 dark:bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, email: false, password: false });

  // Real-time validation
  const emailValid = emailRegex.test(formData.email);
  const passwordValid = formData.password.length >= 6;
  const passwordStrength = formData.password.length > 10 ? 'Strong' : formData.password.length > 6 ? 'Medium' : 'Weak';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validate role
    if (!formData.role) {
      setError('Please select a role.');
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields.');
      return;
    }
    if (!file) {
      setError('Please select a profile image.');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      if (formData.role === 'author') {
        data.append('bio', formData.bio);
      }
      data.append('profilePicture', file);

      const response = await axios.post(`${API_BASE_URL}/api/user/register`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data) {
        setShowSuccess(true);
        setTimeout(() => {
          handleSuccessClose();
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full opacity-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-yellow-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-yellow-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
      
      <div className="w-full max-w-6xl flex items-center relative z-10">
        {/* Left side with signup illustration */}
        <div className="hidden lg:block w-1/2 p-8">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <img 
              src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-page-4489365-3723271.png" 
              alt="Signup Illustration" 
              className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right side with form */}
        <div className="flex-1 lg:pl-12">
          <div className="bg-white dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 relative max-w-md mx-auto transform hover:scale-[1.03] transition-transform duration-300 border-2 border-yellow-100 dark:border-gray-800 hover:border-yellow-400 dark:hover:border-yellow-500 hover:shadow-3xl group overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0 animate-gradient-move bg-gradient-to-br from-yellow-100/60 via-yellow-300/30 to-yellow-500/10 opacity-80 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col items-center mb-6">
                <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Signup Books" className="w-28 h-28 object-cover rounded-full shadow-lg mb-4 border-4 border-yellow-200 dark:border-yellow-700" />
                <UserPlus className="h-12 w-12 text-yellow-500 transform hover:scale-110 transition-transform" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-yellow-200 mb-2">Create Account</h2>
                <p className="text-gray-600 dark:text-gray-300">Join our community today</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-xl text-sm text-center animate-shake">
                  {error}
                </div>
              )}

              <div className="mb-8 flex justify-center space-x-4">
  <button
    type="button"
    onClick={() => setFormData({ ...formData, role: 'customer' })}
    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
      ${formData.role === 'customer' ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 border-gray-200 dark:border-gray-700 hover:bg-gray-100'}`}
  >
    <ShoppingCart className="h-8 w-8 mb-2" />
    <span>Customer</span>
  </button>
  <button
    type="button"
    onClick={() => setFormData({ ...formData, role: 'author' })}
    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
      ${formData.role === 'author' ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 border-gray-200 dark:border-gray-700 hover:bg-gray-100'}`}
  >
    <BookOpen className="h-8 w-8 mb-2" />
    <span>Author</span>
  </button>
</div>

              <form onSubmit={handleSignup} className="space-y-6">
                {/* Common Fields */}
                <div className="space-y-4">
                  <div className="relative group">
  <label htmlFor="name" className="block text-gray-700 dark:text-yellow-200 font-medium mb-2">Name</label>
  <input
    type="text"
    id="name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 group-hover:bg-gray-100"
    required
  />
</div>

                  {/* Author bio field, only show if role is author */}
                  {formData.role === 'author' && (
                    <div className="relative group">
                      <label htmlFor="bio" className="block text-gray-700 dark:text-yellow-200 font-medium mb-2">Bio (for authors)</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 group-hover:bg-gray-100"
                        rows={3}
                        placeholder="Tell us about yourself as an author"
                        required={formData.role === 'author'}
                      />
                    </div>
                  )}

                  <div className="relative group">
                    <label htmlFor="email" className="block text-gray-700 dark:text-yellow-200 font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      aria-label="Email"
                      aria-invalid={!emailValid && touched.email}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-800 dark:text-yellow-100 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-600 transition-all duration-300 group-hover:bg-gray-100 dark:group-hover:bg-gray-900 ${!emailValid && touched.email ? 'ring-2 ring-red-400 dark:ring-red-600' : ''}`}
                      required 
                    />
                    {touched.email && !emailValid && (
                      <span className="absolute left-0 mt-1 text-xs text-red-500 animate-fade-in">Please enter a valid email address.</span>
                    )}
                    {touched.email && emailValid && (
                      <span className="absolute left-0 mt-1 text-xs text-green-600 animate-fade-in">Looks good!</span>
                    )}
                  </div>

                  <div className="relative group">
                    <label htmlFor="password" className="block text-gray-700 dark:text-yellow-200 font-medium mb-2">Password</label>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      aria-label="Password"
                      aria-invalid={!passwordValid && touched.password}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => setTouched({ ...touched, password: true })}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-800 dark:text-yellow-100 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-600 transition-all duration-300 group-hover:bg-gray-100 dark:group-hover:bg-gray-900 ${!passwordValid && touched.password ? 'ring-2 ring-red-400 dark:ring-red-600' : ''}`}
                      required 
                    />
                    <button
                      type="button"
                      tabIndex={0}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.956 9.956 0 012.929-7.071m2.121 2.121A7.963 7.963 0 0112 5c4.418 0 8 3.582 8 8a7.963 7.963 0 01-2.929 6.071M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.956 9.956 0 0121 12c0 5.523-4.477 10-10 10a9.956 9.956 0 01-7.071-2.929m2.121-2.121A7.963 7.963 0 0012 19c4.418 0 8-3.582 8-8a7.963 7.963 0 00-2.929-6.071" /></svg>
                      )}
                    </button>
                    {touched.password && (
  <>
    <span className={`absolute left-0 mt-1 text-xs ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-500'} animate-fade-in`}>{passwordStrength} password</span>
    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded mt-2">
      <div
        className={`h-1 rounded transition-all duration-300 ${passwordStrength === 'Strong' ? 'bg-green-500 w-full' : passwordStrength === 'Medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`}
      />
    </div>
  </>
)}
                  </div>
                  {touched.password && !passwordValid && (
                    <div className="text-xs text-red-500 dark:text-red-400 mt-2 animate-fade-in">Password must be at least 6 characters.</div>
                  )}
                </div>

                {/* Customer-specific fields */}
                {selectedRole === 'customer' && (
                  <div className="space-y-4 animate-fade-in">
  <div className="relative group">
    <label htmlFor="secretCode" className="text-gray-700 dark:text-yellow-200 font-medium mb-2 flex items-center">
      Secret Code
      <span className="ml-1 text-xs text-gray-400 dark:text-gray-500 cursor-pointer" tabIndex={0} aria-label="What is this?" title="A code provided to you for secure customer registration.">
        <svg className="h-4 w-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4m0-4h.01" />
        </svg>
      </span>
    </label>
    <input 
      type="text" 
      id="secretCode"
      name="secretCode"
      value={formData.secretCode}
      onChange={handleChange}
      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 group-hover:bg-gray-100"
      required 
      aria-describedby="secretCodeHelp"
    />
    <small id="secretCodeHelp" className="text-xs text-gray-500 dark:text-gray-400 block mt-1">Ask support if you don't have your code.</small>
  </div>
  <div className="relative group">
    <label htmlFor="image" className="text-gray-700 dark:text-yellow-200 font-medium mb-2 flex items-center">
      Profile Image
      <span className="ml-1 text-xs text-gray-400 dark:text-gray-500 cursor-pointer" tabIndex={0} aria-label="Why upload?" title="This image helps personalize your account and is visible to you only.">
        <svg className="h-4 w-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4m0-4h.01" />
        </svg>
      </span>
    </label>
    <input 
      type="file" 
      id="image"
      onChange={handleFileChange}
      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 group-hover:bg-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
      accept="image/*"
      required 
      aria-describedby="profileImageHelp"
    />
    <small id="profileImageHelp" className="text-xs text-gray-500 dark:text-gray-400 block mt-1">PNG, JPG, or GIF. Max 2MB.</small>
    {/* Image preview */}
    {file && (
      <div className="mt-2 flex items-center space-x-2">
        <img src={URL.createObjectURL(file)} alt="Preview" className="w-12 h-12 object-cover rounded-full border-2 border-yellow-300 shadow" />
        <span className="text-xs text-gray-600 dark:text-gray-300">Preview</span>
      </div>
    )}
  </div>
</div>
                )}

                {/* Author-specific fields */}
                {selectedRole === 'author' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="relative group">
                      <label htmlFor="name" className="block text-gray-700 dark:text-yellow-200 font-medium mb-2">Full Name</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 group-hover:bg-gray-100"
                        required 
                      />
                    </div>
                    <div className="relative group">
                      <label htmlFor="dateOfBirth" className="block text-gray-700 dark:text-yellow-200 font-medium mb-2">Date of Birth</label>
                      <input 
                        type="date" 
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 group-hover:bg-gray-100"
                        required 
                      />
                    </div>
                    <div className="relative group">
                      <label htmlFor="securityCode" className="block text-gray-700 dark:text-yellow-200 font-medium mb-2">Security Code</label>
                      <input 
                        type="text" 
                        id="securityCode"
                        name="securityCode"
                        value={formData.securityCode}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 group-hover:bg-gray-100"
                        required 
                      />
                    </div>
                  </div>
                )}

                <div className="relative group">
  <label htmlFor="profilePicture" className="block text-gray-700 dark:text-yellow-200 font-medium mb-2">Profile Image</label>
  <input
    type="file"
    id="profilePicture"
    name="profilePicture"
    onChange={handleFileChange}
    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 group-hover:bg-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
    accept="image/*"
    required
  />
  {file && (
    <div className="mt-2 flex items-center space-x-2">
      <img src={URL.createObjectURL(file)} alt="Preview" className="w-12 h-12 object-cover rounded-full border-2 border-yellow-300 shadow" />
      <span className="text-xs text-gray-600 dark:text-gray-300">Preview</span>
    </div>
  )}
</div>

<button
  type="submit"
  className="w-full py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
  disabled={
    !formData.role ||
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !file ||
    (formData.role === 'author' && !formData.bio)
  }
>
  Create Account
</button>

                <div className="text-center mt-6">
                  <Link to="/login" className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors">
                    Already have an account? Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessCard
          message={`Successfully registered as ${selectedRole}!`}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default SignupPage;