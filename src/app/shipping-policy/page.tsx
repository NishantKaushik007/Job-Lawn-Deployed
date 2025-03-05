"use client";

import { CosmosAnimation } from "@/components/CosmosAnimation";

const ShippingPolicy: React.FC = () => {
  
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
          <h1 className="text-3xl font-bold mb-6 text-center">Shipping Policy</h1>
          <ul className="list-disc text-xl text-gray-300 space-y-2 ml-6">
            <li>
              As our platform is a digital, SaaS-based job newsletter, we do not ship any physical products.
            </li>
            <li>
              All services, including tailored job openings and updates, are delivered digitally through our online portal.
            </li>
            <li>
              Our service is offered on a subscription-based model, with each subscription valid for 30 days.
            </li>
            <li>
              If you have any questions or concerns, please contact us at{" "}
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

export default ShippingPolicy;
