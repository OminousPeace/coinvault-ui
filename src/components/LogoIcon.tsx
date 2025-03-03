
import React from 'react';

const LogoIcon: React.FC = () => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 animate-pulse-gentle" />
      <span className="relative text-lg font-bold text-white">₵</span>
    </div>
  );
};

export default LogoIcon;
