import React from 'react';
import type { Message } from '../../../contexts/authTypes';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <ul className="space-y-2">
    {messages.map(msg => (
      <li key={msg.id} className="bg-white rounded px-3 py-2 shadow text-sm flex items-center">
        <span className="font-semibold text-primary-600 mr-2">{msg.user.username || 'Unknown'}:</span>
        <span>{msg.content}</span>
        <span className="ml-2 text-xs text-gray-400">{new Date(msg.sent_at).toLocaleTimeString()}</span>
      </li>
    ))}
  </ul>
);

export default MessageList;
