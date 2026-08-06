"use client";

import React, { useEffect, useRef } from "react";

export default function ParticleSphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Set high-DPI canvas dimensions
    const width = 350;
    const height = 350;
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(2, 2);

    // Sphere & Particle Settings
    const numParticles = 180;
    const radius = 110;
    let rotationY = 0;
    let rotationX = 0;

    interface Particle {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      size: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24", "#34d399"];

    // Initialize particles uniformly on a 3D sphere surface
    for (let i = 0; i < numParticles; i++) {
      const phi = Math.acos(-1 + (2 * i) / numParticles);
      const theta = Math.sqrt(numParticles * Math.PI) * phi;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Slow continuous rotation
      rotationY += 0.008;
      rotationX += 0.003;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      // Sort particles by depth (Z index) for correct layering
      const sortedParticles = particles
        .map((p) => {
          // 3D rotation around Y axis
          let x1 = p.baseX * cosY - p.baseZ * sinY;
          let z1 = p.baseX * sinY + p.baseZ * cosY;

          // 3D rotation around X axis
          let y2 = p.baseY * cosX - z1 * sinX;
          let z2 = p.baseY * sinX + z1 * cosX;

          return { ...p, x: x1, y: y2, z: z2 };
        })
        .sort((a, b) => a.z - b.z);

      // Draw particle nodes and dynamic connection lines
      for (let i = 0; i < sortedParticles.length; i++) {
        const p1 = sortedParticles[i];

        // Perspective scale based on Z depth
        const scale = (p1.z + radius * 2) / (radius * 3);
        const screenX = centerX + p1.x;
        const screenY = centerY + p1.y;
        const alpha = Math.max(0.15, Math.min(1, scale));

        // Connect nearby particles with glowing lines
        for (let j = i + 1; j < sortedParticles.length; j++) {
          const p2 = sortedParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 45) {
            const lineX2 = centerX + p2.x;
            const lineY2 = centerY + p2.y;

            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(lineX2, lineY2);
            ctx.strokeStyle = `rgba(148, 163, 184, ${(1 - dist / 45) * 0.25 * alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(screenX, screenY, p1.size * Math.max(0.5, scale), 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p1.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}