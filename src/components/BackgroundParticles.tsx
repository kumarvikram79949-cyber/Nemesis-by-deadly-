import { useEffect, useRef } from 'react';

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      color: string;
    }

    // Futuristic Cyber Neon Colors (Cyan, Electric Blue, Neon Mint, Hologram Purple)
    const colors = [
      'rgba(0, 240, 255, ',
      'rgba(0, 255, 157, ',
      'rgba(56, 189, 248, ',
      'rgba(168, 85, 247, ',
    ];

    const particles: Particle[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.9 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        // 🧈 Butter-smooth GPU particle rendering (No heavy shadowBlur stalls)
        // Outer soft halo
        ctx.fillStyle = `${p.color}${p.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
      />
      {/* Sci-Fi Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 cyber-grid opacity-60" />
      {/* Radial Cyber Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,240,255,0.12),transparent_70%),radial-gradient(circle_at_15%_50%,rgba(168,85,247,0.08),transparent_45%),radial-gradient(circle_at_85%_50%,rgba(0,255,157,0.08),transparent_45%)]" />
    </>
  );
}
