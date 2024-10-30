import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';

export const metadata: Metadata = {
  title: seo.dashboard.title,
  description: seo.dashboard.description,
};

const DashboardPage = () => {
  return <h1>Dashboard</h1>;
};

export default DashboardPage;
