'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface WithAuthProps {
  children: React.ReactNode;
}

const withAuth = ({ children }: WithAuthProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [router]);

  // Render nothing while checking for authentication
  if (isAuthenticated === null) {
    return null;
  }

  // Render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default withAuth;
