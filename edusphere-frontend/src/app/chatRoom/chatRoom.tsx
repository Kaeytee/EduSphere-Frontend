import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../contexts/useAuth';
import { useChatRoom } from './hooks/useChatRoom';
import MessageList from './components/MessageList';
import TypingIndicator from './components/TypingIndicator';

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  // Only one reaction per message per user
  const [reactions, setReactions] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingMsg, setEditingMsg] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const {
    messages,
    isLoading,
    error,
    roomName,
    typingUsers,
    sendMessage,
    sendTyping,
  } = useChatRoom(roomId, user?.id?.toString());

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
    sendTyping(false);
    setReplyingTo(null);
  };

  const handleReact = (msgKey: string, emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [msgKey]: {
        ...(prev[msgKey] || {}),
        [emoji]: ((prev[msgKey]?.[emoji] || 0) + 1)
      }
    }));
  };

  const handleCopy = (content: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
    }
  };

  const handleReply = (msgKey: string, username: string) => {
    setReplyingTo(msgKey);
    setInput(`@${username}: `);
  };

  // Save edited message (local only for now)
  const handleEditSave = (msgKey: string) => {
    // In a real app, send to backend here
    const idx = messages.findIndex(m => (m.id && m.sent_at ? `${m.id}_${m.sent_at}` : m.id || m.sent_at || '') === msgKey);
    if (idx !== -1) {
      messages[idx].content = editValue;
    }
    setEditingMsg(null);
    setEditValue('');
  };

  // Auto-scroll to bottom when messages change
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Helper to format date group labels
  const getDateLabel = (date: Date) => {
    const now = new Date();
    const msgDay = date.getDate();
    const msgMonth = date.getMonth();
    const msgYear = date.getFullYear();
    const nowDay = now.getDate();
    const nowMonth = now.getMonth();
    const nowYear = now.getFullYear();
    const yesterday = new Date(now);
    yesterday.setDate(nowDay - 1);
    if (msgYear === nowYear && msgMonth === nowMonth && msgDay === nowDay) return 'Today';
    if (msgYear === yesterday.getFullYear() && msgMonth === yesterday.getMonth() && msgDay === yesterday.getDate()) return 'Yesterday';
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Group messages by date
  const reversedMessages = [...messages].reverse();
  const groupedMessages: { label: string, items: typeof messages }[] = [];
  let lastLabel = '';
  reversedMessages.forEach(msg => {
    let label = 'No date';
    if (msg.sent_at) {
      const date = new Date(msg.sent_at);
      if (!isNaN(date.getTime())) {
        label = getDateLabel(date);
      }
    }
    if (!groupedMessages.length || lastLabel !== label) {
      groupedMessages.push({ label, items: [msg] });
      lastLabel = label;
    } else {
      groupedMessages[groupedMessages.length - 1].items.push(msg);
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat Room: <span className="text-primary-600">{roomName || roomId}</span></h1>
        <div className="bg-gray-50 rounded-lg p-4 h-96 mb-4 overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-400">Loading messages...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              <ul className="space-y-2 flex flex-col-reverse">
                {groupedMessages.map(group => (
                  <React.Fragment key={group.label}>
                    <li className="sticky top-0 z-10 bg-gray-200 text-xs text-gray-600 py-1 px-2 rounded text-center mb-2">{group.label}</li>
                    {group.items.map((msg, idx) => {
                      let timeStr = '';
                      if (msg.sent_at) {
                        const date = new Date(msg.sent_at);
                        if (!isNaN(date.getTime())) {
                          timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        } else {
                          timeStr = 'Invalid time';
                        }
                      } else {
                        timeStr = 'No time';
                      }
                      const compositeKey = msg.id && msg.sent_at ? `${msg.id}_${msg.sent_at}` : String(msg.id || msg.sent_at || idx);
                      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.user?.username || 'User')}`;
                      const isImage = typeof msg.content === 'string' && (msg.content.startsWith('http') && (msg.content.endsWith('.jpg') || msg.content.endsWith('.png') || msg.content.endsWith('.gif')));
                      const isLink = typeof msg.content === 'string' && msg.content.startsWith('http');
                      const readStatus = idx % 2 === 0 ? '✓✓' : '✓';
                      // ...existing code...
                      return (
                        <li key={compositeKey} className="group flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all">
                          <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover mr-2" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary-700">{msg.user?.username || 'Unknown User'}</span>
                              <span className="text-xs text-gray-400">{timeStr}</span>
                              <span className="text-xs text-green-500 ml-2">{readStatus}</span>
                            </div>
                            <div className="mt-1">
                              {editingMsg === compositeKey ? (
                                <div className="flex gap-2">
                                  <input
                                    className="border px-2 py-1 rounded w-full"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                  />
                                  <button className="text-xs px-2 py-1 rounded bg-primary-600 text-white" onClick={() => handleEditSave(compositeKey)}>Save</button>
                                  <button className="text-xs px-2 py-1 rounded bg-gray-300" onClick={() => { setEditingMsg(null); setEditValue(''); }}>Cancel</button>
                                </div>
                              ) : isImage ? (
                                <img src={msg.content} alt="media" className="max-w-xs rounded-md border" />
                              ) : isLink ? (
                                <a href={msg.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{msg.content}</a>
                              ) : (
                                <span className="text-gray-700 break-words">{msg.content}</span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="text-xs px-2 py-1 rounded hover:bg-gray-200" title="Reply" onClick={() => handleReply(compositeKey, msg.user?.username || 'User')}>↩️ Reply</button>
                              <button className="text-xs px-2 py-1 rounded hover:bg-gray-200" title="Copy" onClick={() => handleCopy(msg.content)}>📋 Copy</button>
                              <button className="text-xs px-2 py-1 rounded hover:bg-gray-200" title="Edit" onClick={() => { setEditingMsg(compositeKey); setEditValue(msg.content); }}>✏️ Edit</button>
                              <button className="text-xs px-2 py-1 rounded hover:bg-gray-200" title="Delete">🗑️ Delete</button>
                              <div className="flex gap-1">
                                {['😀','👍','❤️'].map(emoji => (
                                  <button
                                    key={emoji}
                                    className={`text-xs ${reactions[compositeKey] === emoji ? 'bg-primary-600 text-white' : ''}`}
                                    title="React"
                                    onClick={() => setReactions(prev => ({
                                      ...prev,
                                      [compositeKey]: prev[compositeKey] === emoji ? '' : emoji
                                    }))}
                                  >
                                    {emoji} {reactions[compositeKey] === emoji ? '1' : ''}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {replyingTo === compositeKey && (
                              <div className="mt-2 text-xs text-blue-600">Replying to <b>{msg.user?.username || 'User'}</b></div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </React.Fragment>
                ))}
                <div ref={messagesEndRef} />
              </ul>
              <TypingIndicator typingUsers={typingUsers} />
            </>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => {
              setInput(e.target.value);
              sendTyping(!!e.target.value);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
