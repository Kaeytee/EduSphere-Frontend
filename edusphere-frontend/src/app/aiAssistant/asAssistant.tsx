import React from 'react';

const AiAssistant: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Assistant</h1>
        <div className="bg-gray-50 rounded-lg p-4 h-96 mb-4">
          <p className="text-gray-600">AI conversation will appear here...</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask me anything about your studies..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
