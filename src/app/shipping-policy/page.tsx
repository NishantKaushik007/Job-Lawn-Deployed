import React from 'react';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="relative min-h-screen w-screen bg-[#0A0118] overflow-auto text-white">
      {/* Gradient orbs with pulse animation */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

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
