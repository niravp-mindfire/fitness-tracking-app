import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';

const AdminLayout = dynamic(() => import('../../../layouts/AdminLayout'));
const ExercisesList = dynamic(
  () => import('../../../components/admin/ExerciseList'),
);

export const metadata: Metadata = {
  title: seo.exercise.title,
  description: seo.exercise.description,
  keywords: seo.exercise.keywords.join(','),
  openGraph: seo.exercise.openGraph,
};

const WorkoutPage = () => {
  return (
    <AdminLayout>
      <ExercisesList />
    </AdminLayout>
  );
};

export default WorkoutPage;
