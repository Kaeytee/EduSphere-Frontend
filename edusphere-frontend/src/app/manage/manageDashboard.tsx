import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from "../../contexts/useAuth";

/**
 * Manage dashboard component for room administrators
 * Provides overview and quick access to management features
 * Time Complexity: O(1) for most operations
 */
const ManageDashboard: React.FC = () => {
  const { user } = useAuth();

  /**
   * Management cards configuration
   */
  const managementCards = [
    {
      title: 'Manage Rooms',
      description: 'Create, edit, and organize your study rooms',
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: '/app/manage/rooms',
      color: 'bg-primary-50 hover:bg-primary-100',
      stats: '5 Active Rooms'
    },
    {
      title: 'Manage Students',
      description: 'Monitor student progress and enrollment',
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      path: '/app/manage/students',
      color: 'bg-primary-50 hover:bg-primary-100',
      stats: '42 Students'
    },
    {
      title: 'Room Analytics',
      description: 'View detailed analytics and reports',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/app/manage/analytics',
      color: 'bg-purple-50 hover:bg-purple-100',
      stats: 'Coming Soon'
    },
    {
      title: 'Assignments',
      description: 'Create and manage assignments',
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/app/manage/assignments',
      color: 'bg-orange-50 hover:bg-orange-100',
      stats: '8 Active'
    }
  ];

  /**
   * Quick stats data
   */
  const quickStats = [
    { label: 'Total Rooms', value: '5', change: '+2 this week' },
    { label: 'Active Students', value: '42', change: '+8 this month' },
    { label: 'Assignments', value: '8', change: '3 pending review' },
    { label: 'Avg. Engagement', value: '85%', change: '+5% this month' }
  ];

  /**
   * Recent activities
   */
  const recentActivities = [
    {
      id: '1',
      type: 'room_created',
      message: 'New room "Advanced Physics" created',
      timestamp: '2 hours ago',
      icon: '🏠'
    },
    {
      id: '2',
      type: 'student_joined',
      message: 'Sarah Chen joined "Mathematics 101"',
      timestamp: '4 hours ago',
      icon: '👤'
    },
    {
      id: '3',
      type: 'assignment_submitted',
      message: '15 students submitted "Calculus Assignment"',
      timestamp: '6 hours ago',
      icon: '📝'
    },
    {
      id: '4',
      type: 'room_updated',
      message: 'Updated "Chemistry Lab" settings',
      timestamp: '1 day ago',
      icon: '⚙️'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Management Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}. Here's your teaching overview.</p>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/app/manage/rooms"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Quick Create Room
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {managementCards.map((card, index) => (
          <Link
            key={index}
            to={card.path}
            className={`${card.color} p-6 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  {card.icon}
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">{card.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">{card.description}</p>
                <div className="text-sm font-medium text-gray-500">
                  {card.stats}
                </div>
              </div>
              <div className="ml-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                to="/app/manage/rooms"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Room
              </Link>
              <Link
                to="/app/manage/students"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Invite Students
              </Link>
              <button className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Create Assignment
              </button>
              <button className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send Announcement
              </button>
              <button className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDashboard;
