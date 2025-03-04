// components/NavbarConditional.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarConditional() {
  const pathname = usePathname();

  // Render Navbar only if the current path is "/"
  const allowedPaths = [
    '/',
    '/privacy-policy',
    '/term-and-conditions',
    '/contact-us',
    '/about-us',
    '/shipping-policy',
    '/pricing',
    '/cancellation-and-refund'
  ];
  
  if (!allowedPaths.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}
