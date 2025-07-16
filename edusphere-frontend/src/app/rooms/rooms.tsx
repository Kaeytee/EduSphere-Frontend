import React from 'react';

const Rooms: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Rooms</h1>
        <p className="text-gray-600 mb-6">
          Join or create study rooms to collaborate with other students.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Mathematics Study Group</h3>
            <p className="text-sm text-gray-600 mb-4">Active participants: 12</p>
            <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
              Join Room
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Physics Discussion</h3>
            <p className="text-sm text-gray-600 mb-4">Active participants: 8</p>
            <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
              Join Room
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Computer Science</h3>
            <p className="text-sm text-gray-600 mb-4">Active participants: 15</p>
            <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
