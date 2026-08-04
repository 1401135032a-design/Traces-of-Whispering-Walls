import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SpotlightCandle from './SpotlightCandle';
import { 
  TOMB_OWNER_INFO, 
  MURAL_HOTSPOTS, 
  ARTIFACT_HOTSPOTS 
} from '../data';
import { MuralHotspot, ArtifactHotspot } from '../types';
import { 
  X, Compass, ArrowLeft, ArrowRight, ArrowUp, Sparkles, Landmark, Play, CheckCircle,
  Scroll, Flame, Shield, User, Grid, Eye, Palette, CornerUpLeft, Layers, Map,
  ChevronRight, ChevronDown, ChevronUp
} from 'lucide-react';
import { playClickSound, playWarpSound, startCandleBurningSound, stopCandleBurningSound } from '../utils/audio';
import { getImageUrl } from '../utils/imageLoader';

interface Phase4RoamingProps {
  onBackToHome: () => void;
  onGoToMuralHall: () => void;
  lang?: 'zh' | 'en';
}

interface HotspotDefinition {
  id: string;
  type: 'mural' | 'artifact' | 'custom' | 'label-only';
  label: string;
  labelEn?: string;
  left: string; // horizontal percent within the wide panorama
  top: string; // vertical percent
  customTitle?: string;
  customTitleEn?: string;
  customContent?: string;
  customContentEn?: string;
  customImage?: string;
}

interface ChamberZone {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  descEn?: string;
  backgroundImage: string;
  videoSrc?: string;
  filterClass: string;
  hotspots: HotspotDefinition[];
}

// Exactly 5 navigable chambers along the central axis of Figure 1, with Rear Chamber as a non-interactive view
const CHAMBERS: ChamberZone[] = [
  { 
    id: 'front_corridor', 
    name: '1. 前甬道 (Front Passage)', 
    nameEn: '1. Front Passage',
    desc: '地宫前甬道，地面采用高规格人字形铺砖。一南一北分别整齐陈列着刘济及夫人张氏的汉白玉墓志。左右两侧有小券洞，通往东西两个耳室。',
    descEn: 'Front entrance passage of the tomb with herringbone brick flooring. White marble epitaphs of Liu Ji and Lady Zhang are preserved here. Small arches lead to East and West ear chambers.',
    backgroundImage: '/src/assets/images/甬道.png',
    filterClass: 'brightness-[0.9] contrast-[1.05] saturate-[105%]',
    hotspots: [
      {
        id: 'artifact_wife_epitaph',
        type: 'artifact',
        label: '研读：刘济夫人描金墓志',
        labelEn: 'Examine: Gilded Epitaph of Lady Zhang',
        left: '50%',
        top: '78%'
      },
      {
        id: 'artifact_liuji_epitaph',
        type: 'artifact',
        label: '研读：刘济墓志石刻',
        labelEn: 'Examine: Marble Epitaph of Liu Ji',
        left: '50%',
        top: '65%'
      },
      {
        id: 'front_corridor_left_niche',
        type: 'label-only',
        label: '西壁龛',
        labelEn: 'West Niche',
        left: '32%',
        top: '56%'
      },
      {
        id: 'front_corridor_right_niche',
        type: 'label-only',
        label: '东壁龛',
        labelEn: 'East Niche',
        left: '68%',
        top: '56%'
      },
      {
        id: 'to_main_chamber_portal',
        type: 'custom',
        label: '➔ 前行：直通主墓室地宫',
        labelEn: '➔ Forward: Main Tomb Chamber',
        left: '50%',
        top: '46%'
      },
      {
        id: 'left_ear_portal',
        type: 'custom',
        label: '➔ 进入西耳室 (查看《骏马图》)',
        labelEn: '➔ Enter West Ear Chamber (Mural: Steed)',
        left: '16%',
        top: '50%'
      },
      {
        id: 'right_ear_portal',
        type: 'custom',
        label: '➔ 进入东耳室 (查看《骑马官员图》)',
        labelEn: '➔ Enter East Ear Chamber (Mural: Officials)',
        left: '84%',
        top: '50%'
      }
    ]
  },
  {
    id: 'left_ear',
    name: '2. 西耳室 (West Ear Chamber)',
    nameEn: '2. West Ear Chamber',
    desc: '地宫西耳室（左耳室），墙面上满绘着华美的晚唐壁画。其中正中绘制着名作《骏马图》，展现了幽州卢龙军强大的骑兵战马文化。',
    descEn: 'West Ear Chamber features vivid Late Tang murals, centered around the famous "Steed Mural" depicting the powerful cavalry culture of Lulong Army.',
    backgroundImage: '/src/assets/images/左耳室.png',
    filterClass: 'brightness-[0.92] contrast-[1.05] saturate-[105%]',
    hotspots: [
      {
        id: 'mural_horses_ear',
        type: 'mural',
        label: '查看『西耳室 · 骏马图』壁画',
        labelEn: 'View "Steed Mural"',
        left: '50%',
        top: '44%'
      },
      {
        id: 'back_to_corridor_left',
        type: 'custom',
        label: '➔ 返回前甬道',
        labelEn: '➔ Return to Front Passage',
        left: '50%',
        top: '82%'
      }
    ]
  },
  {
    id: 'right_ear',
    name: '3. 东耳室 (East Ear Chamber)',
    nameEn: '3. East Ear Chamber',
    desc: '地宫东耳室（右耳室），正中绘制着名作《骑马官员图》，体现了幽州藩镇内廷幕僚巡守的赫赫威仪。向上仰视可清晰观赏拱券穹顶与壁画细节。',
    descEn: 'East Ear Chamber features the famous "Mounted Officials Mural" showing military retainers. Look upward to observe the vaulted dome and side walls.',
    backgroundImage: '/src/assets/images/右耳室.png',
    filterClass: 'brightness-[0.92] contrast-[1.05] saturate-[105%]',
    hotspots: [
      {
        id: 'mural_officials',
        type: 'mural',
        label: '查看『东耳室 · 骑马官员图』壁画',
        labelEn: 'View "Mounted Officials Mural"',
        left: '50%',
        top: '44%'
      },
      {
        id: 'back_to_corridor_right',
        type: 'custom',
        label: '➔ 返回前甬道',
        labelEn: '➔ Return to Front Passage',
        left: '50%',
        top: '82%'
      }
    ]
  },
  { 
    id: 'main_chamber', 
    name: '4. 主室地宫 (Main Chamber)', 
    nameEn: '4. Main Chamber',
    desc: '地宫的核心殿宇，正中安放着媲美帝王规格的六层汉白玉须弥座棺床。随鼠标上下移动可全面仰览恢弘的石构穹顶顶壁。',
    descEn: 'The central hall of the tomb containing the imperial-grade 6-tiered white marble coffin bed. Move mouse vertically to admire the majestic vaulted stone dome.',
    backgroundImage: '/src/assets/images/主墓室.jpg',
    filterClass: 'brightness-[0.9] contrast-[1.1] saturate-[110%]',
    hotspots: [
      {
        id: 'artifact_coffin_bed',
        type: 'artifact',
        label: '核心重宝：汉白玉彩绘须弥座棺床',
        labelEn: 'Core Relic: Painted Marble Coffin Bed',
        left: '49%',
        top: '68%'
      },
      {
        id: 'artifact_military_official',
        type: 'artifact',
        label: '查看：彩绘汉白玉武官俑',
        labelEn: 'Examine: Painted Marble Military Figurine',
        left: '32.7%',
        top: '64.5%'
      },
      {
        id: 'artifact_civil_official',
        type: 'artifact',
        label: '查看：彩绘汉白玉文官俑',
        labelEn: 'Examine: Painted Marble Civil Official Figurine',
        left: '36.5%',
        top: '64.5%'
      },
      {
        id: 'artifact_lamp',
        type: 'artifact',
        label: '查看：白石莲瓣长明灯',
        labelEn: 'Examine: White Stone Lotus Lamp',
        left: '61.5%',
        top: '74%'
      },
      {
        id: 'main_chamber_left_side_room',
        type: 'label-only',
        label: '西侧室',
        labelEn: 'West Side Room',
        left: '18%',
        top: '50%'
      },
      {
        id: 'main_chamber_right_side_room',
        type: 'label-only',
        label: '东侧室',
        labelEn: 'East Side Room',
        left: '82%',
        top: '50%'
      },
      {
        id: 'back_to_corridor_portal',
        type: 'custom',
        label: '➔ 后退：返回前甬道',
        labelEn: '➔ Back: Return to Front Passage',
        left: '50%',
        top: '90%'
      },
      {
        id: 'to_rear_corridor_portal',
        type: 'custom',
        label: '➔ 前行：进入后甬道',
        labelEn: '➔ Forward: Enter Rear Passage',
        left: '49%',
        top: '45%'
      },
      {
        id: 'rear_chamber_dome_main',
        type: 'custom',
        label: '勘考：后室砖顶与拱券结构',
        labelEn: 'Survey: Rear Chamber Brick Dome & Vault',
        left: '49%',
        top: '28%',
        customTitle: '后室砖顶与拱券结构',
        customTitleEn: 'Rear Chamber Brick Dome & Vault Mechanics',
        customContent: '后室与甬道顶部的双重青砖拱券及砖顶穹窿，是晚唐官式力学的精湛代表。其弧度可将地层数万斤覆土的重力转化为向两侧挤压的侧向支撑力，维持地宫千年不塌。',
        customContentEn: 'The double brick arches and brick dome of the rear chamber represent master Late Tang engineering, converting overburden weight into lateral support.',
        customImage: '/src/assets/images/图层 1 拷贝 5.png'
      }
    ]
  },
  { 
    id: 'rear_corridor', 
    name: '5. 后甬道 (Rear Passage)', 
    nameEn: '5. Rear Passage',
    desc: '连接主室与后室的青砖拱券腰道，收窄的结构具有极强的地宫重力承托作用。',
    descEn: 'Brick vaulted corridor connecting main chamber and rear chamber, designed with load-bearing arches.',
    backgroundImage: '/src/assets/images/后甬道.png',
    filterClass: 'brightness-[0.8] contrast-[1.0] saturate-[90%]',
    hotspots: [
      {
        id: 'structure_arch',
        type: 'custom',
        label: '勘考：后室青砖拱券与砖顶结构',
        labelEn: 'Survey: Rear Chamber Brick Vault & Dome',
        left: '50%',
        top: '38%',
        customTitle: '后室砖顶与拱券结构',
        customTitleEn: 'Rear Chamber Brick Dome & Vault Mechanics',
        customContent: '后室与甬道顶部的双重青砖拱券及砖顶穹窿，是晚唐官式力学的精湛代表。其弧度可将地层数万斤覆土的重力转化为向两侧挤压的侧向支撑力，维持地宫千年不塌。',
        customContentEn: 'The double brick arches and brick dome of the rear chamber represent master Late Tang engineering, converting overburden weight into lateral support.',
        customImage: '/src/assets/images/图层 1 拷贝 5.png'
      },
      {
        id: 'back_to_main_portal',
        type: 'custom',
        label: '➔ 后退：返回主墓室',
        labelEn: '➔ Back: Return to Main Chamber',
        left: '50%',
        top: '82%'
      },
      {
        id: 'look_rear_chamber_eye',
        type: 'label-only',
        label: '后室宝殿',
        labelEn: 'Rear Shrine Chamber',
        left: '50%',
        top: '24%'
      }
    ]
  }
];

export default function Phase4_Roaming({ onBackToHome, onGoToMuralHall, lang = 'zh' }: Phase4RoamingProps) {
  const isEn = lang === 'en';
  const [roamingState, setRoamingState] = useState({ index: 0, progress: 40 });
  const activeChamberIndex = roamingState.index;
  const chamberProgress = roamingState.progress;
  const [mouseRatio, setMouseRatio] = useState(0); // Normalized mouse X: -1 (left) to 1 (right)
  const [mouseYRatio, setMouseYRatio] = useState(0); // Normalized mouse Y: -1 (top/up) to 1 (bottom/down)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [baseMouseRatio, setBaseMouseRatio] = useState(0);
  const [baseMouseYRatio, setBaseMouseYRatio] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Arrival notification banner state (shows on arrival, then fades out)
  const [arrivalBanner, setArrivalBanner] = useState<string | null>(null);

  // Popup lightboxes state
  const [selectedMural, setSelectedMural] = useState<MuralHotspot | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactHotspot | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [customInfoModal, setCustomInfoModal] = useState<{title: string, titleEn?: string, content: string, contentEn?: string, image?: string} | null>(null);
  const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Reset active image index and close mobile map when chamber or artifact changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [selectedArtifact]);

  useEffect(() => {
    setIsMobileMapOpen(false);
  }, [activeChamberIndex]);

  // Track explored history for final progress
  const [visitedChambers, setVisitedChambers] = useState<Record<string, boolean>>({
    front_corridor: true,
    left_ear: false,
    right_ear: false,
    main_chamber: false,
    rear_corridor: false
  });

  const activeChamber = CHAMBERS[activeChamberIndex] || CHAMBERS[0];

  // Candle burning audio effect when entering East Ear Chamber (right_ear)
  useEffect(() => {
    if (activeChamber.id === 'right_ear') {
      startCandleBurningSound();
    } else {
      stopCandleBurningSound();
    }
    return () => {
      stopCandleBurningSound();
    };
  }, [activeChamberIndex]);

  // Scroll prompt visible after 3 seconds at rear chamber
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  useEffect(() => {
    if (activeChamberIndex === CHAMBERS.length - 1) {
      setShowScrollPrompt(false);
      const promptTimer = setTimeout(() => {
        setShowScrollPrompt(true);
      }, 3000);
      return () => clearTimeout(promptTimer);
    } else {
      setShowScrollPrompt(false);
    }
  }, [activeChamberIndex]);

  // Triggers the automatic fading arrival banner on change
  useEffect(() => {
    playWarpSound();
    setArrivalBanner(isEn ? (activeChamber.nameEn || activeChamber.name) : activeChamber.name);
    
    // Mark as visited
    setVisitedChambers(prev => ({
      ...prev,
      [activeChamber.id]: true
    }));

    // Fade out arrival banner after 2.5 seconds
    const timer = setTimeout(() => {
      setArrivalBanner(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [activeChamberIndex, isEn]);

  // Video element reference for interactive frame scrubbing & panning
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Smooth mouse coordinates state & refs for ultra-silky, zero-jitter camera panning
  const [smoothMouseX, setSmoothMouseX] = useState(0);
  const [smoothMouseY, setSmoothMouseY] = useState(0);
  const smoothXRef = useRef(0);
  const smoothYRef = useRef(0);

  // Store refs for rAF loop to ensure smooth, jitter-free video scrubbing
  const mouseRatioRef = useRef(mouseRatio);
  const mouseYRatioRef = useRef(mouseYRatio);
  const chamberProgressRef = useRef(chamberProgress);

  mouseRatioRef.current = mouseRatio;
  mouseYRatioRef.current = mouseYRatio;
  chamberProgressRef.current = chamberProgress;

  // Smooth lerp loop for camera motion and video scrubbing
  useEffect(() => {
    let animId: number;
    let lastSetTime = -1;

    const tick = () => {
      // 1. Smoothly interpolate camera pan & tilt
      const targetX = mouseRatioRef.current;
      const targetY = mouseYRatioRef.current;
      
      const dx = targetX - smoothXRef.current;
      const dy = targetY - smoothYRef.current;

      if (Math.abs(dx) > 0.0001) {
        smoothXRef.current += dx * 0.12;
      } else {
        smoothXRef.current = targetX;
      }

      if (Math.abs(dy) > 0.0001) {
        smoothYRef.current += dy * 0.12;
      } else {
        smoothYRef.current = targetY;
      }

      setSmoothMouseX(smoothXRef.current);
      setSmoothMouseY(smoothYRef.current);

      // 2. Controlled video scrubbing for Main Chamber (index 3)
      const video = videoRef.current;
      if (video && activeChamberIndex === 3 && video.duration && isFinite(video.duration) && video.duration > 0) {
        if (!video.paused) {
          video.pause();
        }

        const dur = video.duration;
        const normX = (smoothXRef.current + 1) / 2; // 0 to 1
        const normY = (smoothYRef.current + 1) / 2; // 0 to 1
        const progress = chamberProgressRef.current / 100;

        // Map mouse position to target frame time
        const targetTime = Math.max(0, Math.min(dur - 0.05, (normX * 0.7 + normY * 0.2 + progress * 0.1) * dur));

        // Only seek if difference is noticeable (>0.05s) to eliminate jitter when mouse is stationary
        if (!video.seeking && Math.abs(lastSetTime - targetTime) > 0.05) {
          video.currentTime = targetTime;
          lastSetTime = targetTime;
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [activeChamberIndex]);

  // Track mouse coordinates to control smooth panorama rotation & 3D tilt (up to dome ceiling)
  const handleMouseMove = (e: React.MouseEvent) => {
    // If modal is active, pause camera panning to prevent motion sickness during reading
    if (selectedMural || selectedArtifact || customInfoModal) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratioX = (e.clientX / width) * 2 - 1;
    const ratioY = (e.clientY / height) * 2 - 1; // -1 at top, +1 at bottom
    setMouseRatio(ratioX);
    setMouseYRatio(ratioY);
  };

  // Touch handlers for mobile devices to drag/pan around the panorama
  const handleTouchStart = (e: React.TouchEvent) => {
    if (selectedMural || selectedArtifact || customInfoModal) return;
    if (e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
      setBaseMouseRatio(mouseRatio);
      setBaseMouseYRatio(mouseYRatio);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (selectedMural || selectedArtifact || customInfoModal) return;
    if (touchStartX !== null && touchStartY !== null && e.touches[0]) {
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratioDeltaX = -(deltaX / width) * 1.5;
      const ratioDeltaY = -(deltaY / height) * 1.5;
      setMouseRatio(Math.max(-1, Math.min(1, baseMouseRatio + ratioDeltaX)));
      setMouseYRatio(Math.max(-1, Math.min(1, baseMouseYRatio + ratioDeltaY)));
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Wheel scrolling to walk forward or backward through chambers along the central axis
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (selectedMural || selectedArtifact || customInfoModal) return;

    const scrollDelta = e.deltaY < 0 ? 12 : -12;
    if (roamingState.index === CHAMBERS.length - 1 && roamingState.progress + scrollDelta > 100) {
      onGoToMuralHall();
      return;
    }

    setRoamingState(prev => {
      const nextProgress = prev.progress + scrollDelta;
      if (nextProgress > 100) {
        if (prev.index < CHAMBERS.length - 1) {
          return {
            index: prev.index + 1,
            progress: 15
          };
        }
        return {
          index: prev.index,
          progress: 100
        };
      }
      if (nextProgress < 0) {
        if (prev.index > 0) {
          return {
            index: prev.index - 1,
            progress: 85
          };
        }
        return {
          index: prev.index,
          progress: 0
        };
      }
      return {
        index: prev.index,
        progress: nextProgress
      };
    });
  };

  // Direct map jumping callbacks
  const jumpToChamber = (index: number) => {
    playClickSound();
    setRoamingState({
      index: Math.max(0, Math.min(CHAMBERS.length - 1, index)),
      progress: 50
    });
  };

  // Hotspot actions
  const handleMuralClick = (id: string) => {
    playClickSound();
    const found = MURAL_HOTSPOTS.find(m => m.id === id);
    if (found) {
      setSelectedMural(found);
    }
  };

  const handleArtifactClick = (id: string) => {
    playClickSound();
    const found = ARTIFACT_HOTSPOTS.find(a => a.id === id);
    if (found) {
      setSelectedArtifact(found);
    }
  };

  const handleCustomClick = (hotspot: HotspotDefinition) => {
    playClickSound();
    const title = isEn ? (hotspot.customTitleEn || hotspot.customTitle) : hotspot.customTitle;
    const content = isEn ? (hotspot.customContentEn || hotspot.customContent) : hotspot.customContent;
    if (title && content) {
      setCustomInfoModal({
        title,
        titleEn: hotspot.customTitleEn,
        content,
        contentEn: hotspot.customContentEn,
        image: hotspot.customImage
      });
    }
  };

  const handleHotspotClick = (h: HotspotDefinition) => {
    if (h.id === 'left_ear_portal' || h.id === 'to_left_ear_from_main_portal') {
      playClickSound();
      setRoamingState({ index: 1, progress: 50 }); // Left ear chamber is index 1
    } else if (h.id === 'right_ear_portal' || h.id === 'to_right_ear_from_main_portal') {
      playClickSound();
      setRoamingState({ index: 2, progress: 50 }); // Right ear chamber is index 2
    } else if (h.id === 'back_to_corridor_left' || h.id === 'back_to_corridor_right' || h.id === 'back_to_corridor_portal') {
      playClickSound();
      setRoamingState({ index: 0, progress: 50 }); // Front corridor is index 0
    } else if (h.id === 'to_main_chamber_portal') {
      playClickSound();
      setRoamingState({ index: 3, progress: 50 }); // Main chamber is index 3
    } else if (h.id === 'to_rear_corridor_portal') {
      playClickSound();
      setRoamingState({ index: 4, progress: 50 }); // Rear corridor is index 4
    } else if (h.id === 'back_to_main_portal') {
      playClickSound();
      setRoamingState({ index: 3, progress: 50 }); // Main chamber is index 3
    } else if (h.type === 'mural') {
      handleMuralClick(h.id);
    } else if (h.type === 'artifact') {
      handleArtifactClick(h.id);
    } else {
      handleCustomClick(h);
    }
  };

  // Is all axis exploration completed
  const isAllExplored = visitedChambers.front_corridor && 
                       visitedChambers.left_ear &&
                       visitedChambers.right_ear &&
                       visitedChambers.main_chamber && 
                       visitedChambers.rear_corridor;

  // Let's show the final completion portal if we are in the 5th chamber (index 4) and progress is close to 100%
  const showCompletionPortal = activeChamberIndex === 4 && chamberProgress >= 90;

  return (
    <div 
      id="phase4-container" 
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-screen bg-[#070503] text-[#ebdcc8] flex flex-col justify-between relative overflow-hidden font-sans select-none"
    >
      <SpotlightCandle active={true} intensity="full" blurLevel="blur-none" overlayColor="rgba(0, 0, 0, 0)" customRadius={115} soft={true}>
        
        {/* 1. Immersive Panorama Wrapper */}
        <div className="absolute inset-0 z-0 overflow-hidden" style={{ perspective: '1200px' }}>
          
          <motion.div
            id="panorama-screen-container"
            className={`absolute top-1/2 left-1/2 bg-cover bg-center transition-transform duration-100 ease-out flex items-center justify-center overflow-hidden ${isMobile ? 'w-[220vw] h-[130vh]' : 'w-[115vw] h-[130vh]'}`}
            style={{
              backgroundImage: `url(${getImageUrl(activeChamber.backgroundImage)})`,
              // Mouse Y movement tilts the 3D camera to look UP towards the vaulted dome ceiling (穹顶)
              transform: isMobile
                ? `translate(calc(-50% - ${smoothMouseX * 50}vw), calc(-50% + ${smoothMouseY * -160}px)) rotateY(${smoothMouseX * 8}deg) rotateX(${smoothMouseY * -10}deg) scale(${0.85 + (chamberProgress / 100) * 0.45})`
                : `translate(calc(-50% + ${smoothMouseX * -45}px), calc(-50% + ${smoothMouseY * -200}px)) rotateY(${smoothMouseX * 8}deg) rotateX(${smoothMouseY * -12}deg) scale(${0.85 + (chamberProgress / 100) * 0.45})`,
            }}
          >
            {/* Real video integration for Main Chamber (7月23日.mp4) and East Ear Chamber (Video-1784787497353.mp4) */}
            {activeChamber.videoSrc && (
              <video
                ref={videoRef}
                key={activeChamber.videoSrc}
                src={getImageUrl(activeChamber.videoSrc)}
                muted
                playsInline
                onLoadedData={(e) => e.currentTarget.pause()}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              />
            )}

            {/* Ambient vignette shadow layered on the 360 container - softened for high clarity */}
            <div className={`absolute inset-0 pointer-events-none mix-blend-multiply bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.45)_100%)] transition-all duration-700 ${activeChamber.filterClass}`} />



            {/* Hotspots placed exactly on the 360 panorama canvas so they lock position as you look left or right */}
            {activeChamber.hotspots.map((h, index) => {
              // Distinguish the hotspot styles based on type (artifact vs mural vs navigation)
              const isPortal = h.type === 'custom' && (h.id.includes('portal') || h.id.includes('back_to'));
              const isLabelOnly = h.type === 'label-only';
              
              let iconElement = <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
              let ringColor = "border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]";
              let pingBg = "bg-amber-400/25";
              
              if (isLabelOnly) {
                pingBg = "bg-amber-600/10";
                ringColor = "border-amber-600/50 shadow-[0_0_8px_rgba(217,119,6,0.3)]";
                iconElement = <Eye className="w-3.5 h-3.5 text-amber-500/80" />;
              } else if (isPortal) {
                // Navigation hotspots: Emerald green theme with arrows
                pingBg = "bg-emerald-500/25";
                ringColor = "border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]";
                if (h.id.includes('left')) {
                  iconElement = <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />;
                } else if (h.id.includes('right')) {
                  iconElement = <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />;
                } else if (h.id.includes('back_to')) {
                  iconElement = <CornerUpLeft className="w-3.5 h-3.5 text-emerald-400" />;
                } else if (h.id.includes('eye') || h.id.includes('look')) {
                  iconElement = <Eye className="w-3.5 h-3.5 text-emerald-400" />;
                } else {
                  iconElement = <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />;
                }
              } else if (h.type === 'mural') {
                // Mural hotspots: Vermilion/Orange theme with palette/eye
                pingBg = "bg-orange-500/25";
                ringColor = "border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.6)]";
                iconElement = <Palette className="w-3.5 h-3.5 text-orange-400" />;
              } else if (h.type === 'artifact') {
                // Relic/Artifact hotspots: Bright royal gold theme with custom shapes
                pingBg = "bg-yellow-400/25";
                ringColor = "border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.7)]";
                
                if (h.id.includes('epitaph')) {
                  iconElement = <Layers className="w-3.5 h-3.5 text-yellow-400" />;
                } else if (h.id.includes('coffin_bed')) {
                  iconElement = <Grid className="w-3.5 h-3.5 text-yellow-400" />;
                } else if (h.id.includes('lamp')) {
                  iconElement = <Flame className="w-3.5 h-3.5 text-yellow-400" />;
                } else if (h.id.includes('official')) {
                  iconElement = <User className="w-3.5 h-3.5 text-yellow-400" />;
                } else if (h.id.includes('camel') || h.id.includes('beast')) {
                  iconElement = <Sparkles className="w-3.5 h-3.5 text-yellow-400" />;
                } else {
                  iconElement = <Landmark className="w-3.5 h-3.5 text-yellow-400" />;
                }
              }

              const displayLabel = isEn ? (h.labelEn || h.label) : h.label;

              return (
                <div
                  key={h.id}
                  style={{ left: h.left, top: h.top }}
                  className={`absolute group flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20 ${isLabelOnly ? 'cursor-default' : 'cursor-pointer'}`}
                  onClick={isLabelOnly ? undefined : () => handleHotspotClick(h)}
                >
                  <div className="relative w-9 h-9 flex items-center justify-center">
                    {!isLabelOnly && <span className={`absolute inset-0 rounded-full ${pingBg} animate-ping`} />}
                    <span className={`absolute inset-1 rounded-full bg-[#110d0a]/95 border-2 ${ringColor} flex items-center justify-center ${!isLabelOnly ? 'group-hover:scale-125' : ''} transition-transform duration-200`}>
                      {iconElement}
                    </span>
                  </div>
                  {/* Hover contextual hint, always visible with high styling for label-only */}
                  <span className={`mt-2 text-xs md:text-sm font-semibold text-amber-200 font-serif bg-black/95 px-3 py-1.5 rounded border border-amber-500/30 shadow-2xl transition-opacity duration-300 pointer-events-none select-none whitespace-nowrap ${isLabelOnly ? 'opacity-90 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {displayLabel}
                  </span>
                </div>
              );
            })}



            {/* Simulated 3D central architectural layout accents to anchor depth */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* 2. SPECIFIC ARRIVAL BANNER (渐出停留一会变渐隐 - Automatic transition) */}
        <AnimatePresence>
          {arrivalBanner && (
            <motion.div
              initial={{ opacity: 0, y: -25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0d0906]/95 backdrop-blur-md border border-amber-500/30 px-10 py-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.98)] text-center pointer-events-none"
            >
              <div className="text-[10px] tracking-[0.3em] text-amber-500 font-mono uppercase">
                {isEn ? 'SPACE ARRIVED' : '已步入空间'}
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-100 tracking-widest mt-1">
                {arrivalBanner}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROMPT INDICATOR AT REAR CHAMBER: APPEARS AFTER 3 SECONDS */}
        <AnimatePresence>
          {activeChamberIndex === CHAMBERS.length - 1 && showScrollPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex flex-col items-center space-y-1.5 cursor-pointer group"
              onClick={() => { playClickSound(); onGoToMuralHall(); }}
            >
              <div className="flex items-center space-x-2 bg-[#16100b]/92 hover:bg-[#251a12] border border-[#8c6b43]/80 px-6 py-2.5 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-md transition-all group-hover:scale-105 active:scale-95">
                <span className="text-xs md:text-sm font-serif font-bold tracking-[0.2em] text-amber-200">
                  {isEn ? "Scroll Forward" : "向前滚动"}
                </span>
              </div>
              <div className="flex flex-col items-center animate-bounce text-amber-400">
                <ChevronUp className="w-4 h-4 -mb-2" />
                <ChevronUp className="w-4 h-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. CO-ORDINATES CORNER HUD - Hidden on mobile for portrait clarity */}
        <div className="hidden md:flex absolute bottom-6 left-6 z-20 bg-[#16100b]/95 border border-[#8c6b43]/50 px-4 py-2.5 rounded-lg shadow-2xl text-xs md:text-sm text-[#ebdcc8]/90 font-serif items-center space-x-2">
          <Compass className="w-4 h-4 text-amber-500 animate-[spin_16s_linear_infinite]" />
          <span>
            <b>{isEn ? 'Depth: ' : '地底深度: '}{
              activeChamberIndex === 0 ? (isEn ? '3.5m' : '3.5米') : 
              activeChamberIndex === 1 || activeChamberIndex === 2 ? (isEn ? '4.2m' : '4.2米') : 
              activeChamberIndex === 3 ? (isEn ? '4.8m' : '4.8米') : (isEn ? '5.0m' : '5.0米')
            }</b> | <b>{isEn ? 'Structure: ' : '结构: '}{
              activeChamberIndex === 0 ? (isEn ? 'Front Passage Brickwork' : '前甬道人字铺砖') :
              activeChamberIndex === 1 || activeChamberIndex === 2 ? (isEn ? 'Side Ear Vault' : '侧耳室券顶结构') :
              activeChamberIndex === 3 ? (isEn ? 'Main Coffin Bed' : '主室六层须弥棺床') : (isEn ? 'Double Brick Arch' : '过道双重拱券')
            }</b>
          </span>
        </div>

        {/* 4. FIG 1 SCHEMATIC FLOOR PLAN MAP - Desktop View */}
        <div className="hidden md:flex absolute bottom-6 right-6 z-20 bg-[#15100c]/95 border border-[#8c6b43] p-3 rounded-xl shadow-2xl w-[175px] text-center flex-col space-y-2">
          <div className="text-xs text-amber-400 font-serif tracking-widest font-bold border-b border-[#8c6b43]/30 pb-1.5">
            {isEn ? 'Floor Plan (Fig 1)' : '地宫平面图 (图1)'}
          </div>

          {/* Symmetrical SVG representing exactly Figure 1 floor plan and highlight the 5 central axis points */}
          <div className="flex justify-center my-1 bg-black/40 p-1 rounded border border-[#8c6b43]/15">
            <svg className="w-[110px] h-[155px] stroke-[#8c6b43]/40 fill-none" strokeWidth="1.2">
              
              {/* Post-Chamber (后室) - Non-interactive */}
              <path 
                d="M 45 30 L 35 30 L 35 12 A 20 20 0 1 1 75 12 L 75 30 L 65 30 Z"
                className="fill-neutral-900/60 stroke-[#8c6b43]/20 pointer-events-none"
              />
              {/* Rear corridor (后甬道) - Level 5 (index 4) */}
              <rect 
                x="45" y="30" width="20" height="15"
                onClick={() => jumpToChamber(4)}
                className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 4 ? 'fill-amber-500/60 stroke-amber-300 stroke-2' : visitedChambers.rear_corridor ? 'fill-[#8c6b43]/20 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
              />

              {/* Side Chambers (东、西侧室) - Symmetrical side rooms of Main Chamber */}
              <rect 
                x="10" y="55" width="22" height="22" rx="1"
                className="fill-neutral-900/40 stroke-[#8c6b43]/30 pointer-events-none"
              />
              <rect 
                x="78" y="55" width="22" height="22" rx="1"
                className="fill-neutral-900/40 stroke-[#8c6b43]/30 pointer-events-none"
              />

              {/* Main Chamber (主室) - Level 4 (index 3) */}
              <rect 
                x="32" y="45" width="46" height="42" rx="3"
                onClick={() => jumpToChamber(3)}
                className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 3 ? 'fill-amber-500/60 stroke-amber-300 stroke-2 animate-pulse' : visitedChambers.main_chamber ? 'fill-[#8c6b43]/35 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
              />
              {/* Coffin Bed (棺床) inside Main Chamber */}
              <rect 
                x="43" y="56" width="24" height="20" rx="1"
                className="stroke-amber-400/55 fill-amber-500/10 pointer-events-none"
              />

              {/* Left Ear Chamber (西耳室) - index 1 */}
              <rect 
                x="15" y="112" width="20" height="20" rx="1"
                onClick={() => jumpToChamber(1)}
                className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 1 ? 'fill-amber-500/60 stroke-amber-300 stroke-2 animate-pulse' : visitedChambers.left_ear ? 'fill-[#8c6b43]/35 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
              />
              {/* Right Ear Chamber (东耳室) - index 2 */}
              <rect 
                x="75" y="112" width="20" height="20" rx="1"
                onClick={() => jumpToChamber(2)}
                className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 2 ? 'fill-amber-500/60 stroke-amber-300 stroke-2 animate-pulse' : visitedChambers.right_ear ? 'fill-[#8c6b43]/35 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
              />

              {/* Front Passage/Corridor (前甬道) - Level 1 (index 0) */}
              <rect 
                x="44" y="87" width="22" height="60"
                onClick={() => jumpToChamber(0)}
                className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 0 ? 'fill-amber-500/60 stroke-amber-300 stroke-2 animate-pulse' : visitedChambers.front_corridor ? 'fill-[#8c6b43]/30 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
              />
            </svg>
          </div>

          {/* Symmetrical indicator bar */}
          <div className="pt-1.5 border-t border-[#8c6b43]/30 flex justify-between items-center text-xs text-neutral-400">
            <span>{isEn ? 'Progress:' : '探索进度:'}</span>
            <span className="font-semibold text-amber-200 font-mono">
              {Object.values(visitedChambers).filter(v => v).length} / 5
            </span>
          </div>
        </div>

        {/* 4.5 MOBILE FLOATING MAP TOGGLE BUTTON */}
        <button
          onClick={() => { playClickSound(); setIsMobileMapOpen(prev => !prev); }}
          className="md:hidden absolute bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-[#15100c]/95 border border-[#8c6b43] shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center justify-center text-amber-400 active:scale-95 transition-transform cursor-pointer"
        >
          <Map className="w-5 h-5 text-amber-400" />
        </button>

        {/* MOBILE FLOATING MAP CARD POPOVER */}
        <AnimatePresence>
          {isMobileMapOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.92 }}
              className="md:hidden absolute bottom-20 right-6 z-30 bg-[#15100c]/98 border-2 border-[#8c6b43] p-3.5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] w-[180px] text-center flex flex-col space-y-2 backdrop-blur-md"
            >
              <div className="flex justify-between items-center text-xs text-amber-400 font-serif tracking-widest font-bold border-b border-[#8c6b43]/30 pb-1.5">
                <span>{isEn ? 'Floor Plan (Fig 1)' : '地宫平面图 (图1)'}</span>
                <button 
                  onClick={() => { playClickSound(); setIsMobileMapOpen(false); }}
                  className="text-neutral-400 hover:text-white p-1 rounded text-xs leading-none font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Symmetrical SVG representing exactly Figure 1 floor plan */}
              <div className="flex justify-center my-0.5 bg-black/50 p-1.5 rounded-xl border border-[#8c6b43]/20">
                <svg className="w-[110px] h-[155px] stroke-[#8c6b43]/40 fill-none" strokeWidth="1.2">
                  <path 
                    d="M 45 30 L 35 30 L 35 12 A 20 20 0 1 1 75 12 L 75 30 L 65 30 Z"
                    className="fill-neutral-900/60 stroke-[#8c6b43]/20 pointer-events-none"
                  />
                  <rect 
                    x="45" y="30" width="20" height="15"
                    onClick={() => jumpToChamber(4)}
                    className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 4 ? 'fill-amber-500/60 stroke-amber-300 stroke-2' : visitedChambers.rear_corridor ? 'fill-[#8c6b43]/20 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
                  />
                  <rect x="10" y="55" width="22" height="22" rx="1" className="fill-neutral-900/40 stroke-[#8c6b43]/30 pointer-events-none" />
                  <rect x="78" y="55" width="22" height="22" rx="1" className="fill-neutral-900/40 stroke-[#8c6b43]/30 pointer-events-none" />
                  <rect 
                    x="32" y="45" width="46" height="42" rx="3"
                    onClick={() => jumpToChamber(3)}
                    className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 3 ? 'fill-amber-500/60 stroke-amber-300 stroke-2 animate-pulse' : visitedChambers.main_chamber ? 'fill-[#8c6b43]/35 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
                  />
                  <rect x="43" y="56" width="24" height="20" rx="1" className="stroke-amber-400/55 fill-amber-500/10 pointer-events-none" />
                  <rect 
                    x="15" y="112" width="20" height="20" rx="1"
                    onClick={() => jumpToChamber(1)}
                    className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 1 ? 'fill-amber-500/60 stroke-amber-300 stroke-2 animate-pulse' : visitedChambers.left_ear ? 'fill-[#8c6b43]/35 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
                  />
                  <rect 
                    x="75" y="112" width="20" height="20" rx="1"
                    onClick={() => jumpToChamber(2)}
                    className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 2 ? 'fill-amber-500/60 stroke-amber-300 stroke-2 animate-pulse' : visitedChambers.right_ear ? 'fill-[#8c6b43]/35 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
                  />
                  <rect 
                    x="44" y="87" width="22" height="60"
                    onClick={() => jumpToChamber(0)}
                    className={`cursor-pointer transition-all duration-300 ${activeChamberIndex === 0 ? 'fill-amber-500/60 stroke-amber-300 stroke-2 animate-pulse' : visitedChambers.front_corridor ? 'fill-[#8c6b43]/30 stroke-[#8c6b43]' : 'fill-neutral-900/60 stroke-neutral-800'}`}
                  />
                </svg>
              </div>

              {/* Progress indicators */}
              <div className="pt-1.5 border-t border-[#8c6b43]/30 flex justify-between items-center text-xs text-neutral-400">
                <span>{isEn ? 'Progress:' : '探索进度:'}</span>
                <span className="font-semibold text-amber-200 font-mono">
                  {Object.values(visitedChambers).filter(v => v).length} / 5
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCandle>

      {/* 5. TOP HEADER - MINIMALIST BRANDING */}
      <header className="absolute top-0 left-0 w-full z-20 px-3 sm:px-8 py-2.5 sm:py-5 flex justify-between items-center bg-gradient-to-b from-black/95 via-black/70 to-transparent">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
          <div className="text-left">
            <div className="text-[10px] sm:text-xs md:text-sm text-neutral-400 font-serif tracking-[0.1em] sm:tracking-[0.2em] uppercase">
              {isEn ? 'Fangshan Tomb · Roaming' : '房山长沟大墓 · 地宫漫游'}
            </div>
            <div className="text-xs sm:text-sm md:text-base font-bold text-amber-300 font-serif">
              {isEn ? (activeChamber.nameEn || activeChamber.name) : activeChamber.name}
            </div>
          </div>
        </div>
        
        {/* Simple tactile scroll walking feedback */}
        <div className="hidden sm:flex flex-col items-center space-y-1 text-center px-2">
          <span className="text-xs md:text-sm text-amber-400/80 font-serif tracking-widest">
            {activeChamberIndex === 4 
              ? (isEn ? '🎉 Exploration Completed' : '🎉 轴线探索已圆满达成') 
              : isMobile 
                ? (isEn ? '👆 Drag horizontally to look around / Click map to travel ➔' : '👆 手指左右拖拽旋转画面 / 点击下方地图漫游 ➔') 
                : (isEn ? '🖱️ Scroll mouse wheel to walk forward / Move mouse to view dome ➔' : '🖱️ 滚动鼠标滚轮前行步履 / 移动鼠标视角漫游 ➔')}
          </span>
          <div className="w-32 sm:w-40 h-[3px] bg-[#4a3a27] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-200" 
              style={{ width: `${chamberProgress}%` }}
            />
          </div>
        </div>

        <div className="w-24 sm:w-48 pointer-events-none shrink-0" />
      </header>

      {/* 6. IMMERSIVE LIGHTBOX FOR MURALS */}
      <AnimatePresence>
        {selectedMural && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-serif text-[#ebdcc8]"
          >
            <motion.div 
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="max-w-4xl w-full border-2 sm:border-4 border-[#8c6b43] rounded-2xl bg-[#140e0a] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-[75vh] relative"
            >
              {/* Corner ornaments */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />

              <div 
                onClick={() => {
                  playClickSound();
                  setFullscreenImage(getImageUrl(selectedMural.image));
                }}
                className="w-full h-[30vh] sm:h-[35vh] md:h-auto md:w-1/2 bg-[#0a0705] relative flex items-center justify-center border-b md:border-b-0 md:border-r border-[#8c6b43]/30 p-2 sm:p-4 shrink-0 cursor-zoom-in group"
              >
                <div className="absolute inset-2 sm:inset-4 border border-dashed border-[#8c6b43]/15 pointer-events-none" />
                <div className="relative w-full h-full rounded overflow-hidden flex items-center justify-center bg-black/50 shadow-inner">
                  <img 
                    src={getImageUrl(selectedMural.image)} 
                    alt={selectedMural.titleZh} 
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain rounded transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-[#1c130d]/90 border border-[#8c6b43]/40 px-2 py-0.5 rounded text-[10px] sm:text-xs text-amber-400 font-sans font-medium">
                    {isEn ? 'Tang Mural Relic' : '唐代壁画遗珍 (现场实拍)'}
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full opacity-85 group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <span>🔍 {isEn ? 'Fullscreen' : '点击查看高清全屏大图'}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#18110b] to-[#0a0705]">
                <div>
                  <div className="flex justify-between items-start border-b border-[#8c6b43]/30 pb-3 mb-4">
                    <div>
                      <span className="text-xs text-[#c5a059] font-mono tracking-widest uppercase">{selectedMural.title}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-[#fefde0] mt-0.5 font-serif">{isEn ? selectedMural.title : selectedMural.titleZh}</h3>
                    </div>
                    <button 
                      onClick={() => { playClickSound(); setSelectedMural(null); }}
                      className="p-1.5 rounded-full border border-[#4a3a27] hover:border-amber-400 text-[#ebdcc8]/60 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm md:text-base text-amber-50/90 leading-relaxed mb-4 font-serif text-justify indent-6">
                    {isEn ? (selectedMural.descriptionEn || selectedMural.description) : selectedMural.description}
                  </p>

                  <div className="bg-[#22180f] p-4 rounded-xl border border-[#8c6b43]/40 mb-4">
                    <h4 className="text-xs md:text-sm font-bold text-amber-400 mb-2 font-serif">
                      {isEn ? '✦ Late Tang Rituals & Archaeological Meaning:' : '✦ 晚唐藩镇礼俗与考古内涵：'}
                    </h4>
                    <p className="text-xs md:text-sm text-amber-100/80 leading-relaxed font-serif text-justify">
                      {isEn ? (selectedMural.historicalContextEn || selectedMural.historicalContext) : selectedMural.historicalContext}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs md:text-sm font-bold text-amber-400 font-serif">
                      {isEn ? '✦ Painting Technique & Pigment Details:' : '✦ 绘画笔意与色彩细节考究：'}
                    </h4>
                    {(isEn ? (selectedMural.detailsEn || selectedMural.details) : selectedMural.details).map((detail, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs md:text-sm text-[#ebdcc8]/90 font-serif">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#8c6b43]/20 flex justify-end">
                  <button
                    onClick={() => { playClickSound(); setSelectedMural(null); }}
                    className="px-6 py-2.5 rounded bg-amber-500 text-black hover:bg-amber-400 text-xs md:text-sm font-bold font-serif transition-colors cursor-pointer shadow-lg"
                  >
                    {isEn ? 'Close & Continue Roaming' : '关闭，继续地宫漫游'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. IMMERSIVE LIGHTBOX FOR ARTIFACTS */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-serif text-[#ebdcc8]"
          >
            <motion.div 
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="max-w-5xl w-full border-2 sm:border-4 border-[#8c6b43] rounded-2xl bg-[#140e0a] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-[75vh] relative"
            >
              {/* Corner ornaments */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />

              <div className="w-full h-[32vh] sm:h-[38vh] md:h-auto md:w-[62%] bg-[#090604] relative flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#8c6b43]/30 p-2 sm:p-4 md:p-6 shrink-0">
                <div className="absolute inset-2 sm:inset-4 border border-dashed border-[#8c6b43]/15 pointer-events-none" />
                
                {selectedArtifact.images && selectedArtifact.images.length > 0 ? (
                  <div className="w-full h-full flex flex-col justify-between z-10 relative">
                    {/* Top title label */}
                    <div className="text-center mb-1 sm:mb-2">
                      <span className="text-[10px] sm:text-xs text-amber-500/80 tracking-widest font-mono uppercase block">
                        {isEn ? `Unearthed Relic (${selectedArtifact.locationEn || selectedArtifact.location})` : `${selectedArtifact.location} 出土实物大图`}
                      </span>
                    </div>

                    {/* Main Image View with Fullscreen trigger */}
                    <div 
                      onClick={() => {
                        playClickSound();
                        setFullscreenImage(getImageUrl(selectedArtifact.images[activeImgIndex] || selectedArtifact.images[0]));
                      }}
                      className="flex-1 flex items-center justify-center overflow-hidden bg-black/40 rounded-xl border border-[#8c6b43]/30 p-1 sm:p-2 relative shadow-inner cursor-zoom-in group"
                    >
                      <img 
                        src={getImageUrl(selectedArtifact.images[activeImgIndex] || selectedArtifact.images[0])} 
                        alt={selectedArtifact.titleZh}
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-[26vh] sm:max-h-[45vh] md:max-h-[55vh] object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full opacity-85 group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                        <span>🔍 {isEn ? 'Fullscreen' : '点击查看高清全屏大图'}</span>
                      </div>
                    </div>

                    {/* Thumbnail Selector (if multiple images are present) */}
                    {selectedArtifact.images.length > 1 && (
                      <div className="mt-4 flex flex-col items-center gap-1.5 pb-2">
                        <span className="text-xs text-neutral-300 font-sans">
                          {isEn ? `Switch Detail (${activeImgIndex + 1} / ${selectedArtifact.images.length})` : `切换查看细节 (${activeImgIndex + 1} / ${selectedArtifact.images.length})`}
                        </span>
                        <div className="flex justify-center gap-2 flex-wrap">
                          {selectedArtifact.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => { playClickSound(); setActiveImgIndex(idx); }}
                              className={`w-12 h-12 rounded-md border overflow-hidden transition-all duration-200 bg-[#120c08] ${
                                activeImgIndex === idx 
                                  ? 'border-amber-400 scale-105 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
                                  : 'border-[#4a3a27] hover:border-amber-600 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img 
                                src={getImageUrl(img)} 
                                alt="缩略图" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center justify-center h-full z-10 py-10">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#3a2817] to-yellow-600/10 border-2 border-[#8c6b43]/60 flex items-center justify-center text-6xl shadow-2xl mb-6 relative">
                      <div className="absolute -inset-4 rounded-full border border-dashed border-[#8c6b43]/15 animate-spin" />
                      {selectedArtifact.id === 'artifact_liuji_epitaph' || selectedArtifact.id === 'artifact_wife_epitaph' ? '📜' : 
                       selectedArtifact.id === 'artifact_coffin_bed' ? '🪦' :
                       selectedArtifact.id === 'artifact_lamp' ? '🪔' :
                       selectedArtifact.id === 'artifact_civil_official' ? '👨‍💼' :
                       selectedArtifact.id === 'artifact_military_official' ? '💂' :
                       selectedArtifact.id === 'artifact_camel' ? '🐫' : '🦁'}
                    </div>
                    <h4 className="text-lg text-amber-200 font-serif font-bold">{isEn ? selectedArtifact.title : selectedArtifact.titleZh}</h4>
                    <span className="text-xs text-neutral-400 font-mono mt-1">{isEn ? `Unearthed: ${selectedArtifact.locationEn || selectedArtifact.location}` : `${selectedArtifact.location} 出土`}</span>
                  </div>
                )}
              </div>

              <div className="w-full md:w-[38%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#18110b] to-[#0a0705]">
                <div>
                  <div className="flex justify-between items-start border-b border-[#8c6b43]/30 pb-3 mb-4">
                    <div>
                      <span className="text-xs text-[#c5a059] font-mono tracking-widest uppercase">{selectedArtifact.title}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-[#fefde0] mt-0.5 font-serif">{isEn ? selectedArtifact.title : selectedArtifact.titleZh}</h3>
                    </div>
                    <button 
                      onClick={() => { playClickSound(); setSelectedArtifact(null); }}
                      className="p-1.5 rounded-full border border-[#4a3a27] hover:border-amber-400 text-[#ebdcc8]/60 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-amber-50/90 leading-relaxed mb-4 font-serif text-justify">
                    {isEn ? (selectedArtifact.descriptionEn || selectedArtifact.description) : selectedArtifact.description}
                  </p>

                  <div className="bg-[#22180f] p-3.5 rounded-xl border border-[#8c6b43]/30 mb-4 text-xs md:text-sm space-y-1.5">
                    <div className="flex justify-between border-b border-[#8c6b43]/15 pb-1">
                      <span className="text-neutral-400">{isEn ? 'Excavation Location:' : '出土位置:'}</span>
                      <span className="text-amber-200 font-bold">{isEn ? (selectedArtifact.locationEn || selectedArtifact.location) : selectedArtifact.location}</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-1 text-xs md:text-sm text-amber-100/80 font-serif text-justify leading-relaxed">
                      <span className="text-amber-400 font-bold">{isEn ? '✦ Overview & Materials:' : '✦ 文物简述 & 材质特征：'}</span>
                      <span>{isEn ? (selectedArtifact.craftsmanshipEn || selectedArtifact.craftsmanship) : `${selectedArtifact.craftsmanship.split('。')[0]}。${selectedArtifact.excavationInfo.split('。')[0]}。`}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs md:text-sm font-bold text-amber-400 font-serif">{isEn ? '✦ Key Historical Motifs & Symbols:' : '✦ 核心历史纹样与符号：'}</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(isEn ? (selectedArtifact.motifsEn || selectedArtifact.motifs) : selectedArtifact.motifs).map((motif, idx) => (
                        <span key={idx} className="bg-[#221810] text-[#ebdcc8] border border-[#8c6b43]/30 px-3 py-1 rounded text-xs font-serif">
                          ✦ {motif}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#8c6b43]/20 flex justify-end">
                  <button
                    onClick={() => { playClickSound(); setSelectedArtifact(null); }}
                    className="px-6 py-2.5 rounded bg-amber-500 text-black hover:bg-amber-400 text-xs md:text-sm font-bold font-serif transition-colors cursor-pointer shadow-lg"
                  >
                    {isEn ? 'Close & Continue Exploring' : '关闭，继续探索'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. IMMERSIVE LIGHTBOX FOR CUSTOM NARRATIVES */}
      <AnimatePresence>
        {customInfoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 font-serif text-[#ebdcc8]"
          >
            <motion.div 
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="max-w-md w-full border-4 border-[#8c6b43] rounded-2xl bg-[#18110b] p-8 shadow-2xl relative text-center"
            >
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />

              <h4 className="text-lg md:text-xl text-amber-300 font-bold font-serif mb-3 pt-2">
                {isEn ? (customInfoModal.titleEn || customInfoModal.title) : customInfoModal.title}
              </h4>
              <div className="w-12 h-[1px] bg-[#8c6b43]/50 mx-auto mb-4" />

              {customInfoModal.image && (
                <div 
                  onClick={() => {
                    playClickSound();
                    setFullscreenImage(getImageUrl(customInfoModal.image!));
                  }}
                  className="mb-4 rounded-lg overflow-hidden border border-[#8c6b43]/50 shadow-xl bg-black/80 p-1 cursor-zoom-in group relative"
                >
                  <img
                    src={getImageUrl(customInfoModal.image)}
                    alt={customInfoModal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-52 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/40 opacity-85 group-hover:opacity-100 transition-opacity">
                    🔍 {isEn ? 'Click for Fullscreen' : '点击全屏查看'}
                  </div>
                </div>
              )}
              
              <p className="text-sm md:text-base leading-relaxed text-amber-50/90 text-justify font-serif mb-6 px-1">
                {isEn ? (customInfoModal.contentEn || customInfoModal.content) : customInfoModal.content}
              </p>

              <button
                onClick={() => { playClickSound(); setCustomInfoModal(null); }}
                className="px-6 py-2.5 rounded bg-amber-500 text-black hover:bg-amber-400 text-xs md:text-sm font-bold font-serif transition-colors cursor-pointer"
              >
                {isEn ? 'Close & Continue' : '关闭，继续探索'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. EXPLORATION COMPLETION PORTAL OVERLAY */}
      <AnimatePresence>
        {showCompletionPortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="max-w-xl w-full border-4 border-[#8c6b43] bg-[#1a120c] p-8 md:p-12 rounded-2xl shadow-[0_30px_70px_rgba(245,158,11,0.15)] text-center relative"
            >
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />

              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-4xl mx-auto mb-6">
                🎉
              </div>

              <span className="text-xs tracking-[0.3em] text-amber-500 font-mono block mb-1 uppercase font-bold">
                {isEn ? 'Immersion Exploration Complete' : 'IMMERSION EXPLORATION COMPLETE'}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 tracking-widest mb-4">
                {isEn ? 'Tomb Exploration Axis Completed' : '地宫轴线漫游功德圆满'}
              </h2>

              <p className="text-sm md:text-base text-amber-50/85 leading-relaxed font-serif mb-8 max-w-md mx-auto text-justify md:text-center">
                {isEn 
                  ? '“Guided by candlelight, you have traversed 5 meters beneath the surface through all five axial spaces of the Tang Tomb. The history of Jiedushi Liu Ji and his wife, their epitaphs, and burial treasures have been fully explored.”'
                  : '“你已手执红烛、穿行于房山长沟大墓地下5米深的五重轴线空间。晚唐藩镇节度使刘济与夫人的生平、墓志与随葬奇珍皆已勘考完结。”'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => { playClickSound(); onBackToHome(); }}
                  className="px-6 py-3.5 border-2 border-[#8c6b43] bg-[#22180f] hover:bg-[#342417] text-amber-300 rounded font-serif text-xs md:text-sm tracking-widest font-bold transition-all hover:border-amber-400 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isEn ? 'Back to Home' : '返回主页'}</span>
                </button>

                <button
                  onClick={() => { playClickSound(); onGoToMuralHall(); }}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0c0c0e] rounded font-serif text-xs md:text-sm tracking-widest font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer flex items-center justify-center space-x-2 animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEn ? 'Enter Mural Gallery' : '步入数字壁画馆'}</span>
                </button>
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
                alt="全屏文物大图"
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
