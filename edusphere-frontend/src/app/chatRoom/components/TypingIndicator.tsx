import React from 'react';

interface TypingIndicatorProps {
  typingUsers: { userId: string; username: string }[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;
  return (
    <div className="flex items-center mt-2">
      <svg className="w-5 h-5 mr-2 text-primary-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      </svg>
      <span className="text-sm text-primary-700 font-medium">
        {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
      </span>
    </div>
  );
};

export default TypingIndicator;
