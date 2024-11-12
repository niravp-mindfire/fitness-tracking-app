import type { Metadata } from 'next';

import { seo } from '@/utils/seo';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('../components/LandingPage/Navbar'));
const Hero = dynamic(() => import('../components/LandingPage/Hero'));
const Features = dynamic(() => import('../components/LandingPage/Features'));
const Pricing = dynamic(() => import('../components/LandingPage/Pricing'));
const Contact = dynamic(() => import('../components/LandingPage/Contact'));
const Footer = dynamic(() => import('../components/LandingPage/Footer'));

export const metadata: Metadata = {
  title: seo.home.title,
  description: seo.home.description,
  keywords: seo.home.keywords.join(','),
  openGraph: seo.home.openGraph,
};

export default function Home() {
  return (
    <div className="bg-[#EBF2FA]">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
