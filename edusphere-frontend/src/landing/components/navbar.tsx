import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * EduSphere navigation component
 * Responsive navbar for public pages with enhanced fluid mobile menu
 * Shows different content based on authentication status
 */
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('.user-menu-container')) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  /**
   * Check if the current route is active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Open mobile menu with smooth animation
   */
  const openMenu = (): void => {
    setIsMenuOpen(true);
    setIsClosing(false);
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  };

  /**
   * Close mobile menu with smooth animation
   */
  const closeMenu = (): void => {
    if (isMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
        // Restore body scroll
        document.body.style.overflow = 'unset';
      }, 350); // Slightly longer for smoother animation
    }
  };

  /**
   * Toggle mobile menu
   */
  const toggleMenu = (): void => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  /**
   * Toggle user menu visibility
   */
  const toggleUserMenu = (): void => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  /**
   * Handle user logout
   */
  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  /**
   * Handle navigation to dashboard
   */
  const handleGoToDashboard = (): void => {
    navigate('/app/dashboard');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">EduSphere</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium text-sm transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`font-medium text-sm transition-colors duration-200 ${
                isActive('/about') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`font-medium text-sm transition-colors duration-200 ${
                isActive('/contact') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Contact
            </Link>

            {/* Auth Buttons / User Menu */}
            {user ? (
              /* Authenticated User Menu */
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGoToDashboard}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-colors duration-200"
                >
                  Dashboard
                </button>
                <div className="relative user-menu-container">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2">
                      <div className="py-1">
                        <Link
                          to="/app/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/app/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Guest User Auth Buttons */
              <>
                <Link
                  to="/signup"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-primary-100 hover:bg-primary-200 px-4 py-2 rounded-md text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200"
                >
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button and Auth Buttons */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Auth Buttons (visible when not authenticated) */}
            {!user && (
              <>
                <Link
                  to="/signup"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200"
                >
                  Log In
                </Link>
              </>
            )}
            
            {/* Mobile Dashboard Button (visible when authenticated) */}
            {user && (
              <button
                onClick={handleGoToDashboard}
                className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200"
              >
                Dashboard
              </button>
            )}
            
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                {/* Animated hamburger icon */}
                <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Enhanced Backdrop with smooth fade */}
          <div 
            className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ease-out ${
              isClosing ? 'opacity-0' : 'opacity-30'
            }`}
            onClick={closeMenu}
          />
          
          {/* Enhanced Slide-out Menu Panel */}
          <div 
            className={`fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-2xl z-50 md:hidden transform transition-all duration-300 ease-out ${
              isClosing ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            {/* Menu Header with enhanced styling */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">EduSphere</span>
                  <p className="text-xs text-gray-600">Learning Platform</p>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content with enhanced animations */}
            <div className="flex flex-col h-full">
              {/* Navigation Links with staggered entrance animation */}
              <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
                    Navigation
                  </p>
                  
                  {/* Enhanced navigation links */}
                  {[
                    { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                    { path: '/about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { path: '/contact', label: 'Contact', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
                  ].map((item, index) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                        isActive(item.path) 
                          ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 shadow-sm' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={closeMenu}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: isClosing ? 'none' : 'slideInFromRight 0.4s ease-out forwards'
                      }}
                    >
                      <div className={`p-2 rounded-lg mr-4 transition-all duration-200 ${
                        isActive(item.path) ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {isActive(item.path) && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                    </Link>
                  ))}
                </div>

                {/* User Section with enhanced styling */}
                {user && (
                  <div className="pt-6 space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
                      Account
                    </p>
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 mx-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-bold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/app/profile"
                      className="group flex items-center px-4 py-4 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                      onClick={closeMenu}
                    >
                      <div className="p-2 rounded-lg mr-4 bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Profile Settings
                    </Link>
                  </div>
                )}
              </div>

              {/* Enhanced Bottom Actions */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="group flex items-center justify-center w-full px-4 py-4 rounded-xl text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                  >
                    <div className="p-2 rounded-lg mr-3 bg-red-100 text-red-600 group-hover:bg-red-200 transition-all duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/signup"
                      className="flex items-center justify-center w-full px-4 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                      onClick={closeMenu}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center w-full px-4 py-4 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      onClick={closeMenu}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .slide-in-from-top-2 {
          animation: slideInFromTop 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;