import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface DressItem {
  id: string;
  name: string;
  image: string;
}

const DRESSES: DressItem[] = [
  {
    id: "zar-003",
    name: "Noor-ul-Ain Ivory",
    image: "/1.jpeg"
  },
  {
    id: "zar-005",
    name: "Gul-e-Rana Peach",
    image: "/2.jpeg"
  },
  {
    id: "zar-007",
    name: "Royal Sapphire Indigo",
    image: "/3.jpeg"
  },
  {
    id: "zar-001",
    name: "Shehnai Crimson",
    image: "/4.png"
  },
  {
    id: "zar-004",
    name: "Gulbadan Amber",
    image: "/5.png"
  },
  {
    id: "zar-009",
    name: "Shabnam Lilac",
    image: "/6.png"
  }
];

export default function Model3DShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse tilt variables for 3D simulation of active dress
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHoveringActive, setIsHoveringActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const frameId = useRef<number | null>(null);

  // Track window size for responsive spacing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  // Auto rotate interval
  useEffect(() => {
    if (isHoveringActive || hoveredIndex !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DRESSES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isHoveringActive, hoveredIndex]);

  // Handle mouse move to calculate rotation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize coordinates around center (from -0.5 to 0.5)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Set target tilt
    tiltRef.current = {
      x: normY * -15, // tilt up/down
      y: normX * 15,  // tilt left/right
    };

    // Throttle React state changes to render loop frames
    if (frameId.current === null) {
      frameId.current = requestAnimationFrame(() => {
        setTilt(tiltRef.current);
        frameId.current = null;
      });
    }
  };

  const handleMouseLeave = () => {
    if (frameId.current !== null) {
      cancelAnimationFrame(frameId.current);
      frameId.current = null;
    }
    setTilt({ x: 0, y: 0 });
    setIsHoveringActive(false);
  };

  return (
    <section
      ref={containerRef}
      className="w-full pt-1 pb-6 px-4 md:px-8 overflow-hidden relative select-none flex flex-col items-center justify-center"
    >
      {/* Centered Mannequin Exhibition Stage */}
      <div className="relative w-full max-w-7xl mx-auto flex items-center justify-center min-h-[500px] md:min-h-[960px]">

        {/* Mannequin presentation track */}
        <div className="relative w-full h-[460px] md:h-[920px] flex items-center justify-center">
          {DRESSES.map((dress, idx) => {
            // Circular distance from activeIndex
            let diff = idx - activeIndex;
            if (diff < -DRESSES.length / 2) {
              diff += DRESSES.length;
            } else if (diff > DRESSES.length / 2) {
              diff -= DRESSES.length;
            }

            const isCenter = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;
            const isVisible = isCenter || isLeft || isRight;

            const isPng = dress.image.endsWith('.png');
            let scale = isCenter ? (isMobile ? 0.85 : 1.0) : (isMobile ? 0.48 : 0.65);
            if (isPng) {
              scale *= 0.85; // Multiplier to increase size of PNG models to match JPEGs
            }
            let opacity = isCenter ? 1.0 : (isVisible ? 0.45 : 0.0);
            let rotateYVal = isCenter ? tilt.y : (isLeft ? 20 : -20);
            let rotateXVal = isCenter ? tilt.x : 0;

            // Calculate responsive non-overlapping horizontal offset
            let xOffset = "0%";
            if (isLeft) {
              xOffset = isMobile ? "-55%" : "-65%";
            } else if (isRight) {
              xOffset = isMobile ? "55%" : "65%";
            } else if (diff < -1) {
              xOffset = "-120%"; // Hidden off-screen left
            } else if (diff > 1) {
              xOffset = "120%";  // Hidden off-screen right
            }

            let zIndex = 15;
            if (isCenter) {
              zIndex = 30;
            } else if (hoveredIndex === idx) {
              zIndex = 40; // Bring hovered dress to front so it is fully clickable
            } else if (!isVisible) {
              zIndex = 5;
            }

            return (
              <motion.div
                key={dress.id}
                className="absolute w-[180px] md:w-[500px] h-[400px] md:h-[950px] flex flex-col items-center justify-center cursor-pointer"
                animate={{
                  x: xOffset,
                  scale: scale,
                  opacity: opacity,
                  rotateY: rotateYVal,
                  rotateX: rotateXVal,
                  y: [0, -12, 0], // Smooth, continuous floating/breathing animation for every mannequin!
                }}
                transition={{
                  x: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
                  scale: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
                  opacity: { duration: 0.35 },
                  rotateY: isCenter ? { type: "tween", ease: "easeOut", duration: 0.1 } : { type: "spring", stiffness: 100, damping: 18 },
                  rotateX: isCenter ? { type: "tween", ease: "easeOut", duration: 0.1 } : { type: "spring", stiffness: 100, damping: 18 },
                  y: {
                    duration: 3.5 + (idx * 0.8), // staggered floating speeds to make each model feel uniquely alive!
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: 1000,
                  zIndex: zIndex,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                  setTilt({ x: 0, y: 0 });
                }}
                onMouseEnter={() => {
                  if (isCenter) {
                    setIsHoveringActive(true);
                  }
                  setHoveredIndex(idx);
                }}
                onMouseLeave={() => {
                  if (isCenter) {
                    handleMouseLeave();
                  }
                  setHoveredIndex(null);
                }}
                onMouseMove={isCenter ? handleMouseMove : undefined}
              >
                {/* Clean, borderless, frameless frame */}
                <div className="relative w-full h-full overflow-visible">
                  {/* Mannequin Image - stands proudly with zero cards, frames, borders, or backgrounds */}
                  <img
                    src={dress.image}
                    alt={dress.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain select-none pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
