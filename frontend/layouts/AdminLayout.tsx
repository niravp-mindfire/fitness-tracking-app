'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WithAuth from './withAuth';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode; // Define the type for the children prop
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter(); // Use useRouter for navigation
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.clear();
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
    <WithAuth>
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
        >
          {/* Main Content Area */}
          <section className="main-section bg-white rounded-lg shadow-lg p-6">
            {children} {/* Render children content here */}
          </section>
        </main>
      </div>
    </WithAuth>
  );
};

export default AdminLayout;
