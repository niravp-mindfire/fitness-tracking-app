import React, { ReactNode } from 'react';
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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Adjust to your login route
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar handleLogout={handleLogout} />
      <main style={{ flexGrow: 1, padding: 3 }}>
        {children}
      </main>
    </div>
  );
};

export default Admin;
