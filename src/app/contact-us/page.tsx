"use client";

import React, { useState, useEffect, useRef } from "react";

const CosmosAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create non-null references
    const validCanvas = canvas;
    const validCtx = ctx;

    function resizeCanvas() {
      validCanvas.width = window.innerWidth;
      validCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      angle: number;
      constructor(x: number, y: number, radius: number, speed: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
      }
      update(canvas: HTMLCanvasElement) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        // Bounce off canvas edges
        if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
        if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const numParticles = 100;

    for (let i = 0; i < numParticles; i++) {
      particles.push(
        new Particle(
          Math.random() * validCanvas.width,
          Math.random() * validCanvas.height,
          Math.random() * 4 + 1,
          Math.random() * 0.5 + 0.2
        )
      );
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dist = Math.hypot(
            particles[a].x - particles[b].x,
            particles[a].y - particles[b].y
          );
          if (dist < 120) {
            validCtx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 120})`;
            validCtx.lineWidth = 0.7;
            validCtx.beginPath();
            validCtx.moveTo(particles[a].x, particles[a].y);
            validCtx.lineTo(particles[b].x, particles[b].y);
            validCtx.stroke();
          }
        }
      }
    }

    function animate() {
      validCtx.clearRect(0, 0, validCanvas.width, validCanvas.height);
      particles.forEach((particle) => {
        particle.update(validCanvas);
        particle.draw(validCtx);
      });
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

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
        <div className="bg-[#2a2a2a]/50 rounded-2xl backdrop-blur-xl border border-zinc-800 p-8">
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
              className="hidden md:block px-6 py-3 rounded-md text-zinc-300 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition"
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
