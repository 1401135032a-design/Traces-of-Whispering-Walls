import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { getImageUrl } from '../utils/imageLoader';

interface Phase2TunnelProps {
  onComplete: () => void;
  lang?: 'zh' | 'en';
}

export default function Phase2_Tunnel({ onComplete, lang = 'zh' }: Phase2TunnelProps) {
  const isEn = lang === 'en';
  const [textIndex, setTextIndex] = useState(0);

  // Sequenced subtitles with exact user requested texts
  const steps = [
    { text: isEn ? "A Mysterious Patricide Cold Case" : "扑朔迷离的弑父悬案" },
    { text: isEn ? "A Marble Coffin Bed Fitting an Emperor" : "堪比帝王的汉白玉棺床" },
    { text: isEn ? "Explore the 1000-Year Legend of Changgou Tomb..." : "一起探索房山长沟唐墓千年传奇······" }
  ];

  useEffect(() => {
    // Fast step transition
    const timer1 = setTimeout(() => {
      setTextIndex(1);
    }, 1800);

    const timer2 = setTimeout(() => {
      setTextIndex(2);
    }, 3600);

    // Completion transition (5.6 seconds total)
    const timer3 = setTimeout(() => {
      onComplete();
    }, 5600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Sparkles & ripple circles to evoke the time warp
  const rings = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.4,
    size: 80 + i * 180,
  }));

  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    scale: Math.random() * 1.6 + 0.4,
    delay: Math.random() * 2,
  }));

  return (
    <motion.div 
      id="phase2-container" 
      className="w-full h-screen bg-black overflow-hidden flex items-center justify-center relative select-none"
      animate={{
        x: [0, -1.5, 1.5, -1.0, 1.0, 0],
        y: [0, 1.2, -1.5, 1.0, -1.0, 0],
        rotate: [0, -0.2, 0.2, -0.1, 0]
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {/* Pitch black background with subtle radial vignette */}
      <div className="absolute inset-0 z-0 bg-black" />
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.98)_100%)] pointer-events-none" />

      {/* 2. Concentric Time-Warp Golden Rings with ancient decorative feel - Rotating dramatically */}
      <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden pointer-events-none">
        {rings.map((ring) => (
          <motion.div
            key={ring.id}
            initial={{ scale: 0.05, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: [0.1, 2.8, 5.5], 
              opacity: [0, 0.55, 0.25, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              delay: ring.delay,
              ease: "easeInOut"
            }}
            style={{
              width: `${ring.size}px`,
              height: `${ring.size}px`,
            }}
            className="absolute rounded-full border border-amber-500/20 flex items-center justify-center"
          >
            <svg className="w-full h-full opacity-25 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.15" strokeDasharray="4, 4" />
              <path d="M50,2 A48,48 0 0,1 98,50 L50,50 Z" fill="none" stroke="currentColor" strokeWidth="0.08" />
              <path d="M50,50 L2,50 A48,48 0 0,1 50,2" fill="none" stroke="currentColor" strokeWidth="0.08" />
              <path d="M50,50 L50,98 A48,48 0 0,1 2,50" fill="none" stroke="currentColor" strokeWidth="0.08" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 3. Floating Sparkle Particles Spiraling/Rotating Outwards */}
      <div className="absolute inset-0 z-15 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0.05, opacity: 0, rotate: 0 }}
            animate={{ 
              x: [`0px`, `${p.x * 22}px`], 
              y: [`0px`, `${p.y * 22}px`], 
              scale: [0.1, p.scale * 3.2], 
              rotate: [0, p.x > 0 ? 540 : -540],
              opacity: [0, 1.0, 0.6, 0] 
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-300/70"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400/90 blur-[0.5px]" />
          </motion.div>
        ))}
      </div>

      {/* 4. Sequenced Subtitles with beautiful brush/serif layout */}
      <div className="absolute z-20 inset-x-4 top-[38%] flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 1.01 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="px-6 py-4 max-w-2xl"
          >
            {/* Top tiny label */}
            <div className="text-xs md:text-sm tracking-[0.45em] text-white/80 uppercase font-mono mb-4 animate-pulse font-semibold">
              —— CHRONICLE WARP / {isEn ? 'TIME WARP' : '时空回溯'} ——
            </div>

            {/* Core Poetic Text - Smaller and clean with White Gradient */}
            <div className="text-xl md:text-2xl tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.98)] font-serif font-bold leading-relaxed">
              {steps[textIndex].text}
            </div>

            {/* Lower subtitle or indicator */}
            <div className="text-xs text-amber-200/60 font-mono tracking-[0.25em] mt-5">
              {textIndex === 0 && (isEn ? "THE MYSTERIOUS CASE OF FRATRICIDE / REGICIDE" : "晚唐藩镇 · 扑朔迷离的弑父悬案")}
              {textIndex === 1 && (isEn ? "HIGH-SPECIFICATION WHITE MARBLE BURIAL BED" : "极高规格 · 堪比帝王的汉白玉棺床")}
              {textIndex === 2 && (isEn ? "EXPLORE THE 1000-YEAR-OLD TANG TOMB LEGEND" : "千古谜团 · 房山长沟唐墓千年传奇")}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Camera shutter exposure flash at the very end of 5.6 seconds */}
      <motion.div 
        className="absolute inset-0 bg-white z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0, 0, 0, 0.95, 1, 0] 
        }}
        transition={{ 
          duration: 5.6, 
          times: [0, 0.8, 0.9, 0.93, 0.96, 0.98, 1.0],
          ease: "easeInOut" 
        }}
      />
    </motion.div>
  );
}
