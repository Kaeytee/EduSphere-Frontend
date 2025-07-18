import React, { useState, useEffect } from 'react';
import useAuth from "../../contexts/useAuth";
import { UserRole } from "../../contexts/authTypes";

/**
 * Interface for User data structure
 * Comprehensive user information for admin management
 */
interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  emailVerified: boolean;
  enrolledRooms: number;
  totalSessions: number;
  totalPoints: number;
}

/**
 * Interface for user statistics
 */
interface LocalUserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  adminUsers: number;
  teacherUsers: number;
  studentUsers: number;
}

/**
 * User management component for platform administrators
 * Provides comprehensive user administration capabilities
 * Time Complexity: O(n) for rendering user list, O(1) for most operations
 */
const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  
  // State management for users data
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [userStats, setLocalUserStats] = useState<LocalUserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<LocalUser | null>(null);

  // Form state for user creation/editing
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    status: 'active' | 'inactive' | 'suspended';
  }>({
    name: '',
    email: '',
    role: UserRole.USER,
    status: 'active'
  });

  /**
   * Initialize users data on component mount
   * Simulates API call - replace with actual service call
   * Time Complexity: O(1) - constant time operation
   */
  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock users data
        const mockUsers: LocalUser[] = [
          {
            id: '1',
            name: 'John Admin',
            email: 'admin@edusphere.com',
            role: UserRole.ADMIN,
            avatar: 'https://ui-avatars.com/api/?name=John+Admin',
            status: 'active',
            createdAt: '2023-12-01T10:00:00Z',
            lastLogin: '2024-01-20T14:30:00Z',
            emailVerified: true,
            enrolledRooms: 0,
            totalSessions: 156,
            totalPoints: 0
          },
          {
            id: '2',
            name: 'Dr. Sarah Wilson',
            email: 'teacher@edusphere.com',
            role: UserRole.MODERATOR,
            avatar: 'https://ui-avatars.com/api/?name=Dr.+Sarah+Wilson',
            status: 'active',
            createdAt: '2023-12-15T09:00:00Z',
            lastLogin: '2024-01-20T13:15:00Z',
            emailVerified: true,
            enrolledRooms: 5,
            totalSessions: 89,
            totalPoints: 0
          },
          {
            id: '3',
            name: 'Alice Johnson',
            email: 'alice.johnson@university.edu',
            role: UserRole.USER,
            avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson',
            status: 'active',
            createdAt: '2024-01-01T11:30:00Z',
            lastLogin: '2024-01-20T16:45:00Z',
            emailVerified: true,
            enrolledRooms: 3,
            totalSessions: 45,
            totalPoints: 450
          },
          {
            id: '4',
            name: 'Bob Smith',
            email: 'bob.smith@university.edu',
            role: UserRole.USER,
            avatar: 'https://ui-avatars.com/api/?name=Bob+Smith',
            status: 'active',
            createdAt: '2024-01-05T14:20:00Z',
            lastLogin: '2024-01-19T10:30:00Z',
            emailVerified: true,
            enrolledRooms: 2,
            totalSessions: 32,
            totalPoints: 380
          },
          {
            id: '5',
            name: 'Carol Williams',
            email: 'carol.williams@university.edu',
            role: UserRole.USER,
            avatar: 'https://ui-avatars.com/api/?name=Carol+Williams',
            status: 'inactive',
            createdAt: '2024-01-10T16:00:00Z',
            lastLogin: '2024-01-15T12:00:00Z',
            emailVerified: false,
            enrolledRooms: 1,
            totalSessions: 8,
            totalPoints: 120
          },
          {
            id: '6',
            name: 'David Brown',
            email: 'david.brown@university.edu',
            role: UserRole.USER,
            avatar: 'https://ui-avatars.com/api/?name=David+Brown',
            status: 'suspended',
            createdAt: '2024-01-12T13:45:00Z',
            lastLogin: '2024-01-18T09:20:00Z',
            emailVerified: true,
            enrolledRooms: 4,
            totalSessions: 28,
            totalPoints: 200
          }
        ];

        // Calculate stats
        const stats: LocalUserStats = {
          totalUsers: mockUsers.length,
          activeUsers: mockUsers.filter(u => u.status === 'active').length,
          newUsersThisMonth: mockUsers.filter(u => 
            new Date(u.createdAt) > new Date('2024-01-01')
          ).length,
          adminUsers: mockUsers.filter(u => u.role === UserRole.ADMIN).length,
          teacherUsers: mockUsers.filter(u => u.role === UserRole.MODERATOR).length,
          studentUsers: mockUsers.filter(u => u.role === UserRole.USER).length
        };
        
        setUsers(mockUsers);
        setLocalUserStats(stats);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /**
   * Filter users based on search term, role, and status
   * Time Complexity: O(n) where n is number of users
   */
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  /**
   * Handle form input changes
   * Time Complexity: O(1)
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Create new user
   * Time Complexity: O(1) for state update, O(n) for re-render
   */
  const handleCreateUser = async (): Promise<void> => {
    try {
      const newUser: LocalUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}`,
        status: formData.status,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        emailVerified: false,
        enrolledRooms: 0,
        totalSessions: 0,
        totalPoints: 0
      };

      setUsers(prev => [...prev, newUser]);
      setShowUserModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  /**
   * Update existing user
   * Time Complexity: O(n) for finding and updating user
   */
  const handleUpdateUser = async (): Promise<void> => {
    if (!editingUser) return;

    try {
      const updatedUser: LocalUser = {
        ...editingUser,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status
      };

      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      setEditingUser(null);
      setShowUserModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  /**
   * Delete user
   * Time Complexity: O(n) for filtering
   */
  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  /**
   * Update user status
   * Time Complexity: O(n) for finding and updating user
   */
  const updateUserStatus = async (userId: string, newStatus: LocalUser['status']): Promise<void> => {
    if (userId === currentUser?.id && newStatus !== 'active') {
      alert('You cannot change your own status!');
      return;
    }

    try {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      ));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  /**
   * Start editing user
   * Time Complexity: O(1)
   */
  const startEdit = (user: LocalUser): void => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowUserModal(true);
  };

  /**
   * Reset form data
   * Time Complexity: O(1)
   */
  const resetForm = (): void => {
    setFormData({
      name: '',
      email: '',
      role: UserRole.USER,
      status: 'active'
    });
  };

  /**
   * Cancel editing
   * Time Complexity: O(1)
   */
  const cancelEdit = (): void => {
    setEditingUser(null);
    setShowUserModal(false);
    resetForm();
  };

  /**
   * Format date for display
   * Time Complexity: O(1)
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get status color classes
   * Time Complexity: O(1)
   */
  const getStatusColor = (status: LocalUser['status']): string => {
    switch (status) {
      case 'active':
        return 'bg-primary-100 text-primary-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Get role display name
   * Time Complexity: O(1)
   */
  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.MODERATOR:
        return 'Teacher';
      case UserRole.USER:
        return 'Student';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage platform users and permissions</p>
        </div>
        <button
          onClick={() => setShowUserModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{userStats?.totalUsers}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{userStats?.activeUsers}</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{userStats?.newUsersThisMonth}</p>
            <p className="text-sm text-gray-600">New This Month</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{userStats?.adminUsers}</p>
            <p className="text-sm text-gray-600">Admins</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{userStats?.teacherUsers}</p>
            <p className="text-sm text-gray-600">Teachers</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{userStats?.studentUsers}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Roles</option>
            <option value={UserRole.ADMIN}>Administrator</option>
            <option value={UserRole.MODERATOR}>Teacher</option>
            <option value={UserRole.USER}>Student</option>
          </select>
        </div>
        
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="flex items-center mt-1">
                          {user.emailVerified ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{getRoleDisplayName(user.role)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Sessions: {user.totalSessions}</div>
                    <div>Rooms: {user.enrolledRooms}</div>
                    <div>Points: {user.totalPoints}</div>
                    <div>Last: {formatDate(user.lastLogin)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => updateUserStatus(user.id, 
                          user.status === 'active' ? 'inactive' : 'active'
                        )}
                        className={`${
                          user.status === 'active' 
                            ? 'text-yellow-600 hover:text-yellow-800' 
                            : 'text-primary-600 hover:text-primary-800'
                        }`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={user.id === currentUser?.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={UserRole.USER}>Student</option>
                  <option value={UserRole.MODERATOR}>Teacher</option>
                  <option value={UserRole.ADMIN}>Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                {editingUser ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
