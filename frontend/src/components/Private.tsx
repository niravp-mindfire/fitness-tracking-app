import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Private: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const router = useRouter();
  const isAuthenticated =
    typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to the home page if not authenticated
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // If not authenticated, you may want to render null or a loading state while redirecting
  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>; // Optional: You can also show a loading state here
  }

  return <>{children}</>; // Render children if authenticated
};

export default Private;
