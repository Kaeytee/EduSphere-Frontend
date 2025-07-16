import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home page component - Landing page for EduSphere
 * Provides overview of features and call-to-action for new users
 */
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">EduSphere</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your learning experience with our innovative platform that brings together
            students, educators, and AI-powered assistance in one collaborative space.
          </p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/about"
              className="inline-block px-8 py-3 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose EduSphere?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the features that make learning engaging and effective
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborative Learning</h3>
            <p className="text-gray-600">
              Connect with classmates, join study groups, and learn together in interactive virtual rooms.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Assistant</h3>
            <p className="text-gray-600">
              Get instant help with homework, explanations, and personalized study recommendations.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your learning progress with detailed analytics and achievement badges.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students and educators who are already experiencing the future of education.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Start Your Journey Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
