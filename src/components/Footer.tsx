'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname();

  const allowedPaths = [
    '/',
    '/dashboard',
    '/contact-us',
    '/about-us',
    '/pricing',
    '/cancellation-and-refund',
    '/privacy-policy',
    '/shipping-policy',
    '/term-and-conditions'
  ];
  
  if (!allowedPaths.includes(pathname)) {
    return null;
  }

  
  // if (pathname !== '/') return null;

  return (
    <footer className="w-full bg-gray-800 text-white z-50">
      {/* Mobile version: static layout */}
      <div className="block md:hidden p-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-400">
              Privacy Policy
            </Link>
            <Link href="/term-and-conditions" className="hover:text-gray-400">
              Terms & Conditions
            </Link>
            <Link href="/cancellation-and-refund" className="hover:text-gray-400">
              Cancellation & Refund
            </Link>
            <Link href="/shipping-policy" className="hover:text-gray-400">
              Shipping Policy
            </Link>
            <Link href="/pricing" className="hover:text-gray-400">
              Pricing
            </Link>
          </div>
          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="https://linkedin.com/in/your-linkedin"
              className="hover:text-gray-400"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
            <a
              href="https://github.com/NishantKaushik007"
              className="hover:text-gray-400"
              aria-label="GitHub"
            >
              <i className="fab fa-github text-2xl"></i>
            </a>
            <a
              href="https://twitter.com/your-twitter"
              className="hover:text-gray-400"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a
              href="https://instagram.com/your-instagram"
              className="hover:text-gray-400"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a
              href="mailto:your-email@example.com"
              className="hover:text-gray-400"
              aria-label="Email"
            >
              <i className="far fa-envelope text-2xl"></i>
            </a>
          </div>
          {/* Job Lawn text */}
          <div>
            <span className="select-none text-5xl font-bold text-zinc-400">
              Job Lawn
            </span>
          </div>
        </div>
      </div>

      {/* Desktop version: absolute positioning */}
      <div className="hidden md:block fixed bottom-0 left-0 w-full h-24">
        {/* Navigation Links (centered) */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-8 select-none">
          <Link href="/privacy-policy" className="hover:text-gray-400">
            Privacy Policy
          </Link>
          <Link href="/term-and-conditions" className="hover:text-gray-400">
            Terms & Conditions
          </Link>
          <Link href="/cancellation-and-refund" className="hover:text-gray-400">
            Cancellation & Refund
          </Link>
          <Link href="/shipping-policy" className="hover:text-gray-400">
            Shipping Policy
          </Link>
          <Link href="/pricing" className="hover:text-gray-400">
            Pricing
          </Link>
        </div>

        {/* Social Icons (top right) */}
        <div className="absolute top-2 right-8 flex space-x-4">
          <a
            href="https://linkedin.com"
            className="hover:text-gray-400"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin text-2xl"></i>
          </a>
          <a
            href="https://github.com"
            className="hover:text-gray-400"
            aria-label="GitHub"
          >
            <i className="fab fa-github text-2xl"></i>
          </a>
          <a
            href="https://twitter.com"
            className="hover:text-gray-400"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter text-2xl"></i>
          </a>
          <a
            href="https://instagram.com"
            className="hover:text-gray-400"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram text-2xl"></i>
          </a>
          <a
            href="mailto:support@joblawn.com"
            className="hover:text-gray-400"
            aria-label="Email"
          >
            <i className="far fa-envelope text-2xl"></i>
          </a>
        </div>

        {/* Job Lawn text (top left) */}
        <div className="absolute top-2 left-4">
          <span className="select-none text-5xl font-bold text-zinc-400">
            Job Lawn
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
