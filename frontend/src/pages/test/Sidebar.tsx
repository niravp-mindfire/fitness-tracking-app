import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Drawer,
  Typography,
} from '@mui/material';
import {
  Home,
  BarChart,
  Settings,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: open ? 240 : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 64,
          transition: 'width 0.3s ease',
          boxSizing: 'border-box',
          backgroundColor: '#3f51b5', // Change to your preferred background color
        },
      }}
    >
      <div className="flex items-center justify-between p-2">
        <Typography
          variant="h6"
          noWrap
          sx={{ display: open ? 'block' : 'none', color: 'white' }}
        >
          Dashboard
        </Typography>
        <IconButton onClick={handleToggle} sx={{ color: 'white' }}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>
      <List>
        <ListItem component="button">
          <ListItemIcon>
            <Home sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText
            primary={open ? 'Home' : ''}
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItem>
        <ListItem component="button">
          <ListItemIcon>
            <BarChart sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText
            primary={open ? 'Analytics' : ''}
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItem>
        <ListItem component="button">
          <ListItemIcon>
            <Settings sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText
            primary={open ? 'Settings' : ''}
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
