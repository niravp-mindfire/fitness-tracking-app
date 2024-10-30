import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import Login from '@/components/Login';

export const metadata: Metadata = {
  title: seo.login.title,
  description: seo.login.description,
};

const RegisterPage = () => {
  return <Login />;
};

export default RegisterPage;
