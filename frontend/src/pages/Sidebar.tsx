import React from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Home, Settings, ExitToApp, FitnessCenter, Fitbit, AllInclusive, NextPlan, FoodBank, EmojiEvents } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { path } from '../utils/path';

const sidebarWidth = 240;

interface SidebarProps {
  handleLogout: () => void; // Define the type for the handleLogout prop
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: path.DASHBOARD },
    { text: 'Workout', icon: <Fitbit />, path: path.WORKOUT },
    { text: 'Exercise', icon: <FitnessCenter />, path: path.EXERCISE },
    { text: 'Workout Exercise', icon: <AllInclusive />, path: path.WORKOUT_EXERCISE },
    { text: 'Workout Plan', icon: <NextPlan />, path: path.WORKOUT_PLAN },
    { text: 'Challenges', icon: <EmojiEvents />, path: path.CHALLENGE },
    { text: 'Food Items', icon: <FoodBank />, path: path.FOOD_ITEM },
    { text: 'My Profile', icon: <Settings />, path: path.MY_PROFILE },
    { text: 'Logout', icon: <ExitToApp />, action: handleLogout },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" component="div">
          Admin Panel
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={item.action ? 'button' : Link} // Use 'button' if action is defined
            to={item.path} // Use 'to' only if path is defined
            onClick={item.action} // Call action if defined
            sx={{ width: '100%' }} // Ensure the button takes full width
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
