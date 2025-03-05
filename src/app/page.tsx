"use client";

import { CosmosAnimation } from "@/components/CosmosAnimation";
import Link from "next/link";
import { TypingAnimation } from "@/components/magicui/typing-animation";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: "radial-gradient(circle, #1b2735, #090a0f)" }}
    >
      {/* Canvas animation layer */}
      <CosmosAnimation />

      {/* Animated background orbs */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Welcome to{" "}
          <TypingAnimation as="span" className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Job Lawn
          </TypingAnimation>
        </h1>
        <p className="mt-4 text-lg md:text-2xl drop-shadow-md">
          Discover the best job opportunities at top companies.
        </p>
        <Link href="/dashboard">
          <button className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full text-lg font-medium hover:from-green-600 hover:to-blue-700 transition">
            Explore Now
          </button>
        </Link>
      </div>
    </div>
  );
}
