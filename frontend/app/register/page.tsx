import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';
const Register = dynamic(() => import('../../components/Register'));

export const metadata: Metadata = {
  title: seo.signup.title,
  description: seo.signup.description,
  keywords: seo.home.keywords.join(','),
  openGraph: seo.home.openGraph,
};

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
