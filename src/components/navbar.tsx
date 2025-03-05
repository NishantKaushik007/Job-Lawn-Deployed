"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About Us", path: "/about-us" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  return (
    <nav className="relative bg-[#0A0118] overflow-hidden">
      {/* Animated orb background */}
      <div className="fixed top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed -bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Nav Links */}
          <div className="flex items-center space-x-6 select-none">
            <Link href="/" className="flex-shrink-0 cursor-pointer">
              <Image src="/logo.svg" alt="Logo" width={62} height={15} />
            </Link>
            <ul className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.name} className="relative group">
                  <Link
                    href={link.path}
                    className="block py-3 text-white hover:text-zinc-500 transition-all duration-200 select-none"
                  >
                    {link.name}
                  </Link>
                  <div className="absolute rounded-lg bottom-0 w-full h-1 bg-gradient-to-r from-[#00b5ad] via-[#1e40af] to-[#6b21a8] hidden group-hover:block transition-all duration-200"></div>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4 select-none">
            <button
              onClick={() => router.push("/login")}
              className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-base px-5 py-2.5"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/register")}
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-base px-5 py-2.5"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="relative z-10 md:hidden px-2 pt-2 pb-3 space-y-2 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-zinc-500 transition"
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-3 space-y-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/login");
              }}
              className="block w-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-base px-3 py-2 text-center"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/register");
              }}
              className="block w-full text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-base px-3 py-2 text-center"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
