import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';

const AdminLayout = dynamic(() => import('../../../layouts/AdminLayout'));
const WorkoutExercise = dynamic(
  () => import('../../../components/admin/WorkoutExercise'),
);

export const metadata: Metadata = {
  title: seo.workoutExercise.title,
  description: seo.workoutExercise.description,
  keywords: seo.workoutExercise.keywords.join(','),
  openGraph: seo.workoutExercise.openGraph,
};

const WorkoutExercisePage = () => {
  return (
    <AdminLayout>
      <WorkoutExercise />
    </AdminLayout>
  );
};

export default WorkoutExercisePage;
