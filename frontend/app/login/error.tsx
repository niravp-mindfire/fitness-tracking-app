'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-center px-4">
      <div>
        <h2 className="text-red-600 text-xl font-semibold mb-4">
          Oops, something went wrong!
        </h2>
        <p className="text-gray-700 mb-6">{error.message}</p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
