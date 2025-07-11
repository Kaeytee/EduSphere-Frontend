import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About EduSphere</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-lg text-gray-700 mb-6">
            EduSphere is a comprehensive learning platform designed to enhance educational experiences 
            through innovative technology and collaborative learning.
          </p>
          <p className="text-gray-600">
            Our mission is to make quality education accessible and engaging for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
