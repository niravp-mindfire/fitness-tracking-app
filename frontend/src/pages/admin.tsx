// src/pages/Admin.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { useSidebar } from '../components/SidebarProvider';
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/auth';
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import Private from '../components/Private';

interface AdminProps {
  children: ReactNode; // Define the type for the children prop
}

const Admin: React.FC<AdminProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter(); // Use useRouter for navigation
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/'); // Navigate to the home/login route
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setIsSidebarCollapsed(isMobile); // Collapse sidebar if mobile
  }, [isMobile]);

  return (
    <Private>
      <div className="flex min-h-screen bg-[#EBF2FA]">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          handleLogout={handleLogout}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content */}
        <main
          className={`main-content flex-grow transition-all duration-300 ease-in-out ${
            isSidebarCollapsed
              ? 'w-[calc(100%-60px)] lg:w-[calc(100%-240px)]'
              : 'w-[calc(100%-240px)] lg:w-[calc(100%-240px)]'
          } p-6`}
          style={{
            marginLeft: isMobile
              ? '60px'
              : isSidebarCollapsed
                ? '60px'
                : '240px',
          }}
        >
          {/* Main Content Area */}
          <section className="main-section bg-white rounded-lg shadow-lg p-6">
            {children} {/* Render children content here */}
          </section>
        </main>
      </div>
    </Private>
  );
};

export default Admin;
