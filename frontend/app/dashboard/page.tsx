import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';
const Dashboard = dynamic(() => import('../../components/admin/Dashboard'));
const AdminLayout = dynamic(() => import('../../layouts/AdminLayout'));

export const metadata: Metadata = {
  title: seo.dashboard.title,
  description: seo.dashboard.description,
  keywords: seo.home.keywords.join(','),
  openGraph: seo.home.openGraph,
};

const DashboardPage = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default DashboardPage;
