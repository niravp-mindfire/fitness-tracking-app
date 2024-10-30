// loading.tsx with spinner
import React from 'react';

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-blue-600 text-lg font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
