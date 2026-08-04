import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, SkipForward, Play, Pause, ArrowRight, RotateCcw } from 'lucide-react';
import SpotlightCandle from './SpotlightCandle';
import { playClickSound, playWarpSound } from '../utils/audio';
import { getImageUrl } from '../utils/imageLoader';

interface Phase3DescentProps {
  onComplete: () => void;
  lang?: 'zh' | 'en';
}

export default function Phase3_Descent({ onComplete, lang = 'zh' }: Phase3DescentProps) {
  const isEn = lang === 'en';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15); // Fallback estimate
  const [autoPlay, setAutoPlay] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Play ambient warp sounds when entering
  useEffect(() => {
    playWarpSound();
  }, []);

  // Manage video HTML play/pause state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set 50% slower, epic speed for comfortable, serene reading
    video.playbackRate = 0.5;

    if (autoPlay) {
      video.play().catch(() => {
        // Handle autoplay blocking if user hasn't interacted yet
        setAutoPlay(false);
      });
    } else {
      video.pause();
    }
  }, [autoPlay, videoLoaded]);

  // Read current progress as a depth from 0.0 to 5.0 meters
  const depth = duration > 0 ? (currentTime / duration) * 5.0 : 0;

  // Staggered text slides based on depth progress (0m to 5m)
  const biographyVisible = depth > 0.1 && depth < 2.4;
  const tombIntroVisible = depth >= 2.4 && depth < 4.8;
  const bottomReached = depth >= 4.8;

  // Wheel scroll handler to scrub video forward or backward
  // deltaY < 0 is scrolling wheel forward -> advance
  // deltaY > 0 is scrolling wheel backward -> retreat
  const handleWheel = (e: React.WheelEvent) => {
    setAutoPlay(false);
    const video = videoRef.current;
    if (!video) return;

    // Direct scrubbing: change current time in small increments
    const increment = e.deltaY < 0 ? 0.35 : -0.35;
    let nextTime = video.currentTime + increment;
    nextTime = Math.max(0, Math.min(video.duration || 15, nextTime));
    
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  // Keyboard support for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        setAutoPlay(false);
        video.currentTime = Math.min(video.duration || 15, video.currentTime + 0.5);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        setAutoPlay(false);
        video.currentTime = Math.max(0, video.currentTime - 0.5);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setVideoLoaded(true);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onComplete();
  };

  // Dynamic candle light system (from daylight to deep candle illumination)
  const candleActive = depth > 2.5;
  const transitionProgress = Math.min(1, Math.max(0, (depth - 2.5) / 1.5)); // Fades in over 1.5 meters
  const dynamicRadius = candleActive ? 120 + transitionProgress * 380 : 0; // Gradually expand candle circle to bright 500px radius
  const dynamicOverlayAlpha = candleActive ? transitionProgress * 0.94 : 0; // Gradually make surrounding pitch black for deep tomb atmosphere
  const dynamicOverlayColor = `rgba(5, 4, 3, ${dynamicOverlayAlpha})`;

  return (
    <div 
      id="phase3-descent-container" 
      onWheel={handleWheel}
      className="w-full h-screen bg-black text-[#f2efeb] overflow-hidden relative select-none flex flex-col items-center"
    >
      {/* Interactive Candleglow Spotlight */}
      <SpotlightCandle active={candleActive} intensity="full" overlayColor={dynamicOverlayColor} customRadius={dynamicRadius}>
        
        {/* Borders for museum layout */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 z-30" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/10 z-30" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-white/10 z-30" />
        <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10 z-30" />

        {/* 2. Background Video Element */}
        <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={getImageUrl('/src/assets/7月21日(3).mp4')}
            className="w-full h-full object-cover opacity-100 filter brightness-[1.0] contrast-[1.01]"
            playsInline
            muted
            loop={false}
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setAutoPlay(false)}
          />
          {/* Suttle dark radial overlay over video for atmospheric depth and to naturally cover raw video prompt */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.1)_60%,rgba(0,0,0,0.92)_100%)] pointer-events-none" />
        </div>

        {/* 3. Live Depth HUD */}
        <div className="absolute top-8 left-12 z-30 flex items-center space-x-3 bg-black/95 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 font-mono shadow-xl text-xs">
          <Compass className="w-4 h-4 text-amber-500 animate-[spin_16s_linear_infinite]" />
          <div className="flex items-center space-x-2">
            <span className="text-[#f2efeb]/40">{isEn ? "Exploration Depth:" : "墓道探索深度:"}</span>
            <span className="text-amber-400 font-bold font-mono">-{depth.toFixed(1)} {isEn ? "m" : "米"}</span>
          </div>
          <div className="h-3 w-[1px] bg-white/15" />
          <div className="text-[10px] text-[#f2efeb]/50 tracking-wider">
            {autoPlay ? (isEn ? "Auto Cruise" : "自动探索模式") : (isEn ? "Manual Scroll" : "手动滚轮漫游中")}
          </div>
          {/* Autoplay toggler */}
          <button
            onClick={() => { playClickSound(); setAutoPlay(!autoPlay); }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-400 hover:bg-amber-500/25 transition-all cursor-pointer"
          >
            {autoPlay ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            <span>{autoPlay ? (isEn ? "Pause" : "暂停演示") : (isEn ? "Play" : "继续演示")}</span>
          </button>
        </div>

        {/* Skip button shifted left to avoid overlapping with top-right sound and language switch buttons */}
        <div className="absolute top-4 right-36 md:right-40 z-40">
          <button
            onClick={handleSkip}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/85 text-xs text-amber-200 hover:text-white hover:border-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer shadow-lg font-serif"
            title={isEn ? "Skip animation to enter tomb" : "跳过动画直接进入墓室"}
          >
            <span>{isEn ? "Skip Animation" : "跳过动画"}</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Large Fonts Text Card with Paragraph-by-Paragraph Fade-In */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[12%] z-20 px-4 w-full max-w-sm md:max-w-md flex flex-col items-center">
          
          <AnimatePresence mode="wait">
            {biographyVisible ? (
              <motion.div
                key="biography"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full bg-[#0c0906]/35 backdrop-blur-sm border border-[#8c6b43]/35 p-5 md:p-6 shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex flex-col items-center"
              >
                {/* Tang Dynasty Handscroll Wooden Dowel Ends (Left & Right Rods) */}
                <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#422e1a] via-[#8c6b43] to-[#422e1a] rounded-full shadow-inner" />
                <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#422e1a] via-[#8c6b43] to-[#422e1a] rounded-full shadow-inner" />
                
                {/* Exquisite corner bronze corners */}
                <div className="absolute top-1 left-2.5 w-1.5 h-1.5 border-t border-l border-amber-500/40" />
                <div className="absolute top-1 right-2.5 w-1.5 h-1.5 border-t border-r border-amber-500/40" />
                <div className="absolute bottom-1 left-2.5 w-1.5 h-1.5 border-b border-l border-amber-500/40" />
                <div className="absolute bottom-1 right-2.5 w-1.5 h-1.5 border-b border-r border-amber-500/40" />

                <span className="text-[10px] md:text-xs font-serif tracking-[0.2em] text-amber-500/80 mb-1 uppercase text-center font-medium">
                  ✦ {isEn ? "HISTORICAL SUMMARY" : "史料纪要"} ✦
                </span>
                
                {isEn && (
                  <h3 className="text-[7.5px] text-[#f2efeb]/25 font-mono tracking-[0.18em] mb-3 uppercase font-light text-center">
                    BIOGRAPHY OF THE MILITARY GOVERNOR
                  </h3>
                )}
                
                <h2 className="text-lg md:text-xl text-amber-400 font-serif font-bold tracking-[0.25em] mb-4 text-center">
                  {isEn ? "Owner Biography · Military Governor" : "墓主生平 · 卢龙重臣"}
                </h2>

                {/* Staggered Paragraph-by-Paragraph Fade-In with elegant, smaller typography and no borders */}
                <div className="flex flex-col space-y-3.5 text-[11px] md:text-xs text-amber-50/85 leading-relaxed font-serif tracking-wider text-justify pt-1 font-light w-full">
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {isEn ? (
                      <><strong>Liu Ji</strong> (757–810), Military Governor of Lulong in the late Tang Dynasty, guarded the northern border for decades.</>
                    ) : (
                      <><strong>刘济</strong>（757—810），晚唐幽州卢龙节度使，镇守幽燕北疆边防数十年。</>
                    )}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    {isEn ? (
                      <>He was a key regional governor highly relied upon by the imperial court, titled <strong>Prince of Pengcheng</strong>.</>
                    ) : (
                      <>他是朝廷极度倚重的核心藩镇重臣，册封<strong>彭城郡王</strong>，治军忠正、威震北疆。</>
                    )}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.2 }}
                  >
                    {isEn ? (
                      <>After a distinguished career, he passed away and was granted an imperial burial of paramount specifications.</>
                    ) : (
                      <>刘济一生功勋卓著，逝世后，唐朝以极其崇高的规格予以厚葬。</>
                    )}
                  </motion.p>
                </div>

                <div className="absolute -bottom-8 -right-8 text-9xl font-brush opacity-[0.02] text-amber-500 pointer-events-none select-none">{isEn ? "TANG" : "唐"}</div>
              </motion.div>
            ) : tombIntroVisible ? (
              <motion.div
                key="tomb_intro"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full bg-[#0c0906]/35 backdrop-blur-sm border border-[#8c6b43]/35 p-5 md:p-6 shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex flex-col items-center"
              >
                {/* Tang Dynasty Handscroll Wooden Dowel Ends (Left & Right Rods) */}
                <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#422e1a] via-[#8c6b43] to-[#422e1a] rounded-full shadow-inner" />
                <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#422e1a] via-[#8c6b43] to-[#422e1a] rounded-full shadow-inner" />
                
                {/* Exquisite corner bronze corners */}
                <div className="absolute top-1 left-2.5 w-1.5 h-1.5 border-t border-l border-amber-500/40" />
                <div className="absolute top-1 right-2.5 w-1.5 h-1.5 border-t border-r border-amber-500/40" />
                <div className="absolute bottom-1 left-2.5 w-1.5 h-1.5 border-b border-l border-amber-500/40" />
                <div className="absolute bottom-1 right-2.5 w-1.5 h-1.5 border-b border-r border-amber-500/40" />

                <span className="text-[10px] md:text-xs font-serif tracking-[0.2em] text-amber-500/80 mb-1 uppercase text-center font-medium">
                  ✦ {isEn ? "MAUSOLEUM LAYOUT" : "规制测绘"} ✦
                </span>
                
                {isEn && (
                  <h3 className="text-[7.5px] text-[#f2efeb]/25 font-mono tracking-[0.18em] mb-3 uppercase font-light text-center">
                    SPECIFICATIONS OF THE MAUSOLEUM
                  </h3>
                )}
                
                <h2 className="text-lg md:text-xl text-amber-400 font-serif font-bold tracking-[0.25em] mb-4 text-center">
                  {isEn ? "Tomb Structure · Grand Tang Standard" : "墓室介绍 · 晚唐顶格"}
                </h2>

                {/* Staggered Paragraph-by-Paragraph Fade-In with elegant, smaller typography and no borders */}
                <div className="flex flex-col space-y-3.5 text-[11px] md:text-xs text-amber-50/85 leading-relaxed font-serif tracking-wider text-justify pt-1 font-light w-full">
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {isEn ? (
                      <>This tomb is a joint burial for <strong>Liu Ji and Lady Zhang</strong>, showcasing grand scale and high specifications.</>
                    ) : (
                      <>本大墓为<strong>刘济与夫人张氏</strong>的大型夫妻合葬墓，规制宏大，形制极高，是晚唐顶级藩镇墓葬的典型代表。</>
                    )}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    {isEn ? (
                      <>The tomb is cut along the hillside, descending through a long <strong>sloping passageway</strong> to connect chambers.</>
                    ) : (
                      <>整墓依山势斜切，由长达数十米的<strong>斜坡墓道</strong>倾斜而下，依次连接天井、耳室、壁龛、主室及后室。</>
                    )}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.2 }}
                  >
                    {isEn ? (
                      <>The brick walls are painted with vibrant music, dance, and courtly murals, forming an underground epic.</>
                    ) : (
                      <>墓室砖壁上绘满了绚烂繁华的乐舞与朝谒彩绘壁画，堪称地下晚唐政治与礼乐的微缩史诗。</>
                    )}
                  </motion.p>
                </div>

                <div className="absolute -bottom-8 -right-8 text-9xl font-brush opacity-[0.02] text-amber-500 pointer-events-none select-none">{isEn ? "TOMB" : "墓"}</div>
              </motion.div>
            ) : bottomReached ? (
              <motion.div
                key="bottom_reached"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full bg-[#0c0906]/35 backdrop-blur-sm border border-[#8c6b43]/35 p-5 md:p-6 shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex flex-col items-center text-center"
              >
                {/* Tang Dynasty Handscroll Wooden Dowel Ends (Left & Right Rods) */}
                <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#422e1a] via-[#8c6b43] to-[#422e1a] rounded-full shadow-inner" />
                <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#422e1a] via-[#8c6b43] to-[#422e1a] rounded-full shadow-inner" />
                
                {/* Exquisite corner bronze corners */}
                <div className="absolute top-1 left-2.5 w-1.5 h-1.5 border-t border-l border-amber-500/40" />
                <div className="absolute top-1 right-2.5 w-1.5 h-1.5 border-t border-r border-amber-500/40" />
                <div className="absolute bottom-1 left-2.5 w-1.5 h-1.5 border-b border-l border-amber-500/40" />
                <div className="absolute bottom-1 right-2.5 w-1.5 h-1.5 border-b border-r border-amber-500/40" />

                <span className="text-[10px] md:text-xs font-serif tracking-[0.2em] text-[#c6a35f] mb-1 uppercase font-medium">
                  ✦ {isEn ? "ARRIVED AT TOMB" : "抵达地宫"} ✦
                </span>
                
                {isEn && (
                  <h3 className="text-[7.5px] text-[#f2efeb]/25 font-mono tracking-[0.18em] mb-3 uppercase font-light text-center">
                    IMMERSION ARRIVAL UNDERGROUND
                  </h3>
                )}
                
                <h2 className="text-lg md:text-xl text-amber-300 font-serif font-bold tracking-[0.25em] mb-3.5">
                  {isEn ? "Passageway Cleared · Entering Antechamber" : "已穿过墓道 · 抵达前甬道"}
                </h2>
                <p className="text-[11px] md:text-xs text-amber-50/80 font-serif tracking-wide leading-relaxed mb-5 max-w-xs mx-auto text-justify">
                  {isEn 
                    ? "The dim candlelight gradually illuminates the deep brick carvings. Click below to step into the five main chambers." 
                    : "“微弱的烛火渐渐照亮了幽深的砖雕石券。前方即为承载着千年风华的长沟大墓正殿，点击下方按钮，步入地宫轴线五重空间的漫游之旅。”"}
                </p>
                <button
                  onClick={() => { playClickSound(); onComplete(); }}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-black font-serif font-bold text-xs md:text-sm tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer"
                >
                  <span>{isEn ? "Step Into Tomb Chambers" : "踏入地宫正殿"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* 5. Interactive Compass/Scrub Dial */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border-2 border-amber-500/50 bg-black/90 flex items-center justify-center shadow-2xl">
            {/* Outer ticks */}
            <div className="absolute inset-1 rounded-full border border-amber-500/20 animate-[spin_60s_linear_infinite]" />
            {/* Rotating pattern based on depth */}
            <div 
              style={{ transform: `rotate(${depth * 144}deg)`, transition: 'transform 0.15s ease-out' }}
              className="absolute inset-2.5 rounded-full border border-dashed border-amber-500/40 flex items-center justify-center"
            >
              <div className="w-[1.5px] h-full bg-gradient-to-t from-transparent via-amber-500/60 to-transparent" />
              <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent absolute" />
            </div>
            {/* Elegant static compass core crosshair (replacing interactive play/pause button to simplify user interaction) */}
            <div className="w-8 h-8 rounded-full bg-[#1c130d]/95 border border-amber-500/50 flex items-center justify-center shadow-md z-10 pointer-events-none select-none">
              <span className="text-[10px] font-serif font-bold text-amber-500/80">N</span>
            </div>
          </div>
          <span className="text-[10px] text-amber-400/90 font-mono tracking-widest mt-2.5 bg-black/85 px-4 py-1.5 rounded-full border border-white/10 shadow-lg select-none">
            {depth >= 4.8 ? (isEn ? "✦ Bottom Reached (5.0m) ✦" : "✦ 抵达底端 (5.0米) ✦") : (isEn ? "🖱️ Scroll wheel forward to descend · Backward to retreat 🖱️" : "🖱️ 向前滚动滚轮深入 · 向后滚动后退 🖱️")}
          </span>
        </div>

        {/* 6. Live progress indicator bar */}
        <div className="absolute bottom-36 left-0 right-0 z-30 flex flex-col items-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-2 text-center"
          >
            <div className="flex items-center space-x-2 text-[10px] text-amber-500/90 font-mono tracking-[0.3em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>{isEn ? "DESCENDING UNDERGROUND" : "地下下潜中"}</span>
            </div>
            
            <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden mt-1 relative">
              <div 
                style={{ width: `${(currentTime / (duration || 15)) * 100}%` }}
                className="h-full bg-amber-500 transition-all duration-100 ease-out"
              />
            </div>
            <div className="text-[9px] text-[#f2efeb]/40 font-mono tracking-widest mt-1">
              {((currentTime / (duration || 15)) * 100).toFixed(0)}% — {isEn ? "Entering tomb roaming hall..." : "正在进入地宫漫游大厅..."}
            </div>
          </motion.div>
        </div>
        
      </SpotlightCandle>
    </div>
  );
}
