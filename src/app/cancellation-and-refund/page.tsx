import React from 'react';

const CancellationAndRefunds: React.FC = () => {
  return (
    <div className="relative min-h-screen w-screen bg-[#0A0118] overflow-auto text-white">
      {/* Gradient orbs with pulse animation */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      <main className="relative container mx-auto px-4 pt-32 pb-8 z-10">
        <h1 className="text-3xl font-bold mb-6">Cancellation and Refunds</h1>
        <p className="text-xl mb-4">
          Please note that our service operates on a postpaid basis.
        </p>
        <p className="text-xl mb-4">
          This means that you will be billed for your previous usage. In order to continue using our service, you must settle the outstanding amount for the previous usage period.
        </p>
        <p className="text-xl mb-4">
          We do not offer refunds since payments are accepted only for services that have already been rendered. If you choose to cancel your subscription, please ensure that all previous charges have been paid in full.
        </p>
        <p className="text-xl">
          If you have any questions regarding billing, cancellations, or refunds, please contact us at{' '}
          <a href="mailto:support@joblawn.com" className="underline">
            support@joblawn.com
          </a>.
        </p>
      </main>
    </div>
  );
};

export default CancellationAndRefunds;
