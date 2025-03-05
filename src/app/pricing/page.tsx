"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

const CosmosAnimation: React.FC = () => {
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

    return () => window.removeEventListener("resize", resizeCanvas);
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

export default function PremiumCard() {
  return (
    <div className="min-h-screen w-full bg-[#0A0118] relative overflow-hidden">
      <CosmosAnimation />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-sm rounded-3xl bg-black border border-violet-500/30 p-6 overflow-hidden animate-fade-in">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl"></div>

          <div className="absolute top-4 right-4">
            <span className="text-xs font-medium text-violet-500 bg-violet-950/60 px-2 py-1 rounded-md">
              OUR PLAN
            </span>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black border border-violet-500/30">
              <span className="text-violet-500 text-lg">
                <Link href="/" className="flex-shrink-0 cursor-pointer">
                  <Image src="/logo.svg" alt="Logo" width={62} height={15} />
                </Link>
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-violet-500 text-xl font-medium relative inline-block">
                Pricing
                <span className="absolute bottom-0 left-0 w-full h-px bg-violet-500/30"></span>
              </h3>
              <div className="flex items-baseline mt-1">
                <span className="text-white text-4xl font-bold">₹49</span>
                <span className="text-gray-400 text-sm ml-1">/month</span>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Enjoy unlimited access to tailored job openings and career opportunities with our subscription service.
          </p>
          <ul className="space-y-3 mb-8">
            {["Pay After Using 30 Days", "Access To Newly Added Companies", "Unlimited Job Searching", "Customized Filters", "24/7 Availability"].map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-violet-500" />
                </div>
                <span className="text-white text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => (window.location.href = "/register")} className="w-full bg-violet-500 hover:bg-violet-600 text-black font-medium rounded-xl py-6">
            Register Now!
          </Button>
        </div>
      </div>
    </div>
  );
}
