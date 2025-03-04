import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="relative min-h-screen w-screen bg-[#0a0a0a] overflow-auto text-white">
      {/* Fixed glow effects */}
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#6366f1]/20 rounded-full blur-[128px] animate-glow pointer-events-none" />
      <div className="fixed -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/20 rounded-full blur-[128px] animate-glow-delayed pointer-events-none" />

      <main className="relative container mx-auto px-4 pt-32 md:pt-0 pb-8 z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg md:text-xl mb-4">
          Welcome to Job Lawn, your trusted partner in job discovery and career growth.
        </p>
        <p className="text-lg md:text-xl mb-4">
          At Job Lawn, we provide a SaaS-based platform that delivers tailored job openings directly to your inbox.
          Our digital newsletter is designed to match your unique career needs and aspirations, ensuring you never
          miss the perfect opportunity.
        </p>
        <p className="text-lg md:text-xl mb-4">
          Our mission is to simplify the job search process by offering personalized job recommendations based on
          your skills, preferences, and career goals. We believe that every job seeker deserves a streamlined and
          efficient way to access the best career opportunities.
        </p>
        <p className="text-lg md:text-xl mb-4">
          Our service is subscription-based with a 30-day validity period, ensuring continuous access to the latest
          job openings. As a postpaid digital service, we focus on delivering quality content without handling any
          physical shipments.
        </p>
        <p className="text-lg md:text-xl">
          For any questions or support, please feel free to contact us at{' '}
          <a href="mailto:support@joblawn.com" className="underline">
            support@joblawn.com
          </a>.
        </p>
      </main>
    </div>
  );
};

export default AboutUs;
