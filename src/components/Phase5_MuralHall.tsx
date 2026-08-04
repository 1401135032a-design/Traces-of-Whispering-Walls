import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SpotlightCandle from './SpotlightCandle';
import { 
  Sparkles, Music, Wind, Compass, 
  ArrowLeft, ArrowRight, Eye, Hammer, X 
} from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { getImageUrl } from '../utils/imageLoader';

interface Phase5MuralHallProps {
  onBackToHome: () => void;
  onGoToWorkshop: () => void;
  lang?: 'zh' | 'en';
}

interface GalleryMural {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionEn?: string;
  era: string;
  eraEn?: string;
  icon: string;
  bgColor: string;
  image: string; // we'll use our generated high-res restored or damaged murals here
}

export default function Phase5_MuralHall({ onBackToHome, onGoToWorkshop, lang = 'zh' }: Phase5MuralHallProps) {
  const isEn = lang === 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMural, setSelectedMural] = useState<GalleryMural | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const murals: GalleryMural[] = [
    {
      id: 'mural_gongnv_yongtai',
      title: 'Maidens of the Court',
      titleZh: '宫女图',
      description: '这幅《宫女图》保存极完整，图中描绘了九位风姿绰约的宫女，头梳高髻，肩披纱巾，长裙曳地，个个体态丰盈，婀娜多姿。她们手捧方盒、酒杯、拂尘、如意、团扇、蜡烛等，在女官领头下款款徐行，低语凝神，生动传神。',
      descriptionEn: 'Painted on the east wall of the front chamber in Princess Yongtai’s tomb (706 AD), this masterpiece portrays nine graceful court maidens holding ritual objects in an elegant procession.',
      era: '唐·神龙二年 (公元706年) · 永泰公主墓',
      eraEn: 'Tang Dynasty (706 AD) · Tomb of Princess Yongtai',
      icon: '🌸',
      bgColor: 'from-[#251e2b] to-[#0f0c12]',
      image: '/src/assets/images/宫女图.jpg'
    },
    {
      id: 'mural_shoulie_zhanghuai',
      title: 'Royal Hunting Procession',
      titleZh: '狩猎图',
      description: '《狩猎图》长达8.9米，截取时分为四部分。图中现有46位人物，最前方是探路随从，两侧为执旗卫士，后随辎重骆驼。中间一组人马共有六排，应是狩猎出行的皇室贵族及其随从，气势恢宏。',
      descriptionEn: 'Spanning 8.9 meters, this monumental mural captures 46 figures, noble horses, hounds, and hunting falcons on a royal expedition during the Tang Dynasty.',
      era: '唐·神龙二年 (公元706年) · 章怀太子墓',
      eraEn: 'Tang Dynasty (706 AD) · Tomb of Crown Prince Zhanghuai',
      icon: '🦅',
      bgColor: 'from-[#2a1d12] to-[#120b06]',
      image: '/src/assets/images/狩猎图.png'
    },
    {
      id: 'mural_lewu_susixu',
      title: 'Grand Music & Dance',
      titleZh: '乐舞图',
      description: '《乐舞图》全长4.1米，占据墓室东壁。中间为舞者在黄氍毹毯上翩跹起舞，两侧为12人宫廷乐队，分排演奏琵琶、笙、铜钹、横笛、拍板，抚腰歌唱，盛唐礼乐气象呼之欲出。',
      descriptionEn: 'Measuring 4.1 meters across the tomb wall, this mural shows a 12-piece Tang court orchestra playing pipas, flutes, and sheng while a dancer performs on a carpet.',
      era: '唐·天宝三载 (公元744年) · 苏思勖墓',
      eraEn: 'Tang Dynasty (744 AD) · Tomb of Su Sixu',
      icon: '🪕',
      bgColor: 'from-[#1c221a] to-[#0a0e09]',
      image: '/src/assets/images/乐舞图.png'
    },
    {
      id: 'mural_quelou_yide',
      title: 'Que Imperial Watchtower',
      titleZh: '阙楼图',
      description: '《阙楼图》为帝王级别的“三出阙”建制，梁架柱栱朱红，墙壁刷白，青绿彩画，界尺工整。展示了唐代最高等级的阙楼建筑风貌与建筑彩画古法。',
      descriptionEn: 'Demonstrating imperial triple-gate (San-chu-que) watchtower architecture with vermillion bracket complexes, intricate dougong, and green tiles from Prince Yide’s tomb.',
      era: '唐·神龙二年 (公元706年) · 懿德太子墓',
      eraEn: 'Tang Dynasty (706 AD) · Tomb of Crown Prince Yide',
      icon: '🏯',
      bgColor: 'from-[#2e1d24] to-[#140b0f]',
      image: '/src/assets/images/阙楼图.png'
    }
  ];

  const getCardAnimation = (idx: number) => {
    const total = murals.length;
    let diff = idx - currentIndex;
    if (diff < -total / 2) {
      diff += total;
    }
    if (diff > total / 2) {
      diff -= total;
    }

    const isActive = diff === 0;
    const isLeft = diff === -1;
    const isRight = diff === 1;

    const isMobile = windowWidth < 768;
    const translateXOffset = isMobile ? 120 : 360;

    if (isActive) {
      return {
        x: 0,
        scale: 1.12,
        rotateY: 0,
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto' as const,
      };
    } else if (isLeft) {
      return {
        x: -translateXOffset,
        scale: 0.82,
        rotateY: 25,
        opacity: 0.45,
        zIndex: 20,
        pointerEvents: 'auto' as const,
      };
    } else if (isRight) {
      return {
        x: translateXOffset,
        scale: 0.82,
        rotateY: -25,
        opacity: 0.45,
        zIndex: 20,
        pointerEvents: 'auto' as const,
      };
    } else {
      return {
        x: diff > 0 ? translateXOffset * 1.8 : -translateXOffset * 1.8,
        scale: 0.5,
        rotateY: diff > 0 ? -45 : 45,
        opacity: 0,
        zIndex: 10,
        pointerEvents: 'none' as const,
      };
    }
  };

  return (
    <div id="phase5-container" className="w-full h-screen bg-[#0d0907] text-amber-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Spotlight Wrapper is kept disabled/inactive on load so everything is fully lit up and candle cursor disappears */}
      <SpotlightCandle active={false} intensity="none" blurLevel="blur-none" overlayColor="rgba(6, 5, 4, 0.72)">
        
        {/* Museum background wall texture */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center p-4 overflow-hidden"
          style={{
            backgroundColor: '#120f0d',
            backgroundImage: `
              radial-gradient(circle at 50% 40%, rgba(185, 145, 105, 0.28) 0%, rgba(15, 12, 10, 0.98) 100%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
            `
          }}
        >
          {/* Subtle stone wall brick lines */}
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:120px_80px]" />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3d2a1a_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          <div className="max-w-7xl w-full text-center mb-4 z-20 h-4">
            {/* Centered spacing instead of repetitive title */}
          </div>

          {/* 3D Ring Carousel Selector for the Murals */}
          <div className="relative max-w-5xl w-full px-4 z-20 flex items-center justify-between gap-4 h-[60vh] overflow-visible">
            
            {/* Left Button */}
            <button
              onClick={() => {
                playClickSound();
                setCurrentIndex((prev) => (prev - 1 + murals.length) % murals.length);
              }}
              className="absolute left-2 md:left-6 w-12 h-12 rounded-full border border-amber-600/30 bg-[#15100c]/90 text-amber-400 hover:bg-neutral-900 hover:text-amber-300 flex items-center justify-center transition-all shadow-2xl hover:border-amber-400/80 active:scale-95 cursor-pointer z-40 shrink-0"
              title={isEn ? "Previous Mural" : "上一个壁画"}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* 3D Ring Carousel Container */}
            <div className="flex-1 h-full relative flex items-center justify-center overflow-visible [perspective:1200px]">
              {murals.map((mural, idx) => {
                const animationState = getCardAnimation(idx);
                const isActive = idx === currentIndex;
                
                return (
                  <motion.div
                    key={mural.id}
                    style={{ position: 'absolute' }}
                    animate={animationState}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    className={`w-[260px] md:w-[460px] h-[48vh] md:h-[52vh] rounded-2xl border overflow-hidden bg-black shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col cursor-pointer transition-colors duration-300 ${
                      isActive ? 'border-amber-400/60 shadow-amber-500/10' : 'border-neutral-900 opacity-60 hover:border-amber-900/40'
                    }`}
                    onClick={() => {
                      playClickSound();
                      if (isActive) {
                        setSelectedMural(mural);
                      } else {
                        setCurrentIndex(idx);
                      }
                    }}
                  >
                    <div className="relative w-full h-full overflow-hidden flex-1">
                      <img 
                        src={getImageUrl(mural.image)} 
                        alt={mural.titleZh} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      
                      {/* Micro-animations if active card */}
                      {isActive && (
                        <div className="absolute inset-0 pointer-events-none z-15">
                          {/* 1. Horses / Hunting: Golden Spark particles */}
                          {['mural_shoulie_zhanghuai'].includes(mural.id) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 via-transparent to-transparent">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                                  animate={{ y: -120, opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
                                  transition={{
                                    duration: 2 + Math.random(),
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                  }}
                                  style={{ left: `${20 + i * 12}%` }}
                                  className="absolute w-1 h-1 rounded-full bg-amber-400/60 blur-[0.5px]"
                                />
                              ))}
                            </div>
                          )}

                          {/* 2. Clouds / Buildings: Floating Sparkles */}
                          {['mural_quelou_yide'].includes(mural.id) && (
                            <div className="absolute inset-0">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ x: 0, y: 50, opacity: 0, scale: 0.6 }}
                                  animate={{ 
                                    x: Math.sin(i) * 40, 
                                    y: -60 - i * 8, 
                                    opacity: [0, 0.7, 0], 
                                    scale: [0.6, 1, 0.6] 
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                  }}
                                  style={{ left: `${40 + i * 8}%` }}
                                  className="absolute text-amber-300 text-xs opacity-50 flex items-center justify-center"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-400" />
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {/* 3. Maidens / Music & Dance: Rose petals */}
                          {['mural_gongnv_yongtai', 'mural_lewu_susixu'].includes(mural.id) && (
                            <div className="absolute inset-0">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ y: -10, x: Math.random() * 30, opacity: 0, rotate: 0 }}
                                  animate={{ 
                                    y: 150, 
                                    x: Math.random() * 60 - 30, 
                                    opacity: [0, 0.7, 0],
                                    rotate: [0, 360]
                                  }}
                                  transition={{
                                    duration: 4 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: i * 0.8,
                                    ease: 'linear'
                                  }}
                                  style={{ left: `${25 + i * 12}%` }}
                                  className="absolute text-rose-400/40 text-[10px]"
                                >
                                  🌸
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Top corner era badge */}
                      <div className="absolute top-4 left-4 bg-black/85 px-2.5 py-1 rounded-md text-[10px] tracking-widest font-serif border border-amber-900/30 text-amber-400/90 z-10">
                        {mural.icon} {mural.era.split(' · ')[0]}
                      </div>

                      {/* Elegant bottom gradient overlay containing metadata */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-12 pb-5 px-5 flex flex-col justify-end z-10">
                        <h3 className="text-base md:text-lg font-bold font-serif text-amber-300 tracking-wider">
                          {isEn ? mural.title : mural.titleZh}
                        </h3>
                        {isActive && (
                          <p className="text-xs md:text-sm text-neutral-300/90 font-serif leading-relaxed mt-2 line-clamp-2">
                            {isEn ? (mural.descriptionEn || mural.description) : mural.description}
                          </p>
                        )}
                        <div className="mt-3 flex justify-between items-center text-xs text-neutral-400 font-serif border-t border-neutral-800/60 pt-2">
                          <span>{isEn ? (mural.eraEn || mural.era) : (mural.era.split(' · ')[1] || '唐代长沟墓')}</span>
                          {isActive && (
                            <span className="text-xs text-amber-400/80 tracking-widest animate-pulse">
                              {isEn ? 'Click to inspect ✦' : '点击高清鉴赏 ✦'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Button */}
            <button
              onClick={() => {
                playClickSound();
                setCurrentIndex((prev) => (prev + 1) % murals.length);
              }}
              className="absolute right-2 md:right-6 w-12 h-12 rounded-full border border-amber-600/30 bg-[#15100c]/90 text-amber-400 hover:bg-neutral-900 hover:text-amber-300 flex items-center justify-center transition-all shadow-2xl hover:border-amber-400/80 active:scale-95 cursor-pointer z-40 shrink-0"
              title={isEn ? "Next Mural" : "下一个壁画"}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </SpotlightCandle>

      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 px-8 pr-36 md:pr-48 py-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-auto">
        <div className="flex items-center space-x-3">
          <span className="text-amber-500 font-bold tracking-widest text-lg md:text-xl font-serif">
            {isEn ? 'Tang Digital Mural Gallery' : '大唐数字壁画馆'}
          </span>
          <span className="text-xs md:text-sm text-neutral-400 tracking-wider font-serif">
            {isEn ? '/ Masterpiece Restoration Exhibition' : '/ 珍品复原陈列'}
          </span>
        </div>
      </header>

      {/* Floating Bottom Nav Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-40 px-8 flex justify-between items-center pointer-events-auto">
        <button
          onClick={() => {
            playClickSound();
            onBackToHome();
          }}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-amber-900/40 bg-neutral-950/80 text-amber-400 text-xs md:text-sm font-serif hover:bg-neutral-900 transition-colors shadow-2xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'Back to Home' : '返回地宫首页'}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            onGoToWorkshop();
          }}
          className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-amber-500 text-black text-xs md:text-sm font-bold font-serif hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse cursor-pointer"
        >
          <span>{isEn ? 'Restoration Workshop' : '前往壁画修复工坊'}</span>
          <Hammer className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* DETAILED DIALOG POPUP FOR SELECTED MURAL */}
      <AnimatePresence>
        {selectedMural && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 md:p-6 font-serif text-amber-100"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-5xl w-full border border-amber-700/50 rounded-2xl bg-neutral-950 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-[75vh]"
            >
              {/* Image Frame with Fullscreen Trigger */}
              <div 
                onClick={() => {
                  playClickSound();
                  setFullscreenImage(getImageUrl(selectedMural.image));
                }}
                className="w-full h-[30vh] sm:h-[35vh] md:h-auto md:w-1/2 bg-[#0c0906] relative flex items-center justify-center p-2 sm:p-4 cursor-zoom-in group shrink-0 border-b md:border-b-0 md:border-r border-amber-900/20"
              >
                <div className="absolute inset-2 sm:inset-4 border border-dashed border-amber-900/20 pointer-events-none" />
                <div className="relative w-full h-full rounded overflow-hidden bg-black flex items-center justify-center shadow-2xl">
                  <img 
                    src={getImageUrl(selectedMural.image)} 
                    alt={selectedMural.titleZh} 
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain rounded transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full opacity-85 group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <span>🔍 {isEn ? 'Fullscreen' : '点击查看高清全屏大图'}</span>
                  </div>
                </div>
              </div>

              {/* Text info - Scrollable to prevent any text from being obscured */}
              <div className="w-full md:w-1/2 p-5 md:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#110d0a] to-[#060403]">
                <div>
                  <div className="flex justify-between items-start border-b border-amber-900/20 pb-3 mb-4">
                    <div>
                      <span className="text-xs text-amber-500 font-mono tracking-widest uppercase">{selectedMural.title}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-amber-300 mt-0.5">{isEn ? selectedMural.title : selectedMural.titleZh}</h3>
                    </div>
                    <button 
                      onClick={() => {
                        playClickSound();
                        setSelectedMural(null);
                      }}
                      className="p-1.5 rounded-full border border-neutral-800 hover:border-amber-500 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm md:text-base text-amber-100/90 leading-relaxed mb-4 text-justify">
                    {isEn ? (selectedMural.descriptionEn || selectedMural.description) : selectedMural.description}
                  </p>

                  <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-900/40 mb-4">
                    <h4 className="text-xs md:text-sm font-bold text-amber-400 mb-1.5 font-serif">
                      {isEn ? '✦ Archeological & Chronological Context:' : '✦ 馆藏考古与断代信息：'}
                    </h4>
                    <p className="text-xs md:text-sm text-amber-100/80 leading-relaxed text-justify">
                      {isEn 
                        ? 'Digital reconstruction of Tang dynasty royal tomb murals. Using 3D scanning and mineral pigment restoration, experts revived the pristine colors and brushwork of Tang court life.' 
                        : '此幅作品为珍稀的唐代皇室及贵族墓葬壁画数字临摹与重彩复原成果。原壁画由于泥沙侵蚀、霉变与断裂，画面大部斑驳失色。数字化研究团队通过对比研究乾陵陪葬墓等唐代出土壁画，运用先进的三维扫描与数字重彩工艺，精细还原了初唐至盛唐时期上流宫廷生活、服饰器物及建筑的巍峨风华。'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-amber-900/20 mt-2">
                  <span className="text-xs text-neutral-400 font-mono">{isEn ? (selectedMural.eraEn || selectedMural.era) : selectedMural.era}</span>
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedMural(null);
                    }}
                    className="px-6 py-2.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 text-xs md:text-sm font-bold font-serif transition-colors cursor-pointer shadow-lg"
                  >
                    {isEn ? 'Back to Gallery' : '返回陈列馆'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN IMAGE LIGHTBOX */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-lg flex items-center justify-center p-4 select-none cursor-zoom-out"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 z-[101] p-3 rounded-full bg-black/80 text-white border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-all cursor-pointer shadow-2xl"
              title={isEn ? "Close Fullscreen View" : "关闭全屏大图"}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-[95vw] max-h-[92vh] flex items-center justify-center">
              <img
                src={fullscreenImage}
                alt="全屏壁画大图"
                referrerPolicy="no-referrer"
                className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-[0_0_80px_rgba(245,158,11,0.25)] border border-amber-500/30"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
