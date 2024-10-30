import { path } from '@/utils/path';
import Link from 'next/link';

const Hero = () => {
  return (
    <header className="bg-[#064789] text-white py-20">
      {/* Primary color */}
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold">Track Your Fitness Journey</h1>
        <p className="text-lg mt-4">
          Stay on top of your fitness goals with real-time tracking,
          personalized insights, and more.
        </p>
        <Link
          href={path.REGISTER} // Use href instead of to
          className="mt-8 inline-block bg-[#427AA1] py-3 px-8 rounded-full text-lg font-semibold hover:bg-[#679436]"
        >
          Get Started
        </Link>
        {/* Secondary button */}
      </div>
    </header>
  );
};

export default Hero;
