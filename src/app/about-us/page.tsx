"use client";

import React from "react";
import { CosmosAnimation } from "@/components/CosmosAnimation";

const AboutUs: React.FC = () => {

  return (
    <div className="relative min-h-screen w-screen bg-[#0A0118] overflow-hidden text-white">
      {/* Cosmos animation background */}
      <CosmosAnimation />

      {/* Animated gradient orbs */}
      <div className="fixed top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed -bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      {/* Content Card */}
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md relative z-10">
        <div className="bg-[#2a2a2a]/50 rounded-2xl backdrop-blur-xl border border-zinc-800 p-8">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-zinc-300">
            About Us
          </h2>
          <p className="mb-4 text-lg text-gray-300">
            Welcome to Job Lawn, your trusted partner in job discovery and career growth.
          </p>
          <p className="mb-4 text-lg text-gray-300">
            At Job Lawn, we provide a SaaS-based platform that delivers tailored job openings directly to you via our portal.
            Our digital newsletter is designed to match your unique career needs and aspirations, ensuring you never
            miss the perfect opportunity.
          </p>
          <p className="mb-4 text-lg text-gray-300">
            Our mission is to simplify the job search process by offering personalized job recommendations based on
            your skills, preferences, and career goals. We believe that every job seeker deserves a streamlined and
            efficient way to access the best career opportunities, we focus on delivering quality content without handling any
            physical shipments.
          </p>
          
          <p className="text-lg text-gray-300 text-center">
            For any questions or support, please feel free to contact us at{" "}
            <a
              href="mailto:support@joblawn.com"
              className="underline hover:text-blue-300 transition-colors duration-300"
            >
              support@joblawn.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
