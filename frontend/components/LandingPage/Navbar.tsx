'use client';
import { useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import { redirect } from 'next/navigation';
import { path } from '@/utils/path';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the menu for mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#064789] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1
              className="text-2xl font-semibold cursor-pointer"
              onClick={() => redirect(path.HOME)} // Use router.push for navigation
            >
              Fitzo App
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="#features" className="hover:text-[#A5BE00]">
                Features
              </Link>
              <Link href="#pricing" className="hover:text-[#A5BE00]">
                Pricing
              </Link>
              <Link href="#contact" className="hover:text-[#A5BE00]">
                Contact
              </Link>
              <button
                className="bg-[#427AA1] py-2 px-4 rounded hover:bg-[#679436]"
                onClick={() => redirect(path.LOGIN)} // Use router.push for navigation
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-[#427AA1] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-[#427AA1]`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="#features"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#679436]"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#679436]"
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#679436]"
          >
            Contact
          </Link>
          <button
            className="block w-full text-left px-3 py-2 rounded-md bg-[#679436] hover:bg-[#427AA1]"
            onClick={() => redirect(path.LOGIN)} // Use router.push for navigation
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
