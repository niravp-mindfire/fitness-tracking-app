import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';
const AdminLayout = dynamic(() => import('../../../layouts/AdminLayout'));
const WorkoutList = dynamic(
  () => import('../../../components/admin/WorkoutList'),
);

export const metadata: Metadata = {
  title: seo.workout.title,
  description: seo.workout.description,
  keywords: seo.workout.keywords.join(','),
  openGraph: seo.workout.openGraph,
};

const WorkoutPage = () => {
  return (
    <AdminLayout>
      <WorkoutList />
    </AdminLayout>
  );
};

export default WorkoutPage;
