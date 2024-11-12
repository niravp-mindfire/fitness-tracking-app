import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';
const Login = dynamic(() => import('../../components/Login'));

export const metadata: Metadata = {
  title: seo.login.title,
  description: seo.login.description,
  keywords: seo.home.keywords.join(','),
  openGraph: seo.home.openGraph,
};

const RegisterPage = () => {
  return <Login />;
};

export default RegisterPage;
