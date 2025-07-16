import React from 'react'

const features = () => {
  const featureList = [
    "Feature 1: User-friendly interface",
    "Feature 2: Secure authentication",
    "Feature 3: Real-time collaboration",
  ];

  return (
    <div>
      <h2>Key Features</h2>
      <ul>
        {featureList.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}

export default features
