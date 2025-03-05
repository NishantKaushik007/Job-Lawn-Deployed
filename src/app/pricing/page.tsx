"use client"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import Image from "next/image";

export default function PremiumCard() {
  return (
    <div className="min-h-screen w-full bg-[#0A0118] relative overflow-hidden">
      {/* Gradient orbs with pulse animation */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-sm rounded-3xl bg-black border border-amber-500/30 p-6 overflow-hidden animate-fade-in">
          {/* Optional inner decorative effects */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"></div>

          {/* Most popular tag */}
          <div className="absolute top-4 right-4">
            <span className="text-xs font-medium text-amber-500 bg-amber-950/60 px-2 py-1 rounded-md">OUR PLAN</span>
          </div>

          <div className="flex items-start gap-4 mb-6">
            {/* Logo circle */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black border border-amber-500/30">
              <span className="text-amber-500 text-lg">
                <Link href="/" className="flex-shrink-0 cursor-pointer">
                  <Image src="/logo.svg" alt="Logo" width={62} height={15} />
                </Link>
              </span>
            </div>

            <div className="flex-1">
              {/* Title with underline */}
              <h3 className="text-amber-500 text-xl font-medium relative inline-block">
                Pricing
                <span className="absolute bottom-0 left-0 w-full h-px bg-amber-500/30"></span>
              </h3>

              {/* Price */}
              <div className="flex items-baseline mt-1">
                <span className="text-white text-4xl font-bold">₹49</span>
                <span className="text-gray-400 text-sm ml-1">/month</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-6">
            Enjoy unlimited access to tailored job openings and career opportunities with our subscription service.
          </p>

          {/* Features list */}
          <ul className="space-y-3 mb-8">
            {[
              "Pay After Using 30 Days",
              "Access To Newly Added Compaines",
              "Unlimited Job Searching",
              "Customized Filters",
              "24/7 Availablity"
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-amber-500" />
                </div>
                <span className="text-white text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Button */}
          <Button
            onClick={() => window.location.href = "/register"}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-xl py-6"
          >
            Register Now!
          </Button>
        </div>
      </div>
    </div>
  )
}
