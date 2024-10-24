import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart, registerables } from 'chart.js';

// Register all components
Chart.register(...registerables);

const Dashboard = () => {
  // Chart Data (can customize as per your requirements)
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Steps',
        data: [5000, 7000, 8000, 9000, 6000, 12000],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-2 bg-white rounded-lg p-4 shadow-md">
        <Line data={data} />
        <div className="flex justify-between mt-4">
          <div>
            <Typography variant="h6">Total Steps</Typography>
            <Typography variant="body1">9,178 St</Typography>
          </div>
          <div>
            <Typography variant="h6">Total Time</Typography>
            <Typography variant="body1">748 Hr</Typography>
          </div>
        </div>
      </div>

      <Card className="bg-pink-200 col-span-1">
        <CardContent>
          <Typography variant="h6">Daily Jogging</Typography>
          <Typography>Total Time: 748 Hr</Typography>
        </CardContent>
      </Card>

      <Card className="bg-purple-200 col-span-1">
        <CardContent>
          <Typography variant="h6">My Jogging</Typography>
          <Typography>Total Time: 748 Hr</Typography>
        </CardContent>
      </Card>

      <Card className="col-span-1 bg-white shadow-md">
        <CardContent>
          <Typography variant="h6">Bicycle Drill</Typography>
          <Typography>Progress: 45%</Typography>
        </CardContent>
      </Card>

      <Card className="col-span-1 bg-white shadow-md">
        <CardContent>
          <Typography variant="h6">Healthy Busy</Typography>
          <Typography>Progress: 90%</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
