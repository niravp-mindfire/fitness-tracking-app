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

interface ProgressTrackingChartProps {
  data: { date: string; weight: number; bodyFatPercentage: number }[];
}

const ProgressTrackingChart: React.FC<ProgressTrackingChartProps> = ({
  data,
}) => {
  return (
    <div data-testid="progress-tracking-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" data-testid="x-axis" />
          <YAxis data-testid="y-axis" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            data-testid="weight-line"
          />
          <Line
            type="monotone"
            dataKey="bodyFatPercentage"
            stroke="#82ca9d"
            data-testid="body-fat-line"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressTrackingChart;
