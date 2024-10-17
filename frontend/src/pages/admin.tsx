import React, { ReactNode, useEffect, useState } from 'react';
import {
  useMediaQuery,
  Theme,
  ThemeProvider,
  createTheme,
} from '@mui/material'; // Import ThemeProvider and createTheme
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/auth'; // Adjust the import based on your structure
import Sidebar from './Sidebar'; // Adjust the import based on your structure

interface AdminProps {
  children: ReactNode; // Define children prop type
}

const Admin: React.FC<AdminProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  ); // Detect mobile view

  // Automatically collapse the sidebar on mobile
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Adjust to your login route
  };

  return (
    <div data-testid="admin-container" style={{ display: 'flex' }}>
      <Sidebar handleLogout={handleLogout} />
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
