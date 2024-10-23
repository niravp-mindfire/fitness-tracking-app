import React, { ReactNode } from 'react';
import { useSidebar } from '../component/SidebarContext';
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/auth';
import { useNavigate } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';

interface AdminProps {
  children: ReactNode; // Define the type for the children prop
}

const Admin: React.FC<AdminProps> = ({ children }) => {
  const { isCollapsed } = useSidebar(); // Use the context
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme(); // Use Material-UI theme

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Adjust to your login route
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh', // Ensure full height
        backgroundColor: theme.palette.background.default,
      }}
      className="bg-gray-100" // Tailwind for background and general styling
      data-testid="admin-container"
    >
      {/* Sidebar with MUI and Tailwind */}
      <Sidebar isCollapsed={isCollapsed} handleLogout={handleLogout} />

      {/* Main Content */}
      <Box
        component="main"
        className="flex-grow p-6 transition-width duration-300 ease-in-out"
        sx={{
          width: {
            xs: `calc(100% - ${isCollapsed ? 60 : 240}px)`, // Adjust width based on collapsed state
            sm: `calc(100% - ${isCollapsed ? 60 : 240}px)`,
          },
          transition: 'width 0.3s ease', // Smooth transition for width change
        }}
        data-testid="admin-main"
      >
        {/* Page Header */}
        <Box
          className="flex items-center justify-between mb-6"
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
          }}
        >
          <h1 className="text-2xl font-bold text-gray-700">Admin Dashboard</h1>
        </Box>

        {/* Main Content Area */}
        <Box className="bg-white rounded-lg shadow p-6">
          {children} {/* Render children content here */}
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
