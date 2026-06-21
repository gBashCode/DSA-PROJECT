"use client";

import React, { useRef, useEffect, useState } from "react";

interface ParticleTextEffectProps {
  text: string;
  className?: string;
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  velocity: number;
}

export function ParticleTextEffect({
  text,
  className = "",
  particleCount = 500,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();

    const createParticles = () => {
      const particles: Particle[] = [];
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return particles;

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      tempCtx.font = `bold ${Math.min(canvas.width / 8, 80)}px sans-serif`;
      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "middle";
      tempCtx.fillStyle = "white";
      tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);

      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;

      const validPositions: { x: number; y: number }[] = [];
      for (let y = 0; y < tempCanvas.height; y += 4) {
        for (let x = 0; x < tempCanvas.width; x += 4) {
          const index = (y * tempCanvas.width + x) * 4;
          if (data[index + 3] > 128) {
            validPositions.push({ x, y });
          }
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const pos = validPositions[i % validPositions.length];
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          targetX: pos.x / window.devicePixelRatio,
          targetY: pos.y / window.devicePixelRatio,
          size: Math.random() * 2 + 1,
          color: `hsl(${260 + Math.random() * 40}, 70%, ${60 + Math.random() * 20}%)`,
          speed: 0.02 + Math.random() * 0.03,
          angle: Math.random() * Math.PI * 2,
          velocity: 0,
        });
      }

      return particles;
    };

    particlesRef.current = createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((particle) => {
        if (!isHovered) {
          particle.angle += 0.01;
          particle.x += Math.cos(particle.angle) * 0.5;
          particle.y += Math.sin(particle.angle) * 0.5;
        } else {
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          particle.x += dx * particle.speed;
          particle.y += dy * particle.speed;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [text, particleCount, isHovered]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
