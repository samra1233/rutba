import { useEffect, useRef, useState } from 'react';

// Selectors that trigger the magnetic hover effect
const HOVER_SELECTORS = 'button, a, [data-magnetic], .group, input, select, textarea, [role="button"]';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Detect touch device and reduced motion configurations
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouchDevice(isTouch);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReduced(reducedMotion);
  }, []);

  useEffect(() => {
    if (isTouchDevice || prefersReduced) return;

    // Hide native pointer on fine-pointing devices
    document.body.classList.add('cursor-hide-native');

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Update CSS variables directly on the cursor elements
      if (dotRef.current) {
        dotRef.current.style.setProperty('--cursor-x', `${x}px`);
        dotRef.current.style.setProperty('--cursor-y', `${y}px`);
      }
      if (ringRef.current) {
        ringRef.current.style.setProperty('--cursor-x', `${x}px`);
        ringRef.current.style.setProperty('--cursor-y', `${y}px`);
      }

      // Check if mouse is hovering over an interactive target
      const target = e.target as HTMLElement;
      if (target) {
        const interactiveEl = target.closest(HOVER_SELECTORS);
        if (interactiveEl) {
          dotRef.current?.classList.add('is-hovering');
          ringRef.current?.classList.add('is-hovering');
        } else {
          dotRef.current?.classList.remove('is-hovering');
          ringRef.current?.classList.remove('is-hovering');
        }
      }
    };

    const handleMouseLeave = () => {
      dotRef.current?.classList.remove('is-hovering');
      ringRef.current?.classList.remove('is-hovering');
      // Hide cursor out of sight when mouse leaves window
      if (dotRef.current) {
        dotRef.current.style.setProperty('--cursor-x', `-100px`);
        dotRef.current.style.setProperty('--cursor-y', `-100px`);
      }
      if (ringRef.current) {
        ringRef.current.style.setProperty('--cursor-x', `-100px`);
        ringRef.current.style.setProperty('--cursor-y', `-100px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.classList.remove('cursor-hide-native');
    };
  }, [isTouchDevice, prefersReduced]);

  // Touch device: show static ambient background glow only
  if (isTouchDevice) {
    return <div className="cursor-blob-static" aria-hidden="true" />;
  }

  // Reduced motion: no custom cursor
  if (prefersReduced) {
    return null;
  }

  return (
    <>
      {/* Slow-pulse Ambient Background Glow */}
      <div className="cursor-blob" aria-hidden="true" />
      {/* Brand Logo Cursor (Moves instantly for pixel-perfect interaction) */}
      <div ref={dotRef} className="custom-cursor-logo-wrapper" aria-hidden="true">
        <img
          src="/logo.png"
          alt="ROTBA Cursor"
          className="w-10 h-10 object-contain mix-blend-multiply select-none pointer-events-none"
        />
      </div>
    </>
  );
}
