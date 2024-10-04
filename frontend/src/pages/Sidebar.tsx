import React, { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import { Home, Settings, ExitToApp, FitnessCenter, Fitbit, AllInclusive, NextPlan, FoodBank, EmojiEvents, Menu, ChevronLeft, MenuBook } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { path } from '../utils/path';

const expandedWidth = 240; // Width when sidebar is expanded
const collapsedWidth = 60;  // Width when sidebar is collapsed

interface SidebarProps {
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // Get current location

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: path.DASHBOARD },
    { text: 'Workout', icon: <Fitbit />, path: path.WORKOUT },
    { text: 'Exercise', icon: <FitnessCenter />, path: path.EXERCISE },
    { text: 'Workout Exercise', icon: <AllInclusive />, path: path.WORKOUT_EXERCISE },
    { text: 'Workout Plan', icon: <NextPlan />, path: path.WORKOUT_PLAN },
    { text: 'Challenges', icon: <EmojiEvents />, path: path.CHALLENGE },
    { text: 'Food Items', icon: <FoodBank />, path: path.FOOD_ITEM },
    { text: 'Meal Plans', icon: <MenuBook />, path: path.MEAL_PLAN },
    { text: 'My Profile', icon: <Settings />, path: path.MY_PROFILE },
    { text: 'Logout', icon: <ExitToApp />, action: handleLogout },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? collapsedWidth : expandedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? collapsedWidth : expandedWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s', // Smooth transition for width changes
        },
      }}
    >
      <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
        {!isCollapsed && (
          <Typography variant="h6" component="div">
            Admin Panel
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          {isCollapsed ? <Menu /> : <ChevronLeft />}
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
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              backgroundColor: location.pathname === item.path ? '#f0f0f0' : 'transparent', // Change background on selection
              '&:hover': {
                backgroundColor: location.pathname === item.path ? '#e0e0e0' : '#f0f0f0', // Add hover effect
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 'auto' : 2,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={item.text} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
