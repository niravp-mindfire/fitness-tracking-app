import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';

const AdminLayout = dynamic(() => import('../../../layouts/AdminLayout'));
const WorkoutPlanList = dynamic(
  () => import('../../../components/admin/WorkoutPlanList'),
);

export const metadata: Metadata = {
  title: seo.workoutPlan.title,
  description: seo.workoutPlan.description,
  keywords: seo.workoutPlan.keywords.join(','),
  openGraph: seo.workoutPlan.openGraph,
};

const WorkoutExercisePage = () => {
  return (
    <AdminLayout>
      <WorkoutPlanList />
    </AdminLayout>
  );
};

export default WorkoutExercisePage;
