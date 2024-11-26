import { Metadata } from 'next/types';
import { seo } from '@/utils/seo';
import ResetPassword from '@/components/ResetPassword';
import { useSearchParams } from 'next/navigation';

export const metadata: Metadata = {
  title: seo.login.title,
  description: seo.login.description,
  keywords: seo.home.keywords.join(','),
  openGraph: seo.home.openGraph,
};
interface Props {
  params: { token: string };
}

const RegisterPage = ({ params }: Props) => {
  const { token } = params;

  return <ResetPassword token={token} />;
};

export default RegisterPage;
