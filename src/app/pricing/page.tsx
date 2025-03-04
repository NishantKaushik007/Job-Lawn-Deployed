import React from 'react';

const Pricing: React.FC = () => {
  return (
    <div className="relative min-h-screen w-screen bg-[#0a0a0a] overflow-auto text-white">
      {/* Fixed glow effects */}
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#6366f1]/20 rounded-full blur-[128px] animate-glow pointer-events-none" />
      <div className="fixed -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/20 rounded-full blur-[128px] animate-glow-delayed pointer-events-none" />

      <main className="relative container mx-auto px-4 pt-32 md:pt-48 pb-8 z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Pricing</h1>
        <p className="text-lg md:text-xl mb-4">
          Enjoy unlimited access to tailored job openings and career opportunities with our subscription service.
        </p>
        <div className="bg-gray-800 rounded-lg p-6 my-4 text-center">
          <p className="text-2xl md:text-3xl font-bold">49 INR</p>
          <p className="text-lg md:text-xl">per month (30 days validity)</p>
        </div>
        <p className="text-lg md:text-xl mb-4">
          Subscribe now to get the best job recommendations directly delivered to you.
        </p>
      </main>
    </div>
  );
};

export default Pricing;
