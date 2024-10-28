// src/components/SEO.tsx
import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {/* Add more meta tags as needed */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO;
