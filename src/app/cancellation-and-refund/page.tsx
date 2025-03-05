"use client";

import React from "react";
import { CosmosAnimation } from "@/components/CosmosAnimation";

const CancellationAndRefunds: React.FC = () => {

  return (
    <div className="relative min-h-screen w-screen bg-[#0A0118] overflow-hidden text-white">
      {/* Cosmos animation background */}
      <CosmosAnimation />

      {/* Animated gradient orbs */}
      <div className="fixed top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      {/* Content Card */}
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md relative z-10">
        <div className="bg-[#2a2a2a]/50 rounded-2xl backdrop-blur-xl border border-zinc-800 p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Cancellation and Refunds</h1>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-xl">
              Please note that our service operates on a postpaid basis.
            </li>
            <li className="text-xl">
              This means that you will be billed for your previous usage. In order to continue using our service, you must settle the outstanding amount for the previous usage period.
            </li>
            <li className="text-xl">
              We do not offer refunds since payments are accepted only for services that have already been rendered.
            </li>
            <li className="text-xl">
              If you have any questions regarding billing, cancellations, or refunds, please contact us at{" "}
              <a
                href="mailto:support@joblawn.com"
                className="underline hover:text-blue-300 transition-colors duration-300"
              >
                support@joblawn.com
              </a>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CancellationAndRefunds;
