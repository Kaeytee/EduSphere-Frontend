import { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { RoomService } from '../../../services/room';
import { socketService } from '../../../services/socket';
import type { Message } from '../../../contexts/authTypes';
import type { SocketMessage, UserTypingData } from '../../../services/socket';

export function useChatRoom(
  roomId: string | undefined,
  userId: string | undefined,
  // username?: string
): {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  roomName: string;
  typingUsers: { userId: string; username: string }[];
  sendMessage: (content: string) => Promise<void>;
  sendTyping: (isTyping: boolean) => void;
  joinRoom: () => void;
  leaveRoom: () => void;
} {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>('');
  const [typingUsers, setTypingUsers] = useState<{ userId: string; username: string }[]>([]);
  const typingTimeouts = useRef<{ [userId: string]: ReturnType<typeof setTimeout> }>({});
  const isMounted = useRef<boolean>(true);

  const joinRoom = useCallback(() => {
    if (roomId && userId) {
      socketService.joinRoom({ room_id: roomId, user_id: userId });
    }
  }, [roomId, userId]);

  const leaveRoom = useCallback(() => {
    if (roomId && userId) {
      socketService.leaveRoom({ room_id: roomId, user_id: userId });
    }
  }, [roomId, userId]);

  useEffect(() => {
    isMounted.current = true;

    const fetchRoomAndMessages = async () => {
      if (!roomId) {
        setError('Room ID is required');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [roomDetails, msgs] = await Promise.all([
          RoomService.getRoom(roomId),
          RoomService.getMessages(roomId),
        ]);
        if (isMounted.current) {
          setRoomName(roomDetails.name || 'Unknown Room');
          setMessages(msgs || []);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : 'Failed to fetch room or messages');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchRoomAndMessages();

    if (!roomId || !userId) {
      setError('Both room ID and user ID are required');
      return;
    }

    socketService.connect().then(() => {
      if (isMounted.current && roomId && userId) {
        joinRoom();
      }
    }).catch(() => {
      if (isMounted.current) {
        setError('Failed to connect to socket');
      }
    });

    const handleNewMessage = (data: SocketMessage) => {
      if (!isMounted.current || data.room_id !== roomId) return;
        const userObj = data.user as Partial<{ id: string | number; username?: string; email?: string; firstName?: string; lastName?: string }>;
        const msg: Message = {
          id: data.id,
          room_id: data.room_id,
          user_id: data.user_id,
          content: data.content,
          sent_at: data.sent_at,
          user: {
            id: String(userObj.id),
            username: userObj.username ?? userObj.email ?? 'Unknown User',
            firstName: userObj.firstName ?? '',
            lastName: userObj.lastName ?? '',
          },
        };
      setMessages(prev => [...prev, msg]);
    };

    // Extend UserTypingData to include room_id for proper typing
    type UserTypingDataWithRoom = UserTypingData & { room_id?: string };

    const handleUserTyping = (data: UserTypingDataWithRoom) => {
      // Use correct property for roomId (if available)
      // If UserTypingData does not have room_id, skip room check
      if (!isMounted.current || (data.room_id !== undefined && data.room_id !== roomId)) return;
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u.userId !== data.user_id);
        if (data.is_typing) {
          return [...filtered, { userId: data.user_id, username: data.username || 'Unknown User' }];
        }
        return filtered;
      });
      if (data.is_typing) {
        if (typingTimeouts.current[data.user_id]) {
          clearTimeout(typingTimeouts.current[data.user_id]);
        }
        typingTimeouts.current[data.user_id] = setTimeout(() => {
          if (isMounted.current) {
            setTypingUsers(prev => prev.filter(u => u.userId !== data.user_id));
            delete typingTimeouts.current[data.user_id];
          }
        }, 3000);
      }
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);

    return () => {
      isMounted.current = false;
      leaveRoom();
      Object.values(typingTimeouts.current).forEach(clearTimeout);
      typingTimeouts.current = {};
    };
  }, [roomId, userId, joinRoom, leaveRoom]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !roomId || !userId) {
      setError('Invalid message or missing room/user ID');
      return;
    }
    try {
      await socketService.sendMessage({
        room_id: roomId,
        user_id: String(userId),
        content,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const sendTyping = (isTyping: boolean) => {
    if (!roomId || !userId) return;
    socketService.sendTyping({
      room_id: roomId,
      user_id: String(userId),
      is_typing: isTyping,
    });
  };

  return {
    messages,
    isLoading,
    error,
    roomName,
    typingUsers,
    sendMessage,
    sendTyping,
    joinRoom,
    leaveRoom,
  };
}