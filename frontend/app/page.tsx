import type { Metadata } from 'next';

import { seo } from '@/utils/seo';
import Navbar from '@/components/LandingPage/Navbar';
import Hero from '@/components/LandingPage/Hero';
import Features from '@/components/LandingPage/Features';
import Pricing from '@/components/LandingPage/Pricing';
import Contact from '@/components/LandingPage/Contact';
import Footer from '@/components/LandingPage/Footer';

export const metadata: Metadata = {
  title: seo.home.title,
  description: seo.home.description,
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
