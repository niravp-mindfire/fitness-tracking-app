import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ProgressTrackingChart from '../components/ProgressTrackingChart';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../utils/apiUrl';
import Admin from './Admin';
import SEO from '../components/SEO';
import { seo } from '../utils/seo';

// Define the shape of chart data
interface ChartData {
  date: string; // Adjust to Date if needed
  weight: number;
  bodyFatPercentage: number;
}

const Dashboard = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = async () => {
    try {
      const response = await axiosInstance.get(
        `${apiUrl.PROGRESS_TRACKINGS}/track/progress`,
      );
      if (response.status === 200) {
        setLoading(true);
        setChartData(response.data.data); // Typescript should now understand the type
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  return (
    <>
      <SEO
        title={seo?.dashboard?.title}
        description={seo?.dashboard?.description}
        keywords={seo?.dashboard?.keywords?.join(',')}
      />
      <Admin>
        <Box sx={{ padding: 4 }} data-testid="dashboard">
          <Box
            sx={{
              padding: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              boxShadow: 2,
            }}
            data-testid="chart-container"
          >
            {loading && <ProgressTrackingChart data={chartData} />}
          </Box>
        </Box>
      </Admin>
    </>
  );
};

export default React.memo(Dashboard);
