// Programmatic Audio Synthesizer for Interactive Sound Effects and Chimes
// Uses standard Web Audio API to play instant sound effects without loading asset files

let audioCtx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;

let droneOsc: OscillatorNode | null = null;
let droneGainNode: GainNode | null = null;
let melodyInterval: any = null;
let activeTimeouts: any[] = [];

let candleHissSource: AudioBufferSourceNode | null = null;
let candleHissGain: GainNode | null = null;
let candleCracklerInterval: any = null;

// Tang Dynasty Court Music Pentatonic Modes (宮 Gōng, 商 Shāng, 角 Jué, 徵 Zhǐ, 羽 Yǔ)
// A3, C4, D4, E4, G4, A4, C5, D5, E5, G5, A5
const TANG_PENTATONIC = {
  A2: 110.00,
  C3: 130.81,
  E3: 164.81,
  G3: 196.00,
  A3: 220.00,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.00,
  A4: 440.00,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.00,
};

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtxClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioCtxClass();
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);
    masterGainNode.connect(audioCtx.destination);
  }
  return audioCtx;
}

function getMasterOutput(): AudioNode | null {
  const ctx = getAudioContext();
  if (!ctx || !masterGainNode) return null;
  return masterGainNode;
}

// Global toggle state
let isSoundEnabled = false;

export function setGlobalSoundEnabled(enabled: boolean) {
  isSoundEnabled = enabled;
  const ctx = getAudioContext();
  const output = getMasterOutput();
  
  if (!ctx || !output || !masterGainNode) return;
  
  if (enabled) {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    masterGainNode.gain.setValueAtTime(1.0, ctx.currentTime);
    startBackgroundAmbience();
  } else {
    // Fades master volume to 0 instantly (10ms) to ensure ALL audio silences without lag
    masterGainNode.gain.setValueAtTime(0, ctx.currentTime);
    stopBackgroundAmbience();
    stopCandleBurningSound();
  }
}

// Helper to register pending timeouts so they can be completely cleared on mute
function safeTimeout(fn: () => void, delayMs: number) {
  if (!isSoundEnabled) return;
  const id = setTimeout(() => {
    activeTimeouts = activeTimeouts.filter(t => t !== id);
    if (isSoundEnabled) fn();
  }, delayMs);
  activeTimeouts.push(id);
}

function clearAllPendingTimeouts() {
  activeTimeouts.forEach(id => clearTimeout(id));
  activeTimeouts = [];
}

export function playClickSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // High-pitched crystal/stone chime tap tone
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(950, now);
    osc1.frequency.exponentialRampToValueAtTime(350, now + 0.18);
    
    // Supporting tone for depth
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(630, now);
    osc2.frequency.exponentialRampToValueAtTime(220, now + 0.18);
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(output);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.22);
    osc2.stop(now + 0.22);
  } catch (err) {
    console.warn("Failed to play click sound:", err);
  }
}

// Play traditional Guzheng / Chime pluck when starting exploration
export function playTraditionalInstrument() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    
    // Traditional Chinese Guzheng/Chime pentatonic chord (A3, C4, E4, A4)
    const freqs = [TANG_PENTATONIC.A3, TANG_PENTATONIC.C4, TANG_PENTATONIC.E4, TANG_PENTATONIC.A4];
    freqs.forEach((freq, idx) => {
      const delay = idx * 0.1;
      
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 2, now + delay);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now + delay);
      filter.frequency.exponentialRampToValueAtTime(200, now + delay + 2.0);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.18, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 3.2);
      
      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(output);
      
      osc.start(now + delay);
      subOsc.start(now + delay);
      osc.stop(now + delay + 3.3);
      subOsc.stop(now + delay + 3.3);
    });
  } catch (err) {
    console.warn("Failed to play traditional instrument chime:", err);
  }
}

export function playWarpSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    const duration = 2.5;
    
    const lowOsc = ctx.createOscillator();
    const lowGain = ctx.createGain();
    
    lowOsc.type = 'sine';
    lowOsc.frequency.setValueAtTime(45, now);
    lowOsc.frequency.exponentialRampToValueAtTime(220, now + duration);
    
    const lowFilter = ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.setValueAtTime(140, now);
    
    lowGain.gain.setValueAtTime(0.0001, now);
    lowGain.gain.linearRampToValueAtTime(0.15, now + 0.4);
    lowGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    lowOsc.connect(lowFilter);
    lowFilter.connect(lowGain);
    lowGain.connect(output);
    
    lowOsc.start(now);
    lowOsc.stop(now + duration);

    // Synthesize howling cavern wind using white noise filtering
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.Q.setValueAtTime(2.5, now);
    windFilter.frequency.setValueAtTime(160, now);
    windFilter.frequency.exponentialRampToValueAtTime(750, now + 1.0);
    windFilter.frequency.exponentialRampToValueAtTime(200, now + duration);
    
    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.0001, now);
    windGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
    windGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(output);
    
    noiseSource.start(now);
    noiseSource.stop(now + duration);
    
  } catch (err) {
    console.warn("Failed to play warp wind sound:", err);
  }
}

// ============================================================================
// RICH TANG DYNASTY COURT MUSIC SYNTHESIZER (宫廷唐乐 - 霓裳古韵)
// Synthesizes multi-instrumental Tang Court Music:
// 1. Tang Pipa/Guzheng (琵琶/古筝 - Plucked chords & tremolo runs)
// 2. Tang Dongxiao / Flute (洞箫/竹笛 - Legato breathy melody with pitch vibrato)
// 3. Tang Court Bianzhong Chimes (宫廷编钟 - Resonant metallic bell overtones)
// 4. Tang Drum & Deep Tomb Pad (唐鼓与地宫苍古低鸣)
// ============================================================================

// Pluck a single Tang Pipa/Guzheng note or Tremolo Roll
function playPipaNote(freq: number, delayMs: number = 0, isTremolo: boolean = false, isAccent: boolean = false) {
  safeTimeout(() => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;

    const now = ctx.currentTime;
    const count = isTremolo ? 3 : 1; // Tremolo roll technique (轮指/摇指)

    for (let i = 0; i < count; i++) {
      const offset = i * 0.08;
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle'; // Wooden pluck string body
      osc.frequency.setValueAtTime(freq, now + offset);

      subOsc.type = 'sine'; // High harmonic shimmer
      subOsc.frequency.setValueAtTime(freq * 2, now + offset);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isAccent ? 1800 : 1200, now + offset);
      filter.frequency.exponentialRampToValueAtTime(220, now + offset + 2.2);

      const peakVol = isAccent ? 0.15 : (isTremolo ? 0.08 : 0.11);
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(peakVol, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 2.8);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(output);

      osc.start(now + offset);
      subOsc.start(now + offset);
      osc.stop(now + offset + 3.0);
      subOsc.stop(now + offset + 3.0);
    }
  }, delayMs);
}

// Play Tang Dongxiao / Bamboo Flute legato note with smooth pitch glide and LFO vibrato
function playDongxiaoMelodyNote(freq: number, durationSec: number = 2.0, delayMs: number = 0) {
  safeTimeout(() => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // 4.2 Hz Pitch Vibrato LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(4.2, now);
    lfoGain.gain.setValueAtTime(freq * 0.015, now); // 1.5% pitch modulation
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfoGain.connect(subOsc.frequency);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.98, now); // Portamento pitch slide in
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.15);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 0.98, now);
    subOsc.frequency.exponentialRampToValueAtTime(freq, now + 0.15);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, now);
    filter.Q.setValueAtTime(1.8, now);

    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.25); // Breathy swell
    gain.gain.setValueAtTime(0.09, now + durationSec - 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    lfo.start(now);
    osc.start(now);
    subOsc.start(now);

    lfo.stop(now + durationSec + 0.1);
    osc.stop(now + durationSec + 0.1);
    subOsc.stop(now + durationSec + 0.1);
  }, delayMs);
}

// Play Tang Court Bianzhong / Bronze Bell Chime
function playBianzhongChime(freq: number, delayMs: number = 0) {
  safeTimeout(() => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;

    const now = ctx.currentTime;
    
    // Bronze bells have non-integer harmonic overtones (1x, 2.76x, 5.4x)
    const partials = [1.0, 2.76, 5.4];
    const vols = [0.11, 0.05, 0.025];

    partials.forEach((p, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vols[idx], now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(output);

      osc.start(now);
      osc.stop(now + 4.8);
    });
  }, delayMs);
}

// Soft Tang Court Percussion / Drum beat (唐鼓)
function playTangDrumBeat(delayMs: number = 0) {
  safeTimeout(() => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.15);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(output);

    osc.start(now);
    osc.stop(now + 0.25);
  }, delayMs);
}

// Tang Dynasty Court Music Orchestral Composition Phrases (12 Evolving Phrases for non-monotonous music)
const TANG_COURT_COMPOSITIONS = [
  // Phrase 0: Opening Chime & Flute Solo (开篇钟音与洞箫独奏)
  () => {
    playBianzhongChime(TANG_PENTATONIC.A3, 0);
    playTangDrumBeat(0);
    playDongxiaoMelodyNote(TANG_PENTATONIC.E4, 2.5, 200);
    playPipaNote(TANG_PENTATONIC.A3, 600, false, true);
    playPipaNote(TANG_PENTATONIC.C4, 1100);
    playPipaNote(TANG_PENTATONIC.E4, 1600);
    playPipaNote(TANG_PENTATONIC.A4, 2100, true);
  },
  // Phrase 1: Pipa Plucked Arpeggio & High Flute Call (琵琶和音与高音竹笛)
  () => {
    playPipaNote(TANG_PENTATONIC.A3, 0, false, true);
    playPipaNote(TANG_PENTATONIC.E4, 200);
    playPipaNote(TANG_PENTATONIC.A4, 400);
    playDongxiaoMelodyNote(TANG_PENTATONIC.A4, 2.2, 500);
    playDongxiaoMelodyNote(TANG_PENTATONIC.C5, 2.0, 1400);
    playPipaNote(TANG_PENTATONIC.G4, 1600, true);
    playBianzhongChime(TANG_PENTATONIC.E5, 1800);
  },
  // Phrase 2: Bianzhong Bell Chime Accent (编钟合鸣)
  () => {
    playBianzhongChime(TANG_PENTATONIC.E4, 0);
    playBianzhongChime(TANG_PENTATONIC.A3, 100);
    playTangDrumBeat(0);
    playPipaNote(TANG_PENTATONIC.G3, 300);
    playPipaNote(TANG_PENTATONIC.D4, 600);
    playDongxiaoMelodyNote(TANG_PENTATONIC.G4, 2.6, 700);
    playPipaNote(TANG_PENTATONIC.E4, 1300, true);
    playPipaNote(TANG_PENTATONIC.A4, 1800);
  },
  // Phrase 3: Ascending Guzheng Pluck Run (古筝上滑音)
  () => {
    playPipaNote(TANG_PENTATONIC.A3, 0);
    playPipaNote(TANG_PENTATONIC.C4, 150);
    playPipaNote(TANG_PENTATONIC.D4, 300);
    playPipaNote(TANG_PENTATONIC.E4, 450);
    playPipaNote(TANG_PENTATONIC.G4, 600);
    playDongxiaoMelodyNote(TANG_PENTATONIC.E5, 2.4, 700);
    playPipaNote(TANG_PENTATONIC.A4, 1200, true);
    playPipaNote(TANG_PENTATONIC.G4, 1700);
  },
  // Phrase 4: Quiet Court Solitude (幽壁沉息)
  () => {
    playTangDrumBeat(0);
    playTangDrumBeat(600);
    playDongxiaoMelodyNote(TANG_PENTATONIC.D4, 3.0, 200);
    playPipaNote(TANG_PENTATONIC.A3, 800, false, true);
    playPipaNote(TANG_PENTATONIC.E4, 1500, true);
    playBianzhongChime(TANG_PENTATONIC.C4, 2000);
  },
  // Phrase 5: High Chime & Double String Roll (高音编磬与双线摇指)
  () => {
    playBianzhongChime(TANG_PENTATONIC.A4, 0);
    playBianzhongChime(TANG_PENTATONIC.E5, 150);
    playDongxiaoMelodyNote(TANG_PENTATONIC.C5, 2.2, 300);
    playPipaNote(TANG_PENTATONIC.E5, 500, true, true);
    playPipaNote(TANG_PENTATONIC.D5, 1000);
    playPipaNote(TANG_PENTATONIC.A4, 1500, true);
  },
  // Phrase 6: Court Cadence Return (唐宫羽调归韵)
  () => {
    playBianzhongChime(TANG_PENTATONIC.A3, 0);
    playTangDrumBeat(0);
    playDongxiaoMelodyNote(TANG_PENTATONIC.A4, 2.5, 200);
    playPipaNote(TANG_PENTATONIC.E4, 500);
    playPipaNote(TANG_PENTATONIC.C4, 1000);
    playPipaNote(TANG_PENTATONIC.A3, 1500, false, true);
  },
  // Phrase 7: Velvet Night Echo (幽夜回荡) - New phrase
  () => {
    playBianzhongChime(TANG_PENTATONIC.G3, 0);
    playDongxiaoMelodyNote(TANG_PENTATONIC.D5, 2.5, 100);
    playPipaNote(TANG_PENTATONIC.A3, 400);
    playPipaNote(TANG_PENTATONIC.C4, 800);
    playPipaNote(TANG_PENTATONIC.E4, 1200);
    playPipaNote(TANG_PENTATONIC.G4, 1600, true);
    playTangDrumBeat(1800);
  },
  // Phrase 8: Grand Banquet Chime (大唐华清合乐) - New phrase
  () => {
    playTangDrumBeat(0);
    playBianzhongChime(TANG_PENTATONIC.C4, 0);
    playBianzhongChime(TANG_PENTATONIC.G4, 200);
    playDongxiaoMelodyNote(TANG_PENTATONIC.E4, 2.2, 300);
    playPipaNote(TANG_PENTATONIC.A4, 700, true);
    playPipaNote(TANG_PENTATONIC.C5, 1200, false, true);
    playPipaNote(TANG_PENTATONIC.E5, 1600);
  },
  // Phrase 9: Eternal Grotto Whispers (千年莫高幻乐) - New phrase
  () => {
    playBianzhongChime(TANG_PENTATONIC.E3, 0);
    playDongxiaoMelodyNote(TANG_PENTATONIC.A4, 2.8, 100);
    playPipaNote(TANG_PENTATONIC.D4, 500);
    playPipaNote(TANG_PENTATONIC.E4, 1000, true);
    playPipaNote(TANG_PENTATONIC.G4, 1500);
    playPipaNote(TANG_PENTATONIC.C5, 2000, true);
  },
  // Phrase 10: Imperial Silk Road Caravan (丝路胡乐鸣钟)
  () => {
    playBianzhongChime(TANG_PENTATONIC.A3, 0);
    playTangDrumBeat(0);
    playTangDrumBeat(400);
    playDongxiaoMelodyNote(TANG_PENTATONIC.E5, 2.4, 200);
    playPipaNote(TANG_PENTATONIC.C4, 400, true);
    playPipaNote(TANG_PENTATONIC.D4, 800);
    playPipaNote(TANG_PENTATONIC.E4, 1200, false, true);
    playPipaNote(TANG_PENTATONIC.G4, 1600, true);
    playBianzhongChime(TANG_PENTATONIC.C5, 2000);
  },
  // Phrase 11: Lulong Guard Patrol Echoes (卢龙军威浩歌)
  () => {
    playBianzhongChime(TANG_PENTATONIC.C3, 0);
    playTangDrumBeat(0);
    playTangDrumBeat(800);
    playDongxiaoMelodyNote(TANG_PENTATONIC.A3, 2.6, 200);
    playDongxiaoMelodyNote(TANG_PENTATONIC.C4, 2.2, 1000);
    playPipaNote(TANG_PENTATONIC.E4, 600, true);
    playPipaNote(TANG_PENTATONIC.A4, 1400, false, true);
  }
];

let compositionIdx = 0;

export function startBackgroundAmbience() {
  try {
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    stopBackgroundAmbience();
    
    // 1. Imperial Tomb Deep Resonant Bass Pad (宫廷地宫深沉低鸣)
    droneOsc = ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(TANG_PENTATONIC.A2, ctx.currentTime);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, ctx.currentTime);
    
    droneGainNode = ctx.createGain();
    droneGainNode.gain.setValueAtTime(0.045, ctx.currentTime);
    
    droneOsc.connect(filter);
    filter.connect(droneGainNode);
    droneGainNode.connect(output);
    
    droneOsc.start();
    
    // 2. Continuous Tang Dynasty Court Music Composition Engine
    const tickComposition = () => {
      if (!isSoundEnabled) return;
      
      const phrase = TANG_COURT_COMPOSITIONS[compositionIdx];
      phrase();
      
      compositionIdx = (compositionIdx + 1) % TANG_COURT_COMPOSITIONS.length;
    };
    
    // Play initial phrase immediately
    tickComposition();
    // Schedule next composition phrase every 2.8 seconds
    melodyInterval = setInterval(tickComposition, 2800);
    
  } catch (err) {
    console.warn("Failed to start Tang court soundscape:", err);
  }
}

export function stopBackgroundAmbience() {
  clearAllPendingTimeouts();
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
  if (droneOsc) {
    try {
      droneOsc.stop();
      droneOsc.disconnect();
    } catch {}
    droneOsc = null;
  }
}

export function startCandleBurningSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    const output = getMasterOutput();
    if (!ctx || !output) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    stopCandleBurningSound();
    
    const now = ctx.currentTime;
    
    // Soft hiss/breath of candle flame
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    candleHissSource = ctx.createBufferSource();
    candleHissSource.buffer = buffer;
    candleHissSource.loop = true;
    
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(320, now);
    lowpass.Q.setValueAtTime(1.0, now);
    
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(950, now);
    bandpass.Q.setValueAtTime(0.4, now);
    
    candleHissGain = ctx.createGain();
    candleHissGain.gain.setValueAtTime(0.008, now);
    
    candleHissSource.connect(lowpass);
    lowpass.connect(bandpass);
    bandpass.connect(candleHissGain);
    candleHissGain.connect(output);
    
    candleHissSource.start(now);
    
    // Intermittent crackling pops
    const playCrackle = () => {
      if (!isSoundEnabled) return;
      const cCtx = getAudioContext();
      const cOut = getMasterOutput();
      if (!cCtx || !cOut) return;
      
      const clickTime = cCtx.currentTime;
      const volume = Math.random() * 0.008 + 0.002;
      const pitch = Math.random() * 1200 + 800;
      
      const osc = cCtx.createOscillator();
      const gainNode = cCtx.createGain();
      const clickFilter = cCtx.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, clickTime);
      
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(pitch, clickTime);
      clickFilter.Q.setValueAtTime(3.5, clickTime);
      
      gainNode.gain.setValueAtTime(volume, clickTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.01);
      
      osc.connect(clickFilter);
      clickFilter.connect(gainNode);
      gainNode.connect(cOut);
      
      osc.start(clickTime);
      osc.stop(clickTime + 0.012);
    };
    
    const tick = () => {
      if (!isSoundEnabled) return;
      playCrackle();
      const nextDelay = Math.random() * 900 + 200;
      candleCracklerInterval = setTimeout(tick, nextDelay);
    };
    
    candleCracklerInterval = setTimeout(tick, 400);
    
  } catch (err) {
    console.warn("Failed to start candle burning sound:", err);
  }
}

export function stopCandleBurningSound() {
  if (candleCracklerInterval) {
    clearTimeout(candleCracklerInterval);
    candleCracklerInterval = null;
  }
  if (candleHissSource) {
    try {
      candleHissSource.stop();
      candleHissSource.disconnect();
    } catch {}
    candleHissSource = null;
  }
  if (candleHissGain) {
    try {
      candleHissGain.disconnect();
    } catch {}
    candleHissGain = null;
  }
}

