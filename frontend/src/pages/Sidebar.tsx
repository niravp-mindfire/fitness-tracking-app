// src/pages/admin/Sidebar.tsx

import React, { useEffect, useState } from 'react';
import { useMediaQuery, Theme } from '@mui/material';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Home,
  Settings,
  ExitToApp,
  FitnessCenter,
  Fitbit,
  AllInclusive,
  NextPlan,
  FoodBank,
  EmojiEvents,
  Menu,
  ChevronLeft,
  MenuBook,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { path } from '../utils/path';

const expandedWidth = 240; // Width when sidebar is expanded
const collapsedWidth = 60; // Width when sidebar is collapsed

// Update SidebarProps to include isCollapsed
interface SidebarProps {
  handleLogout: () => void;
  isCollapsed: boolean; // Add this line
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout, isCollapsed }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isCollapsed); // Maintain local state

  const location = useLocation(); // Get current location
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  useEffect(() => {
    setIsSidebarCollapsed(isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: path.DASHBOARD },
    { text: 'Workout', icon: <Fitbit />, path: path.WORKOUT },
    { text: 'Exercise', icon: <FitnessCenter />, path: path.EXERCISE },
    {
      text: 'Workout Exercise',
      icon: <AllInclusive />,
      path: path.WORKOUT_EXERCISE,
    },
    { text: 'Workout Plan', icon: <NextPlan />, path: path.WORKOUT_PLAN },
    { text: 'Challenges', icon: <EmojiEvents />, path: path.CHALLENGE },
    { text: 'Food Items', icon: <FoodBank />, path: path.FOOD_ITEM },
    { text: 'Meal Plans', icon: <MenuBook />, path: path.MEAL_PLAN },
    { text: 'Nutritions', icon: <MenuBook />, path: path.NUTRITION },
    { text: 'Nutrition Meals', icon: <MenuBook />, path: path.NUTRITION_MEAL },
    {
      text: 'Progress Tracking',
      icon: <MenuBook />,
      path: path.PROGRESS_TRACKINGS,
    },
    { text: 'My Profile', icon: <Settings />, path: path.MY_PROFILE },
    { text: 'Logout', icon: <ExitToApp />, action: handleLogout },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isSidebarCollapsed ? collapsedWidth : expandedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isSidebarCollapsed ? collapsedWidth : expandedWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s', // Smooth transition for width changes
        },
      }}
    >
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
        }}
      >
        {!isSidebarCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' }, // Adjust font size based on screen size
              padding: { xs: 1, sm: 2 }, // Adjust padding
            }}
          >
            Admin Panel
          </Typography>
        )}
        <IconButton onClick={toggleSidebar} data-testid="sidebar-toggle-btn">
          {isSidebarCollapsed ? <Menu /> : <ChevronLeft />}
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={item.action ? 'button' : Link}
            to={item.path}
            onClick={item.action}
            selected={location.pathname === item.path} // Highlight selected item
            sx={{
              width: '100%',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              backgroundColor:
                location.pathname === item.path ? '#f0f0f0' : 'transparent', // Change background on selection
              '&:hover': {
                backgroundColor:
                  location.pathname === item.path ? '#e0e0e0' : '#f0f0f0', // Add hover effect
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isSidebarCollapsed ? 'auto' : 2,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isSidebarCollapsed && <ListItemText primary={item.text} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
