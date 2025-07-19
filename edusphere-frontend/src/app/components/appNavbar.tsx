import React, { useState, useEffect, useRef } from 'react';
import useAuth from "../../contexts/useAuth";
import { getUserDisplayName } from "../../utils/userUtils";
import { UserRole } from "../../contexts/authTypes";
import useNotifications from "../../contexts/useNotifications";
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationDropdown from '../../components/NotificationDropdown';

/**
 * Enhanced top navigation bar component for authenticated users
 * Provides smooth animations and modern UX for user menu and notifications
 */
const AppNavbar: React.FC = () => {
  const { user, logout, hasMinimumRole } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  /**
   * Navigation menu items with role-based visibility
   */
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/app/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      requiredRole: UserRole.STUDENT
    },
    {
      name: 'My Profile',
      path: '/app/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      requiredRole: UserRole.STUDENT
    },
    {
      name: 'Study Rooms',
      path: '/app/rooms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      requiredRole: UserRole.STUDENT
    },
    {
      name: 'AI Assistant',
      path: '/app/ai-assistant',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      requiredRole: UserRole.STUDENT
    }
  ];

  /**
   * Room admin navigation items
   */
  const roomAdminItems = [
    {
      name: 'Manage Rooms',
      path: '/app/manage/rooms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      requiredRole: UserRole.TEACHER
    },
    {
      name: 'Manage Students',
      path: '/app/manage/students',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      requiredRole: UserRole.TEACHER
    }
  ];

  /**
   * Admin navigation items
   */
  const adminItems = [
    {
      name: 'Admin Dashboard',
      path: '/app/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      requiredRole: UserRole.ADMIN
    },
    {
      name: 'User Management',
      path: '/app/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      requiredRole: UserRole.ADMIN
    },
    {
      name: 'System Settings',
      path: '/app/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      requiredRole: UserRole.ADMIN
    }
  ];

  /**
   * Check if the current route is active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Render navigation section with role-based filtering
   */
  const renderMobileNavigationSection = (
    title: string,
    items: Array<{
      name: string;
      path: string;
      icon: React.ReactElement;
      requiredRole: UserRole;
    }>
  ) => {
    // Filter items based on user role
    const filteredItems = items.filter(item => 
      hasMinimumRole(item.requiredRole)
    );

    if (filteredItems.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 transform hover:scale-105 ${
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg mr-4 transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-200 text-primary-700'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600'
              }`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Handle user logout with smooth transition
   */
  const handleLogout = (): void => {
    setIsUserMenuOpen(false);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 150);
  };

  /**
   * Toggle user menu with animation
   */
  const toggleUserMenu = (): void => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationOpen(false);
  };

  /**
   * Toggle notification menu with animation
   */
  const toggleNotifications = (): void => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserMenuOpen(false);
  };

  /**
   * Toggle mobile menu with smooth animation
   */
  const toggleMobileMenu = (): void => {
    if (isMobileMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsMobileMenuOpen(true);
      setIsClosing(false);
    }
  };

  /**
   * Handle navigation and close menus
   */
  const handleNavigation = (path: string): void => {
    setIsUserMenuOpen(false);
    setIsNotificationOpen(false);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button with enhanced animation */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-200"
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6">
                  <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}></span>
                  <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                  <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                  }`}></span>
                </div>
              </button>
            </div>

            {/* Center - Welcome message or breadcrumbs */}
            <div className="hidden lg:flex items-center flex-1">
              <div className="ml-6">
                <h1 className="text-lg font-semibold text-gray-900">
                  Welcome back, {getUserDisplayName(user)?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Spacer for mobile */}
            <div className="flex-1 lg:hidden"></div>

            {/* Right side - User menu and notifications */}
            <div className="flex items-center space-x-2">
              {/* Notifications with enhanced animation */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={toggleNotifications}
                  className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {/* Enhanced notification badge */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </button>
                
                {/* Enhanced Notification Dropdown */}
                <NotificationDropdown 
                  isOpen={isNotificationOpen} 
                  onClose={() => setIsNotificationOpen(false)} 
                />
              </div>

              {/* User menu with enhanced styling */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
                  onClick={toggleUserMenu}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {getUserDisplayName(user)?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-900">
                    {getUserDisplayName(user) || 'User'}
                  </span>
                  <svg 
                    className={`h-4 w-4 text-gray-400 transform transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced user dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 transform transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-100 rounded-t-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {getUserDisplayName(user)?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{getUserDisplayName(user)}</p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation('/app/profile')}
                        className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <div className="p-2 rounded-lg mr-3 bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all duration-200">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Profile Settings</span>
                          <p className="text-xs text-gray-500">Manage your account</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavigation('/app/dashboard')}
                        className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <div className="p-2 rounded-lg mr-3 bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all duration-200">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Dashboard</span>
                          <p className="text-xs text-gray-500">View your overview</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavigation('/app/settings')}
                        className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <div className="p-2 rounded-lg mr-3 bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all duration-200">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Settings</span>
                          <p className="text-xs text-gray-500">Preferences & privacy</p>
                        </div>
                      </button>
                    </div>

                    {/* Logout section */}
                    <div className="border-t border-gray-100 mt-2">
                      <button
                        onClick={handleLogout}
                        className="group flex items-center w-full px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <div className="p-2 rounded-lg mr-3 bg-red-100 text-red-600 group-hover:bg-red-200 transition-all duration-200">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Sign Out</span>
                          <p className="text-xs text-red-500">End your session</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile slide-out menu with complete sidebar navigation */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black z-30 lg:hidden transition-opacity duration-300 ease-out ${
              isClosing ? 'opacity-0' : 'opacity-50'
            }`}
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile menu panel */}
          <div 
            className={`fixed top-0 left-0 h-full w-80 max-w-sm bg-white shadow-2xl z-40 lg:hidden transform transition-all duration-300 ease-out ${
              isClosing ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">EduSphere</span>
                  <p className="text-xs text-gray-600">Navigation</p>
                </div>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile menu content */}
            <div className="flex flex-col h-full">
              {/* User info */}
              <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {getUserDisplayName(user)?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-900">{getUserDisplayName(user)}</div>
                    <div className="text-sm text-gray-600">{user?.email}</div>
                    <div className="text-xs text-gray-500 capitalize mt-1">
                      {user?.role?.toLowerCase() || 'student'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation sections */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {renderMobileNavigationSection('Main', menuItems)}
                {renderMobileNavigationSection('Teacher Tools', roomAdminItems)}
                {renderMobileNavigationSection('Administration', adminItems)}
              </div>

              {/* Mobile logout and settings */}
              <div className="border-t border-gray-200 p-4 space-y-2">
                <button
                  onClick={() => handleNavigation('/app/settings')}
                  className="group flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="p-2 rounded-lg mr-4 bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="p-2 rounded-lg mr-4 bg-red-100 text-red-600 group-hover:bg-red-200 transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom CSS for animations */}
      <style>{`
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
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .slide-in-from-top-2 {
          animation: slideInFromTop 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default AppNavbar;