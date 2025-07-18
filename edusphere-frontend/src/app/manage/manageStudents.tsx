import React, { useState, useEffect } from 'react';
import useAuth from "../../contexts/useAuth";

/**
 * Interface for Student data structure
 * Follows clean architecture principles for data modeling
 */
interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledRooms: string[];
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
  grade?: string;
  major?: string;
  totalPoints: number;
  completedAssignments: number;
}

/**
 * Interface for Room data for dropdown selection
 */
interface RoomOption {
  id: string;
  name: string;
  subject: string;
}

/**
 * Student management component for teachers and room administrators
 * Provides comprehensive student management functionality
 * Time Complexity: O(n) for rendering student list, O(1) for most operations
 */
const ManageStudents: React.FC = () => {
  const { user } = useAuth();
  
  // State management for students data
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');

  /**
   * Initialize students and rooms data on component mount
   * Simulates API call - replace with actual service call
   * Time Complexity: O(1) - constant time operation
   */
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock rooms data
        const mockRooms: RoomOption[] = [
          { id: '1', name: 'Advanced Mathematics', subject: 'Mathematics' },
          { id: '2', name: 'Physics Lab Discussion', subject: 'Physics' },
          { id: '3', name: 'Computer Science Fundamentals', subject: 'Computer Science' },
          { id: '4', name: 'Chemistry Lab', subject: 'Chemistry' },
          { id: '5', name: 'Biology Study Group', subject: 'Biology' }
        ];

        // Mock students data
        const mockStudents: Student[] = [
          {
            id: '1',
            name: 'Alice Johnson',
            email: 'alice.johnson@university.edu',
            avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson',
            enrolledRooms: ['1', '2'],
            joinedAt: '2024-01-15T10:00:00Z',
            lastActive: '2024-01-20T14:30:00Z',
            status: 'active',
            grade: 'A',
            major: 'Mathematics',
            totalPoints: 450,
            completedAssignments: 12
          },
          {
            id: '2',
            name: 'Bob Smith',
            email: 'bob.smith@university.edu',
            avatar: 'https://ui-avatars.com/api/?name=Bob+Smith',
            enrolledRooms: ['1', '3'],
            joinedAt: '2024-01-16T09:00:00Z',
            lastActive: '2024-01-19T16:45:00Z',
            status: 'active',
            grade: 'B+',
            major: 'Computer Science',
            totalPoints: 380,
            completedAssignments: 10
          },
          {
            id: '3',
            name: 'Carol Williams',
            email: 'carol.williams@university.edu',
            avatar: 'https://ui-avatars.com/api/?name=Carol+Williams',
            enrolledRooms: ['2', '4'],
            joinedAt: '2024-01-17T11:30:00Z',
            lastActive: '2024-01-18T10:15:00Z',
            status: 'inactive',
            grade: 'B',
            major: 'Physics',
            totalPoints: 320,
            completedAssignments: 8
          },
          {
            id: '4',
            name: 'David Brown',
            email: 'david.brown@university.edu',
            avatar: 'https://ui-avatars.com/api/?name=David+Brown',
            enrolledRooms: ['3', '5'],
            joinedAt: '2024-01-18T13:00:00Z',
            lastActive: '2024-01-20T12:00:00Z',
            status: 'active',
            grade: 'A-',
            major: 'Biology',
            totalPoints: 420,
            completedAssignments: 11
          },
          {
            id: '5',
            name: 'Emma Davis',
            email: 'emma.davis@university.edu',
            avatar: 'https://ui-avatars.com/api/?name=Emma+Davis',
            enrolledRooms: ['1', '4', '5'],
            joinedAt: '2024-01-19T15:20:00Z',
            lastActive: '2024-01-20T17:30:00Z',
            status: 'suspended',
            grade: 'C',
            major: 'Chemistry',
            totalPoints: 250,
            completedAssignments: 6
          }
        ];
        
        setStudents(mockStudents);
        setRooms(mockRooms);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /**
   * Filter students based on search term, room, and status
   * Time Complexity: O(n) where n is number of students
   */
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.major?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoom = selectedRoom === 'all' || student.enrolledRooms.includes(selectedRoom);
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesRoom && matchesStatus;
  });

  /**
   * Get room name by ID
   * Time Complexity: O(n) where n is number of rooms
   */
  const getRoomName = (roomId: string): string => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  /**
   * Update student status
   * Time Complexity: O(n) for finding and updating student
   */
  const updateStudentStatus = async (studentId: string, newStatus: Student['status']): Promise<void> => {
    try {
      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, status: newStatus }
          : student
      ));
    } catch (error) {
      console.error('Failed to update student status:', error);
    }
  };

  /**
   * Remove student from room
   * Time Complexity: O(n) for finding and updating student
   */
  // Future feature for removing students from specific rooms
  /*
  const removeStudentFromRoom = async (studentId: string, roomId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to remove this student from the room?')) {
      try {
        setStudents(prev => prev.map(student => 
          student.id === studentId 
            ? { ...student, enrolledRooms: student.enrolledRooms.filter(id => id !== roomId) }
            : student
        ));
      } catch (error) {
        console.error('Failed to remove student from room:', error);
      }
    }
  };
  */

  /**
   * Send invitation to student
   * Time Complexity: O(1)
   */
  const sendInvitation = async (): Promise<void> => {
    if (!inviteEmail.trim()) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would send an email invitation
      console.log('Invitation sent to:', inviteEmail);
      
      setShowInviteModal(false);
      setInviteEmail('');
      
      // Show success message (you might want to add a toast notification here)
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
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
  const getStatusColor = (status: Student['status']): string => {
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
          <p className="text-gray-600">Monitor and manage student enrollment and progress</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Invite Student
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students by name, email, or major..."
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
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Rooms</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
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

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={student.avatar}
                          alt={student.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                        <div className="text-sm text-gray-500">{student.major}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {student.enrolledRooms.map(roomId => (
                        <div key={roomId} className="text-sm text-gray-900">
                          {getRoomName(roomId)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Points: {student.totalPoints}</div>
                      <div>Assignments: {student.completedAssignments}</div>
                      <div>Grade: {student.grade}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(student.lastActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStudentStatus(student.id, 
                          student.status === 'active' ? 'inactive' : 'active'
                        )}
                        className={`${
                          student.status === 'active' 
                            ? 'text-yellow-600 hover:text-yellow-800' 
                            : 'text-primary-600 hover:text-primary-800'
                        }`}
                      >
                        {student.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => updateStudentStatus(student.id, 'suspended')}
                        className="text-red-600 hover:text-red-800"
                        disabled={student.status === 'suspended'}
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Student Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Invite Student</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter student's email address"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                An invitation will be sent to the student's email address with instructions to join your rooms.
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={sendInvitation}
                disabled={!inviteEmail.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
