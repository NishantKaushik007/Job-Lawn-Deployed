"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { TypingAnimation } from "@/components/magicui/typing-animation";

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

function CosmosAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Guard against null canvas

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Guard against null context

    // Create non-null versions for use in nested functions
    const validCanvas = canvas;
    const validCtx = ctx;

    function resizeCanvas() {
      validCanvas.width = window.innerWidth;
      validCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

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
}

export default function Home() {
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: "radial-gradient(circle, #1b2735, #090a0f)" }}
    >
      {/* Canvas animation layer */}
      <CosmosAnimation />

      {/* Animated background orbs */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Welcome to{" "}
          <TypingAnimation as="span" className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Job Lawn
          </TypingAnimation>
        </h1>
        <p className="mt-4 text-lg md:text-2xl drop-shadow-md">
          Discover the best job opportunities at top companies.
        </p>
        <Link href="/dashboard">
          <button className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full text-lg font-medium hover:from-green-600 hover:to-blue-700 transition">
            Explore Now
          </button>
        </Link>
      </div>
    </div>
  );
}
