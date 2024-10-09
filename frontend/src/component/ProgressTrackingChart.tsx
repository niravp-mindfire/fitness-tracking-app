import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ProgressData {
  date: string;
  weight: number;
  bodyFatPercentage: number;
}

interface ProgressTrackingChartProps {
  data: ProgressData[];
}

const ProgressTrackingChart: React.FC<ProgressTrackingChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
        <Line type="monotone" dataKey="bodyFatPercentage" stroke="#82ca9d" name="Body Fat (%)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressTrackingChart;
