import React, { useState, useEffect } from 'react';
import useAuth from "../../contexts/useAuth";
import { RoomService } from '../../services/room';
import type { Room } from '../../contexts/authTypes';

const ManageRooms: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: ''
  });

  useEffect(() => {
    const fetchRooms = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      
      try {
        let roomsData: Room[];
        
        if (user?.role === 'TEACHER' && user?.id) {
          roomsData = await RoomService.getRoomsByTeacher(user.id.toString());
        } else {
          roomsData = await RoomService.getRooms();
        }
        
        setRooms(roomsData);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleCreateRoom = async (): Promise<void> => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }

    setError(null);

    try {
      const newRoom = await RoomService.createRoom({
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        creatorId: user.id.toString()
      });

      setRooms(prev => [...prev, newRoom]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create room:', err);
      setError(err instanceof Error ? err.message : 'Failed to create room');
    }
  };

  const handleUpdateRoom = async (): Promise<void> => {
    if (!editingRoom) return;

    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }

    setError(null);

    try {
      const updatedRoom = await RoomService.updateRoom(editingRoom.id, {
        name: formData.name,
        description: formData.description,
        slug: formData.slug
      });

      setRooms(prev => prev.map(room => 
        room.id === editingRoom.id ? updatedRoom : room
      ));
      
      setEditingRoom(null);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to update room:', err);
      setError(err instanceof Error ? err.message : 'Failed to update room');
    }
  };

  const handleDeleteRoom = async (roomId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setError(null);
      
      try {
        await RoomService.deleteRoom(roomId);
        setRooms(prev => prev.filter(room => room.id !== roomId));
      } catch (err) {
        console.error('Failed to delete room:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete room');
      }
    }
  };

  const toggleRoomStatus = async (roomId: string, currentStatus: boolean): Promise<void> => {
    setError(null);
    
    try {
      const updatedRoom = await RoomService.toggleRoomStatus(roomId, !currentStatus);
      setRooms(prev => prev.map(room => 
        room.id === roomId ? updatedRoom : room
      ));
    } catch (err) {
      console.error('Failed to toggle room status:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle room status');
    }
  };

  const startEdit = (room: Room): void => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || '',
      slug: room.slug
    });
    setShowCreateModal(true);
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      description: '',
      slug: ''
    });
  };

  const cancelEdit = (): void => {
    setEditingRoom(null);
    setShowCreateModal(false);
    resetForm();
    setError(null);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive: boolean): string => {
    return isActive 
      ? 'bg-primary-100 text-primary-800' 
      : 'bg-red-100 text-red-800';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
          <p className="text-gray-600">Create and manage study rooms</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Create Room
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No rooms found matching your search.' : 'No rooms created yet.'}
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{room.name}</div>
                        <div className="text-sm text-gray-500">{room.description}</div>
                        <div className="text-xs text-gray-400">Slug: {room.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Participants: {room.userCount || 0}</div>
                      <div>Messages: {room.messageCount || 0}</div>
                      <div>Media: {room.mediaCount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.deletedAt ? false : true)}`}>
                        {room.deletedAt ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(room.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(room)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleRoomStatus(room.id, !room.deletedAt)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          {room.deletedAt ? 'Activate' : 'Deactivate'}
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingRoom ? 'Edit Room' : 'Create New Room'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name *
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
                  Room Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="room-slug"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from room name.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-800 text-sm">{error}</span>
                  </div>
                </div>
              )}
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