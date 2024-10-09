import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ProgressTrackingChart from "../component/ProgressTrackingChart";
import axiosInstance from "../utils/axiosInstance";
import { apiUrl } from "../utils/apiUrl";

// Define the shape of chart data
interface ChartData {
  date: string; // Adjust to Date if needed
  weight: number;
  bodyFatPercentage: number;
}

const Dashboard = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = async () => {
    try {
      const response = await axiosInstance.get(`${apiUrl.PROGRESS_TRACKINGS}/track/progress`);
      if (response.status === 200) {
        console.log(response.data.data);
        setChartData(response.data.data); // Typescript should now understand the type
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Welcome to the Dashboard</Typography>
      <Box sx={{ padding: 4 }}>
        <ProgressTrackingChart data={chartData} />
      </Box>
    </Box>
  );
};

export default React.memo(Dashboard);
