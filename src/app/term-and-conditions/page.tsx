import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="relative min-h-screen w-screen bg-[#0A0118] overflow-auto text-white">
      {/* Gradient orbs with pulse animation using fixed positioning */}
      <div className="fixed top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed -bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      <main className="relative container mx-auto px-4 pt-32 md:pt-64 pb-8 z-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Terms and Conditions</h1>
        <ol className="list-decimal ml-4 md:ml-6 space-y-6 text-lg md:text-xl">
          <li>
            <h2 className="text-lg md:text-xl font-semibold mb-2">Acceptance of Terms</h2>
            <p>
              By accessing and using our services, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our services.
            </p>
          </li>
          <li>
            <h2 className="text-lg md:text-xl font-semibold mb-2">Modification of Terms</h2>
            <p>
              We reserve the right to change or modify these Terms and Conditions at any time. Any changes will be posted on this page, and your continued use of the services constitutes your acceptance of the revised terms.
            </p>
          </li>
          <li>
            <h2 className="text-lg md:text-xl font-semibold mb-2">Use of Services</h2>
            <p>
              You agree to use our services only for lawful purposes and in accordance with these Terms and Conditions. You must not use our services in any way that could damage, disable, or impair our systems or interfere with other users.
            </p>
          </li>
          <li>
            <h2 className="text-lg md:text-xl font-semibold mb-2">Intellectual Property</h2>
            <p>
              All content and materials provided on our platform, including text, graphics, logos, and images, are the property of our company or its licensors. Unauthorized use or reproduction is prohibited.
            </p>
          </li>
          <li>
            <h2 className="text-lg md:text-xl font-semibold mb-2">User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.
            </p>
          </li>
          <li>
            <h2 className="text-lg md:text-xl font-semibold mb-2">Limitation of Liability</h2>
            <p>
              In no event shall our company be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services.
            </p>
          </li>
          <li>
            <h2 className="text-lg md:text-xl font-semibold mb-2">Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which our company operates, without regard to its conflict of law provisions.
            </p>
          </li>
          <li>
            <h2 className="text-lg md:text-xl font-semibold mb-2">Contact Us</h2>
            <p>
              If you have any questions or concerns about these Terms and Conditions, please contact us at{' '}
              <a href="mailto:support@joblawn.com" className="underline">
                support@joblawn.com
              </a>.
            </p>
          </li>
        </ol>
      </main>
    </div>
  );
};

export default TermsAndConditions;
