import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Welcome to the Dashboard</Typography>
    </Box>
  );
};

export default React.memo(Dashboard);
