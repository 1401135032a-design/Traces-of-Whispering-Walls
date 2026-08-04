import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface SpotlightCandleProps {
  children: React.ReactNode;
  active?: boolean;
  intensity?: 'full' | 'dim' | 'none';
  blurLevel?: string;
  overlayColor?: string;
  onPositionChange?: (x: number, y: number) => void;
  customRadius?: number;
  soft?: boolean;
}

export default function SpotlightCandle({
  children,
  active = true,
  intensity = 'full',
  blurLevel = 'blur-none',
  overlayColor = 'rgba(8, 6, 4, 0.68)', // Warm tomb dust amber-brown, dark and immersive default
  onPositionChange,
  customRadius,
  soft = false
}: SpotlightCandleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [flicker, setFlicker] = useState(1);

  // Smoke Particle State
  interface SmokeParticle {
    id: number;
    x: number;
    y: number;
    driftX: number;
    duration: number;
    size: number;
  }
  const [particles, setParticles] = useState<SmokeParticle[]>([]);

  // Safe latest-coordinate tracking ref to prevent interval thrashing
  const coordsRef = useRef(coords);
  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  // Periodic smoke particle spawner
  useEffect(() => {
    if (!active || intensity === 'none') return;

    const interval = setInterval(() => {
      const currentCoords = coordsRef.current;
      if (!currentCoords) return;

      const id = Date.now() + Math.random();
      const newParticle: SmokeParticle = {
        id,
        x: currentCoords.x,
        y: currentCoords.y - 12, // spawn slightly above the candle wick
        driftX: Math.random() * 56 - 28, // -28px to +28px horizontal drift
        duration: 1.8 + Math.random() * 1.0, // 1.8s to 2.8s lifetime
        size: 14 + Math.random() * 12, // 14px to 26px initial size
      };

      setParticles((prev) => [...prev.slice(-20), newParticle]);
    }, 180);

    return () => clearInterval(interval);
  }, [active, intensity]);

  // Gentle candlelight flickering effect
  useEffect(() => {
    if (!active || intensity === 'none') return;
    const interval = setInterval(() => {
      setFlicker(0.95 + Math.random() * 0.1); // Random scale between 0.95 and 1.05
    }, 120);
    return () => clearInterval(interval);
  }, [active, intensity]);

  // Center on mount and resize
  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current && containerRef.current.clientWidth > 0 && containerRef.current.clientHeight > 0) {
        setCoords({
          x: containerRef.current.clientWidth / 2,
          y: containerRef.current.clientHeight / 2
        });
      } else if (typeof window !== 'undefined') {
        setCoords({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });
      }
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    const timer = setTimeout(updateCenter, 50);
    const timer2 = setTimeout(updateCenter, 200);
    return () => {
      window.removeEventListener('resize', updateCenter);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
    setIsHovered(true);
    if (onPositionChange) {
      onPositionChange(x, y);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const centerX = containerRef.current?.clientWidth ? containerRef.current.clientWidth / 2 : (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
    const centerY = containerRef.current?.clientHeight ? containerRef.current.clientHeight / 2 : (typeof window !== 'undefined' ? window.innerHeight / 2 : 350);
    setCoords({
      x: centerX,
      y: centerY
    });
  };

  // Adjust spotlight size to be smaller, focused, and bright
  const radius = customRadius !== undefined ? customRadius : (intensity === 'full' ? 240 : intensity === 'dim' ? 140 : 0);
  const candleRadius = radius * flicker;

  const defaultX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const defaultY = typeof window !== 'undefined' ? window.innerHeight / 2 : 350;

  const activeX = (coords && coords.x > 30 && coords.y > 30) ? coords.x : defaultX;
  const activeY = (coords && coords.x > 30 && coords.y > 30) ? coords.y : defaultY;

  // Mask string for overlay (keeps inner area 100% crystal clear and free of hazy grey, with a quick high-contrast vignette edge)
  const maskStyle = active && intensity !== 'none'
    ? {
        WebkitMaskImage: soft
          ? `radial-gradient(circle ${candleRadius}px at ${activeX}px ${activeY}px, transparent 0%, transparent 42%, rgba(0,0,0,0.1) 68%, rgba(0,0,0,0.45) 85%, black 100%)`
          : `radial-gradient(circle ${candleRadius}px at ${activeX}px ${activeY}px, transparent 0%, transparent 86%, rgba(0,0,0,0.12) 93%, black 100%)`,
        maskImage: soft
          ? `radial-gradient(circle ${candleRadius}px at ${activeX}px ${activeY}px, transparent 0%, transparent 42%, rgba(0,0,0,0.1) 68%, rgba(0,0,0,0.45) 85%, black 100%)`
          : `radial-gradient(circle ${candleRadius}px at ${activeX}px ${activeY}px, transparent 0%, transparent 86%, rgba(0,0,0,0.12) 93%, black 100%)`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat'
      }
    : intensity === 'none'
    ? { display: 'none' }
    : {};

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* 1. Underlying Sharp Clear Content */}
      <div className="absolute inset-0 w-full h-full z-0">
        {children}
      </div>

      {/* 1.5 Warm Candlelight Glow Overlay (brightens and tints the scene around the candle with full-screen gradient to prevent square border) */}
      {active && intensity !== 'none' && (
        <div
          style={{
            background: soft
              ? `radial-gradient(circle ${candleRadius * 1.15}px at ${activeX}px ${activeY}px, rgba(254, 235, 200, 0.18) 0%, rgba(251, 191, 36, 0.08) 50%, rgba(245, 158, 11, 0.01) 80%, rgba(0,0,0,0) 100%)`
              : `radial-gradient(circle ${candleRadius * 1.3}px at ${activeX}px ${activeY}px, rgba(255, 244, 225, 0.92) 0%, rgba(254, 208, 140, 0.58) 35%, rgba(245, 158, 11, 0.25) 70%, rgba(217, 119, 6, 0) 100%)`,
            transition: isHovered ? 'none' : 'background 0.4s ease-out'
          }}
          className="absolute inset-0 pointer-events-none z-5 mix-blend-screen overlay-flicker"
        />
      )}

      {/* 1.6 High-clarity and Brightness Highlight Layer (for brilliant illuminating effects) */}
      {active && intensity !== 'none' && (
        <div
          style={{
            left: activeX,
            top: activeY,
            width: `${candleRadius * 1.6}px`,
            height: `${candleRadius * 1.6}px`,
            background: soft
              ? `radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(254, 213, 150, 0.02) 60%, rgba(0,0,0,0) 100%)`
              : `radial-gradient(circle, rgba(255, 255, 255, 0.38) 0%, rgba(254, 213, 150, 0.15) 50%, rgba(0,0,0,0) 100%)`,
            transform: `translate(-50%, -50%)`,
            transition: isHovered ? 'none' : 'left 0.4s ease-out, top 0.4s ease-out'
          }}
          className={`absolute pointer-events-none z-6 rounded-full ${soft ? 'mix-blend-overlay' : 'mix-blend-color-dodge'}`}
        />
      )}

      {/* 2. Top Dark/Blurry Overlay (revealed/masked by mouse) */}
      {active && intensity !== 'none' && (
        <div
          style={{
            backgroundColor: overlayColor,
            transition: 'mask-image 0.05s ease-out, -webkit-mask-image 0.05s ease-out',
            ...maskStyle
          }}
          className={`absolute inset-0 w-full h-full z-10 pointer-events-none ${blurLevel}`}
        />
      )}

      {/* 2.5 Style Block and Smoke Particles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes smokeRise {
          0% {
            transform: translate(-50%, -100%) scale(0.6) translateY(0) translateX(0);
            opacity: 0;
            filter: blur(2px);
          }
          15% {
            opacity: 0.22;
            filter: blur(3.5px);
          }
          100% {
            transform: translate(-50%, -100%) scale(4.0) translateY(-180px) translateX(var(--drift-x));
            opacity: 0;
            filter: blur(18px);
          }
        }
        @keyframes flameDance {
          0%, 100% { transform: scale(1) rotate(-2deg) translateY(0); filter: drop-shadow(0 0 12px rgba(245,158,11,0.8)); }
          25% { transform: scale(1.08, 0.95) rotate(3deg) translateY(-1.5px); filter: drop-shadow(-3px 0 16px rgba(251,191,36,0.9)); }
          50% { transform: scale(0.94, 1.06) rotate(-4deg) translateY(1px); filter: drop-shadow(3px 0 14px rgba(217,119,6,0.8)); }
          75% { transform: scale(1.05, 0.98) rotate(2deg) translateY(-2px); filter: drop-shadow(0 -2px 18px rgba(252,211,77,0.95)); }
        }
        @keyframes auraFlicker {
          0%, 100% { opacity: 0.35; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          30% { opacity: 0.55; transform: translate(-48%, -52%) scale(1.12) rotate(4deg); }
          60% { opacity: 0.28; transform: translate(-52%, -49%) scale(0.92) rotate(-3deg); }
          85% { opacity: 0.48; transform: translate(-49%, -51%) scale(1.06) rotate(2deg); }
        }
        @keyframes overlayFlicker {
          0%, 100% { opacity: 0.85; }
          30% { opacity: 1; }
          60% { opacity: 0.75; }
          85% { opacity: 0.95; }
        }
        .smoke-particle {
          animation: smokeRise var(--duration) ease-out forwards;
          background: radial-gradient(circle, rgba(230, 222, 210, 0.15) 0%, rgba(200, 192, 180, 0.04) 50%, transparent 80%);
        }
        .flame-dance {
          animation: flameDance 1.8s ease-in-out infinite;
        }
        .aura-flicker {
          animation: auraFlicker 2.4s ease-in-out infinite;
        }
        .overlay-flicker {
          animation: overlayFlicker 2.4s ease-in-out infinite;
        }
      `}} />

      {coords && active && intensity !== 'none' && particles.map((p) => (
        <div
          key={p.id}
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            zIndex: 15,
            '--drift-x': `${p.driftX}px`,
            '--duration': `${p.duration}s`,
          } as React.CSSProperties}
          className="absolute rounded-full pointer-events-none smoke-particle"
        />
      ))}

      {/* 3. The Candle Flame Cursor Follower */}
      {coords && active && intensity !== 'none' && (
        <div
          style={{
            left: coords.x,
            top: coords.y,
            transform: `translate(-50%, -50%) scale(${flicker})`,
            opacity: isHovered ? 1 : 0.75, // slightly dim when resting in center
            transition: isHovered ? 'none' : 'left 0.4s ease-out, top 0.4s ease-out, opacity 0.4s'
          }}
          className="absolute pointer-events-none z-20"
        >
          {/* Flame Core */}
          <div className="relative w-12 h-12 flex items-center justify-center flame-dance">
            {/* Expanded and brightened candle flame glow aura */}
            <div className="absolute w-48 h-48 rounded-full bg-amber-500/35 blur-3xl aura-flicker left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-24 h-24 rounded-full bg-amber-600/50 blur-xl aura-flicker left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-12 h-12 rounded-full bg-yellow-400/65 blur-md aura-flicker left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            {/* Inner tiny flame icon */}
            <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-red-600 via-amber-500 to-amber-200 blur-[1px] rotate-3 z-10 flame-dance" />
            {/* Candle wick ring */}
            <div className="absolute bottom-1 w-[2px] h-2.5 bg-neutral-800 z-5" />
          </div>
        </div>
      )}
    </div>
  );
}
