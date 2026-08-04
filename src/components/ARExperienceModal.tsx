import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, X, RotateCcw, Download, Sparkles, Flame, 
  Compass, Move, Scan, CheckCircle2, 
  Smartphone, Navigation, SunMedium, Eye, ShieldCheck, Zap
} from 'lucide-react';
import { playClickSound, playWarpSound } from '../utils/audio';
import { getImageUrl } from '../utils/imageLoader';

interface ARExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'zh' | 'en';
}

interface ARRelicItem {
  id: string;
  nameZh: string;
  nameEn: string;
  category: 'mural' | 'artifact';
  image: string;
  codeZh: string;
  codeEn: string;
  eraZh: string;
  eraEn: string;
  descriptionZh: string;
  descriptionEn: string;
}

interface ARChamber {
  id: string;
  nameZh: string;
  nameEn: string;
  bgImage: string;
}

const AR_CHAMBERS: ARChamber[] = [
  { id: 'camera', nameZh: '📷 现实实景墙面', nameEn: '📷 Live Wall Camera', bgImage: '' },
  { id: 'passage', nameZh: '🏛️ 地宫前甬道', nameEn: '🏛️ Front Passage', bgImage: '/src/assets/images/后甬道.png' },
  { id: 'ear', nameZh: '🕯️ 侧耳室券顶', nameEn: '🕯️ Ear Vaults', bgImage: '/src/assets/images/左耳室.png' },
  { id: 'main', nameZh: '👑 主墓室宝座', nameEn: '👑 Main Chamber', bgImage: '/src/assets/images/主墓室.jpg' }
];

const AR_RELICS: ARRelicItem[] = [
  {
    id: 'lewu',
    nameZh: '主室乐舞图 (胡腾舞与乐队)',
    nameEn: 'Main Chamber: Hu Teng Dance & Orchestra',
    category: 'mural',
    image: '/src/assets/images/主墓室.jpg',
    codeZh: '专属识别码 AR-M01',
    codeEn: 'Code AR-M01',
    eraZh: '晚唐 · 公元814年 · 主墓室',
    eraEn: 'Late Tang (814 AD) · Main Chamber',
    descriptionZh: '晚唐藩镇流行之胡腾舞，伴随拍板、琵琶与箜篌交响，画风豪放，神采飞扬。',
    descriptionEn: 'Passionate Sogdian Hu Teng dance accompanied by Tang orchestra, reflecting Lulong garrison culture.'
  },
  {
    id: 'gongnv',
    nameZh: '宫女出行图 (盛唐侍女)',
    nameEn: 'Mural: High Tang Court Maidens',
    category: 'mural',
    image: '/src/assets/images/宫女图.jpg',
    codeZh: '专属识别码 AR-M02',
    codeEn: 'Code AR-M02',
    eraZh: '盛唐 · 神龙二年 · 永泰公主墓',
    eraEn: 'High Tang (706 AD) · Princess Yongtai Tomb',
    descriptionZh: '九位宫女手持团扇、烛台、方盒款款徐行，体态丰盈，婀娜多姿。',
    descriptionEn: 'Nine elegant court maidens holding candle holders and fan, classic High Tang figure style.'
  },
  {
    id: 'guanmiao',
    nameZh: '骑马官员图 (幽州仪仗)',
    nameEn: 'Mural: Tang Official on Horseback',
    category: 'mural',
    image: '/src/assets/images/左耳室.png',
    codeZh: '专属识别码 AR-M03',
    codeEn: 'Code AR-M03',
    eraZh: '晚唐 · 幽州卢龙藩镇',
    eraEn: 'Late Tang · Lulong Garrison',
    descriptionZh: '幽州藩镇高级幕僚骑乘骏马，头戴乌纱，身着朱红官服，彰显显赫军权。',
    descriptionEn: 'Senior staff official of Youzhou garrison on horseback wearing vermilion official robes.'
  },
  {
    id: 'junma',
    nameZh: '双骏图 (幽州战马)',
    nameEn: 'Mural: Tang Warhorse',
    category: 'mural',
    image: '/src/assets/images/骏马.png',
    codeZh: '专属识别码 AR-M04',
    codeEn: 'Code AR-M04',
    eraZh: '晚唐 · 房山长沟',
    eraEn: 'Late Tang · Fangshan Changgou',
    descriptionZh: '画中骏马骨骼遒劲，饰有金错鞍鞯，乃幽州卢龙骑兵精锐战马写照。',
    descriptionEn: 'Robust Tang military horse equipped with gilded saddle and bronze stirrups.'
  },
  {
    id: 'epitaph',
    nameZh: '幽州节度使刘济墓志',
    nameEn: 'Artifact: Epitaph of Liu Ji',
    category: 'artifact',
    image: '/src/assets/images/后甬道.png',
    codeZh: '专属识别码 AR-A01',
    codeEn: 'Code AR-A01',
    eraZh: '唐元和九年 (公元814年)',
    eraEn: 'Tang Yuanhe 9th Year (814 AD)',
    descriptionZh: '汉白玉巨制，盖面阴刻双龙纹与“唐故幽州卢龙节度使刘公墓志之铭”，描金璀璨。',
    descriptionEn: 'Monumental white marble epitaph cover deeply engraved with golden dragon patterns and calligraphy.'
  },
  {
    id: 'camel',
    nameZh: '唐三彩双峰骆驼',
    nameEn: 'Artifact: Sancai Silk Road Camel',
    category: 'artifact',
    image: '/src/assets/images/左耳室.png',
    codeZh: '专属识别码 AR-A02',
    codeEn: 'Code AR-A02',
    eraZh: '盛唐 · 丝绸之路瑰宝',
    eraEn: 'High Tang · Silk Road Relic',
    descriptionZh: '昂首伫立，驮载丝绸与胡瓶，黄、绿、白三彩釉色交融，极具大唐包容气象。',
    descriptionEn: 'Glazed Bactrian camel carrying Silk Road merchandise with vibrant yellow and green glazes.'
  }
];

export default function ARExperienceModal({ isOpen, onClose, lang = 'zh' }: ARExperienceModalProps) {
  const isEn = lang === 'en';
  
  // Camera & Video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [cameraState, setCameraState] = useState<'pending' | 'granted' | 'denied' | 'simulated'>('pending');
  const [selectedRelic, setSelectedRelic] = useState<ARRelicItem>(AR_RELICS[0]);
  const [selectedChamber, setSelectedChamber] = useState<ARChamber>(AR_CHAMBERS[0]);
  
  // Scanner Mode State (扫描识别码/实景墙面标定)
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [targetLocked, setTargetLocked] = useState<boolean>(true);

  // Real-time Device Motion / Gyroscope Tracking state
  const [gyroActive, setGyroActive] = useState<boolean>(false);
  const [gyroOffset, setGyroOffset] = useState({ x: 0, y: 0, alpha: 0 });
  const [gyroPermissionNeeded, setGyroPermissionNeeded] = useState<boolean>(false);

  // AR Placement Controls
  const [pos, setPos] = useState({ x: 50, y: 48 }); // % relative to container
  const [scale, setScale] = useState<number>(1.0); // 0.4 to 2.2
  const [rotation, setRotation] = useState<number>(0); // 0 to 360 deg
  
  // AR Real-time Restoration Level & Effects
  const [restorationLevel, setRestorationLevel] = useState<number>(100); // 0 (weathered) to 100 (vibrant restoration)
  const [candleTorchActive, setCandleTorchActive] = useState<boolean>(true);
  const [spectralMode, setSpectralMode] = useState<'NORMAL' | 'INFRARED' | 'XRAY' | 'UV'>('NORMAL');
  const [candlePos, setCandlePos] = useState({ x: 50, y: 50 }); // % relative to container

  // Dragging interaction state
  const [isDraggingRelic, setIsDraggingRelic] = useState<boolean>(false);

  // Snapshot result state
  const [snapshotCardUrl, setSnapshotCardUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Device Orientation Listener for Mobile Real-time Motion Tracking
  useEffect(() => {
    if (!isOpen) return;

    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission === 'function') {
      setGyroPermissionNeeded(true);
    } else {
      enableDeviceOrientation();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isOpen]);

  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.beta !== null && e.gamma !== null) {
      setGyroActive(true);
      const gammaVal = e.gamma || 0;
      const betaVal = (e.beta || 0) - 45; // baseline holding angle ~45deg
      const alphaVal = e.alpha || 0;

      const normX = Math.max(-40, Math.min(40, gammaVal * 1.2));
      const normY = Math.max(-40, Math.min(40, betaVal * 1.2));

      setGyroOffset({ x: normX, y: normY, alpha: Math.round(alphaVal) });
    }
  };

  const enableDeviceOrientation = async () => {
    try {
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission === 'function') {
        const perm = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (perm === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setGyroActive(true);
          setGyroPermissionNeeded(false);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
        setGyroActive(true);
      }
    } catch (err) {
      console.warn('Device orientation error:', err);
    }
  };

  // Request Camera Stream on mount / open
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraState('pending');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraState('granted');
      } else {
        setCameraState('simulated');
      }
    } catch (err) {
      console.warn('Camera access error or denied:', err);
      setCameraState('denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Trigger Target Code Scan Simulation
  const triggerCodeScan = () => {
    playWarpSound();
    setIsScanning(true);
    setTargetLocked(false);

    setTimeout(() => {
      setIsScanning(false);
      setTargetLocked(true);
      playClickSound();
    }, 2200);
  };

  // Handle Touch/Mouse Dragging for Relic & Candle
  const handlePointerDownContainer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (candleTorchActive) {
      setCandlePos({ x, y });
    }
  };

  const handlePointerDownRelic = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDraggingRelic(true);
  };

  const handlePointerMoveContainer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    if (isDraggingRelic) {
      setPos({ x, y });
    } else if (candleTorchActive) {
      setCandlePos({ x, y });
    }
  };

  const handlePointerUpContainer = () => {
    setIsDraggingRelic(false);
  };

  // Generate AR Snapshot Photo Card
  const captureARSnapshot = () => {
    playWarpSound();
    setIsCapturing(true);

    setTimeout(() => {
      try {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1440;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // 1. Fill dark tomb canvas background
        ctx.fillStyle = '#0a0806';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw Camera video frame or simulated background
        if (videoRef.current && cameraState === 'granted' && selectedChamber.id === 'camera') {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        } else {
          const bgGrad = ctx.createRadialGradient(540, 720, 100, 540, 720, 800);
          bgGrad.addColorStop(0, '#221810');
          bgGrad.addColorStop(0.5, '#120c08');
          bgGrad.addColorStop(1, '#050403');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 3. Draw Spectral Filter overlay if active
        if (spectralMode === 'INFRARED') {
          ctx.fillStyle = 'rgba(217, 119, 6, 0.25)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (spectralMode === 'XRAY') {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (spectralMode === 'UV') {
          ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 4. Draw Candle Spotlight radial gradient
        if (candleTorchActive) {
          const torchX = (candlePos.x / 100) * canvas.width;
          const torchY = (candlePos.y / 100) * canvas.height;
          const torchGrad = ctx.createRadialGradient(torchX, torchY, 50, torchX, torchY, 450);
          torchGrad.addColorStop(0, 'rgba(254, 215, 170, 0.4)');
          torchGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
          torchGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
          ctx.fillStyle = torchGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 5. Draw AR Relic Image with Restoration Filter
        const relicImg = new Image();
        relicImg.crossOrigin = 'anonymous';
        relicImg.src = selectedRelic.image;
        relicImg.onload = () => {
          ctx.save();
          const rx = (pos.x / 100) * canvas.width;
          const ry = (pos.y / 100) * canvas.height;
          const rw = 480 * scale;
          const rh = 360 * scale;

          ctx.translate(rx, ry);
          ctx.rotate((rotation * Math.PI) / 180);

          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 35;
          ctx.drawImage(relicImg, -rw / 2, -rh / 2, rw, rh);
          ctx.restore();

          // 6. Draw Antique Tang Decorative Frame
          ctx.strokeStyle = '#c6a35f';
          ctx.lineWidth = 12;
          ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

          ctx.strokeStyle = 'rgba(198, 163, 95, 0.4)';
          ctx.lineWidth = 3;
          ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

          // 7. Draw Red Tang Seal Stamp
          ctx.fillStyle = '#b91c1c';
          ctx.beginPath();
          ctx.roundRect(canvas.width - 240, canvas.height - 240, 170, 170, 16);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 4;
          ctx.strokeRect(canvas.width - 232, canvas.height - 232, 154, 154);

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 32px "Noto Serif SC", serif';
          ctx.textAlign = 'center';
          ctx.fillText('幽州卢龙', canvas.width - 155, canvas.height - 165);
          ctx.fillText('节度使印', canvas.width - 155, canvas.height - 115);

          // 8. Draw Caption Text at bottom
          ctx.fillStyle = 'rgba(15, 10, 6, 0.88)';
          ctx.fillRect(50, canvas.height - 160, canvas.width - 320, 110);
          ctx.strokeStyle = '#c6a35f';
          ctx.lineWidth = 2;
          ctx.strokeRect(50, canvas.height - 160, canvas.width - 320, 110);

          ctx.fillStyle = '#fef3c7';
          ctx.font = 'bold 32px "Noto Serif SC", serif';
          ctx.textAlign = 'left';
          ctx.fillText(`大唐房山长沟大墓 · AR移动端虚实重叠复原卡片`, 70, canvas.height - 110);
          
          ctx.fillStyle = '#d97706';
          ctx.font = '22px monospace';
          ctx.fillText(`【探寻对象】${selectedRelic.nameZh} (${restorationLevel}%数字复原) | ${new Date().toLocaleDateString()}`, 70, canvas.height - 70);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setSnapshotCardUrl(dataUrl);
          setIsCapturing(false);
        };

        relicImg.onerror = () => {
          setIsCapturing(false);
        };
      } catch (err) {
        console.error('AR Snapshot error:', err);
        setIsCapturing(false);
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between font-serif select-none overflow-hidden text-[#ebdcc8]"
      >
        {/* Hidden Canvas for Snapshot Card rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* 1. COMPACT TOP HEADER HUD BAR - NO TEXT WRAPPING / NO OVERLAPPING */}
        <header className="absolute top-0 left-0 w-full z-30 px-2 sm:px-4 py-2 bg-gradient-to-b from-black/95 via-black/80 to-transparent flex justify-between items-center border-b border-amber-500/20">
          <div className="flex items-center space-x-1.5 min-w-0 pr-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 animate-pulse shrink-0">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 truncate">
              <h3 className="text-[11px] sm:text-xs font-bold text-amber-200 tracking-wide flex items-center gap-1 truncate">
                <span className="truncate">{isEn ? 'Mobile AR Real-time' : '移动端AR实时复原'}</span>
                <span className="text-[8px] bg-amber-500 text-black px-1 py-0.2 rounded font-mono font-bold shrink-0">AR</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* iOS / Mobile Gyro Permission Button */}
            {gyroPermissionNeeded && (
              <button
                onClick={enableDeviceOrientation}
                className="px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-400 text-amber-200 text-[9px] font-bold flex items-center gap-0.5 animate-bounce cursor-pointer whitespace-nowrap"
              >
                <Navigation className="w-2.5 h-2.5" />
                <span>{isEn ? 'Gyro' : '陀螺仪'}</span>
              </button>
            )}

            {/* Scan Code / Wall Alignment Trigger */}
            <button
              onClick={triggerCodeScan}
              className={`px-2 py-1 rounded-full border text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer whitespace-nowrap ${
                isScanning 
                  ? 'bg-amber-400 text-black border-yellow-200 animate-pulse'
                  : 'bg-black/80 text-amber-300 border-amber-500/50 hover:border-amber-400'
              }`}
            >
              <Scan className="w-3 h-3 text-amber-300" />
              <span>{isScanning ? (isEn ? 'Scanning...' : '扫描墙面中') : (isEn ? 'Scan Code' : '扫码/壁面标定')}</span>
            </button>

            {/* Snapshot Trigger Button */}
            <button
              onClick={captureARSnapshot}
              disabled={isCapturing}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-black font-bold text-[10px] sm:text-xs flex items-center space-x-1 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isCapturing ? '...' : (isEn ? 'Snap' : 'AR拍照')}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/80 border border-amber-500/40 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* 2. AR VIEWPORT CANVAS CONTAINER WITH REAL-TIME MOTION PARALLAX */}
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDownContainer}
          onPointerMove={handlePointerMoveContainer}
          onPointerUp={handlePointerUpContainer}
          className="relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950 touch-none cursor-crosshair"
        >
          {/* CAMERA VIDEO STREAM BACKGROUND */}
          {selectedChamber.id === 'camera' && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                cameraState === 'granted' ? 'opacity-100' : 'opacity-20'
              }`}
            />
          )}

          {/* REAL-TIME 3D TOMB CHAMBER VIRTUAL ENVIRONMENT BACKGROUND (PARALLAXED BY GYROSCOPE) */}
          {selectedChamber.id !== 'camera' && selectedChamber.bgImage && (
            <div 
              style={{
                transform: `scale(1.15) translate(${gyroOffset.x * 0.8}px, ${gyroOffset.y * 0.8}px) rotate(${gyroOffset.x * 0.15}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={getImageUrl(selectedChamber.bgImage)}
                alt={selectedChamber.nameZh}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
              />
            </div>
          )}

          {/* SIMULATED / DENIED CAMERA FALLBACK BANNER */}
          {selectedChamber.id === 'camera' && cameraState !== 'granted' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#16100a] via-[#0d0906] to-[#050403] flex flex-col items-center justify-center p-4 text-center z-10">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 mb-2 animate-bounce">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-amber-200 mb-1">
                {cameraState === 'denied' 
                  ? (isEn ? 'Camera Permission Notice' : '已启动 3D 模拟 AR 实时空间') 
                  : (isEn ? 'Simulated Mobile AR Active' : '已启动 3D 移动端实时 AR 空间')}
              </h4>
              <p className="text-[11px] text-neutral-300 max-w-xs leading-relaxed mb-2.5">
                {isEn ? 'Mobile gyro tracking active for real-time scene roaming.' : '手持手机对准墙面或滑动屏幕，高精唐墓壁画实时悬浮重叠于现实空间。'}
              </p>
              <button
                onClick={startCamera}
                className="px-3 py-1 rounded-full border border-amber-500/60 bg-amber-500/20 text-amber-300 text-[10px] hover:bg-amber-500 hover:text-black font-bold transition-all cursor-pointer"
              >
                {isEn ? 'Enable Live Camera' : '开启手机真实摄像头'}
              </button>
            </div>
          )}

          {/* AR CODE / WALL SCANNER RETICLE OVERLAY */}
          {(isScanning || !targetLocked) && (
            <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center p-6">
              <div className="w-64 h-64 sm:w-80 sm:h-80 border-2 border-amber-400/80 rounded-2xl relative flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.4)]">
                {/* Scanner laser beam */}
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_15px_#f59e0b] animate-[ping_2s_infinite]" />
                
                {/* Corner reticles */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-400" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-400" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-400" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-400" />

                <div className="bg-black/80 px-3 py-1 rounded-full border border-amber-400 text-amber-300 text-[10px] font-mono animate-pulse flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{isEn ? 'Scanning Target Code AR-M01...' : '正在扫描墙面专属识别码/捕获物理平面...'}</span>
                </div>
              </div>
            </div>
          )}

          {/* SPECTRAL LAYER OVERLAY */}
          {spectralMode === 'INFRARED' && (
            <div className="absolute inset-0 bg-amber-600/20 mix-blend-color-dodge pointer-events-none z-10" />
          )}
          {spectralMode === 'XRAY' && (
            <div className="absolute inset-0 bg-cyan-600/20 mix-blend-difference pointer-events-none z-10" />
          )}
          {spectralMode === 'UV' && (
            <div className="absolute inset-0 bg-purple-600/20 mix-blend-screen pointer-events-none z-10" />
          )}

          {/* VIRTUAL CANDLE SPOTLIGHT OVERLAY */}
          {candleTorchActive && (
            <div 
              style={{
                background: `radial-gradient(circle at ${candlePos.x}% ${candlePos.y}%, rgba(254, 215, 170, 0.45) 0%, rgba(245, 158, 11, 0.22) 180px, rgba(10, 8, 6, 0.72) 380px, rgba(0, 0, 0, 0.92) 100%)`
              }}
              className="absolute inset-0 pointer-events-none z-10 transition-all duration-75"
            >
              <div 
                style={{ left: `${candlePos.x}%`, top: `${candlePos.y}%` }}
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
              >
                <Flame className="w-4 h-4 text-amber-300 animate-bounce filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
              </div>
            </div>
          )}

          {/* AR FLOATING CULTURAL RELIC / MURAL OVERLAY ELEMENT (SUSPENDED ON PHYSICAL WALL) */}
          <div 
            style={{
              left: `${pos.x + (gyroActive ? gyroOffset.x * 0.5 : 0)}%`,
              top: `${pos.y + (gyroActive ? gyroOffset.y * 0.5 : 0)}%`,
              transform: `translate(-50%, -50%) rotate(${rotation + (gyroActive ? gyroOffset.x * 0.1 : 0)}deg) scale(${scale})`,
              transition: isDraggingRelic ? 'none' : 'left 0.08s ease-out, top 0.08s ease-out, transform 0.08s ease-out'
            }}
            onPointerDown={handlePointerDownRelic}
            className={`absolute z-20 cursor-grab active:cursor-grabbing transition-shadow group select-none ${
              isDraggingRelic ? 'ring-2 ring-amber-400 ring-offset-4 ring-offset-black rounded-lg scale-105' : ''
            }`}
          >
            {/* High-Definition Floating Frame */}
            <div className="relative p-1.5 sm:p-2 bg-black/70 rounded-xl border-2 border-amber-400/90 shadow-[0_0_45px_rgba(245,158,11,0.6)] backdrop-blur-md overflow-hidden">
              <img
                src={getImageUrl(selectedRelic.image)}
                alt={selectedRelic.nameZh}
                referrerPolicy="no-referrer"
                style={{
                  filter: `saturate(${0.4 + (restorationLevel / 100) * 0.9}) contrast(${0.8 + (restorationLevel / 100) * 0.3}) brightness(${0.7 + (restorationLevel / 100) * 0.4})`
                }}
                className="max-w-[75vw] sm:max-w-[380px] max-h-[35vh] object-contain rounded-lg pointer-events-none transition-all duration-300"
              />

              {/* Restoration Badge Overlay */}
              <div className="absolute bottom-1.5 right-1.5 bg-amber-950/90 border border-amber-400 text-amber-200 text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold backdrop-blur-md shadow-md whitespace-nowrap">
                {isEn ? `Restored: ${restorationLevel}%` : `实景复原度: ${restorationLevel}%`}
              </div>
              
              {/* Touch Drag Handle Indicator */}
              <div className="absolute top-1.5 left-1.5 bg-black/80 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1 opacity-90 whitespace-nowrap">
                <Move className="w-2.5 h-2.5 text-amber-400" />
                <span>{isEn ? 'Floating on Wall' : '悬浮于墙面'}</span>
              </div>
            </div>
          </div>

          {/* AR COMPACT SPATIAL HUD */}
          <div className="absolute top-11 left-2 z-20 pointer-events-none flex flex-col space-y-1 max-w-[65vw]">
            <div className="bg-black/80 border border-amber-500/40 px-2 py-0.5 rounded-md text-[9px] font-mono text-amber-300 flex items-center space-x-1 backdrop-blur-md whitespace-nowrap overflow-hidden">
              <Compass className="w-3 h-3 text-amber-400 animate-[spin_12s_linear_infinite] shrink-0" />
              <span className="truncate">
                {gyroActive 
                  ? `陀螺仪 X:${gyroOffset.x.toFixed(0)}° Y:${gyroOffset.y.toFixed(0)}°` 
                  : (isEn ? 'Touch Panning' : '手机平移漫游')}
              </span>
            </div>
            <div className="bg-black/80 border border-amber-500/30 px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-mono text-neutral-300 backdrop-blur-md truncate">
              <span>{selectedRelic.codeZh} · {isEn ? selectedRelic.nameEn : selectedRelic.nameZh}</span>
            </div>
          </div>
        </div>

        {/* 3. CLEAN NON-OVERLAPPING BOTTOM CONTROL PANEL */}
        <div className="z-30 bg-gradient-to-t from-black via-black/95 to-black/80 border-t border-amber-500/30 p-2 sm:p-3 flex flex-col space-y-2">
          
          {/* Chamber Scene Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs font-mono no-scrollbar">
            <span className="text-[9px] text-amber-400 font-bold shrink-0 mr-1 whitespace-nowrap">{isEn ? 'Scene:' : '场景:'}</span>
            {AR_CHAMBERS.map(chamber => (
              <button
                key={chamber.id}
                onClick={() => {
                  playClickSound();
                  setSelectedChamber(chamber);
                }}
                className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                  selectedChamber.id === chamber.id
                    ? 'bg-amber-500 text-black border-amber-300 font-bold shadow-md'
                    : 'bg-black/70 text-neutral-300 border-neutral-800 hover:border-amber-600'
                }`}
              >
                {isEn ? chamber.nameEn : chamber.nameZh}
              </button>
            ))}
          </div>

          {/* Controls toolbar: Torch, Spectral Filter, Real-time Restoration Level Slider */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap text-xs font-mono">
            
            {/* Candle Spotlight Toggle */}
            <button
              onClick={() => {
                playClickSound();
                setCandleTorchActive(prev => !prev);
              }}
              className={`px-2 py-0.5 rounded-full border flex items-center space-x-1 transition-all cursor-pointer text-[10px] whitespace-nowrap ${
                candleTorchActive
                  ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md'
                  : 'bg-black/80 text-neutral-400 border-neutral-700 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>{candleTorchActive ? (isEn ? 'Candle' : '烛光探照') : (isEn ? 'Off' : '无烛光')}</span>
            </button>

            {/* Real-time Artifact Restoration Slider */}
            <div className="flex items-center space-x-1 bg-black/80 border border-amber-500/30 px-2 py-0.5 rounded-full">
              <SunMedium className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="text-[9px] text-amber-300 font-bold whitespace-nowrap">{isEn ? 'Restore:' : '复原'}:</span>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={restorationLevel}
                onChange={(e) => setRestorationLevel(parseInt(e.target.value))}
                className="w-14 sm:w-20 accent-amber-500 cursor-pointer"
              />
              <span className="text-[9px] text-amber-200 font-mono w-6 text-right">{restorationLevel}%</span>
            </div>

            {/* Spectral Filter Switcher */}
            <div className="flex items-center bg-neutral-900 border border-amber-500/30 rounded-full p-0.5 shrink-0">
              {(['NORMAL', 'INFRARED', 'XRAY', 'UV'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    playClickSound();
                    setSpectralMode(mode);
                  }}
                  className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] transition-colors cursor-pointer whitespace-nowrap ${
                    spectralMode === mode 
                      ? 'bg-amber-500 text-black font-bold' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode === 'NORMAL' && (isEn ? 'Real' : '彩绘')}
                  {mode === 'INFRARED' && (isEn ? 'IR' : '红外')}
                  {mode === 'XRAY' && (isEn ? 'X-Ray' : 'X光')}
                  {mode === 'UV' && (isEn ? 'UV' : '荧光')}
                </button>
              ))}
            </div>

            {/* Reset Scale/Pos */}
            <button
              onClick={() => {
                playClickSound();
                setPos({ x: 50, y: 48 });
                setScale(1.0);
                setRotation(0);
              }}
              className="p-1 rounded bg-black/60 border border-amber-500/20 text-neutral-400 hover:text-amber-300 transition-colors"
              title={isEn ? "Reset" : "重置"}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Relic Carousel Selection */}
          <div className="overflow-x-auto pb-0.5 flex gap-1.5 no-scrollbar">
            {AR_RELICS.map(relic => {
              const isSelected = selectedRelic.id === relic.id;
              return (
                <button
                  key={relic.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedRelic(relic);
                  }}
                  className={`shrink-0 flex items-center space-x-1.5 p-1 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/90 border-amber-400 ring-1 ring-amber-500/40 shadow-md'
                      : 'bg-neutral-900/80 border-neutral-800 hover:border-amber-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getImageUrl(relic.image)}
                    alt={relic.nameZh}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 object-cover rounded border border-amber-500/30 shrink-0"
                  />
                  <div className="w-24">
                    <h5 className="text-[10px] font-bold text-amber-100 font-serif truncate">
                      {isEn ? relic.nameEn : relic.nameZh}
                    </h5>
                    <p className="text-[8px] text-amber-400/80 font-mono truncate">
                      {relic.codeZh}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SNAPSHOT CARD MODAL DIALOG */}
        <AnimatePresence>
          {snapshotCardUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-lg flex items-center justify-center p-3 font-serif"
            >
              <div className="max-w-md w-full border-2 border-amber-500/60 bg-[#16100b] p-4 rounded-xl shadow-2xl flex flex-col items-center space-y-2.5 relative">
                
                <button
                  onClick={() => setSnapshotCardUrl(null)}
                  className="absolute top-2.5 right-2.5 p-1 rounded-full bg-black/80 text-neutral-400 hover:text-white border border-neutral-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <span className="text-[9px] text-amber-500 tracking-widest font-mono uppercase block font-bold">
                    {isEn ? 'AR Exploration Card' : 'AR 虚实重叠复原考证金卡'}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-amber-200 mt-0.5">
                    {isEn ? 'Fangshan Tomb AR Card' : '房山长沟大墓 AR 考证金卡'}
                  </h3>
                </div>

                {/* Generated Card Image Preview */}
                <div className="w-full max-h-[50vh] overflow-hidden rounded-lg border border-amber-500/40 shadow-xl bg-black flex items-center justify-center p-1">
                  <img
                    src={snapshotCardUrl}
                    alt="AR Snapshot Card"
                    className="max-w-full max-h-[48vh] object-contain rounded"
                  />
                </div>

                {/* Action Buttons: Save/Download */}
                <div className="w-full flex items-center justify-center gap-2 pt-1">
                  <a
                    href={snapshotCardUrl}
                    download={`Fangshan_AR_Card_${Date.now()}.jpg`}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-black font-bold text-xs flex items-center space-x-1 shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Download' : '保存复原金卡'}</span>
                  </a>

                  <button
                    onClick={() => setSnapshotCardUrl(null)}
                    className="px-3.5 py-1.5 rounded-full border border-amber-500/50 bg-black/80 text-amber-300 text-xs font-bold hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    {isEn ? 'Continue' : '继续 AR 漫游'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
