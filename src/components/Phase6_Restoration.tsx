import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RESTORATION_STEPS } from '../data';
import { playClickSound } from '../utils/audio';
import { getImageUrl } from '../utils/imageLoader';
import { 
  Wrench, Sparkles, CheckCircle2, RotateCcw, 
  Download, Share2, ArrowLeft, Brush, FlaskConical, 
  Palette, PenTool, Flame, Info, Check, HelpCircle as HelpIcon, 
  Sun, Eye, Sliders, Shield, Zap, Search, Activity, RefreshCw
} from 'lucide-react';

interface Phase6RestorationProps {
  onBackToHome: () => void;
  lang?: 'zh' | 'en';
}

interface PathologyType {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
  cause: string;
  causeEn: string;
  solution: string;
  solutionEn: string;
  dangerLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  microscopicDesc: string;
  microscopicDescEn: string;
  colorClass: string;
  x: string;
  y: string;
}

const PATHOLOGIES: PathologyType[] = [
  {
    id: 'hollow_drum',
    name: '空鼓',
    nameEn: 'Hollow Drum (Detachment)',
    icon: '🕳️',
    description: '因地表水下渗与温度骤变，导致墓室泥灰粉刷层与背部红砖体之间形成中空。空气充斥其中，一触即塌。',
    descriptionEn: 'Surface water seepage and temperature shifts created hollow voids between plaster coat and brick body.',
    cause: '墓壁深层水分不均，产生热胀冷缩，致泥灰层物理剥离。',
    causeEn: 'Uneven moisture content causing thermal expansion & contraction, peeling plaster physically.',
    solution: '骨胶注浆法。使用天然猪骨或牛骨胶液通过微孔注射填补，并配合科学按压，让墙面回归平整。',
    solutionEn: 'Targeted Bone Glue Injection. Micro-injecting natural gelatin solution to re-fill voids.',
    dangerLevel: 'CRITICAL',
    microscopicDesc: '岩层结合层纤维发生解体，泥砂颗粒大面积悬空错位。',
    microscopicDescEn: 'Binding fibers disintegrated at interfacial layer; sand grains suspended and dislocated.',
    colorClass: 'bg-red-950/40 text-red-400 border-red-900/50',
    x: '32%',
    y: '42%'
  },
  {
    id: 'flaking',
    name: '剥落与起甲',
    nameEn: 'Flaking & Peeling',
    icon: '🍂',
    description: '由于地宫湿度过高，泥灰层中的可溶性盐类发生重结晶，体积膨胀，导致表层矿物颜料层发生龟裂、起翘和片状脱落。',
    descriptionEn: 'High humidity causes soluble salt recrystallization in plaster, expanding volume and causing mineral paint flaking.',
    cause: '地下盐碱随水分向表面渗透并结晶，硬化顶起色彩颜料层。',
    causeEn: 'Underground salt seeped with water, crystallizing on surface and pushing up color layers.',
    solution: '边缘粘合回贴。使用温和天然粘合剂点涂于起翘边缘，以软木压块垫无酸纸轻柔回压抚平。',
    solutionEn: 'Edge Re-adhesion. Applying mild natural binder onto flaking edges and gently pressing flat with cork pads.',
    dangerLevel: 'HIGH',
    microscopicDesc: '胶结物严重丧失，矿物晶体之间失去拉力，呈片状游离。',
    microscopicDescEn: 'Binder heavily lost; mineral crystals lost tension and floated into flaking sheets.',
    colorClass: 'bg-amber-950/40 text-amber-400 border-amber-900/50',
    x: '68%',
    y: '30%'
  },
  {
    id: 'fading',
    name: '色料褪变',
    nameEn: 'Pigment Fading',
    icon: '🎨',
    description: '唐代主要使用朱砂、石青、石绿等重彩矿物颜料。千百年来由于空气缓慢渗入以及墓室酸碱环境侵蚀，色料表面失去原有胶度，斑驳黯淡。',
    descriptionEn: 'Tang murals used cinnabar and malachite. Over millennia, air infiltration and acidity degraded binder, rendering colors dim.',
    cause: '有机胶结材料老化降解，矿物粉体失去保护介质而氧化或粉化。',
    causeEn: 'Organic binder aged and degraded; mineral powders oxidized without protective media.',
    solution: '矿物研彩复原。在充分保护线条的前提下，用最温和的天然色料浆液补充脱落区域，恢复大唐重彩韵味。',
    solutionEn: 'Mineral Pigment Inpainting. Supplementing lost areas with gentle natural pigment slurries while protecting original outlines.',
    dangerLevel: 'MEDIUM',
    microscopicDesc: '颜料晶格受酸性墓液溶蚀，反射折射率大范围改变，光泽暗哑。',
    microscopicDescEn: 'Pigment lattice eroded by tomb fluids, changing refractive index and dimming luster.',
    colorClass: 'bg-blue-950/40 text-blue-400 border-blue-900/50',
    x: '45%',
    y: '65%'
  },
  {
    id: 'mold_infestation',
    name: '霉菌侵害',
    nameEn: 'Mold & Biocrust',
    icon: '🦠',
    description: '密闭黑暗的地宫中凝结了丰富的地表渗透水气。这给地下霉菌、地衣提供了天然温床，它们大肆蔓延，形成漆黑的菌斑，完全遮蔽了绝美的画面。',
    descriptionEn: 'Enclosed dark tomb moisture spawned mold colonies and biocrusts, forming black spots obscuring artwork.',
    cause: '地下积水、空气微循环与富营养泥土颗粒促使真菌大量繁殖。',
    causeEn: 'Stagnant water, micro-air loops, and nutrient soil enabled fungal growth.',
    solution: '生化温和除霉。采用专用的微毒抑菌剂点涂，再用极细软拂尘扫除干涸菌丝，保留底层彩绘不受破坏。',
    solutionEn: 'Biochemical Mild Mold Removal. Applying targeted anti-fungal solution and softly dusting dried hyphae.',
    dangerLevel: 'HIGH',
    microscopicDesc: '霉菌菌丝交织成网状侵入颜料层微孔，吸附重金属离子呈黑色。',
    microscopicDescEn: 'Fungal hyphae intertwined into networks inside micropores, adsorbing heavy metal ions.',
    colorClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50',
    x: '78%',
    y: '72%'
  }
];

// Guide Paths definition (SVG coordinates on a 400x300 canvas space)
const GUIDE_PATHS: { [key: number]: { path: string; name: string; nameEn: string } } = {
  1: { path: "M 50 150 Q 150 80, 250 150 T 450 150", name: "微风除尘扫描线", nameEn: "Dusting Sweep Path" },
  2: { path: "M 220 30 L 200 130 L 240 230 L 220 330", name: "开裂空鼓灌浆缝", nameEn: "Hollow Fissure Path" },
  3: { path: "M 100 180 C 130 100, 320 100, 350 200 C 270 280, 160 280, 100 180 Z", name: "朱砂重彩点色域", nameEn: "Cinnabar Inpaint Zone" },
  4: { path: "M 150 90 C 160 150, 230 160, 210 240 C 190 280, 250 310, 300 270", name: "仕女铁线轮廓墨迹", nameEn: "Lady Outline Ink Path" },
  5: { path: "M 240 180 A 30 30 0 1 0 270 180 A 60 60 0 1 0 300 180 A 90 90 0 1 0 330 180", name: "全幅固色螺旋层", nameEn: "Full Fixative Spiral Layer" }
};

export default function Phase6_Restoration({ onBackToHome, lang = 'zh' }: Phase6RestorationProps) {
  const isEn = lang === 'en';
  const [restorationStage, setRestorationStage] = useState<'KNOWLEDGE' | 'SIMULATION'>('KNOWLEDGE');
  const [knowledgeStep, setKnowledgeStep] = useState<'PATHOLOGY' | 'PRINCIPLE' | 'STEPS'>('PATHOLOGY');
  const [selectedPathology, setSelectedPathology] = useState<string>('hollow_drum');
  const [pathologyVisionMode, setPathologyVisionMode] = useState<'BEFORE' | 'AFTER'>('BEFORE');
  const [demoStepIndex, setDemoStepIndex] = useState<number>(1);
  const [isAutoPlayingDemo, setIsAutoPlayingDemo] = useState<boolean>(false);
  const [viewedDemoSteps, setViewedDemoSteps] = useState<number[]>([1]);
  const [showStepsWarning, setShowStepsWarning] = useState<boolean>(false);

  useEffect(() => {
    if (restorationStage === 'KNOWLEDGE' && knowledgeStep === 'STEPS') {
      setViewedDemoSteps(prev => prev.includes(demoStepIndex) ? prev : [...prev, demoStepIndex]);
    }
  }, [demoStepIndex, restorationStage, knowledgeStep]);

  const hasViewedAllDemoSteps = [1, 2, 3, 4, 5].every(s => viewedDemoSteps.includes(s));

  useEffect(() => {
    let timer: any;
    if (isAutoPlayingDemo && restorationStage === 'KNOWLEDGE' && knowledgeStep === 'STEPS') {
      timer = setInterval(() => {
        setDemoStepIndex((prev) => (prev % 5) + 1);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlayingDemo, restorationStage, knowledgeStep]);

  // Interactive workshop states
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [stepProgress, setStepProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [beforeAfterPos, setBeforeAfterPos] = useState<number>(50); // Before & After Comparison Slider Position (0 to 100%)

  // Advanced Spectrum, Lighting, and Magnifier States
  const [spectralMode, setSpectralMode] = useState<'DAYLIGHT' | 'UV' | 'INFRARED'>('DAYLIGHT');
  const [lightIntensity, setLightIntensity] = useState<number>(120); // 50% to 150%, brighter default
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, relX: 0.5, relY: 0.5 });
  const [hoveringCanvas, setHoveringCanvas] = useState<boolean>(false);

  // Restoration Gameplay Mechanics Settings
  const [handStabilizer, setHandStabilizer] = useState<number>(5); // 1 to 10
  const [atomizationPressure, setAtomizationPressure] = useState<number>(6); // 1 to 10
  const [pigmentMoisture, setPigmentMoisture] = useState<number>(6); // 1 to 10
  const [pigmentLoaded, setPigmentLoaded] = useState<number>(0); // 0 to 100
  const [selectedPigmentType, setSelectedPigmentType] = useState<'CINNABAR' | 'MALACHITE'>('CINNABAR');

  // Targeted Injection Nodes for Step 2
  const [injectionNodes, setInjectionNodes] = useState([
    { id: 1, x: 180, y: 70, label: "仕女发冠中空层", labelEn: "Lady Crown Cavity", progress: 0 },
    { id: 2, x: 210, y: 150, label: "领襟粉刷层起翘", labelEn: "Collar Plaster Flaking", progress: 0 },
    { id: 3, x: 230, y: 220, label: "背景红砂岩开裂缝", labelEn: "Background Rock Fissure", progress: 0 },
    { id: 4, x: 200, y: 280, label: "下层砖胎错位沉降", labelEn: "Lower Brickbed Settling", progress: 0 }
  ]);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

  // General drag, wrong-drag, trail points states
  const [showGuidePath, setShowGuidePath] = useState(true);
  const [isWrongDrag, setIsWrongDrag] = useState(false);
  const [isDraggingTool, setIsDraggingTool] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedPoints, setDraggedPoints] = useState<{ x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  const activeStep = RESTORATION_STEPS[currentStepIndex - 1];

  // Local programmatic sound generator using Web Audio API
  const playRestorationSound = (type: 'sweep' | 'inject' | 'dab' | 'trace' | 'spray' | 'success') => {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      if (type === 'sweep') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      } else if (type === 'inject') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.25);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      } else if (type === 'dab') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      } else if (type === 'trace') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      } else if (type === 'spray') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(3100, now + 0.18);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      } else if (type === 'success') {
        // Pentatonic scale chime progression (宫 C, 角 E, 徵 G, 羽 A, 宫 C5)
        const notes = [261.63, 329.63, 392.00, 440.00, 523.25];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.08);
          g.connect(ctx.destination);
          o.connect(g);
          g.gain.setValueAtTime(0.0, now);
          g.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.45);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.5);
        });
        return;
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio Context synth failed:", e);
    }
  };

  // High quality vector-designed tools with prominent illustrations
  const tools = [
    { 
      type: 'brush', 
      name: '山羊毫古法拂尘刷', 
      nameEn: 'Wool Bristle Duster',
      icon: Brush, 
      chem: '纯天然精选山羊毛 · 软木手柄',
      chemEn: 'Pure Selected Goat Wool · Cork Handle',
      desc: '专用于清理壁画表面的浮砂、泥迹以及千年堆积的风沙粉尘。刷毛极细微，在不伤及颜料层的前提下静电吸附污垢。', 
      descEn: 'Used for clearing surface sand and dust accumulated over centuries without damaging pigment layers.',
      step: 1,
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-md">
          {/* Wooden handle */}
          <rect x="44" y="55" width="12" height="35" rx="3" fill="#a0522d" stroke="#5c2e16" strokeWidth="1.5" />
          <path d="M 44 80 L 56 80 L 52 90 L 48 90 Z" fill="#5c2e16" />
          {/* Metal sleeve */}
          <rect x="40" y="45" width="20" height="10" rx="1" fill="#c0c0c0" stroke="#7f7f7f" strokeWidth="1" />
          {/* Premium Brush Hairs */}
          <path d="M 50 10 C 30 25 28 50 42 45 C 50 43 50 43 58 45 C 72 50 70 25 50 10" fill="#fdfefe" stroke="#d5dbdb" strokeWidth="1.5" />
          <circle cx="50" cy="45" r="3" fill="#8c6d4f" />
          {/* Hair strands */}
          <line x1="42" y1="35" x2="42" y2="45" stroke="#e5e7e9" strokeWidth="1" />
          <line x1="50" y1="20" x2="50" y2="45" stroke="#e5e7e9" strokeWidth="1" />
          <line x1="58" y1="35" x2="58" y2="45" stroke="#e5e7e9" strokeWidth="1" />
          <line x1="46" y1="25" x2="46" y2="45" stroke="#e5e7e9" strokeWidth="1" />
          <line x1="54" y1="25" x2="54" y2="45" stroke="#e5e7e9" strokeWidth="1" />
        </svg>
      )
    },
    { 
      type: 'glue', 
      name: '动物明胶精准注射器', 
      nameEn: 'Animal Bone Glue Syringe',
      icon: FlaskConical, 
      chem: '8% 天然牛骨胶 + 92% 去离子高纯水',
      chemEn: '8% Natural Bovine Bone Glue + 92% Pure Water',
      desc: '注入中空岩壁裂隙层。在35℃恒温下具有极佳的流动性，冷却结晶后强度高、收缩性极微，是加固空鼓的黄金粘合剂。', 
      descEn: 'Injected into hollow wall gaps at 35°C for high bonding strength and minimal shrinkage upon cooling.',
      step: 2,
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-md">
          {/* Steel syringe barrel */}
          <rect x="42" y="20" width="16" height="42" rx="1" fill="none" stroke="#e2d4b7" strokeWidth="2.5" />
          {/* Fluid levels */}
          <rect x="45" y="32" width="10" height="28" fill="#c5893a" opacity="0.85" />
          {/* Plunger shaft and grip */}
          <line x1="50" y1="5" x2="50" y2="32" stroke="#b43d2c" strokeWidth="3" />
          <rect x="40" y="5" width="20" height="4" rx="1" fill="#78281f" />
          <line x1="45" y1="32" x2="55" y2="32" stroke="#78281f" strokeWidth="2" />
          {/* Fine needle */}
          <line x1="50" y1="62" x2="50" y2="92" stroke="#90a4ae" strokeWidth="1.5" strokeLinecap="round" />
          {/* Measurement marks */}
          <line x1="45" y1="38" x2="49" y2="38" stroke="#ffffff" strokeWidth="1" />
          <line x1="45" y1="44" x2="49" y2="44" stroke="#ffffff" strokeWidth="1" />
          <line x1="45" y1="50" x2="49" y2="50" stroke="#ffffff" strokeWidth="1" />
          <line x1="45" y1="56" x2="49" y2="56" stroke="#ffffff" strokeWidth="1" />
          {/* Glowing tip indicator */}
          <circle cx="50" cy="92" r="4" fill="#b43d2c" className="animate-ping" opacity="0.6" />
        </svg>
      )
    },
    { 
      type: 'paint', 
      name: '矿物研磨石青朱砂色盘', 
      nameEn: 'Mineral Cinnabar Palette',
      icon: Palette, 
      chem: '超细研磨辰砂矿粉 / 青金石原石粉',
      chemEn: 'Ultrafine Ground Cinnabar & Azurite Ore Powder',
      desc: '采用唐代原汁原味的研磨重彩，经澄泥水漂法提纯。朱砂呈饱满红润，石青呈幽深苍蓝，具有极高的耐光化学稳定性。', 
      descEn: 'Authentic Tang Dynasty heavy mineral pigments with outstanding lightfastness and stability.',
      step: 3,
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-md">
          {/* Wooden circular palette tray */}
          <circle cx="50" cy="50" r="40" fill="#2c1e14" stroke="#d4af37" strokeWidth="1.5" />
          {/* Finger hole */}
          <circle cx="35" cy="50" r="6" fill="#140b05" />
          {/* Highly colorful heavy mineral paste pools */}
          <circle cx="50" cy="26" r="11" fill="#b43d2c" stroke="#e2d4b7" strokeWidth="1" /> {/* Cinnabar Red */}
          <circle cx="70" cy="42" r="11" fill="#1e8449" stroke="#e2d4b7" strokeWidth="1" /> {/* Malachite Green */}
          <circle cx="65" cy="66" r="11" fill="#2471a3" stroke="#e2d4b7" strokeWidth="1" /> {/* Azurite Blue */}
          <circle cx="45" cy="74" r="11" fill="#d4ac0d" stroke="#e2d4b7" strokeWidth="1" /> {/* Ochre Yellow */}
          {/* Highlight sparkles on pigments */}
          <circle cx="48" cy="22" r="2" fill="#ffffff" opacity="0.8" />
          <circle cx="68" cy="38" r="2" fill="#ffffff" opacity="0.8" />
          <circle cx="63" cy="62" r="2" fill="#ffffff" opacity="0.8" />
        </svg>
      )
    },
    { 
      type: 'pen', 
      name: '五官开相北尾狼毫笔', 
      nameEn: 'Weasel Hair Calligraphy Pen',
      icon: PenTool, 
      chem: '纯正松烟香墨 + 雄胆胶汁固化',
      chemEn: 'Pure Pine Soot Ink + Bile Glue Cure',
      desc: '专为仕女发丝、眉梢、唇线及衣袍铁线描复原而制。笔头坚挺圆润，锋芒锐利，出水均匀，极富弹韧。', 
      descEn: 'Crafted for delicate facial features, hair strands, and iron-wire outlines with sharp resilience.',
      step: 4,
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-md">
          {/* Spotted bamboo shaft */}
          <line x1="20" y1="80" x2="72" y2="28" stroke="#d4ac0d" strokeWidth="3.5" strokeLinecap="round" />
          {/* Bamboo nodes */}
          <circle cx="37" cy="63" r="2.5" fill="#9a7d0a" />
          <circle cx="55" cy="45" r="2.5" fill="#9a7d0a" />
          {/* Golden brass bolster sleeve */}
          <path d="M 18 82 L 23 77 L 27 81 L 22 86 Z" fill="#b49b3c" />
          {/* Dark fine hair tip */}
          <path d="M 20 80 L 7 93 C 12 88 15 88 20 80" fill="#111111" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
          {/* Drip of ink */}
          <circle cx="7" cy="93" r="1.5" fill="#111111" />
        </svg>
      )
    },
    { 
      type: 'varnish', 
      name: '丙烯共聚无色固色喷剂', 
      nameEn: 'Color Protection Sealant',
      icon: Flame, 
      chem: '2.5% 高分子乳液 + 抗菌挥发抑菌剂',
      chemEn: '2.5% Polymer Emulsion + Anti-bacterial Agent',
      desc: '在壁画表面建立纳米级的无色透气防水封护层。阻隔地宫水气和外界二氧化碳，牢固锁住矿物颜料颗粒。', 
      descEn: 'Forms a breathable nano-protective layer locking mineral pigments against moisture and air.',
      step: 5,
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-md">
          {/* Elegant traditional bronze spray canister */}
          <rect x="36" y="32" width="28" height="45" rx="4" fill="#3e2723" stroke="#8d6e63" strokeWidth="2" />
          {/* Copper neck and cap */}
          <rect x="42" y="18" width="16" height="14" rx="1.5" fill="#8d6e63" stroke="#5d4037" strokeWidth="1.5" />
          {/* Nozzle outlet */}
          <path d="M 42 18 L 32 12 L 32 20 Z" fill="#5d4037" />
          {/* Pump top handle lever */}
          <line x1="50" y1="18" x2="50" y2="8" stroke="#8d6e63" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="8" r="3.5" fill="#5d4037" />
          {/* Metallic ornamentation */}
          <rect x="42" y="40" width="16" height="18" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
          <circle cx="50" cy="49" r="4" fill="#d4af37" opacity="0.5" />
        </svg>
      )
    },
  ];

  // Map step numbers to precise guide coordinate paths
  const checkDragAccuracy = () => {
    return true; // Always allow flexible drag inside restoration canvas
  };

  // Direct pointer sweep / click handler on canvas
  const handleDirectPointerAction = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imageFrameRef.current || stepProgress >= 100) return;
    if (e.buttons !== 1 && e.type !== 'pointerdown') return;

    const rect = imageFrameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const relativeX = Math.max(0, Math.min(rect.width, x));
    const relativeY = Math.max(0, Math.min(rect.height, y));

    setDraggedPoints(prev => {
      const updated = [...prev, { x: relativeX, y: relativeY }];
      if (updated.length > 50) updated.shift();
      return updated;
    });

    setIsWrongDrag(false);

    if (currentStepIndex === 1) {
      setStepProgress(prev => {
        const next = Math.min(100, prev + 3.8);
        if (next >= 100 && prev < 100) playRestorationSound('success');
        else if (Math.random() < 0.3) playRestorationSound('sweep');
        return next;
      });
    } else if (currentStepIndex === 2) {
      setInjectionNodes(prev => {
        let updated = false;
        const nextNodes = prev.map(node => {
          if (!updated && node.progress < 100) {
            updated = true;
            const nextProg = Math.min(100, node.progress + 25);
            if (nextProg >= 100) playRestorationSound('success');
            else playRestorationSound('inject');
            return { ...node, progress: nextProg };
          }
          return node;
        });
        return nextNodes;
      });
    } else if (currentStepIndex === 3) {
      if (pigmentLoaded <= 0) {
        setPigmentLoaded(100);
      }
      setStepProgress(prev => {
        const next = Math.min(100, prev + 4.2);
        if (next >= 100 && prev < 100) playRestorationSound('success');
        else if (Math.random() < 0.3) playRestorationSound('dab');
        return next;
      });
      setPigmentLoaded(prev => Math.max(0, prev - 2.5));
    } else if (currentStepIndex === 4) {
      setStepProgress(prev => {
        const next = Math.min(100, prev + 3.6);
        if (next >= 100 && prev < 100) playRestorationSound('success');
        else if (Math.random() < 0.3) playRestorationSound('trace');
        return next;
      });
    } else if (currentStepIndex === 5) {
      setStepProgress(prev => {
        const next = Math.min(100, prev + 5.0);
        if (next >= 100 && prev < 100) playRestorationSound('success');
        else if (Math.random() < 0.3) playRestorationSound('spray');
        return next;
      });
    }
  };

  // Drag handler on the canvas relative coordinates
  const handleCanvasDrag = (event: any, info: any) => {
    if (!imageFrameRef.current || stepProgress >= 100) return;

    const rect = imageFrameRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;

    const relativeX = Math.max(0, Math.min(rect.width, x));
    const relativeY = Math.max(0, Math.min(rect.height, y));

    setDraggedPoints(prev => {
      const updated = [...prev, { x: relativeX, y: relativeY }];
      if (updated.length > 50) updated.shift();
      return updated;
    });

    setIsWrongDrag(false);
    const moveDistance = Math.sqrt(info.delta.x ** 2 + info.delta.y ** 2);
    
    if (moveDistance > 0.2) {
      if (currentStepIndex === 1) {
        setStepProgress(prev => {
          const next = Math.min(100, prev + moveDistance * 0.85);
          if (next >= 100 && prev < 100) playRestorationSound('success');
          else if (Math.floor(prev / 6) < Math.floor(next / 6)) playRestorationSound('sweep');
          return next;
        });
      } else if (currentStepIndex === 2) {
        setStepProgress(prev => {
          const next = Math.min(100, prev + moveDistance * 2.0);
          if (next >= 98 && prev < 98) playRestorationSound('success');
          else if (Math.floor(prev / 6) < Math.floor(next / 6)) playRestorationSound('inject');
          return next >= 98 ? 100 : next;
        });
        setInjectionNodes(prev => prev.map(node => ({
          ...node,
          progress: Math.min(100, Math.max(node.progress, node.progress + moveDistance * 4.0))
        })));
      } else if (currentStepIndex === 3) {
        if (pigmentLoaded <= 0) {
          setPigmentLoaded(100);
        }
        setStepProgress(prev => {
          const next = Math.min(100, prev + moveDistance * 0.75);
          if (next >= 100 && prev < 100) playRestorationSound('success');
          return next;
        });
        setPigmentLoaded(prev => Math.max(0, prev - moveDistance * 0.4));
        if (Math.random() < 0.2) playRestorationSound('dab');
      } else if (currentStepIndex === 4) {
        setStepProgress(prev => {
          const next = Math.min(100, prev + moveDistance * 0.7);
          if (next >= 100 && prev < 100) playRestorationSound('success');
          else if (Math.floor(prev / 8) < Math.floor(next / 8)) playRestorationSound('trace');
          return next;
        });
      } else if (currentStepIndex === 5) {
        setStepProgress(prev => {
          const next = Math.min(100, prev + moveDistance * 0.95);
          if (next >= 100 && prev < 100) playRestorationSound('success');
          else if (Math.floor(prev / 5) < Math.floor(next / 5)) playRestorationSound('spray');
          return next;
        });
      }
    }
  };

  // Click-to-Inject targets handler for Step 2
  const handleNodeInjection = (id: number) => {
    if (currentStepIndex !== 2) return;
    playClickSound();
    setActiveNodeId(id);
    playRestorationSound('inject');

    setInjectionNodes(prev => {
      const updated = prev.map(node => node.id === id ? { ...node, progress: 100 } : node);
      const sum = updated.reduce((acc, n) => acc + n.progress, 0);
      const totalPct = Math.min(100, (sum / 400) * 100);
      if (totalPct >= 95) {
        setStepProgress(100);
        playRestorationSound('success');
      } else {
        setStepProgress(totalPct);
      }
      return updated;
    });
    setTimeout(() => {
      setActiveNodeId(null);
    }, 200);
  };

  const handleNextStep = () => {
    playClickSound();
    if (currentStepIndex < 5) {
      setCurrentStepIndex(prev => prev + 1);
      setStepProgress(0);
      setDraggedPoints([]);
      setIsWrongDrag(false);
      // Initialize custom mechanics states
      if (currentStepIndex + 1 === 3) {
        setPigmentLoaded(100); // Fully loaded at start of painting
      }
    } else {
      setIsComplete(true);
      playRestorationSound('success');
    }
  };

  const handleReset = () => {
    playClickSound();
    setCurrentStepIndex(1);
    setStepProgress(0);
    setIsComplete(false);
    setDraggedPoints([]);
    setIsWrongDrag(false);
    setPigmentLoaded(0);
    setInjectionNodes(nodes => nodes.map(n => ({ ...n, progress: 0 })));
  };

  const handleDippedPigment = (type: 'CINNABAR' | 'MALACHITE') => {
    playClickSound();
    playRestorationSound('dab');
    setSelectedPigmentType(type);
    setPigmentLoaded(100);
    setToastMsg(`🎨 【颜料饱满】已成功沾取天然${type === 'CINNABAR' ? '朱砂红(辰砂)' : '石青绿(孔雀石)'}重彩，可开始点敷！`);
  };

  // Magnifier mouse move tracker
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageFrameRef.current) return;
    const rect = imageFrameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setHoveringCanvas(true);
      setMagnifierPos({
        x: x,
        y: y,
        relX: x / rect.width,
        relY: y / rect.height
      });
    } else {
      setHoveringCanvas(false);
    }
  };

  const handleDownload = () => {
    playClickSound();
    const link = document.createElement('a');
    link.href = getImageUrl('/src/assets/images/修复后.jpg');
    link.download = '房山长沟大墓壁画修复画卷.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMsg('🎨 【成果保存成功】已将4K数字精绘修复作品下载到本地！');
  };

  const handleShare = () => {
    playClickSound();
    navigator.clipboard.writeText(window.location.href);
    setToastMsg('🔗 【数字馆藏录入】已成功生成数字文物ID并复制链接，成果永久入库！');
  };

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const activeToolObj = tools.find(t => t.step === currentStepIndex);

  // Spectral display color filters
  const getSpectralStyles = () => {
    if (spectralMode === 'UV') {
      return {
        filter: `brightness(${lightIntensity}%) hue-rotate(240deg) saturate(1.8) contrast(1.15)`,
        boxShadow: "0 0 30px rgba(138, 43, 226, 0.45) inset"
      };
    } else if (spectralMode === 'INFRARED') {
      return {
        filter: `brightness(${lightIntensity - 15}%) grayscale(100%) contrast(1.5) sepia(20%)`,
        boxShadow: "0 0 25px rgba(212, 175, 55, 0.15) inset"
      };
    } else {
      return {
        filter: `brightness(${lightIntensity}%) saturate(1.05)`,
        boxShadow: "none"
      };
    }
  };

  return (
    <div 
      id="phase6-container" 
      className="w-full h-screen flex flex-col justify-between relative overflow-hidden text-[#382315] font-sans select-none"
      style={{
        backgroundColor: '#f4ebd9',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(247, 241, 227, 0.95) 0%, rgba(232, 220, 196, 1) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)' opacity='0.12'/%3E%3C/svg%3E")
        `
      }}
    >
      
      {/* -------------------- PAPER-BROWN HERITAGE HEADER -------------------- */}
      <header className="absolute top-0 left-0 w-full z-40 px-2 sm:px-6 py-1.5 sm:py-2 flex justify-between items-center bg-[#ebdcc2]/95 backdrop-blur-md border-b border-[#cbb396] shadow-md overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#8b2500] border border-[#611b00] flex items-center justify-center text-amber-100 shadow-md shrink-0 relative overflow-hidden">
            <Brush className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-100 relative z-10" />
            <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-300 absolute top-0.5 right-0.5 z-10" />
          </div>
          <div>
            <h1 className="text-[#382315] font-black tracking-wider text-[10px] sm:text-xs md:text-sm font-serif">
              {isEn ? 'Changgou Tomb Mural Restoration Workshop' : '房山长沟大墓壁画数字修复工坊'}
            </h1>
            <span className="text-[8px] sm:text-[9px] text-[#382315] font-mono font-bold block tracking-wider uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b2500] animate-pulse" />
              {restorationStage === 'KNOWLEDGE' 
                ? (isEn ? 'Pathology & Principles' : '病害机理与古法诊疗') 
                : (isEn ? 'Restoration Lab' : '精密壁画修补实操')}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-3 mr-24 sm:mr-36 shrink-0">
          <div className="bg-[#e2d0b5] p-0.5 rounded-lg border border-[#a6825c] flex space-x-0.5 sm:space-x-1">
            <button 
              onClick={() => {
                playClickSound();
                setRestorationStage('KNOWLEDGE');
              }}
              className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-serif transition-all cursor-pointer ${
                restorationStage === 'KNOWLEDGE'
                  ? 'bg-[#8b2500] text-white font-bold shadow'
                  : 'text-[#382315] hover:bg-[#ebdcc2]'
              }`}
            >
              <span>{isEn ? '📚 Docs' : '📚 1.病害文献'}</span>
            </button>
            <button 
              onClick={() => {
                playClickSound();
                setRestorationStage('SIMULATION');
              }}
              className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-serif transition-all cursor-pointer ${
                restorationStage === 'SIMULATION'
                  ? 'bg-[#8b2500] text-white font-bold shadow'
                  : 'text-[#382315] hover:bg-[#ebdcc2]'
              }`}
            >
              <span>{isEn ? '🧪 Lab' : '🧪 2.理化实操台'}</span>
            </button>
          </div>

          <button 
            onClick={() => {
              playClickSound();
              onBackToHome();
            }}
            className="text-[10px] sm:text-xs font-serif px-2 sm:px-3 py-0.5 sm:py-1 rounded bg-[#382315] text-[#f4ebd9] border border-[#23150b] hover:bg-[#28180d] transition-colors cursor-pointer shadow-md whitespace-nowrap"
          >
            {isEn ? 'Exit' : '返回墓室'}
          </button>
        </div>
      </header>

      {/* -------------------- STAGE 1: IMPERIAL ARCHAEOLOGY TEXTBOOK -------------------- */}
      <AnimatePresence mode="wait">
        {restorationStage === 'KNOWLEDGE' && (
          <motion.div 
            key="knowledge-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center px-2 md:px-6 py-1 z-10 font-serif text-stone-300 relative mt-10 overflow-hidden min-h-0"
          >
            {/* Scroll Container */}
            <div className="relative w-full max-w-6xl md:max-w-7xl mx-auto flex items-center justify-center my-auto max-h-[calc(100vh-3.5rem)]">
              
              {/* Left wooden cylinder */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 md:w-5 h-[94%] bg-gradient-to-r from-[#2c1d14] via-[#5c3e21] to-[#2c1d14] rounded-full shadow-2xl hidden md:flex flex-col justify-between items-center py-4 z-20 border border-amber-900/40">
                <div className="w-4 h-2 bg-amber-600 rounded-sm" />
                <div className="text-[9px] text-white/60 tracking-widest transform -rotate-90 origin-center select-none font-mono">REPAIR</div>
                <div className="w-4 h-2 bg-amber-600 rounded-sm" />
              </div>

              {/* Scroll Board: Aged Paper Brown Parchment Theme (纸褐色) */}
              <div 
                className="w-full md:mx-6 bg-[#e8dcc4] text-[#382315] rounded-xl border-2 border-[#a6825c] p-3.5 md:p-5 shadow-2xl relative z-10 flex flex-col justify-between max-h-[calc(100vh-4rem)] overflow-y-auto"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 50% 50%, #f4ebd9 0%, #d8c6a8 100%)
                  `
                }}
              >
                {/* Ancient Golden Accent Framing line */}
                <div className="absolute inset-2 md:inset-3 pointer-events-none border border-[#8b6540]/30 rounded-lg" />
                <div className="absolute inset-3 md:inset-4 pointer-events-none border border-[#8b6540]/15 rounded-lg" />

                {/* Sub-navigation inside scroll */}
                <div className="flex justify-center space-x-3 md:space-x-10 mb-2.5 z-10 border-b border-[#cbb396] pb-2 shrink-0">
                  {[
                    { id: 'PATHOLOGY', title: isEn ? 'Chap 1 · Pathology Diagnosis' : '第一章 · 千年病害诊断' },
                    { id: 'PRINCIPLE', title: isEn ? 'Chap 2 · Conservation Ethics' : '第二章 · 国际保护底线' },
                    { id: 'STEPS', title: isEn ? 'Chap 3 · Restoration Steps' : '第三章 · 修复步骤介绍' }
                  ].map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        playClickSound();
                        setKnowledgeStep(lesson.id as any);
                      }}
                      className={`text-sm md:text-base px-4 py-1.5 transition-all relative font-bold font-serif cursor-pointer ${
                        knowledgeStep === lesson.id 
                          ? 'text-[#8b2500]' 
                          : 'text-[#6e503b] hover:text-[#382315]'
                      }`}
                    >
                      {lesson.title}
                      {knowledgeStep === lesson.id && (
                        <motion.div 
                          layoutId="activeLessonTab"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#8b2500]"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Content Box */}
                <div className="flex-1 flex flex-col justify-center py-1 z-10 min-h-0">
                  <AnimatePresence mode="wait">
                    
                    {/* CHAP 1: PATHOLOGY DIAGNOSIS */}
                    {knowledgeStep === 'PATHOLOGY' && (
                      <motion.div
                        key="pathology"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
                      >
                        {/* Selector cards */}
                        <div className="lg:col-span-5 space-y-2 text-left flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[10px] tracking-widest text-[#8b2500] font-bold block font-sans uppercase">
                                {isEn ? "MURAL DIAGNOSTIC SHEET //" : "壁画病害诊断档案 //"}
                              </span>
                              <span className="text-[10px] text-[#785942] font-mono">
                                {isEn ? "Changgou Tomb Database" : "房山长沟大墓病理库"}
                              </span>
                            </div>

                            <h3 className="text-base md:text-lg font-bold tracking-wider text-[#2d1a0d] font-serif">
                              {isEn ? "Typical Mural Pathologies" : "墓室壁画典型水盐与生物病害"}
                            </h3>
                            <p className="text-xs text-[#422a19] leading-relaxed font-sans mt-0.5">
                              {isEn 
                                ? "High humidity, water seepage, and chemical reactions damage the fragile plaster layer. Click a sample card or probe:" 
                                : "地下长年阴暗高湿、渗透水和酸碱化学反应极易摧毁脆弱的灰泥颜料层。点击病理样本卡或右侧实景探针进行解剖："}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {PATHOLOGIES.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  playClickSound();
                                  setSelectedPathology(p.id);
                                }}
                                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                                  selectedPathology === p.id
                                    ? 'bg-[#dcc099] border-[#8b5a2b] text-[#1c1007] shadow-md ring-1 ring-[#8b5a2b]'
                                    : 'bg-[#ede0ca] border-[#cbb396] hover:bg-[#e2d0b5] text-[#3d2719]'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5">
                                  <span className="text-xl">{p.icon}</span>
                                  <div>
                                    <strong className="text-[#2c180b] text-xs md:text-sm block font-serif">
                                      {isEn ? p.nameEn : p.name}
                                    </strong>
                                    {isEn && (
                                      <span className="text-[10px] text-[#785942] font-sans block uppercase tracking-wider">
                                        {p.nameEn}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${p.colorClass}`}>
                                  {isEn ? p.dangerLevel : (p.dangerLevel === 'CRITICAL' ? '高危' : p.dangerLevel === 'HIGH' ? '严重' : '中度')}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Image & Detail Specimen Panel */}
                        <div className="lg:col-span-7 bg-[#ede0ca] p-3.5 rounded-lg border-2 border-[#cbb396] flex flex-col justify-between text-left relative overflow-hidden shadow-inner space-y-2.5">
                          
                          {/* Top: Live Mural Image Specimen with Hotspot Probes */}
                          <div className="relative w-full h-[150px] md:h-[180px] rounded-lg border border-[#a6825c] overflow-hidden shadow-md bg-stone-900 group shrink-0">
                            <img
                              src={getImageUrl(pathologyVisionMode === 'BEFORE' ? '/src/assets/images/修复前.jpg' : '/src/assets/images/修复后.jpg')}
                              alt="病害剖析样本"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-all duration-500"
                            />
                            
                            {/* Scanning Beam Animation */}
                            <motion.div
                              animate={{ y: ['0%', '100%', '0%'] }}
                              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                              className="absolute inset-x-0 h-[2px] bg-amber-400/80 shadow-[0_0_12px_#fbbf24] pointer-events-none z-10"
                            />

                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-amber-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 z-20">
                              <Eye className="w-3 h-3 text-amber-400" />
                              <span>{pathologyVisionMode === 'BEFORE' ? (isEn ? '[Damaged Specimen]' : '【修复前残损标本】') : (isEn ? '[Post-Restoration View]' : '【修复后对比视角】')}</span>
                            </div>

                            {/* Vision Toggle Button */}
                            <button
                              onClick={() => {
                                playClickSound();
                                setPathologyVisionMode(prev => prev === 'BEFORE' ? 'AFTER' : 'BEFORE');
                              }}
                              className="absolute top-2 right-2 bg-[#8b2500] hover:bg-[#731f00] text-amber-100 text-[10px] font-serif font-bold px-2.5 py-0.5 rounded border border-[#611b00] shadow cursor-pointer z-20 flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>{isEn ? (pathologyVisionMode === 'BEFORE' ? 'Switch After' : 'Switch Before') : (`切换${pathologyVisionMode === 'BEFORE' ? '修复后' : '修复前'}`)}</span>
                            </button>

                            {/* Interactive Hotspots for each pathology on image */}
                            {PATHOLOGIES.map((p) => {
                              const isSelected = selectedPathology === p.id;
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    playClickSound();
                                    setSelectedPathology(p.id);
                                  }}
                                  style={{ left: p.x, top: p.y }}
                                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all ${
                                    isSelected ? 'scale-125' : 'hover:scale-110 opacity-80'
                                  }`}
                                >
                                  <div className={`p-1 rounded-full border shadow-lg flex items-center justify-center ${
                                    isSelected ? 'bg-amber-500 text-stone-950 border-white ring-2 ring-amber-400/40' : 'bg-black/70 text-amber-200 border-amber-400/50'
                                  }`}>
                                    <span className="text-xs">{p.icon}</span>
                                  </div>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1.8, opacity: 0 }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                      className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Bottom: Selected Pathology Detail Card */}
                          {(() => {
                            const pObj = PATHOLOGIES.find(p => p.id === selectedPathology)!;
                            return (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 border-b border-[#cbb396] pb-1.5">
                                  <span className="text-2xl p-1.5 rounded-lg bg-[#e3d1b3] border border-[#ba9f7f]">{pObj.icon}</span>
                                  <div>
                                    <h4 className="text-sm md:text-base font-black text-[#8b2500] font-serif">
                                      {isEn ? pObj.nameEn : pObj.name}
                                    </h4>
                                    <span className="text-[10px] text-[#785942] block font-mono">{pObj.nameEn}</span>
                                  </div>
                                </div>

                                <div className="space-y-1.5 font-sans text-[#3a2518]">
                                  <p className="text-xs md:text-sm text-[#3a2518] leading-relaxed">
                                    <b className="text-[#8b2500] font-serif">{isEn ? '✦ Erosion Features: ' : '✦ 侵蚀表征：'}</b>
                                    {isEn ? pObj.descriptionEn : pObj.description}
                                  </p>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-0.5">
                                    <div className="p-2 rounded bg-[#f1e6d3] border border-[#cbb396]">
                                      <span className="text-xs text-[#613e25] block font-serif font-bold">
                                        {isEn ? '● Physical Cause' : '● 物理化学病因'}
                                      </span>
                                      <p className="text-xs text-[#422a19] mt-0.5 leading-relaxed">
                                        {isEn ? pObj.causeEn : pObj.cause}
                                      </p>
                                    </div>
                                    <div className="p-2 rounded bg-[#e8dbbf] border border-[#bfa583]">
                                      <span className="text-xs text-[#8b2500] block font-serif font-bold">
                                        {isEn ? '● Conservation Solution' : '● 现代科技治理法'}
                                      </span>
                                      <p className="text-xs text-[#382315] mt-0.5 leading-relaxed">
                                        {isEn ? pObj.solutionEn : pObj.solution}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-2 rounded bg-[#e2d1b5] border border-[#bfa583] text-xs text-[#2c1a0e] leading-relaxed flex items-start space-x-1.5">
                                    <span className="text-[#8b2500] font-mono font-bold shrink-0">{isEn ? '[Polarization Analysis]' : '[偏光分析]'}</span>
                                    <p>{isEn ? pObj.microscopicDescEn : pObj.microscopicDesc}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}

                    {/* CHAP 2: CONSERVATION PRINCIPLES */}
                    {knowledgeStep === 'PRINCIPLE' && (
                      <motion.div
                        key="principle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3.5 max-w-5xl mx-auto text-left"
                      >
                        <div className="text-center space-y-1">
                          <span className="text-[10px] md:text-xs tracking-[0.2em] text-[#8b2500] font-mono font-bold block uppercase">
                            {isEn ? "MURAL CONSERVATION ETHICS //" : "壁画保护准则纪要 //"}
                          </span>
                          <h3 className="text-lg md:text-xl font-bold tracking-wider text-[#2d1a0d] font-serif">
                            {isEn ? "Three Core Conservation Principles" : "国际数字保护三条金科铁律"}
                          </h3>
                          <p className="text-xs md:text-sm text-[#523826] font-sans">
                            {isEn ? "Strictly following Venice Charter and China Cultural Relics Principles" : "文物修复严格遵循威尼斯宪章与中国文物古迹保护准则"}
                          </p>
                          <div className="w-16 h-[2px] bg-[#8b2500]/40 mx-auto mt-0.5" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                          {[
                            {
                              n: isEn ? '1' : '一',
                              title: isEn ? 'Minimal Intervention' : '最少干预原则',
                              titleEn: 'Minimal Intervention',
                              desc: isEn 
                                ? 'Only repair damaged pigment layers and cracks without adding subjective recoloring.' 
                                : '仅对面临剥落、空鼓损坏的颜料底层及断裂处施加补救，决不可因个人的主观审美添加臆想性质的补涂和线条。',
                              color: 'border-[#cbb396] bg-[#ede0ca] text-[#382315]',
                              badge: isEn ? 'Red Line' : '行业红线',
                              illustration: (
                                <div className="relative w-full h-20 md:h-24 rounded-lg border border-[#a6825c] overflow-hidden bg-stone-900 my-1.5">
                                  <img src={getImageUrl('/src/assets/images/修复前.jpg')} alt="最少干预" className="w-full h-full object-cover opacity-80" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/40 to-black/60 flex items-center justify-around px-2 text-xs font-mono text-amber-200 font-bold">
                                    <span className="bg-red-900/90 px-1.5 py-0.5 rounded border border-red-500/50">{isEn ? 'Over-paint ❌' : '臆造补彩 ❌'}</span>
                                    <span className="bg-emerald-900/90 px-1.5 py-0.5 rounded border border-emerald-500/50">{isEn ? 'Minimal ✓' : '最小干预 ✓'}</span>
                                  </div>
                                </div>
                              )
                            },
                            {
                              n: isEn ? '2' : '二',
                              title: isEn ? 'Reversibility of Materials' : '材料可逆性原则',
                              titleEn: 'Reversibility of Materials',
                              desc: isEn 
                                ? 'Natural adhesives and fixatives used must be safely removable in future conservation.' 
                                : '注入的天然骨胶和固色保护剂，在未来的技术发展中，必须可以通过无害的温和物理、化学方法安全剥除，绝不产生永久绑定伤害。',
                              color: 'border-[#cbb396] bg-[#ede0ca] text-[#382315]',
                              badge: isEn ? 'Reversible' : '为后世负责',
                              illustration: (
                                <div className="relative w-full h-20 md:h-24 rounded-lg border border-[#a6825c] overflow-hidden bg-stone-900 my-1.5">
                                  <img src={getImageUrl('/src/assets/images/修复后.jpg')} alt="材料可逆" className="w-full h-full object-cover opacity-80" />
                                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-xs font-mono text-amber-100 p-1 text-center">
                                    <span className="text-amber-300 font-bold">{isEn ? 'Gelatin (Soluble in 35°C water)' : '天然明胶 (35℃温水可溶)'}</span>
                                    <span className="text-[10px] text-amber-200/80 mt-0.5">{isEn ? 'Avoid chemical glue damage' : '避免化学强力胶水伤害'}</span>
                                  </div>
                                </div>
                              )
                            },
                            {
                              n: isEn ? '3' : '三',
                              title: isEn ? 'Respect Original Patina' : '保持原真历史包浆',
                              titleEn: 'Respect Original Patina',
                              desc: isEn 
                                ? 'Preserve historical marks and patina on the mural without gaudy over-renovation.' 
                                : '保留残损画面中所浸透的历史沧桑痕迹，矿物敷彩仅限于过渡性修补，力求整体画境古雅自然，拒绝艳丽的“过度翻新”。',
                              color: 'border-[#cbb396] bg-[#ede0ca] text-[#382315]',
                              badge: isEn ? 'Authentic' : '修旧如旧',
                              illustration: (
                                <div className="relative w-full h-20 md:h-24 rounded-lg border border-[#a6825c] overflow-hidden bg-stone-900 my-1.5">
                                  <img src={getImageUrl('/src/assets/images/修复前.jpg')} alt="修旧如旧" className="w-full h-full object-cover opacity-80" />
                                  <div className="absolute inset-0 bg-amber-950/40 flex items-center justify-center text-xs font-serif font-bold text-amber-100">
                                    <span className="bg-[#8b2500]/90 px-2.5 py-1 rounded border border-amber-500/30">{isEn ? 'Natural & Elegant Patina' : '古雅自然 · 保留岁痕'}</span>
                                  </div>
                                </div>
                              )
                            }
                          ].map((rule, idx) => (
                            <div key={idx} className={`p-3.5 md:p-4 rounded-lg border-2 flex flex-col justify-between space-y-2 ${rule.color}`}>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xl font-serif font-black text-[#8b2500]">{rule.n}</span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#e2d1b5] border border-[#bfa583] text-[#8b2500] font-bold">{rule.badge}</span>
                                </div>
                                <h4 className="text-sm md:text-base font-black text-[#2c180b] font-serif">{rule.title}</h4>
                                {isEn && (
                                  <span className="text-[10px] text-[#785942] block font-mono uppercase mb-0.5">{rule.titleEn}</span>
                                )}
                                {rule.illustration}
                                <p className="text-xs leading-relaxed text-[#422a19] font-sans mt-1.5">{rule.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* CHAP 3: SCIENTIFIC METHODS & STEP ANIMATIONS */}
                    {knowledgeStep === 'STEPS' && (
                      <motion.div
                        key="steps"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3 max-w-6xl mx-auto"
                      >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-2 border-b border-[#cbb396] pb-2">
                          <div className="text-left">
                            <span className="text-[10px] md:text-xs tracking-[0.2em] text-[#8b2500] font-mono font-bold block uppercase">
                              {isEn ? 'FIVE RESTORATION STAGES //' : '壁画修复五步流程演示 //'}
                            </span>
                            <h3 className="text-lg md:text-xl font-bold tracking-wider text-[#2d1a0d] font-serif">
                              {isEn ? 'Five-Step Mural Restoration Method' : '壁画修复五步法'}
                            </h3>
                          </div>

                          {/* Auto-play demo toggle button */}
                          <button
                            onClick={() => {
                              playClickSound();
                              setIsAutoPlayingDemo(prev => !prev);
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-serif font-bold shadow transition-all cursor-pointer flex items-center space-x-1.5 border ${
                              isAutoPlayingDemo
                                ? 'bg-amber-600 text-white border-amber-700 animate-pulse'
                                : 'bg-[#8b2500] hover:bg-[#731f00] text-amber-100 border-[#611b00]'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isAutoPlayingDemo ? (isEn ? '⏸ Pause Animation' : '⏸ 暂停流程动效') : (isEn ? '▶ Start All Step Demos' : '▶ 启动全流程动画演示')}</span>
                          </button>
                        </div>

                        {/* Interactive Step Switcher Bar with Guided Bouncing Indicators */}
                        <div className="grid grid-cols-5 gap-2 relative pt-2">
                          {[
                            { idx: 1, label: isEn ? '1. Dusting' : '壹·拂尘', icon: '🧹' },
                            { idx: 2, label: isEn ? '2. Bone Glue' : '贰·骨胶', icon: '🧪' },
                            { idx: 3, label: isEn ? '3. Pigment' : '叁·重彩', icon: '🖌️' },
                            { idx: 4, label: isEn ? '4. Outline' : '肆·勾线', icon: '✍️' },
                            { idx: 5, label: isEn ? '5. Fixation' : '伍·固色', icon: '💨' }
                          ].map(s => {
                            const isViewed = viewedDemoSteps.includes(s.idx);
                            const nextUnviewed = [1, 2, 3, 4, 5].find(step => !viewedDemoSteps.includes(step));
                            const isNextTarget = !hasViewedAllDemoSteps && s.idx === nextUnviewed;

                            return (
                              <button
                                key={s.idx}
                                onClick={() => {
                                  playClickSound();
                                  setIsAutoPlayingDemo(false);
                                  setShowStepsWarning(false);
                                  setDemoStepIndex(s.idx);
                                }}
                                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center relative ${
                                  demoStepIndex === s.idx
                                    ? 'bg-[#8b2500] text-amber-100 border-[#611b00] shadow-md font-bold ring-2 ring-amber-400'
                                    : isNextTarget
                                      ? 'bg-amber-100 text-[#8b2500] border-amber-500 font-bold ring-2 ring-amber-400 animate-pulse'
                                      : isViewed
                                        ? 'bg-[#ede0ca] text-[#382315] border-[#cbb396] hover:bg-[#e2d0b5]'
                                        : 'bg-[#ded1bd]/70 text-[#382315]/70 border-[#cbb396]/60 hover:bg-[#e2d0b5]'
                                }`}
                              >
                                {isNextTarget && (
                                  <span className="absolute -top-3.5 bg-amber-600 text-white text-[9px] px-2 py-0.2 rounded-full font-serif font-bold shadow-md z-30 animate-bounce whitespace-nowrap">
                                    {isEn ? 'Click Next ➔' : '点击这 ➔'}
                                  </span>
                                )}
                                <span className="text-xl">{s.icon}</span>
                                <span className="text-xs font-serif font-bold mt-0.5">{s.label}</span>
                                {isViewed && (
                                  <span className="text-[9px] text-emerald-700 font-bold mt-0.5 flex items-center gap-0.5">
                                    ✓ {isEn ? 'Viewed' : '已看'}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Warning banner when trying to proceed early */}
                        {showStepsWarning && !hasViewedAllDemoSteps && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-2 rounded-md bg-amber-900 text-amber-100 text-xs font-serif text-center border border-amber-600 shadow-md flex items-center justify-center gap-2"
                          >
                            <span>⚠️ {isEn ? `Please watch all 5 steps before starting practical lab! (Watched: ${viewedDemoSteps.length}/5)` : `请看完全部5步修复演示才能进入实操！(已看: ${viewedDemoSteps.length}/5)`}</span>
                          </motion.div>
                        )}

                        {/* Step Dynamic Animation Display Board */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#ede0ca] p-3.5 rounded-lg border-2 border-[#cbb396] text-left">
                          
                          {/* Live Animated Canvas Preview */}
                          <div className="lg:col-span-7 relative h-[240px] md:h-[290px] rounded-lg border border-[#a6825c] overflow-hidden bg-stone-900 shadow-md shrink-0">
                            {/* Base Damaged Layer */}
                            <img
                              src={getImageUrl('/src/assets/images/修复前.jpg')}
                              alt="修复演练"
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Restored Layer overlaid with opacity according to demo step */}
                            <div
                              className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
                              style={{ opacity: demoStepIndex * 0.2 }}
                            >
                              <img
                                src={getImageUrl('/src/assets/images/修复后.jpg')}
                                alt="修复演练后"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* STEP SPECIFIC ANIMATED OVERLAYS */}
                            {demoStepIndex === 1 && (
                              <motion.div
                                animate={{ x: ['-20%', '120%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent pointer-events-none flex items-center justify-center"
                              >
                                <span className="text-3xl filter drop-shadow">🧹</span>
                              </motion.div>
                            )}

                            {demoStepIndex === 2 && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.div
                                  animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.8, 0.3] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="w-24 h-24 rounded-full border-4 border-amber-400 bg-amber-500/20 shadow-[0_0_20px_#f59e0b]"
                                />
                                <span className="absolute text-3xl">🧪</span>
                              </div>
                            )}

                            {demoStepIndex === 3 && (
                              <motion.div
                                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                                className="absolute inset-0 bg-red-900/20 pointer-events-none flex items-center justify-center"
                              >
                                <span className="text-4xl filter drop-shadow">🖌️</span>
                              </motion.div>
                            )}

                            {demoStepIndex === 4 && (
                              <div className="absolute inset-0 pointer-events-none">
                                <svg className="w-full h-full">
                                  <motion.path
                                    d="M 50 100 Q 150 40, 250 120 T 380 80"
                                    fill="none"
                                    stroke="#1c1007"
                                    strokeWidth="4"
                                    strokeDasharray="10 5"
                                    animate={{ strokeDashoffset: [0, -30] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  />
                                </svg>
                                <span className="absolute top-1/2 left-1/2 text-3xl -translate-x-1/2 -translate-y-1/2">✍️</span>
                              </div>
                            )}

                            {demoStepIndex === 5 && (
                              <motion.div
                                animate={{ opacity: [0.2, 0.7, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 via-sky-300/20 to-transparent pointer-events-none flex items-center justify-center"
                              >
                                <span className="text-4xl">💨</span>
                              </motion.div>
                            )}

                            <div className="absolute bottom-2.5 left-2.5 bg-black/80 text-amber-200 text-[10px] font-mono px-2.5 py-0.5 rounded border border-amber-500/30 font-bold">
                              {isEn ? `Demo Progress: Step ${demoStepIndex}/5 (${demoStepIndex * 20}%)` : `演示进度: Step ${demoStepIndex}/5 (${demoStepIndex * 20}%)`}
                            </div>
                          </div>

                          {/* Step Text Explanation */}
                          <div className="lg:col-span-5 flex flex-col justify-between space-y-2 font-sans">
                            {(() => {
                              const stepInfo = isEn ? [
                                { name: 'Step 1 · Gentle Dusting', sub: 'Surface Dust Removal', desc: 'Use fine goat hair brush to gently clear surface dust and sand, preventing scratch damage.', chem: 'Tool: Pure Soft Goat Hair Brush' },
                                { name: 'Step 2 · Bone Glue Penetration', sub: 'Hollow Layer Bonding', desc: 'Inject warm 35°C natural cattle bone glue into hollow gap points for structural restoration.', chem: 'Material: 8% Cattle Bone Glue + Water' },
                                { name: 'Step 3 · Pigment Application', sub: 'Mineral Color Touch-up', desc: 'Blend finely ground cinnabar & azurite, applying with minimal intervention principles.', chem: 'Color: Natural Cinnabar / Malachite' },
                                { name: 'Step 4 · Precise Outlining', sub: 'Iron-line Stroke Drawing', desc: 'Use Huizhou ink to trace traditional iron-line contours of hair and garments.', chem: 'Ink: Traditional Huizhou Oil Smoke Ink' },
                                { name: 'Step 5 · Color Fixation', sub: 'Protective Film Spraying', desc: 'Spray breathable nano protective film to isolate moisture and lock in rich pigments.', chem: 'Seal: 2.5% Breathable Polymer Film' }
                              ][demoStepIndex - 1] : [
                                { name: '第一步 · 毛刷拂垢', sub: '表层轻柔拂尘', desc: '采用极细山羊毫拂尘刷轻抚去表层的泥尘与风沙，避免二次划伤。', chem: '工具: 纯天然软质山羊毛刷' },
                                { name: '第二步 · 骨胶渗透', sub: '微裂空鼓粘合', desc: '精准对准空鼓注胶靶点，灌注 35℃ 温热天然牛骨胶进行结构复原。', chem: '材料: 8% 天然牛骨胶 + 92% 纯水' },
                                { name: '第三步 · 朱砂重敷', sub: '矿物过渡着色', desc: '调和超细研磨辰砂与石青，以最少干预准则点染褪变残缺处。', chem: '色料: 纯天然水飞朱砂 / 石青' },
                                { name: '第四步 · 毫细描廓', sub: '断裂铁线勾轮', desc: '以徽州油烟墨描摹宫女发髻、眉梢和衣袍铁线线条，重现大唐神骨。', chem: '墨汁: 古法徽州油烟墨' },
                                { name: '第五步 · 整体固色', sub: '均匀雾化喷护', desc: '全幅喷洒丙烯酸透气纳米薄膜，阻隔水气，封存重彩发色。', chem: '封护: 2.5% 高分子透气保护乳液' }
                              ][demoStepIndex - 1];

                              return (
                                <>
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-[#8b2500] font-mono font-bold block uppercase tracking-wider">
                                      {isEn ? `STEP ${demoStepIndex} OF 5 //` : `修复步骤 第 ${demoStepIndex} 步 //`}
                                    </span>
                                    <h4 className="text-base md:text-lg font-black text-[#2c180b] font-serif">{stepInfo.name}</h4>
                                    <span className="text-xs font-bold text-[#8b2500] block">{stepInfo.sub}</span>
                                    <p className="text-xs md:text-sm text-[#422a19] leading-relaxed pt-0.5">{stepInfo.desc}</p>
                                  </div>

                                  <div className="p-2 rounded-lg bg-[#f1e6d3] border border-[#cbb396] text-xs text-[#382315] font-mono font-bold">
                                    {stepInfo.chem}
                                  </div>
                                </>
                              );
                            })()}
                          </div>

                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

                {/* Right wooden cylinder */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 md:w-6 h-[94%] bg-gradient-to-l from-[#3d1e11] via-[#6d3e23] to-[#3d1e11] rounded-full shadow-2xl hidden md:flex flex-col justify-between items-center py-4 z-20 border border-amber-900/40">
                  <div className="w-5 h-2.5 bg-amber-600 rounded-sm" />
                  <div className="text-[10px] text-white/60 tracking-widest transform rotate-90 origin-center select-none font-mono">{isEn ? 'MURAL' : '壁画'}</div>
                  <div className="w-5 h-2.5 bg-amber-600 rounded-sm" />
                </div>

                {/* Footer buttons inside scroll */}
                <div className="pt-2.5 md:pt-3 border-t border-[#cbb396] flex items-center justify-between z-10 shrink-0">
                  <div className="text-[#523826] text-[11px] font-sans font-medium">
                    {isEn ? '* After studying all 5 steps, proceed to the practical lab.' : '* 研习完毕全流程，方可开启实操平台。科学修复，妙手重光。'}
                  </div>

                  <div className="flex space-x-2.5">
                    {knowledgeStep !== 'PATHOLOGY' && (
                      <button
                        onClick={() => {
                          playClickSound();
                          setShowStepsWarning(false);
                          if (knowledgeStep === 'STEPS') setKnowledgeStep('PRINCIPLE');
                          else if (knowledgeStep === 'PRINCIPLE') setKnowledgeStep('PATHOLOGY');
                        }}
                        className="px-4 py-1.5 rounded-lg border border-[#bfa583] bg-[#ede0ca] text-[#382315] text-xs md:text-sm font-bold tracking-widest font-serif transition-all hover:bg-[#e2d0b5] cursor-pointer shadow-sm"
                      >
                        {isEn ? '← Previous Chapter' : '← 上一章'}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playClickSound();
                        if (knowledgeStep === 'PATHOLOGY') {
                          setKnowledgeStep('PRINCIPLE');
                        } else if (knowledgeStep === 'PRINCIPLE') {
                          setKnowledgeStep('STEPS');
                        } else {
                          if (!hasViewedAllDemoSteps) {
                            setShowStepsWarning(true);
                            const nextUnviewed = [1, 2, 3, 4, 5].find(s => !viewedDemoSteps.includes(s)) || 1;
                            setDemoStepIndex(nextUnviewed);
                            return;
                          }
                          setRestorationStage('SIMULATION');
                          setPigmentLoaded(100);
                        }
                      }}
                      className={`px-5 py-1.5 rounded-lg text-xs md:text-sm font-bold tracking-widest font-serif transition-all cursor-pointer shadow-md ${
                        knowledgeStep === 'STEPS' && hasViewedAllDemoSteps
                          ? 'bg-[#8b2500] hover:bg-[#a62c00] text-[#f5efe0] border border-[#611b00] ring-2 ring-amber-400 animate-pulse shadow-[0_0_15px_#f59e0b]'
                          : knowledgeStep === 'STEPS'
                            ? 'bg-[#6e5847] text-stone-300 border border-[#524134] hover:bg-[#8b2500]'
                            : 'bg-[#8b2500] hover:bg-[#a62c00] text-[#f5efe0] border border-[#611b00]'
                      }`}
                    >
                      {knowledgeStep === 'STEPS' 
                        ? (hasViewedAllDemoSteps 
                            ? (isEn ? 'Open Lab Workbench ➔' : '开启实操工作台 ➔') 
                            : (isEn ? `Watch All 5 Steps (${viewedDemoSteps.length}/5)` : `请看完5步演示 (${viewedDemoSteps.length}/5)`))
                        : (isEn ? 'Next Chapter ➔' : '下一章 ➔')}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* -------------------- STAGE 2: PROFESSIONAL SCIENTIFIC WORKSHOP (Interactive Dark Lab) -------------------- */}
        {restorationStage === 'SIMULATION' && (
          <motion.div 
            key="simulation-stage"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.4 }}
            className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 pt-13 pb-0.5 overflow-hidden w-full max-w-[1500px] mx-auto z-10"
          >
            
            {/* LEFT COLUMN: TACTILE ROYAL TOOL CABINET & PROCESS PARAMETERS */}
            <div className="lg:col-span-4 bg-[#ede0ca] rounded-xl border-2 border-[#a6825c] p-3 md:p-4 flex flex-col justify-between shadow-xl relative overflow-hidden h-full min-h-0">
              
              <div className="space-y-3 overflow-y-auto pr-1 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-[#a6825c]/60 pb-1.5">
                    <div className="flex items-center space-x-1.5 text-[#382315]">
                      <Wrench className="w-4 h-4 text-[#8b2500]" />
                      <h2 className="text-sm font-black tracking-wider font-serif uppercase">
                        {isEn ? "Tang Restoration Toolbox" : "唐代古法修复工具箱"}
                      </h2>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#8b2500] text-white font-mono border border-[#611b00] font-bold">
                      {isEn ? "ACTIVE" : "进行中"}
                    </span>
                  </div>

                  {/* Steps Horizontal Roadmap Mini Pills */}
                  <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                    {[1, 2, 3, 4, 5].map((idx) => {
                      const isPassed = currentStepIndex > idx;
                      const isActive = currentStepIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => {
                            if (idx <= currentStepIndex) {
                              playClickSound();
                              setCurrentStepIndex(idx);
                              setStepProgress(idx < currentStepIndex ? 100 : 0);
                              setDraggedPoints([]);
                            }
                          }}
                          className={`h-2.5 rounded-full cursor-pointer transition-all border ${
                            isPassed 
                              ? 'bg-emerald-700 border-emerald-900' 
                              : isActive 
                              ? 'bg-[#8b2500] border-[#611b00] shadow-md ring-2 ring-[#8b2500]/40' 
                              : 'bg-[#cbb396] border-[#a6825c]'
                          }`}
                          title={isEn ? `Step ${idx}` : `工序 ${idx}`}
                        />
                      );
                    })}
                  </div>

                  {/* ACTIVE PROMINENT TOOL CARD DISPLAY */}
                  {activeToolObj && (
                    <div className="bg-[#f4ebd9] rounded-xl border-2 border-[#a6825c] overflow-hidden shadow-sm flex flex-col">
                      <div className="p-1.5 px-3 bg-[#e8dcc4] border-b border-[#a6825c] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#8b2500] font-bold tracking-widest">
                          {isEn ? "● TOOL UNIT" : "● 修复工具"}
                        </span>
                        <span className="text-[10px] text-[#785942] font-mono font-bold">
                          {isEn ? `STEP_0${currentStepIndex}` : `第 ${currentStepIndex} 步`}
                        </span>
                      </div>

                      <div className="p-3 flex flex-col items-center text-center space-y-2">
                        {/* Tool Graphic */}
                        <motion.div 
                          key={activeToolObj.step}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="w-12 h-12 rounded-full bg-[#ede0ca] border-2 border-[#8b2500] flex items-center justify-center shadow-md relative shrink-0"
                        >
                          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,37,0,0.08)_0%,transparent_100%)] animate-pulse" />
                          {activeToolObj.svg}
                        </motion.div>

                        <div>
                          <h3 className="text-sm font-black text-[#8b2500] font-serif tracking-wider">
                            {isEn ? activeToolObj.nameEn : activeToolObj.name}
                          </h3>
                          {isEn && (
                            <span className="text-[10px] text-[#785942] font-mono block">{activeToolObj.nameEn}</span>
                          )}
                        </div>

                        {/* Chemical / Raw Materials Composition Breakdown */}
                        <div className="w-full bg-[#e2d0b5] p-2 rounded-lg border border-[#a6825c]/60 text-xs font-mono text-[#382315] text-left">
                          <div className="flex items-center gap-1.5 text-[#8b2500] font-bold mb-1">
                            <Activity className="w-3.5 h-3.5" />
                            <span>{isEn ? "Chemical Composition" : "理化成分配比"}</span>
                          </div>
                          <p className="leading-snug">{isEn ? (activeToolObj as any).chemEn || activeToolObj.chem : activeToolObj.chem}</p>
                        </div>

                        <p className="text-xs text-[#523826] leading-relaxed font-sans text-left">
                          {isEn ? (activeToolObj as any).descEn || activeToolObj.desc : activeToolObj.desc}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GAMEPLAY PARAMETERS ADJUSTMENT BOX */}
                  <div className="bg-[#f4ebd9] rounded-xl border-2 border-[#a6825c] p-2.5 space-y-2 text-left shadow-sm">
                    <div className="flex items-center space-x-1.5 text-[#8b2500] font-serif border-b border-[#a6825c]/50 pb-1">
                      <Sliders className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold tracking-wider uppercase">
                        {isEn ? "Restoration Parameter Tuning" : "修复参数调谐"}
                      </span>
                    </div>

                    {/* Step 1: Sweep Controls */}
                    {currentStepIndex === 1 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono text-[#382315]">
                          <span className="font-serif font-bold">{isEn ? "Goat Hair Hardness:" : "羊毛刷毛硬度:"}</span>
                          <span className="text-[#8b2500] font-bold">{isEn ? "30% (Soft)" : "30% (软质)"}</span>
                        </div>
                        <div className="w-full h-2 bg-[#cbb396] rounded-full overflow-hidden border border-[#a6825c]">
                          <div className="w-[30%] h-full bg-[#8b2500]" />
                        </div>
                        <p className="text-xs text-[#523826] leading-relaxed font-sans">
                          {isEn ? "Soft goat hair brush provides low friction, cleaning dirt without damaging pristine surface." : "山羊毫刷拂尘阻力小，完美清除硬垢而不伤表层。"}
                        </p>
                      </div>
                    )}

                    {/* Step 2: Bone Glue Targeted Node Tracker */}
                    {currentStepIndex === 2 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-[#8b2500] font-serif block">
                          {isEn ? "● Grouting Target Monitor (Click target to fill)" : "● 灌浆靶点监测 (直接点击靶点也可填充)"}
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {injectionNodes.map(node => (
                            <div 
                              key={node.id} 
                              onClick={() => handleNodeInjection(node.id)}
                              className={`p-1.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                                node.progress >= 100 
                                  ? 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold' 
                                  : activeNodeId === node.id 
                                  ? 'bg-amber-100 border-[#8b2500] text-[#8b2500] animate-pulse font-bold'
                                  : 'bg-[#e8dcc4] border-[#a6825c] text-[#382315] hover:bg-[#e2d0b5]'
                              }`}
                            >
                              <span className="font-serif truncate max-w-[90px]">#{node.id} {isEn ? node.labelEn : node.label}</span>
                              <span className="font-mono font-bold">{node.progress}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Coloration Dabbing Pigment Levels & Refilling */}
                    {currentStepIndex === 3 && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#8b2500] font-serif">{isEn ? "● Pigment Palette" : "● 矿物颜料盒"}</span>
                          <span className="text-[#382315] font-mono">{isEn ? "Pigment Loaded:" : "色墨余量:"} <b className="text-[#8b2500]">{Math.round(pigmentLoaded)}%</b></span>
                        </div>

                        {/* Loading Meter */}
                        <div className="w-full h-2 bg-[#cbb396] rounded-full overflow-hidden border border-[#a6825c]">
                          <motion.div 
                            className={`h-full ${selectedPigmentType === 'CINNABAR' ? 'bg-[#8b2500]' : 'bg-[#1e8449]'}`}
                            animate={{ width: `${pigmentLoaded}%` }}
                          />
                        </div>

                        {/* Pigments click-to-load buttons */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleDippedPigment('CINNABAR')}
                            className={`py-1.5 px-2 rounded-lg border text-xs font-serif transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                              selectedPigmentType === 'CINNABAR' && pigmentLoaded > 0
                                ? 'bg-[#8b2500] border-[#611b00] text-white font-bold shadow-sm'
                                : 'bg-[#e8dcc4] border-[#a6825c] text-[#382315] hover:bg-[#e2d0b5]'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#8b2500]" />
                            <span>{isEn ? "Dip Cinnabar Red" : "沾取朱砂红"}</span>
                          </button>
                          <button
                            onClick={() => handleDippedPigment('MALACHITE')}
                            className={`py-1.5 px-2 rounded-lg border text-xs font-serif transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                              selectedPigmentType === 'MALACHITE' && pigmentLoaded > 0
                                ? 'bg-[#1e8449] border-[#145a32] text-white font-bold shadow-sm'
                                : 'bg-[#e8dcc4] border-[#a6825c] text-[#382315] hover:bg-[#e2d0b5]'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#1e8449]" />
                            <span>{isEn ? "Dip Malachite Green" : "沾取石青绿"}</span>
                          </button>
                        </div>

                        {/* Moisture adjust slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono text-[#382315]">
                            <span className="font-serif font-bold">{isEn ? "Glue Dilution Ratio:" : "胶液稀释比:"}</span>
                            <span className="text-[#8b2500] font-bold">{pigmentMoisture * 10}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={pigmentMoisture}
                            onChange={(e) => setPigmentMoisture(Number(e.target.value))}
                            className="w-full accent-[#8b2500] bg-[#cbb396] h-1.5 rounded-full cursor-pointer" 
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 4: Tracing stabilizer */}
                    {currentStepIndex === 4 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono text-[#382315]">
                          <span className="font-serif font-bold">{isEn ? "✍️ Hand Stabilizer:" : "✍️ 执笔手部稳定器:"}</span>
                          <span className="text-[#8b2500] font-bold">Lvl {handStabilizer}</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={handStabilizer}
                          onChange={(e) => setHandStabilizer(Number(e.target.value))}
                          className="w-full accent-[#8b2500] bg-[#cbb396] h-1.5 rounded-full cursor-pointer" 
                        />
                        <p className="text-xs text-[#523826] leading-relaxed font-sans">
                          {isEn ? "Filters hand trembling for smooth iron-line tracing." : "过滤微小抖动，描画高古游丝铁线轮廓更平滑。"}
                        </p>
                      </div>
                    )}

                    {/* Step 5: Atomization Pressure adjust */}
                    {currentStepIndex === 5 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-serif text-[#382315] font-bold">{isEn ? "💨 Atomization Pressure:" : "💨 雾化压力:"}</span>
                          <span className={`font-mono font-bold ${
                            atomizationPressure >= 5 && atomizationPressure <= 8 ? 'text-emerald-700' : 'text-rose-700'
                          }`}>
                            {atomizationPressure} Bar ({atomizationPressure >= 5 && atomizationPressure <= 8 ? (isEn ? 'Safe' : '安全') : (isEn ? 'Deviated' : '偏离')})
                          </span>
                        </div>
                        
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={atomizationPressure}
                          onChange={(e) => setAtomizationPressure(Number(e.target.value))}
                          className="w-full accent-[#8b2500] bg-[#cbb396] h-1.5 rounded-full cursor-pointer" 
                        />

                        {/* Pressure Sweet spot dial preview */}
                        <div className="p-1.5 rounded-lg bg-[#e8dcc4] border border-[#a6825c] flex justify-between items-center text-xs font-mono text-[#382315]">
                          <span>{isEn ? "LOW" : "低压"}</span>
                          <div className="flex space-x-1">
                            {Array.from({ length: 10 }).map((_, i) => {
                              const barId = i + 1;
                              const isOptimal = barId >= 5 && barId <= 8;
                              const isActive = atomizationPressure >= barId;
                              return (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-3 rounded-sm transition-all ${
                                    isActive 
                                      ? isOptimal 
                                        ? 'bg-emerald-600' 
                                        : 'bg-rose-600' 
                                      : 'bg-[#cbb396]'
                                  }`} 
                                />
                              );
                            })}
                          </div>
                          <span>{isEn ? "HIGH" : "高压"}</span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* HISTORICAL NOTES & ANCIENT PROTOCOL SUMMARY AT BOTTOM */}
                <div className="p-2.5 bg-[#e2d0b5] rounded-xl border border-[#a6825c]/70 text-xs text-[#382315] space-y-1 mt-2">
                  <div className="flex items-center space-x-1 font-serif font-bold text-[#8b2500]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? "Ancient Mural Conservation Protocol" : "古代壁画保护规范"}</span>
                  </div>
                  <p className="text-[11px] text-[#523826] leading-relaxed">
                    {isEn ? "“Preserve original appearance, reversible materials”. Minimal intervention protocol, no speculative painting." : "“修旧如旧，材料可逆”。遵循最少干预准则，严禁随意臆测补绘。"}
                  </p>
                </div>
                {/* OUT OF LINES ERROR DIALOGUE */}
                {isWrongDrag && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1.5 bg-rose-950/40 rounded border border-rose-900/60 text-[9px] text-rose-400 text-left leading-normal flex items-start gap-1 mt-1"
                  >
                    <Info className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p>
                      <b>{isEn ? "Warning: " : "警告："}</b>{isEn ? "Please drag gently along the golden dashed guide line." : "请顺着金色虚线导轨滑动轻抚。"}
                    </p>
                  </motion.div>
                )}

              </div>

            </div>

            {/* RIGHT COLUMN: RECONSTRUCTION CANVAS WITH SPECTRUM & MAGNIFIER CONTROLS */}
            <div className="lg:col-span-8 flex flex-col justify-between overflow-hidden h-full min-h-0">
              
              {!isComplete ? (
                <div className="flex-1 min-h-0 bg-[#ede0ca] rounded-xl border-2 border-[#a6825c] overflow-hidden flex flex-col relative shadow-2xl">
                  
                  {/* COMPACT TOP SPECTRUM & STEP HEADER */}
                  <div className="shrink-0 bg-[#f4ebd9] px-2.5 py-1.5 border-b border-[#a6825c]/50 flex flex-nowrap justify-between items-center gap-2 z-10 text-[#382315] overflow-x-auto overflow-y-hidden scrollbar-none">
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-[#8b2500] text-white border border-[#611b00] text-[10px] md:text-xs font-bold font-mono tracking-wider uppercase shrink-0">
                        STEP {currentStepIndex} / 5
                      </span>
                      <span className="text-xs md:text-sm font-serif font-black text-[#2c180b] whitespace-nowrap shrink-0">{isEn ? activeStep.name : activeStep.nameZh}</span>
                      <span className="text-[10px] md:text-xs font-mono font-bold text-[#8b2500] bg-[#ede0ca] px-1.5 py-0.5 rounded border border-[#cbb396] shrink-0">{Math.round(stepProgress)}%</span>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
                      {/* Source modes (Spectral Mode) */}
                      <div className="bg-[#e8dcc4] p-0.5 rounded-md border border-[#a6825c] flex space-x-0.5 text-xs shadow-sm shrink-0">
                        {[
                          { id: 'DAYLIGHT', label: isEn ? '☀️ Daylight' : '☀️ 日光' },
                          { id: 'UV', label: isEn ? '🍇 UV Light' : '🍇 紫外光源' },
                          { id: 'INFRARED', label: isEn ? '🔴 Infrared' : '🔴 红外穿透' }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => { playClickSound(); setSpectralMode(btn.id as any); }}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer font-serif font-bold whitespace-nowrap text-xs ${
                              spectralMode === btn.id ? 'bg-[#8b2500] text-white shadow-md' : 'text-[#382315] hover:bg-[#d8c6a8]'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Light slider */}
                      <div className="flex items-center space-x-1 text-xs font-mono font-bold bg-[#e8dcc4] px-2 py-0.5 rounded-md border border-[#a6825c] shadow-sm shrink-0">
                        <Sun className="w-3.5 h-3.5 text-[#8b2500] shrink-0" />
                        <span className="text-[11px] text-[#382315] font-serif font-bold shrink-0">{isEn ? 'Light:' : '亮度:'}</span>
                        <input 
                          type="range" min="50" max="150" value={lightIntensity}
                          onChange={(e) => setLightIntensity(Number(e.target.value))}
                          className="w-14 sm:w-20 accent-[#8b2500] bg-[#cbb396] h-1.5 rounded-full cursor-pointer"
                        />
                        <span className="text-[10px] md:text-xs text-[#8b2500] font-mono shrink-0 font-bold">{lightIntensity}%</span>
                      </div>

                      {/* Magnifier */}
                      <button
                        onClick={() => { playClickSound(); setShowMagnifier(!showMagnifier); }}
                        className={`px-2 py-0.5 rounded-md border text-xs font-serif transition-all flex items-center space-x-1 cursor-pointer font-bold shadow-sm shrink-0 whitespace-nowrap ${
                          showMagnifier ? 'bg-[#8b2500] border-[#611b00] text-white shadow-md' : 'bg-[#e8dcc4] border-[#a6825c] text-[#382315] hover:bg-[#d8c6a8]'
                        }`}
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{showMagnifier ? (isEn ? 'Close Micro' : '关闭显微') : (isEn ? 'Micro Scope' : '高倍显微')}</span>
                      </button>
                    </div>

                  </div>

                  {/* Top glowing progress line */}
                  <div className="w-full h-1 bg-[#cbb396] relative z-10 shrink-0">
                    <motion.div 
                      className="absolute h-full bg-[#8b2500] shadow-md shadow-red-900/50" 
                      initial={{ width: 0 }}
                      animate={{ width: `${stepProgress}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>

                  {/* Scientific instructions banner */}
                  <div className="shrink-0 bg-[#e8dcc4] border-b border-[#a6825c]/50 px-3.5 py-1.5 flex items-center justify-between text-xs md:text-sm text-[#382315] font-serif z-10 gap-2">
                    <div className="truncate flex items-center space-x-1.5">
                      <span className="text-[#8b2500] font-bold shrink-0">{isEn ? "✦ [Protocol]:" : "✦ [实操指南]:"}</span>
                      <span className="truncate font-medium">{isEn ? (activeStep.instructionEn || activeStep.instruction) : activeStep.instruction}</span>
                    </div>
                    <span className="text-[#8b2500] font-bold shrink-0 text-xs bg-[#f4ebd9] px-2.5 py-0.5 rounded-md border border-[#a6825c] shadow-sm">
                      {isEn ? "👉 Drag on canvas or click below to fill" : "👉 画面擦拭或点击下方一键修补"}
                    </span>
                  </div>

                  {/* HIGH FIDELITY DIGITAL INTERACTIVE CANVAS (MAXIMIZED SIZE) */}
                  <div 
                    ref={canvasRef}
                    className="flex-1 min-h-0 relative overflow-hidden flex flex-col items-center justify-center p-2 bg-stone-950"
                    onMouseMove={handleCanvasMouseMove}
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  >
                    {/* Visual metal corner border guides */}
                    <div className="absolute inset-2 pointer-events-none border border-stone-850 rounded" />
                    
                    {/* Frame container for painting with dynamic multi-spectral glow */}
                    <div 
                      ref={imageFrameRef}
                      onPointerDown={handleDirectPointerAction}
                      onPointerMove={handleDirectPointerAction}
                      className="relative w-full max-w-3xl h-full max-h-[calc(100vh-175px)] aspect-[4/3] rounded-lg border border-stone-800 bg-[#120f0e] select-none shadow-2xl overflow-hidden cursor-crosshair touch-none"
                      style={{
                        borderColor: spectralMode === 'UV' ? '#c084fc' : spectralMode === 'INFRARED' ? '#f59e0b' : '#3e2723'
                      }}
                    >
                      {/* DAMAGED UNDERLAYER (Modified by Spectrals style filters) */}
                      <img
                        src={getImageUrl('/src/assets/images/修复前.jpg')}
                        alt="房山长沟大墓破损壁画"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        style={getSpectralStyles()}
                      />

                      {/* RESTORED OVERLAYER (Opacity based on step progress, also filters) */}
                      <div 
                        style={{
                          opacity: (currentStepIndex - 1) * 0.2 + (stepProgress / 100) * 0.2,
                          transition: 'opacity 0.15s ease-out'
                        }}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                      >
                        <img
                          src={getImageUrl('/src/assets/images/修复后.jpg')}
                          alt="房山长沟大墓精绘复原壁画"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none pointer-events-none"
                          style={{
                            ...getSpectralStyles(),
                            filter: getSpectralStyles().filter + ' saturate(1.1)'
                          }}
                        />
                      </div>

                      {/* ----------------- PROCESS DIAGNOSTIC OVERLAYS FOR ACTIVE STEPS ----------------- */}
                      
                      {/* Step 1: Mud Overlay */}
                      {currentStepIndex === 1 && (
                        <div 
                          style={{ opacity: Math.max(0, 1 - stepProgress / 100) }}
                          className="absolute inset-0 bg-[#4e3a2c]/65 backdrop-blur-[0.5px] pointer-events-none flex items-center justify-center transition-opacity"
                        >
                          {spectralMode === 'UV' ? (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,249,157,0.2)_0%,transparent_100%)] animate-pulse flex flex-col justify-end p-4">
                              <span className="text-lime-400 font-mono text-[9px] text-center bg-black/80 px-2 py-1 rounded border border-lime-500/50 self-center">
                                {isEn ? "🦠 [UV DIAGNOSIS] Fungal hyphae and biocrust detected" : "🦠 [UV DIAGNOSIS] 发现大面积霉菌菌丝网及生物结皮"}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center text-stone-200 text-[10px] font-serif tracking-widest p-2 px-3 border border-amber-900/40 bg-stone-950/95 rounded shadow-xl">
                              {isEn ? "🌫️ Millennial sand and dust layer accumulated on mural surface" : "🌫️ 表层积淀千年地宫泥沙与古浮尘 (Dust Layer)"}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 2: Fissures and Inject Nodes */}
                      {currentStepIndex === 2 && stepProgress < 100 && (
                        <div className="absolute inset-0 pointer-events-none">
                          <svg className="w-full h-full stroke-red-600/60 fill-none" strokeWidth="2.5" style={{ opacity: Math.max(0.15, 1 - stepProgress / 100) }}>
                            <path d="M 220,30 L 200,130 L 240,230 L 220,330" strokeDasharray="5,5" className={spectralMode === 'UV' ? 'stroke-cyan-400 drop-shadow-[0_0_8px_#22d3ee]' : ''} />
                          </svg>

                          {injectionNodes.map(node => (
                            <div 
                              key={node.id}
                              className="absolute pointer-events-auto"
                              style={{ left: `${node.x / 400 * 100}%`, top: `${node.y / 300 * 100}%` }}
                            >
                              <button
                                onClick={() => handleNodeInjection(node.id)}
                                className={`w-7 h-7 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-lg transition-all ${
                                  node.progress >= 100
                                    ? 'bg-emerald-600 border-2 border-emerald-300 text-white font-mono text-[9px] font-bold'
                                    : activeNodeId === node.id
                                    ? 'bg-amber-500 border-2 border-white animate-spin'
                                    : 'bg-red-700/90 border-2 border-red-300 animate-pulse hover:scale-110 text-white text-[10px] font-bold'
                                }`}
                                title={node.label}
                              >
                                {node.progress >= 100 ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : (
                                  "🎯"
                                )}
                              </button>
                              
                              {node.progress < 100 && (
                                <div className="absolute w-10 h-10 rounded-full border-2 border-dashed border-red-500 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-30 pointer-events-none" />
                              )}

                              <div className="absolute left-4 -top-3 bg-stone-950/90 text-stone-300 border border-stone-800 text-[8px] p-0.5 px-1 rounded whitespace-nowrap opacity-90">
                                #{node.id}: {node.progress}%
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Step 3: Color Deficiency */}
                      {currentStepIndex === 3 && stepProgress < 100 && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className={`absolute w-28 h-28 rounded-full border-2 border-dashed border-red-600/30 animate-pulse ${spectralMode === 'UV' ? 'border-purple-500/50' : ''}`} />
                          
                          {pigmentLoaded <= 0 && (
                            <div className="absolute p-1.5 bg-rose-950/90 border border-rose-800/80 rounded-lg text-rose-300 text-[9px] text-center max-w-[180px] animate-bounce">
                              {isEn ? "⚠️ Pigment Depleted: Click Cinnabar/Malachite on palette!" : "⚠️ 色料已沾尽：请点击左方工具箱【朱砂】或【石青】！"}
                            </div>
                          )}

                          <div className="absolute bottom-3 left-3 bg-stone-950/95 text-amber-400 text-[9px] px-2 py-0.5 rounded border border-stone-850 shadow-md">
                            🎨 {isEn ? "Inpaint Area" : "补色区"} ({selectedPigmentType === 'CINNABAR' ? (isEn ? 'Cinnabar' : '朱砂红') : (isEn ? 'Malachite' : '石青绿')})
                          </div>
                        </div>
                      )}

                      {/* Step 4: Line cracks */}
                      {currentStepIndex === 4 && stepProgress < 100 && (
                        <div className="absolute inset-0 pointer-events-none">
                          {spectralMode === 'INFRARED' ? (
                            <div className="absolute inset-0 bg-amber-950/10 pointer-events-none flex flex-col justify-end p-2">
                              <span className="text-amber-400 font-mono text-[9px] text-center bg-black/85 px-2 py-0.5 rounded border border-amber-500/50 self-center">
                                {isEn ? "✍️ [Infrared] Revealing Tang artisan charcoal draft line" : "✍️ [红外透视] 显现唐代画匠炭笔底稿"}
                              </span>
                            </div>
                          ) : (
                            <div className="absolute top-3 left-3 bg-stone-950/95 text-stone-300 text-[9px] px-2 py-0.5 rounded border border-stone-850 shadow-md">
                              {isEn ? "✍️ Exfoliated ink outlines on court lady face" : "✍️ 宫女面庞墨线轮廓剥离"}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 5: Spray sealant mist effect */}
                      {currentStepIndex === 5 && isDraggingTool && (
                        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none flex items-center justify-center mix-blend-color-dodge">
                          <div className="w-48 h-48 rounded-full bg-emerald-500/15 blur-2xl animate-ping" />
                          <div className="w-36 h-36 rounded-full bg-[#d4af37]/10 blur-xl animate-pulse" />
                        </div>
                      )}

                      {/* Interactive Dragging Trail Path */}
                      {showGuidePath && stepProgress < 100 && GUIDE_PATHS[currentStepIndex] && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="guideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#d4af37" />
                              <stop offset="100%" stopColor="#b43d2c" />
                            </linearGradient>
                          </defs>
                          <motion.path 
                            d={GUIDE_PATHS[currentStepIndex].path}
                            stroke="url(#guideGrad)"
                            strokeWidth="3"
                            strokeDasharray="6,6"
                            fill="none"
                            initial={{ strokeDashoffset: 0 }}
                            animate={{ strokeDashoffset: -20 }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
                            className="drop-shadow-sm opacity-85"
                          />
                        </svg>
                      )}

                      {/* Sparkle dust trails */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {draggedPoints.map((pt, i) => (
                          <circle 
                            key={i} 
                            cx={pt.x} 
                            cy={pt.y} 
                            r={currentStepIndex === 1 ? 22 : currentStepIndex === 5 ? 35 : 8} 
                            fill={
                              currentStepIndex === 1 
                                ? "#6e4f3a" 
                                : currentStepIndex === 3 
                                ? (selectedPigmentType === 'CINNABAR' ? "#b43d2c" : "#1e8449")
                                : currentStepIndex === 4 
                                ? "#1a1a1a" 
                                : "#d4af37"
                            } 
                            opacity={Math.max(0, 1 - (draggedPoints.length - i) / draggedPoints.length) * 0.4} 
                          />
                        ))}
                      </svg>

                      {/* Sparkles particle emitter */}
                      {isDraggingTool && !isWrongDrag && (
                        <div className="absolute pointer-events-none animate-ping" style={{ left: dragOffset.x, top: dragOffset.y }}>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        </div>
                      )}

                      {/* LARGE FLOATING tactile tool cursor */}
                      {stepProgress < 100 && activeToolObj && (
                        <motion.div
                          drag
                          dragConstraints={imageFrameRef}
                          dragElastic={0.01}
                          dragMomentum={false}
                          onDragStart={() => setIsDraggingTool(true)}
                          onDrag={handleCanvasDrag}
                          onDragEnd={() => setIsDraggingTool(false)}
                          className="absolute z-30 cursor-grab active:cursor-grabbing pointer-events-auto"
                          style={{
                            left: 'calc(50% - 28px)',
                            top: 'calc(50% - 28px)'
                          }}
                        >
                          <div className="relative group">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 text-[#d4af37] text-[9px] px-2 py-0.5 rounded border border-amber-900/40 shadow-lg opacity-85 group-hover:opacity-100 transition-opacity">
                              {isEn ? "✦ Drag tool to restore mural" : "✦ 拖拽工具滑动修缮"}
                            </div>
                            
                            <div className="w-14 h-14 rounded-full bg-stone-950/95 border-2 border-[#d4af37] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95">
                              {activeToolObj.svg}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* MICROSCOPIC GLASS */}
                      {showMagnifier && hoveringCanvas && (
                        <div 
                          className="absolute w-32 h-32 rounded-full border-4 border-dashed border-[#d4af37] bg-[#1a1512] shadow-2xl pointer-events-none z-50 flex items-center justify-center overflow-hidden"
                          style={{
                            left: magnifierPos.x - 64,
                            top: magnifierPos.y - 64
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 z-10">
                            <div className="w-full h-[1px] bg-[#d4af37]" />
                            <div className="h-full w-[1px] bg-[#d4af37]" />
                            <div className="w-8 h-8 rounded-full border border-[#d4af37]" />
                          </div>

                          <div 
                            className="absolute inset-0 pointer-events-none transition-all duration-100"
                            style={{
                              backgroundImage: `url("${getImageUrl('/src/assets/images/修复后.jpg')}")`,
                              backgroundPosition: `${magnifierPos.relX * 100}% ${magnifierPos.relY * 100}%`,
                              backgroundSize: '400% 400%',
                              filter: 'contrast(1.4) brightness(1.15) saturate(1.2)'
                            }}
                          />
                          <div className="absolute bottom-1 bg-stone-950/90 text-[8px] font-mono text-[#d4af37] p-0.5 px-2 rounded border border-stone-850 z-20">
                            4.0X ZOOM
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* BOTTOM QUICK ACTION & CONTROL BAR */}
                  <div className="shrink-0 bg-[#f4ebd9] p-1.5 px-3 border-t border-[#a6825c]/50 flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          playClickSound();
                          playRestorationSound(currentStepIndex === 1 ? 'sweep' : currentStepIndex === 2 ? 'inject' : currentStepIndex === 3 ? 'dab' : currentStepIndex === 4 ? 'trace' : 'spray');
                          setStepProgress(prev => {
                            const next = Math.min(100, prev + 25);
                            if (next >= 100 && prev < 100) playRestorationSound('success');
                            return next;
                          });
                          if (currentStepIndex === 2) {
                            setInjectionNodes(nodes => nodes.map(n => ({
                              ...n,
                              progress: Math.min(100, n.progress + 25)
                            })));
                          }
                        }}
                        className="px-3 py-1 rounded bg-[#8b2500] hover:bg-[#731f00] text-white text-xs font-bold font-serif shadow-md border border-[#611b00] transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <span>
                          {currentStepIndex === 1 && (isEn ? "🧹 Quick Clean Dust (+25%)" : "🧹 快速【拂尘除尘】(+25%)")}
                          {currentStepIndex === 2 && (isEn ? "🧪 Quick Inject Glue (+25%)" : "🧪 快速【灌注骨胶】(+25%)")}
                          {currentStepIndex === 3 && (isEn ? "🖌️ Quick Inpaint Pigment (+25%)" : "🖌️ 快速【矿物重彩】(+25%)")}
                          {currentStepIndex === 4 && (isEn ? "✍️ Quick Trace Outline (+25%)" : "✍️ 快速【勾勒墨线】(+25%)")}
                          {currentStepIndex === 5 && (isEn ? "💨 Quick Spray Sealant (+25%)" : "💨 快速【喷雾固色】(+25%)")}
                        </span>
                      </button>

                      <div className="text-[10px] text-[#382315] font-medium hidden md:flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8b2500] mr-1 animate-pulse" />
                        <span>{isEn ? "Status: " : "状态: "}<b className="text-[#8b2500] font-bold">{isEn ? (GUIDE_PATHS[currentStepIndex]?.nameEn || GUIDE_PATHS[currentStepIndex]?.name) : (GUIDE_PATHS[currentStepIndex]?.name || '图层扫描')}</b></span>
                      </div>
                    </div>

                    {stepProgress >= 100 ? (
                      <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleNextStep}
                        className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-serif shadow-lg border border-emerald-800 transition-all flex items-center space-x-1 cursor-pointer animate-bounce"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{isEn ? "Step Complete! Next ➔" : "工序完成！进入下一步 ➔"}</span>
                      </motion.button>
                    ) : (
                      <span className="text-[10px] text-[#382315] font-bold font-serif">
                        {isEn ? "(Or drag on canvas)" : "(也可滑动画面)"}
                      </span>
                    )}
                  </div>

                </div>
              ) : (
                /* -------------------- REPAIR COMPLETION DISPLAY (BEFORE & AFTER COMPARISON) -------------------- */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 bg-[#ede0ca] rounded-xl border-2 border-[#a6825c] p-4 md:p-5 flex flex-col justify-between items-center shadow-2xl relative max-h-full overflow-y-auto"
                >
                  <div className="absolute inset-2 pointer-events-none border border-[#8b2500]/20 rounded-lg" />
                  
                  {/* Compact Header Bar */}
                  <div className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-2 bg-[#f4ebd9] px-3.5 py-2 rounded-lg border border-[#a6825c]/60 shadow-sm shrink-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-600 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <h2 className="text-sm md:text-base font-black text-[#382315] font-serif tracking-wide">
                        {isEn ? "Mural Art Reborn in Golden Tang Splendor" : "妙笔守真 · 大唐盛世画卷终获新生"}
                      </h2>
                    </div>
                    <p className="text-xs text-[#523826] font-serif font-medium flex items-center gap-1">
                      <span className="text-[#8b2500]">✦</span>
                      {isEn ? "Side-by-side HD slider comparison:" : "修复前后对比展示如下（左右拖动）："}
                    </p>
                  </div>

                  {/* INTERACTIVE LEFT-RIGHT SLIDER COMPARISON CANVAS */}
                  <div className="w-full max-w-3xl my-1 flex flex-col items-center space-y-1.5 shrink-0">
                    
                    {/* Interactive Slider Container (Preserving 4:3 Original Aspect Ratio) */}
                    <div 
                      className="relative w-full max-w-2xl aspect-[4/3] max-h-[300px] sm:max-h-[340px] md:max-h-[380px] rounded-xl border-2 border-[#a6825c] overflow-hidden shadow-2xl bg-stone-950 select-none cursor-ew-resize touch-none group mx-auto"
                      onPointerDown={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const updatePos = (clientX: number) => {
                          const x = clientX - rect.left;
                          const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
                          setBeforeAfterPos(pct);
                        };
                        updatePos(e.clientX);
                        const onMove = (moveEv: PointerEvent) => updatePos(moveEv.clientX);
                        const onUp = () => {
                          window.removeEventListener('pointermove', onMove);
                          window.removeEventListener('pointerup', onUp);
                        };
                        window.addEventListener('pointermove', onMove);
                        window.addEventListener('pointerup', onUp);
                      }}
                    >
                      {/* Underlayer: RESTORED AFTER IMAGE */}
                      <img
                        src={getImageUrl('/src/assets/images/修复后.jpg')}
                        alt="修复后盛唐壁画"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                      />
                      
                      <div className="absolute top-2.5 right-2.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg backdrop-blur-sm z-10 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{isEn ? "AFTER: RESTORED" : "修复后 · 妙笔重光"}</span>
                      </div>

                      {/* Overlayer Clipped Box: DAMAGED BEFORE IMAGE */}
                      <div 
                        className="absolute inset-0 w-full h-full overflow-hidden shadow-[2px_0_15px_rgba(0,0,0,0.7)] pointer-events-none"
                        style={{ clipPath: `polygon(0 0, ${beforeAfterPos}% 0, ${beforeAfterPos}% 100%, 0 100%)` }}
                      >
                        <img
                          src={getImageUrl('/src/assets/images/修复前.jpg')}
                          alt="修复前病害残损标本"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-stone-950/90 text-amber-200 border border-amber-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg backdrop-blur-sm z-10 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>{isEn ? "BEFORE: DAMAGED" : "修复前 · 千年残损"}</span>
                        </div>
                      </div>

                      {/* VERTICAL SLIDER DRAGGING HANDLE */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_#fbbf24] z-30 pointer-events-none -translate-x-1/2"
                        style={{ left: `${beforeAfterPos}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-500 border-2 border-white shadow-2xl flex items-center justify-center text-stone-950 font-black text-xs">
                          ↔
                        </div>
                      </div>

                    </div>

                    {/* Quick Preset Buttons & Percentage Indicator */}
                    <div className="flex items-center justify-between w-full max-w-2xl px-1 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => { playClickSound(); setBeforeAfterPos(100); }}
                          className={`px-2.5 py-1 rounded text-[11px] font-serif font-bold transition-all cursor-pointer ${
                            beforeAfterPos === 100 ? 'bg-[#8b2500] text-amber-100 shadow-md' : 'bg-[#ede0ca] border border-[#a6825c] text-[#382315] hover:bg-[#e2d0b5]'
                          }`}
                        >
                          {isEn ? "Full Before (100%)" : "全看修复前"}
                        </button>
                        <button
                          onClick={() => { playClickSound(); setBeforeAfterPos(50); }}
                          className={`px-2.5 py-1 rounded text-[11px] font-serif font-bold transition-all cursor-pointer ${
                            beforeAfterPos === 50 ? 'bg-[#8b2500] text-amber-100 shadow-md' : 'bg-[#ede0ca] border border-[#a6825c] text-[#382315] hover:bg-[#e2d0b5]'
                          }`}
                        >
                          {isEn ? "50/50 Split" : "50/50 对比"}
                        </button>
                        <button
                          onClick={() => { playClickSound(); setBeforeAfterPos(0); }}
                          className={`px-2.5 py-1 rounded text-[11px] font-serif font-bold transition-all cursor-pointer ${
                            beforeAfterPos === 0 ? 'bg-emerald-800 text-white shadow-md' : 'bg-[#ede0ca] border border-[#a6825c] text-[#382315] hover:bg-[#e2d0b5]'
                          }`}
                        >
                          {isEn ? "Full After (100%)" : "全看修复后"}
                        </button>
                      </div>

                      <div className="font-mono text-[11px] text-[#8b2500] font-bold bg-[#f4ebd9] px-2.5 py-1 rounded border border-[#a6825c]/60">
                        {isEn ? `BEFORE ${Math.round(beforeAfterPos)}% | AFTER ${Math.round(100 - beforeAfterPos)}%` : `残损占比 ${Math.round(beforeAfterPos)}% ｜ 修复占比 ${Math.round(100 - beforeAfterPos)}%`}
                      </div>
                    </div>

                  </div>

                  <div className="flex flex-wrap justify-center gap-2.5 pt-1">
                    <button
                      onClick={handleReset}
                      className="px-3.5 py-1.5 rounded border border-[#a6825c] bg-[#ede0ca] hover:bg-[#e2d0b5] text-[#382315] text-xs font-bold font-serif transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isEn ? "Restore Again" : "重新修缮"}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="px-3.5 py-1.5 rounded bg-[#382315] hover:bg-[#28180d] text-[#f4ebd9] text-xs font-bold font-serif transition-all border border-[#23150b] flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isEn ? "Save Work" : "保存修缮成果"}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="px-3.5 py-1.5 rounded bg-[#8b2500] hover:bg-[#731f00] text-white text-xs font-bold font-serif transition-all flex items-center space-x-1.5 cursor-pointer shadow-md border border-[#611b00]"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{isEn ? "Store in Gallery" : "存入数字馆藏"}</span>
                    </button>
                  </div>

                </motion.div>
              )}

            </div>

          </motion.div>
        )}
      </AnimatePresence>
      
      {/* -------------------- DYNAMIC TOAST NOTIFICATION -------------------- */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1c1411] text-stone-200 text-xs py-3 px-6 rounded-lg shadow-2xl border-2 border-[#5c402b]/60 flex items-center space-x-2.5 font-serif"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER COOPERATIVE COPYRIGHT BANNER */}
      <footer className="py-1 bg-[#0a0807] border-t border-stone-900 text-center z-10 text-[9px] text-stone-600 font-sans tracking-widest shrink-0">
        {isEn 
          ? "Fangshan Changgong Tomb Mural Digital Restoration Workshop © 2026 Virtual Mural Conservation Lab // Minimal Intervention • Reversible Materials" 
          : "房山长沟大墓遗址壁画数字修复工坊 © 2026 壁画保护实验室 // 最小干预 • 材料可逆 • 尊重真原"}
      </footer>

    </div>
  );
}
