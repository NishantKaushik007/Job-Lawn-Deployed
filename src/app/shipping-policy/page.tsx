"use client";

import React, { useEffect, useRef } from "react";

const ShippingPolicy: React.FC = () => {
  // Inline CosmosAnimation component
  const CosmosAnimation = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

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

      // Determine particle count: 50 for mobile, 100 for desktop.
      const numParticles = window.innerWidth < 768 ? 50 : 100;
      const particles: Particle[] = [];
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
