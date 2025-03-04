import React from 'react';

const CancellationAndRefunds: React.FC = () => {
  return (
    <div className="relative min-h-screen w-screen bg-[#0a0a0a] overflow-auto text-white">
      {/* Fixed glow effects */}
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#6366f1]/20 rounded-full blur-[128px] animate-glow pointer-events-none" />
      <div className="fixed -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/20 rounded-full blur-[128px] animate-glow-delayed pointer-events-none" />

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
