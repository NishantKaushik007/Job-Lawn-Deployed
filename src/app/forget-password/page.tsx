"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CosmosAnimation } from "@/components/CosmosAnimation";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  // Keep OTP as an array of 6 digits for consistency.
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // State to detect if device is mobile (viewport width < 640px)
  const [isMobile, setIsMobile] = useState(false);

  // --- Added for Toggle Password Visibility ---
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forget-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setOtpSent(true);
    } else {
      setError(data.error || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forget-password/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Join the otp array to form the OTP string
      body: JSON.stringify({ email, otp: otp.join(""), newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/login");
    } else {
      if (
        data.error === "OTP expired. Please request a new one." ||
        data.error === "Too many attempts. Please request a new OTP."
      ) {
        setOtpSent(false);
        setEmail("");
        window.location.reload();
      }
      setError(data.error || "Invalid OTP or password reset failed.");
    }
  };

  useEffect(() => {
    if (
      error &&
      (error.includes("OTP expired") || error.includes("Too many attempts"))
    ) {
      window.location.reload();
    }
  }, [error]);

  // For non-mobile: Handle OTP input change for each separate input box
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.target.value;

    if (value.length > 1) {
      if (/^\d+$/.test(value)) {
        const digits = value.split("").slice(0, 6);
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (index + i < 6) {
            newOtp[index + i] = digit;
          }
        });
        setOtp(newOtp);
        const nextIndex = index + digits.length;
        if (nextIndex < 6) {
          document.getElementById(`otp-input-${nextIndex}`)?.focus();
        }
      }
      return;
    }

    if (value === "" || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  // For non-mobile: Handle paste event for multi-inputs
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteDigits = pasteData.split("");
      setOtp(pasteDigits);
      document.getElementById("otp-input-5")?.focus();
    }
  };

  // For non-mobile: Arrow key navigation between OTP inputs
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      e.preventDefault();
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  // For mobile: Handle OTP change in the single input field
  const handleMobileOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only allow up to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      // Update the OTP state as an array (pad missing digits with empty strings)
      const digits = value.split("");
      while (digits.length < 6) {
        digits.push("");
      }
      setOtp(digits);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Cosmos animation background */}
      <CosmosAnimation />
      
      {/* Gradient orbs with pulse animation */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-sm sm:max-w-md p-8 bg-[#2a2a2a]/50 rounded-2xl backdrop-blur-xl border border-zinc-800 relative z-10 select-none">
        <h1 className="text-2xl font-semibold text-white text-center mb-8">
          Forget Password
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full h-12 px-4 py-2 rounded-md bg-[#2a2a2a]/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#f59e0b] text-white hover:to-[#f59e0b] relative overflow-hidden h-12"
            >
              <span className="relative z-10">
                {loading ? "Sending OTP..." : "Request OTP"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/50 to-[#f59e0b]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {isMobile ? (
              // Single input for mobile devices
              <div>
                <label
                  htmlFor="otp-mobile"
                  className="text-sm text-zinc-400 mb-1 block"
                >
                  Enter OTP
                </label>
                <input
                  id="otp-mobile"
                  type="text"
                  value={otp.join("")}
                  onChange={handleMobileOtpChange}
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="w-full h-12 text-center text-white bg-[#2a2a2a] border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              // Multiple inputs for larger devices
              <div className="flex justify-center flex-wrap gap-1 sm:gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onPaste={handleOtpPaste}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    maxLength={1}
                    placeholder="-"
                    className="min-w-[32px] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-center text-white bg-[#2a2a2a] border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            )}

            <div className="space-y-2 mt-6 relative">
              <label htmlFor="newPassword" className="text-sm text-zinc-400">
                New Password
              </label>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                required
                className="w-full h-12 px-4 py-2 pr-12 rounded-md bg-[#2a2a2a]/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.524-4.24M4.465 4.465l15.07 15.07"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.88 9.88A3 3 0 0114.12 14.12"
                    />
                  </svg>
                )}
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#f59e0b] text-white hover:to-[#f59e0b] relative overflow-hidden h-12 mt-6"
            >
              <span className="relative z-10">
                {loading ? "Verifying..." : "Reset Password"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/50 to-[#f59e0b]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
