import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDownCircle, Info, Compass, Eye, MapPin, Navigation } from 'lucide-react';
import { playClickSound, playWarpSound } from '../utils/audio';
import { getImageUrl } from '../utils/imageLoader';

interface Phase3MoundProps {
  onEnterTomb: () => void;
  lang?: 'zh' | 'en';
}

type ViewpointType = 'way' | 'mound_close' | 'descent_mouth';

interface Hotspot {
  id: string;
  label: string;
  labelEn: string;
  left: string;
  top: string;
  z: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
}

const VIEWPOINT_HOTSPOTS: Record<ViewpointType, Hotspot[]> = {
  way: [
    {
      id: 'mound',
      label: '封土',
      labelEn: 'Earthen Mound',
      left: '49%',
      top: '41%',
      z: '10px',
      title: '覆斗形封土',
      titleEn: 'Truncated Pyramid Mound',
      desc: '房山长沟大墓地表封土筑造极为宏伟，底边长约40米、宽约34米。其形制为唐代高规格墓葬所特有的“覆斗形”，历经千载风雨，今仍如小山般巍然耸立，显示了墓主人生前显赫至极的身世地位。',
      descEn: 'The surface earthen mound of Changgou Tomb measures approximately 40m long and 34m wide. Built in the shape of a truncated pyramid typical of high-grade Tang Dynasty tombs, it displays the noble status of the tomb owner.'
    },
    {
      id: 'superstructure',
      label: '墓上建筑',
      labelEn: 'Above-ground Hall',
      left: '39%',
      top: '68%',
      z: '15px',
      title: '墓上享堂建筑遗存',
      titleEn: 'Sacrificial Shrine Relics',
      desc: '在大平砖铺设的祭道及斜坡墓道侧翼，考古发现了大量排列规整的柱础石、础坑以及享堂房屋地基。这表明大墓地表曾筑有宏大的祭祀大殿，用于举办隆重的宗族祭祖与节度使祭祀典礼。',
      descEn: 'Archaeologists discovered pillar foundation stones and building foundations along the sacrificial path, indicating that a grand ancestral hall once stood above the tomb for ceremonial rites.'
    }
  ],
  mound_close: [
    {
      id: 'mound_rammed',
      label: '夯土层理',
      labelEn: 'Rammed Earth Layers',
      left: '50%',
      top: '36%',
      z: '8px',
      title: '古法夯筑工艺',
      titleEn: 'Ancient Rammed Earth Craft',
      desc: '此封土高耸巍峨，是由黄土掺杂碎石渣逐层夯筑而成。每层夯土厚约15-20厘米，夯窝密集，历经千百年冲刷依然极其坚固不崩。',
      descEn: 'The mound was constructed layer by layer using loess mixed with gravel. Each rammed layer is 15-20 cm thick and remains extremely solid after a thousand years.'
    }
  ],
  descent_mouth: [
    {
      id: 'ramp_entry',
      label: '墓门斜坡',
      labelEn: 'Tomb Entrance Ramp',
      left: '35%',
      top: '55%',
      z: '12px',
      title: '深隧斜坡墓道',
      titleEn: 'Deep Sloping Passageway',
      desc: '直坠而下的缓坡阶梯状通道，两壁粉饰白灰并精绘有威仪凛凛的晚唐出游仪仗与乐舞壁画，直通幽暗的地下主墓室。',
      descEn: 'A deep stepped sloping ramp leading down. Both side walls were plastered and painted with Late Tang honor guard and dance murals, leading directly to the underground chamber.'
    }
  ]
};

export default function Phase3_Mound({ onEnterTomb, lang = 'zh' }: Phase3MoundProps) {
  const isEn = lang === 'en';
  const [zoom, setZoom] = useState(1.05);
  const [showHUD, setShowHUD] = useState(true);
  
  // Custom states for interactive markers and roaming spots
  const [currentSpot, setCurrentSpot] = useState<ViewpointType>('way');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  // States for 360 panorama drag panning
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEntering) return;
    setIsDragging(true);
    dragStartX.current = e.clientX - panOffset;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isEntering) return;
    const newPan = e.clientX - dragStartX.current;
    // Limit panning to +/- 360px for elegant look-around margins
    const maxPan = 380;
    setPanOffset(Math.max(-maxPan, Math.min(maxPan, newPan)));
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEntering) return;
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX - panOffset;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isEntering) return;
    const newPan = e.touches[0].clientX - dragStartX.current;
    const maxPan = 380;
    setPanOffset(Math.max(-maxPan, Math.min(maxPan, newPan)));
  };

  // Roam to target viewpoint - Smooth cinema translation panning and zoom
  const handleRoamToSpot = (spot: ViewpointType) => {
    playClickSound();
    setCurrentSpot(spot);
    setActiveTooltip(null);
    setPanOffset(0); // Reset horizontal panning when switching points
    
    if (spot === 'way') {
      setZoom(1.02);
    } else if (spot === 'mound_close') {
      setZoom(1.15);
    } else if (spot === 'descent_mouth') {
      setZoom(1.1);
    }
  };

  const triggerEnteringSequence = () => {
    if (isEntering) return;
    setIsEntering(true);
    playWarpSound();
    setZoom(1.4); // Deep zoom transition
    
    // Smooth transition into descent
    setTimeout(() => {
      onEnterTomb();
    }, 2500);
  };

  // Dynamic cinema translation offsets for physical roaming feel (flat 2D panning)
  const getSpotOffsets = () => {
    switch (currentSpot) {
      case 'mound_close':
        return { x: 50, y: -20 };
      case 'descent_mouth':
        return { x: -60, y: -40 };
      case 'way':
      default:
        return { x: 0, y: 0 };
    }
  };

  const offsets = getSpotOffsets();

  return (
    <div
      id="phase3-container"
      className="w-full h-screen bg-[#070503] text-[#ebdcc8] select-none overflow-hidden relative flex flex-col justify-between"
    >
      {/* Dynamic Sky Dome Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#090b11] via-[#151a24] to-[#070503] opacity-95" />

      {/* Interactive World Area */}
      <div 
        style={{ perspective: '1200px' }}
        className="absolute inset-0 z-1 flex items-center justify-center overflow-hidden pointer-events-none"
      >
        <div 
          style={{
            transform: `translate3d(${offsets.x}px, ${offsets.y}px, 0px) scale(${zoom})`,
            transition: isEntering ? 'transform 2.5s ease-in-out' : 'transform 1.2s cubic-bezier(0.15, 0.85, 0.25, 1)'
          }}
          className="relative w-full max-w-7xl h-[85vh] md:h-[90vh] flex items-center justify-center rounded-none overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-[#8c6b43]/30 bg-black pointer-events-auto"
        >
          {/* Panning 360 Canvas wrapping both image and markers */}
          <div
            style={{
              transform: `translateX(calc(-50% + ${panOffset}px))`,
              left: '50%',
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.15, 0.85, 0.25, 1)'
            }}
            className="absolute top-0 bottom-0 w-[150%] md:w-[130%] h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
          >
            {/* Main Panorama Image resembling Figure 1 perfectly (without people, no side pits) */}
            <img
              src={getImageUrl('/src/assets/images/图片生成-1784640069970.png')}
              alt="唐代长沟大墓地表封土堆全景"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-[1200ms] ${isEntering ? 'scale-110 blur-[1px] brightness-70' : 'brightness-105 contrast-[1.02]'}`}
            />

            {/* Simple subtle bottom overlay - No dark vignette edges on sides */}
            <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* Render dynamic hotspots based on current active viewpoint */}
            {VIEWPOINT_HOTSPOTS[currentSpot].map((hotspot) => (
              <div 
                key={hotspot.id}
                style={{
                  left: hotspot.left,
                  top: hotspot.top,
                }}
                className="absolute z-10 pointer-events-auto flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  setActiveTooltip(activeTooltip === hotspot.id ? null : hotspot.id);
                }}
              >
                {/* Standard white circle cursor */}
                <div className="relative cursor-pointer flex flex-col items-center group">
                  <div className="absolute w-6 h-6 rounded-full bg-white/25 animate-ping pointer-events-none" />
                  <div className="w-3.5 h-3.5 rounded-full bg-white border border-neutral-900 shadow-[0_0_10px_rgba(255,255,255,0.9)] group-hover:scale-125 transition-transform" />
                  
                  {/* Ancient rustic label capsule - Fixed relative overriding absolute bug */}
                  <div className="absolute -top-10 px-3 py-1 bg-[#1a130e] border border-[#8c6b43] text-[#ebdcc8] shadow-lg text-[11px] font-serif tracking-widest whitespace-nowrap select-none pointer-events-none flex items-center space-x-1">
                    <div className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 border border-[#4a3a27]/50 pointer-events-none" />
                    <span className="relative z-10">{isEn ? hotspot.labelEn : hotspot.label}</span>
                  </div>
                </div>

                {/* 古朴提示框: Rustic Ancient Scroll Styled Tooltip - Fixed relative overriding absolute bug */}
                <AnimatePresence>
                  {activeTooltip === hotspot.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute top-8 w-64 bg-[#1a130e]/98 border-2 border-[#8c6b43] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.85)] text-[11px] leading-relaxed text-[#ebdcc8] z-30 rounded-none"
                    >
                      {/* Ancient brass inner frame & corners decoration */}
                      <div className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 border border-[#4d3c29] pointer-events-none" />
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#b89463] pointer-events-none" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#b89463] pointer-events-none" />
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#b89463] pointer-events-none" />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#b89463] pointer-events-none" />
                      
                      <p className="font-serif relative z-10">
                        <strong className="text-[#e6c280] block mb-1 text-xs border-b border-[#4d3c29] pb-1">
                          ❖ {isEn ? hotspot.titleEn : hotspot.title}
                        </strong>
                        {isEn ? hotspot.descEn : hotspot.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* ==================== Permanent Interactive Marker: "墓室入口 / 进入墓道" (The deep ramp entryway) ==================== */}
            {currentSpot === 'way' && (
              <div 
                style={{
                  left: '50%',
                  top: '74%',
                }}
                className="absolute z-25 pointer-events-auto cursor-pointer -translate-x-1/2 -translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerEnteringSequence();
                }}
              >
                <div className="relative flex flex-col items-center justify-center group">
                  {/* Pulsing deep glowing circles */}
                  <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
                  <div className="absolute -inset-6 bg-amber-600/15 rounded-full blur-md animate-ping pointer-events-none" />
                  
                  {/* Floating downwards arrow */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-10 h-10 rounded-full bg-[#1a130e] border border-[#8c6b43] text-[#ebdcc8] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:border-amber-400 group-hover:text-amber-300 transition-all"
                  >
                    <ArrowDownCircle className="w-6 h-6 animate-pulse text-[#b89463]" />
                  </motion.div>
                  
                  {/* Ancient label */}
                  <div className="mt-2 bg-[#1a130e]/95 border border-[#8c6b43] px-2.5 py-1 text-[10px] text-[#ebdcc8] font-serif tracking-widest whitespace-nowrap shadow-xl">
                    <div className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 border border-[#4a3a27]/40 pointer-events-none" />
                    <span className="relative z-10">
                      {isEn ? 'Click to Enter Underground Tomb (Ramp)' : '点此进入地宫 (下坡)'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Overlay Header */}
      <header className="w-full z-20 px-8 py-5 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-3">
          <span className="text-[#ebdcc8] font-serif font-black tracking-widest text-base">
            {isEn ? 'Surface Mound Exploration' : '地表封土漫游'}
          </span>
          <span className="text-[10px] text-[#b89463] bg-[#1a130e] px-2 py-0.5 border border-[#8c6b43]/40 font-serif font-semibold">
            {isEn ? 'Changgou Tang Tomb, Fangshan' : '房山长沟唐代大墓'}
          </span>
        </div>

        {/* Informational badges substituting drag options */}
        <div className="hidden lg:flex items-center space-x-6 text-[11px] text-amber-100/60 font-serif">
          <span className="flex items-center space-x-1.5 bg-[#1a130e]/80 px-3 py-1 border border-[#8c6b43]/30">
            <Compass className="w-3.5 h-3.5 text-[#b89463]" />
            <span>{isEn ? 'Carved in Mountain · 34m Long' : '依山凿穴 · 全长 34 米'}</span>
          </span>
        </div>

        {/* HUD toggle shifted left to avoid overlapping sound/language buttons */}
        <button
          onClick={() => {
            playClickSound();
            setShowHUD(!showHUD);
          }}
          className="p-1.5 border border-[#8c6b43] bg-[#1a130e] hover:bg-[#251b14] transition-colors text-[#ebdcc8] flex items-center space-x-1 text-xs px-3 shadow-md pointer-events-auto relative mr-44 md:mr-52"
        >
          <div className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 border border-[#4a3a27]/40 pointer-events-none" />
          <Info className="w-3.5 h-3.5 text-[#b89463] relative z-10" />
          <span className="relative z-10">
            {showHUD ? (isEn ? 'Hide Brief' : '隐藏简报') : (isEn ? 'Show Brief' : '查看简报')}
          </span>
        </button>
      </header>

      {/* Left Side Interactive HUD Panel in 古朴 Style */}
      <AnimatePresence>
        {showHUD && !isEntering && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="absolute left-3 sm:left-4 md:left-6 top-14 md:top-20 z-20 w-[210px] sm:w-[250px] md:w-72 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar bg-[#17120e]/85 backdrop-blur-md border-2 border-[#8c6b43] shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-2.5 md:p-4 text-[#ebdcc8] font-serif pointer-events-auto rounded-none"
          >
            {/* Ancient corner & border decorations */}
            <div className="absolute top-1 left-1 right-1 bottom-1 border border-[#4a3a27] pointer-events-none" />
            <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#b89463] pointer-events-none" />
            <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#b89463] pointer-events-none" />
            <div className="absolute bottom-0.5 left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#b89463] pointer-events-none" />
            <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#b89463] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center space-x-1.5 text-[#b89463] border-b border-[#4a3a27] pb-1.5 md:pb-2 mb-2 md:mb-3">
                <Compass className="w-4 h-4 animate-[spin_30s_linear_infinite]" />
                <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase">
                  {isEn ? "Changgou Tomb Overview" : "长沟大墓地表全貌"}
                </h2>
              </div>

              {/* Figure diagram / illustration for mound structure */}
              <div className="mb-2 md:mb-3 overflow-hidden border border-[#8c6b43]/60 shadow-lg bg-black/80 p-0.5">
                <img 
                  src={getImageUrl('/src/assets/images/1cc77b0159e427664826b4d44e7e01b2.png')} 
                  alt={isEn ? "Mound Structure Blueprint" : "封土堆与地宫结构剖视图"} 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-28 md:max-h-36 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              <p className="text-xs md:text-sm text-[#ebdcc8]/90 leading-relaxed mb-2 md:mb-3 text-justify">
                {isEn 
                  ? "Changgou Tomb is carved into the mountain with a total length of 34 meters. The surface features a grand truncated pyramid mound."
                  : "房山长沟唐大墓依山凿穴，全长 34 米。由墓道、甬道、东西壁龛、主室、侧室、后室对称排布。地表上则保留着巍峨宏大的覆斗状夯土封土。"}
              </p>

              <div className="space-y-1 md:space-y-1.5 text-xs md:text-sm border-t border-[#4a3a27] pt-2 md:pt-3">
                <div className="flex justify-between bg-neutral-900/40 p-1.5 md:p-2 rounded-none border border-[#4a3a27]/50">
                  <span className="text-[#ebdcc8]/60">{isEn ? 'Position' : '当前位置'}</span>
                  <span className="font-semibold text-[#ebdcc8]">
                    {currentSpot === 'way' && (isEn ? 'Sacred Way Relics' : '地表神道遗址')}
                    {currentSpot === 'mound_close' && (isEn ? 'Mound Slope Base' : '封土基底护坡')}
                    {currentSpot === 'descent_mouth' && (isEn ? 'Tomb Portal Area' : '墓门祭祀台区')}
                  </span>
                </div>
                <div className="flex justify-between bg-neutral-900/40 p-1.5 md:p-2 rounded-none border border-[#4a3a27]/50">
                  <span className="text-[#ebdcc8]/60">{isEn ? 'Mound Height' : '封土高度'}</span>
                  <span className="font-semibold text-[#ebdcc8]">12.5 {isEn ? 'm' : '米'}</span>
                </div>
                <div className="flex justify-between bg-neutral-900/40 p-1.5 md:p-2 rounded-none border border-[#4a3a27]/50">
                  <span className="text-[#ebdcc8]/60">{isEn ? 'Structure' : '地下规制'}</span>
                  <span className="font-semibold text-[#ebdcc8]">{isEn ? 'Symmetrical Layout' : '对称排布规制'}</span>
                </div>
              </div>

              {/* Viewpoint Navigation Details */}
              <div className="hidden md:flex mt-4 p-2.5 bg-[#201914] border border-[#4a3a27] items-start space-x-2">
                <Eye className="w-4 h-4 text-[#b89463] mt-0.5 shrink-0" />
                <div className="text-xs md:text-sm text-[#ebdcc8]/90 leading-relaxed">
                  {currentSpot === 'way' && (isEn ? 'At Sacred Way, observe symmetrical ceremonial stone carvings.' : '在神道点，您可以端详对称陈列的仪仗神道石刻。')}
                  {currentSpot === 'mound_close' && (isEn ? 'At Mound Base, view rammed earth craftsmanship up close.' : '在封土点，您可以近距离端详古人依山凿穴、对称排筑的痕痕。')}
                  {currentSpot === 'descent_mouth' && (isEn ? 'At Tomb Portal, look down into the sloping ramp. Click arrow to descend.' : '在墓口点，可以俯视直坠而下的缓坡。点击下方箭头即可穿行下沉。')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Side Viewpoint Controller (Roaming Spots Selector) in 古朴 Style */}
      {!isEntering && (
        <div className="absolute right-4 md:right-6 top-16 md:top-24 z-20 flex flex-col space-y-3 pointer-events-auto">
          <div className="bg-[#17120e]/75 backdrop-blur-md border-2 border-[#8c6b43] p-2 md:p-4 shadow-2xl w-32 md:w-48 font-serif relative rounded-none">
            {/* Ancient corner & border decorations */}
            <div className="absolute top-1 left-1 right-1 bottom-1 border border-[#4a3a27] pointer-events-none" />
            <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#b89463] pointer-events-none" />
            <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#b89463] pointer-events-none" />
            <div className="absolute bottom-0.5 left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#b89463] pointer-events-none" />
            <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#b89463] pointer-events-none" />

            <div className="relative z-10">
              <span className="text-[9px] md:text-xs text-[#b89463] font-bold uppercase tracking-widest block mb-1.5 md:mb-3 border-b border-[#4a3a27] pb-1">
                {isEn ? 'Viewpoint Navigation' : '观景点位切换'}
              </span>

              <div className="space-y-1 md:space-y-2">
                {[
                  { id: 'way', name: isEn ? 'Sacred Way' : '神道远景', desc: isEn ? 'Mound & Path' : '神道与封土全貌' },
                  { id: 'mound_close', name: isEn ? 'Mound Base' : '封土近景', desc: isEn ? 'Rammed Layers' : '夯土筑造层理' },
                  { id: 'descent_mouth', name: isEn ? 'Tomb Ramp' : '墓口近景', desc: isEn ? 'Descend Entrance' : '地下斜坡墓道口' },
                ].map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => {
                      playClickSound();
                      setCurrentSpot(spot.id as ViewpointType);
                      setActiveTooltip(null);
                    }}
                    className={`w-full p-1.5 md:p-2 text-left transition-all border cursor-pointer relative ${
                      currentSpot === spot.id
                        ? 'bg-[#8c6b43]/30 border-[#b89463] text-amber-200 shadow-md'
                        : 'bg-black/30 border-[#4a3a27] hover:border-[#8c6b43] text-[#ebdcc8]/60 hover:text-[#ebdcc8]'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 md:space-x-2">
                      <MapPin className={`w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 ${currentSpot === spot.id ? 'text-amber-400' : 'text-[#8c6b43]'}`} />
                      <div>
                        <div className="text-[10px] md:text-xs font-bold font-serif">{spot.name}</div>
                        <div className="text-[8px] md:text-[9px] text-[#ebdcc8]/40 hidden md:block">{spot.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen flash on transit with White Gradient text style */}
      {isEntering && (
        <div className="absolute inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
          {/* Spatial warp tunnel with perspective distortion and micro rotation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: '800px' }}>
            <motion.div
              initial={{ rotate: 0, scale: 0.95 }}
              animate={{ rotate: [0, 4, -4, 6], scale: [1, 1.2, 1.35, 1.6] }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="w-full h-full opacity-60 bg-[radial-gradient(circle_at_center,rgba(197,143,78,0.25)_0%,transparent_70%)]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center font-serif text-[#ebdcc8] z-10 px-4"
          >
            <h2 className="text-2xl md:text-4xl font-bold tracking-[0.3em] mb-3 text-amber-200">
              {isEn ? "DESCENDING TO UNDERGROUND TOMB..." : "正在穿行下沉至地下地宫..."}
            </h2>
            <p className="text-xs md:text-sm text-[#b89463] font-mono tracking-widest">
              {isEn ? "ENTERING SLOPING RAMP & MURAL HALL" : "即将开启斜坡墓道与穹窿顶大壁画展厅"}
            </p>
          </motion.div>
        </div>
      )}

      {/* Footer Navigation Help */}
      <footer className="w-full z-20 p-4 bg-[#110d0a] border-t border-[#4d3a27] flex justify-between items-center text-[10px] text-amber-100/50 font-serif">
        <span>{isEn ? 'Status: Surface Mound Exploration' : '当前状态: 地表封土漫游'}</span>
        <span className="animate-pulse text-amber-400 font-medium">
          {isEn 
            ? '✦ Carved into mountain, 34m long. Select viewpoints or click arrow to descend ✦' 
            : '✦ 依山凿穴、全长 34 米，点击右侧观测点进行漫游，或点击中央箭头开始下探 ✦'}
        </span>
        <span className="opacity-0 select-none pointer-events-none">房山长沟大墓地表遗址</span>
      </footer>
    </div>
  );
}
