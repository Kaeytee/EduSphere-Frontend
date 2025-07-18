import React from 'react';
import useAuth from "../../contexts/useAuth";
import { getUserDisplayName } from "../../utils/userUtils";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {getUserDisplayName(user)}!
        </h1>
        <p className="text-gray-600">
          Here's your learning dashboard with recent activities and progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h2>
          <p className="text-gray-600">Your recent course activities will appear here.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Study Progress</h2>
          <p className="text-gray-600">Track your learning progress and achievements.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-gray-600">Your scheduled classes and study sessions.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
