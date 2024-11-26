import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';
const ForgetPassword = dynamic(() => import('../../components/ForgetPassword'));

export const metadata: Metadata = {
  title: seo.forgotPassword.title,
  description: seo.forgotPassword.description,
  keywords: seo.forgotPassword.keywords.join(','),
  openGraph: seo.forgotPassword.openGraph,
};

const RegisterPage = () => {
  return <ForgetPassword />;
};

export default RegisterPage;
