"use client";

import { CosmosAnimation } from "@/components/CosmosAnimation";

const PrivacyPolicy: React.FC = () => {

  return (
    <div className="relative min-h-screen w-screen bg-[#0A0118] overflow-hidden text-white">
      {/* Cosmos animation background */}
      <CosmosAnimation />

      {/* Animated gradient orbs */}
      <div className="fixed top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      {/* Content Card */}
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md relative z-10 select-none">
        <div className="bg-[#2a2a2a]/50 rounded-2xl backdrop-blur-xl border border-zinc-800 p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <ol className="list-decimal ml-6 space-y-6 marker:text-xl">
            <li>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <p className="text-xl">
                We collect personal information such as name, email, contact details, and payment information when you use our services.
              </p>
            </li>
            <li>
              <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
              <ul className="list-disc ml-6 space-y-1 text-xl">
                <li>To process transactions (including Razorpay payments)</li>
                <li>To improve our services and user experience</li>
                <li>To communicate updates and promotional offers</li>
              </ul>
            </li>
            <li>
              <h2 className="text-xl font-semibold mb-2">Data Sharing and Security</h2>
              <p className="text-xl">
                We do not sell your data. However, we may share it with trusted third-party partners like Razorpay for payment processing. We implement security measures to protect your data.
              </p>
            </li>
            <li>
              <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
              <p className="text-xl">
                You have the right to access, modify, or delete your personal data. Contact us at{" "}
                <a
                  href="mailto:support@joblawn.com"
                  className="underline hover:text-blue-300 transition-colors duration-300"
                >
                  support@joblawn.com
                </a>{" "}
                for requests.
              </p>
            </li>
            <li>
              <h2 className="text-xl font-semibold mb-2">Updates to Privacy Policy</h2>
              <p className="text-xl">
                We may update our policy from time to time. Continued use of our services implies agreement with the changes.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
