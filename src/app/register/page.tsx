"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CosmosAnimation } from "@/components/CosmosAnimation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    mobile: "",
    countryCode: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-[#0A0118] overflow-hidden">
      {/* Cosmos animation background */}
      <CosmosAnimation />

      {/* Gradient orbs with pulse animation */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Centering container */}
      <div className="relative z-10 flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-md p-6 sm:p-8 md:p-10 bg-[#2a2a2a]/50 rounded-2xl backdrop-blur-xl border border-zinc-800">
          {/* Logo */}
          <div className="w-16 h-16 mb-8 mx-auto">
            <Link href="/">
              <img 
                src="/logo.svg" 
                alt="Job Lawn" 
                className="w-full h-full" 
              />
            </Link>
          </div>

          <h1 className="text-2xl font-semibold text-white text-center mb-8">
            Register
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-zinc-400">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-md bg-[#2a2a2a]/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-md bg-[#2a2a2a]/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="space-y-2 relative">
              <label htmlFor="password" className="text-sm text-zinc-400">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 pr-12 rounded-md bg-[#2a2a2a]/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-10 cursor-pointer"
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

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="sm:w-1/3">
                <label htmlFor="countryCode" className="text-sm text-zinc-400">
                  Country Code
                </label>
                <input
                  id="countryCode"
                  type="text"
                  name="countryCode"
                  placeholder="+91"
                  value={form.countryCode}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-md bg-[#2a2a2a]/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:w-2/3">
                <label htmlFor="mobile" className="text-sm text-zinc-400">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-md bg-[#2a2a2a]/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00b5ad] via-[#1e40af] to-[#6b21a8] text-white relative overflow-hidden h-12 transition-all duration-1000 ease-in-out hover:from-[#6b21a8] hover:via-[#00b5ad] hover:to-[#1e40af]"
            >
              <span className="relative z-10">Register</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00b5ad]/50 via-[#1e40af]/50 to-[#6b21a8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </Button>
          </form>
          {/* Footer */}
          <footer className="pt-6 flex justify-center gap-6 mt-2">
            <Link href="/term-and-conditions" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Privacy policy
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
