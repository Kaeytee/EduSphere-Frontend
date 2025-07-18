import React, { useState, useEffect } from 'react';
import useAuth from "../../contexts/useAuth";

/**
 * Interface for Room data structure
 * Follows clean architecture principles for data modeling
 */
interface Room {
  id: string;
  name: string;
  description: string;
  subject: string;
  capacity: number;
  currentStudents: number;
  teacherId: string;
  teacherName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Room management component for teachers and room administrators
 * Provides CRUD operations for managing study rooms
 * Time Complexity: O(n) for rendering room list, O(1) for most operations
 */
const ManageRooms: React.FC = () => {
  const { user } = useAuth();
  
  // State management for rooms data
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form state for create/edit operations
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    capacity: 20
  });

  /**
   * Initialize rooms data on component mount
   * Simulates API call - replace with actual service call
   * Time Complexity: O(1) - constant time operation
   */
  useEffect(() => {
    const fetchRooms = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API call
        const mockRooms: Room[] = [
          {
            id: '1',
            name: 'Advanced Mathematics',
            description: 'Calculus and Linear Algebra discussion room',
            subject: 'Mathematics',
            capacity: 25,
            currentStudents: 18,
            teacherId: user?.id || '1',
            teacherName: user?.name || 'Teacher',
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            name: 'Physics Lab Discussion',
            description: 'Quantum mechanics and thermodynamics',
            subject: 'Physics',
            capacity: 20,
            currentStudents: 15,
            teacherId: user?.id || '1',
            teacherName: user?.name || 'Teacher',
            isActive: true,
            createdAt: '2024-01-16T09:00:00Z',
            updatedAt: '2024-01-16T09:00:00Z'
          },
          {
            id: '3',
            name: 'Computer Science Fundamentals',
            description: 'Data structures and algorithms study group',
            subject: 'Computer Science',
            capacity: 30,
            currentStudents: 22,
            teacherId: user?.id || '1',
            teacherName: user?.name || 'Teacher',
            isActive: false,
            createdAt: '2024-01-17T14:00:00Z',
            updatedAt: '2024-01-17T14:00:00Z'
          }
        ];
        
        setRooms(mockRooms);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  /**
   * Filter rooms based on search term
   * Time Complexity: O(n) where n is number of rooms
   */
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle form input changes
   * Time Complexity: O(1)
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  /**
   * Create new room
   * Time Complexity: O(1) for state update, O(n) for re-render
   */
  const handleCreateRoom = async (): Promise<void> => {
    try {
      const newRoom: Room = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        subject: formData.subject,
        capacity: formData.capacity,
        currentStudents: 0,
        teacherId: user?.id || '1',
        teacherName: user?.name || 'Teacher',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setRooms(prev => [...prev, newRoom]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  /**
   * Update existing room
   * Time Complexity: O(n) for finding and updating room
   */
  const handleUpdateRoom = async (): Promise<void> => {
    if (!editingRoom) return;

    try {
      const updatedRoom: Room = {
        ...editingRoom,
        name: formData.name,
        description: formData.description,
        subject: formData.subject,
        capacity: formData.capacity,
        updatedAt: new Date().toISOString()
      };

      setRooms(prev => prev.map(room => 
        room.id === editingRoom.id ? updatedRoom : room
      ));
      setEditingRoom(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update room:', error);
    }
  };

  /**
   * Delete room
   * Time Complexity: O(n) for filtering
   */
  const handleDeleteRoom = async (roomId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        setRooms(prev => prev.filter(room => room.id !== roomId));
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  /**
   * Toggle room active status
   * Time Complexity: O(n) for finding and updating room
   */
  const toggleRoomStatus = async (roomId: string): Promise<void> => {
    try {
      setRooms(prev => prev.map(room => 
        room.id === roomId 
          ? { ...room, isActive: !room.isActive, updatedAt: new Date().toISOString() }
          : room
      ));
    } catch (error) {
      console.error('Failed to toggle room status:', error);
    }
  };

  /**
   * Start editing room
   * Time Complexity: O(1)
   */
  const startEdit = (room: Room): void => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      subject: room.subject,
      capacity: room.capacity
    });
  };

  /**
   * Reset form data
   * Time Complexity: O(1)
   */
  const resetForm = (): void => {
    setFormData({
      name: '',
      description: '',
      subject: '',
      capacity: 20
    });
  };

  /**
   * Cancel editing
   * Time Complexity: O(1)
   */
  const cancelEdit = (): void => {
    setEditingRoom(null);
    setShowCreateModal(false);
    resetForm();
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
          <p className="text-gray-600">Create and manage study rooms for your students</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Create New Room
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search rooms by name, subject, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.name}</h3>
                  <p className="text-sm text-gray-600">{room.subject}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    room.isActive 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {room.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{room.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Capacity: {room.currentStudents}/{room.capacity}</span>
                <span>Students: {room.currentStudents}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(room)}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleRoomStatus(room.id)}
                    className={`text-sm font-medium ${
                      room.isActive 
                        ? 'text-red-600 hover:text-red-800' 
                        : 'text-primary-600 hover:text-primary-800'
                    }`}
                  >
                    {room.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingRoom) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingRoom ? 'Edit Room' : 'Create New Room'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter room name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter room description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
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
                onClick={editingRoom ? handleUpdateRoom : handleCreateRoom}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                {editingRoom ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
