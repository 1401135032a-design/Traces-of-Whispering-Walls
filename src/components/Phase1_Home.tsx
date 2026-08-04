import React, { useState } from 'react';
import { motion } from 'motion/react';
import SpotlightCandle from './SpotlightCandle';
import { Lock, Flame, Volume2, VolumeX } from 'lucide-react';
import { getImageUrl } from '../utils/imageLoader';

interface Phase1HomeProps {
  onStart: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  lang?: 'zh' | 'en';
  setLang?: React.Dispatch<React.SetStateAction<'zh' | 'en'>>;
}

export default function Phase1_Home({ onStart, soundEnabled, toggleSound, lang = 'zh', setLang }: Phase1HomeProps) {
  const [buttonHighlighted, setButtonHighlighted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCandleMove = (x: number, y: number) => {
    // Check if candle is close to center button (around window center)
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    // If within 150px of center, highlight button automatically
    if (distance < 140) {
      setButtonHighlighted(true);
    } else {
      setButtonHighlighted(false);
    }
  };

  const isEn = lang === 'en';

  return (
    <div id="phase1-container" className="w-full h-screen bg-[#0a0805] text-[#f2efeb] flex flex-col justify-between relative font-sans select-none overflow-hidden">
      <SpotlightCandle 
        active={true} 
        intensity="full" 
        overlayColor="rgba(8, 6, 4, 0.35)"
        onPositionChange={handleCandleMove}
        customRadius={180}
      >
        {/* Frame borders for premium museum aesthetic */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 z-30" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/10 z-30" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-white/10 z-30" />
        <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10 z-30" />
        
        {/* Decorative corner ornaments */}
        <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-white/20 pointer-events-none z-30" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-white/20 pointer-events-none z-30" />

        {/* Tomb Background - Beautiful ancient tomb corridor mural image */}
        <div 
          style={{
            transform: `perspective(1200px) rotateY(${mousePos.x * 3.5}deg) rotateX(${mousePos.y * -3.5}deg) translateX(${mousePos.x * 12}px) translateY(${mousePos.y * 12}px)`,
            transition: 'transform 0.6s cubic-bezier(0.15, 0.85, 0.3, 1)'
          }}
          className="absolute -inset-5 flex items-center justify-center overflow-hidden bg-black z-0 origin-center"
        >
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes floatUp {
              0% {
                transform: translateY(0) translateX(0) scale(1);
                opacity: 0;
              }
              10% {
                opacity: 0.85;
              }
              90% {
                opacity: 0.4;
              }
              100% {
                transform: translateY(-110vh) translateX(40px) scale(0.4);
                opacity: 0;
              }
            }
            @keyframes flickerLight {
              0%, 100% { opacity: 0.30; transform: scale(1) translateX(-6px) translateY(-3px); }
              15% { opacity: 0.48; transform: scale(1.08) translateX(8px) translateY(5px); }
              30% { opacity: 0.22; transform: scale(0.92) translateX(-5px) translateY(2px); }
              45% { opacity: 0.42; transform: scale(1.06) translateX(6px) translateY(-4px); }
              60% { opacity: 0.25; transform: scale(0.95) translateX(-4px) translateY(3px); }
              75% { opacity: 0.45; transform: scale(1.10) translateX(5px) translateY(-2px); }
              90% { opacity: 0.32; transform: scale(0.97) translateX(-2px) translateY(6px); }
            }
            @keyframes slowCameraPush {
              0% { transform: scale(1); }
              100% { transform: scale(1.14); }
            }
            .candle-flicker-overlay {
              background: radial-gradient(circle at 50% 65%, rgba(254, 191, 116, 0.45) 0%, rgba(217, 119, 6, 0.22) 45%, transparent 75%);
              animation: flickerLight 3.2s ease-in-out infinite;
            }
            .video-slow-push {
              animation: slowCameraPush 35s ease-in-out infinite alternate;
            }
            .ember-particle {
              animation: floatUp linear infinite;
            }
          `}} />

          <video 
            src={getImageUrl('/src/assets/Video-1784642136570.mp4')} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-100 select-none pointer-events-none video-slow-push"
          />
          {/* Flame shadow/glow overlay */}
          <div className="absolute inset-0 z-5 pointer-events-none mix-blend-color-dodge candle-flicker-overlay" />
          
          {/* Floating glowing amber embers */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-80">
            {Array.from({ length: 15 }).map((_, idx) => {
              const size = Math.random() * 3 + 1.5;
              const delay = Math.random() * 8;
              const duration = Math.random() * 8 + 6;
              const left = `${Math.random() * 100}%`;
              return (
                <div
                  key={idx}
                  style={{
                    left,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                  className="absolute bottom-[-10px] bg-gradient-to-t from-amber-400 to-yellow-200 rounded-full blur-[0.5px] ember-particle"
                />
              );
            })}
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </div>

        {/* Floating Top Header */}
        <header className="absolute top-0 left-0 w-full z-30 px-4 md:px-12 py-4 sm:py-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-auto">
          {/* Navigation Items with tooltip */}
          <div className="flex items-center space-x-3 sm:space-x-6 md:space-x-10">
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs md:text-sm font-mono tracking-wider sm:tracking-widest opacity-50 group cursor-not-allowed relative">
              <span>{isEn ? 'Tomb Roaming' : '地宫漫游'}</span>
              <Lock className="w-3.5 h-3.5 opacity-60" />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-neutral-950 text-[#c6a35f] text-xs py-1.5 px-3 rounded border border-amber-900/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isEn ? 'Click [Begin Exploration] First' : '请先【开始探索】'}
              </div>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs md:text-sm font-mono tracking-wider sm:tracking-widest opacity-50 group cursor-not-allowed relative">
              <span>{isEn ? 'Digital Murals' : '数字壁画'}</span>
              <Lock className="w-3.5 h-3.5 opacity-60" />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-neutral-950 text-[#c6a35f] text-xs py-1.5 px-3 rounded border border-amber-900/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isEn ? 'Click [Begin Exploration] First' : '请先【开始探索】'}
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 text-xs md:text-sm font-mono tracking-wider sm:tracking-widest opacity-50 group cursor-not-allowed relative">
              <span>{isEn ? 'Restoration Workshop' : '壁画修复工坊'}</span>
              <Lock className="w-3.5 h-3.5 opacity-60" />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-neutral-950 text-[#c6a35f] text-xs py-1.5 px-3 rounded border border-amber-900/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isEn ? 'Click [Begin Exploration] First' : '请先【开始探索】'}
              </div>
            </div>
          </div>
        </header>

        {/* Central Display and Start Button */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center z-20 px-3 sm:px-4 text-center mt-4 sm:mt-8 origin-center pointer-events-none overflow-hidden"
        >
          <div className="max-w-4xl w-full flex flex-col items-center pointer-events-auto px-2">
            {/* 1. Subtitle bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-[#c6a35f] font-mono tracking-[0.06em] sm:tracking-[0.18em] md:tracking-[0.25em] text-[9px] sm:text-xs md:text-sm uppercase mb-2 sm:mb-3"
            >
              {isEn ? '— CHANGGOU TANG TOMB DIGITAL ARCHAEOLOGY —' : '— 长沟大墓数字考古沉浸式体验 —'}
            </motion.div>
            
            {/* 2. Main Calligraphy / Fancy English Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              style={isEn ? { fontFamily: "'Cinzel Decorative', 'Cormorant Garamond', serif" } : {}}
              className={`${
                isEn 
                  ? 'text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-normal sm:tracking-[0.02em] leading-tight py-1 sm:py-2' 
                  : 'text-4xl sm:text-7xl md:text-[108px] font-brush font-normal tracking-[0.04em]'
              } text-transparent bg-clip-text bg-gradient-to-b from-[#fff2db] via-[#e5be75] to-[#a67d36] filter drop-shadow-[0_12px_35px_rgba(0,0,0,0.99)] mb-1 sm:mb-2 select-none`}
            >
              {isEn ? 'Traces of Whispering Walls' : '幽壁寻迹'}
            </motion.h1>

            {/* 3. Short tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.5 }}
              className={`text-xs sm:text-base md:text-xl text-[#f2efeb] font-serif font-light max-w-3xl mx-auto mb-3 sm:mb-6 leading-relaxed ${
                isEn ? 'tracking-wider sm:tracking-[0.15em] md:tracking-[0.2em]' : 'tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.35em]'
              }`}
            >
              {isEn ? 'Guided by Candlelight, Explore the Tang Tomb' : '以烛为引，重探唐墓'}
            </motion.p>
 
            {/* 4. Elegant introductory paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 2.1 }}
              className="text-[11px] sm:text-xs md:text-sm text-[#f2efeb]/80 max-w-lg mx-auto mb-5 sm:mb-10 leading-relaxed tracking-wider border-y border-white/15 py-2.5 sm:py-4 font-serif text-center px-2"
            >
              {isEn 
                ? '“Holding a solitary candle, brushing away a thousand years of wind and sand. Return to the dark realm of Kaiyuan flourishing age, re-exploring Tang tomb murals and ancient relics.”'
                : '“手执一盏孤烛，拨开千载风沙。重返开元盛世地宫幽暗之境，在忽明忽灭的烛影中，重探唐墓壁画与文物的风华遗韵。”'}
            </motion.p>
          </div>

          {/* Action Button Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.6, duration: 1 }}
            className="flex flex-col items-center justify-center mt-1 sm:mt-2 space-y-2 sm:space-y-3 pointer-events-auto"
          >
            {/* Medallion style start button */}
            <button
              id="begin-explore-btn"
              onClick={onStart}
              className={`relative px-8 sm:px-12 py-3 sm:py-4 border-2 font-serif font-bold text-xs sm:text-base overflow-hidden transition-all duration-500 cursor-pointer rounded-full sm:rounded-none ${
                buttonHighlighted
                  ? 'bg-[#c6a35f] text-[#0c0c0e] border-[#c6a35f] shadow-[0_0_35px_rgba(198,163,95,0.6)] scale-105'
                  : 'bg-transparent text-[#c6a35f] border-[#c6a35f] hover:bg-[#c6a35f] hover:text-[#0c0c0e] hover:shadow-[0_0_30px_rgba(198,163,95,0.4)]'
              }`}
            >
              <span className="flex items-center justify-center space-x-2 tracking-[0.2em] sm:tracking-[0.3em] pl-[0.2em] sm:pl-[0.3em]">
                <Flame className={`w-4 h-4 sm:w-5 sm:h-5 ${buttonHighlighted ? 'text-[#0c0c0e] animate-bounce' : 'text-[#c6a35f] group-hover:text-[#0c0c0e]'}`} />
                <span>{isEn ? 'BEGIN EXPLORATION' : '开始探索'}</span>
              </span>
            </button>

            {/* Hint message under button */}
            <div className="text-center pt-1 px-4">
              <span className="text-[10px] sm:text-xs text-[#c6a35f] font-mono tracking-wider sm:tracking-widest animate-pulse font-semibold">
                {buttonHighlighted 
                  ? (isEn ? '✦ Candlelight ignited, click to embark ✦' : '✦ 烛火已引燃古老祭坛，点击启程 ✦') 
                  : (isEn ? '💡 Move candle / touch screen to illuminate 💡' : '💡 请将鼠标/滑动触摸屏引燃烛火点亮古老地宫 💡')}
              </span>
            </div>
          </motion.div>
        </div>
      </SpotlightCandle>
    </div>
  );
}
