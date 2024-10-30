import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import Register from '@/components/Register';

export const metadata: Metadata = {
  title: seo.signup.title,
  description: seo.signup.description,
};

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
