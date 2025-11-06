import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/70 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <i className="fas fa-chart-line text-2xl text-cyan-400"></i>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
              Real-Time Dashboard
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;