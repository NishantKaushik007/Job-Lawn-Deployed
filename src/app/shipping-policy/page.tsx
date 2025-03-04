import React from 'react';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="relative min-h-screen w-screen bg-[#0a0a0a] overflow-auto text-white">
      {/* Fixed glow effects */}
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#6366f1]/20 rounded-full blur-[128px] animate-glow pointer-events-none" />
      <div className="fixed -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/20 rounded-full blur-[128px] animate-glow-delayed pointer-events-none" />

      <main className="relative container mx-auto px-4 pt-32 pb-8 z-10">
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
        <p className="text-xl">
          As our platform is a digital, SaaS-based job newsletter, we do not ship any physical products.
        </p>
        <p className="text-xl mt-4">
          All of our services, including tailored job openings and updates, are delivered digitally through our online portal.
        </p>
        <p className="text-xl mt-4">
          Our service is offered on a subscription-based model, and each subscription is valid for 30 days.
        </p>
        <p className="text-xl mt-4">
          If you have any questions or concerns about our service delivery, please feel free to contact us at{' '}
          <a href="mailto:support@joblawn.com" className="underline">
            support@joblawn.com
          </a>.
        </p>
      </main>
    </div>
  );
};

export default ShippingPolicy;
