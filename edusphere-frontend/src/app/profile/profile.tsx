import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm capitalize"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
