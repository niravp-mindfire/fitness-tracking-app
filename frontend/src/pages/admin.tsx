// src/pages/admin/index.tsx

import React, { ReactNode } from 'react';
import { useSidebar } from '../component/SidebarContext';
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/auth';
import { useNavigate } from 'react-router-dom';

interface AdminProps {
  children: ReactNode; // Define the type for the children prop
}

const Admin: React.FC<AdminProps> = ({ children }) => {
  const { isCollapsed } = useSidebar(); // Use the context
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Adjust to your login route
  };

  return (
    <div data-testid="admin-container" style={{ display: 'flex' }}>
      <Sidebar isCollapsed={isCollapsed} handleLogout={handleLogout} />
      <main
        data-testid="admin-main"
        style={{
          flexGrow: 1,
          padding: '16px',
          width: isCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 240px)', // Adjust based on sidebar
          transition: 'width 0.3s ease',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Admin;
