import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { seo } from '../utils/seo';

function LandingPage() {
  return (
    <>
      <SEO
        title={seo?.home?.title}
        description={seo?.home?.description}
        keywords={seo?.home?.keywords?.join(',')}
      />
      <div className="bg-[#EBF2FA]">
        <Navbar />
        <Hero />
        <Features />
        <Pricing />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
export default LandingPage;
