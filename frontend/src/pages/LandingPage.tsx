import Navbar from '../component/Navbar';
import Hero from '../component/Hero';
import Features from '../component/Features';
import Pricing from '../component/Pricing';
import Contact from '../component/Contact';
import Footer from '../component/Footer';

function LandingPage() {
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

export default LandingPage;
