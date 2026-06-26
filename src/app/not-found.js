// src/components/NotFound.jsx
import Link from 'next/link';
import React from 'react';


const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#556B2F] text-white p-6">
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-extrabold text-[#FFD700] drop-shadow-lg">404</h1>
        
        <h2 className="text-3xl font-bold">Oops! Page Not Found</h2>
        
        <p className="text-lg text-gray-200 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="pt-6">
          <Link
            href="/"
            className="px-8 py-3 bg-[#FFD700] text-[#556B2F] font-bold rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;