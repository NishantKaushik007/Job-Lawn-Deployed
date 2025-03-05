"use client";

import React, { useState } from "react";
import { CosmosAnimation } from "@/components/CosmosAnimation";

const ContactUs: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });

      if (res.ok) {
        setStatus("Your message has been sent.");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("Something went wrong, please try again.");
      }
    } catch (error) {
      setStatus("An error occurred, please try again later.");
    }
  };

  return (
    <section className="relative min-h-screen w-screen bg-[#0A0118] overflow-auto text-zinc-300">
      {/* Canvas animation background */}
      <CosmosAnimation />

      {/* Animated orb background */}
      <div className="fixed top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md relative z-10">
        {/* Transparent, blurred card */}
        <div className="bg-[#2a2a2a]/50 rounded-2xl backdrop-blur-xl border border-zinc-800 p-8 select-none">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-zinc-300">
            Contact Us
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-300 sm:text-xl">
            Got a technical issue? Want to send feedback about a feature? Need details about our future plans? Let us know.
          </p>
          {status && <p className="mb-4 text-center text-lg">{status}</p>}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-zinc-400">
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full h-12 px-4 rounded-md bg-[#2a2a2a]/50 border border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-zinc-400">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Let us know how we can help you"
                required
                className="w-full h-12 px-4 rounded-md bg-[#2a2a2a]/50 border border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-zinc-400">
                Your message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a comment..."
                required
                className="w-full px-4 py-2 rounded-md bg-[#2a2a2a]/50 border border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-md text-zinc-300 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
