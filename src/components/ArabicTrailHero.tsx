import React, { useEffect, useRef } from 'react';

const ARABIC_LETTERS = [
  'ر', 'ت', 'ب', 'ة', // Brand name ROTBA letters
  'أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'
];

interface Particle {
  x: number;
  y: number;
  letter: string;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  angle: number;
  spin: number;
}

export default function ArabicTrailHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Handle resizing
    const resizeCanvas = () => {
      if (parent && canvas) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track frame animations
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.015; // Gradual fade-out (approx 1-1.5 seconds)
        p.angle += p.spin;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        
        // Draw elegant glowing text in luxury gold
        ctx.font = `italic ${p.size}px Amiri, Scheherazade, Georgia, serif`;
        ctx.fillStyle = `rgba(197, 160, 89, ${p.opacity})`; // Brand gold color #C5A059
        ctx.shadowColor = 'rgba(232, 200, 136, 0.5)';
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.letter, 0, 0);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse Move event handler on parent element
    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Distance threshold to prevent spawning too many particles
      const dist = Math.hypot(x - lastMousePos.current.x, y - lastMousePos.current.y);

      // Spawn if cursor has moved enough
      if (dist > 8) {
        const count = Math.min(2, Math.floor(dist / 8));
        for (let i = 0; i < count; i++) {
          const letter = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
          const size = Math.random() * 12 + 16; // Elegant size: 16px to 28px
          const angle = (Math.random() - 0.5) * 0.3; // Slight initial tilt
          const spin = (Math.random() - 0.5) * 0.02; // Stately, slow rotation
          
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            letter,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -Math.random() * 0.6 - 0.2, // Drift upwards slowly
            size,
            opacity: 1.0,
            angle,
            spin
          });
        }
        lastMousePos.current = { x, y };
      }
    };

    parent.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20 block"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
