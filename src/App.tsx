import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExplorePhase } from './types';
import Phase1_Home from './components/Phase1_Home';
import Phase2_Tunnel from './components/Phase2_Tunnel';
import Phase3_Mound from './components/Phase3_Mound';
import Phase3_Descent from './components/Phase3_Descent';
import Phase4_Roaming from './components/Phase4_Roaming';
import Phase5_MuralHall from './components/Phase5_MuralHall';
import Phase6_Restoration from './components/Phase6_Restoration';
import ARExperienceModal from './components/ARExperienceModal';
import { Volume2, VolumeX, Globe, Camera } from 'lucide-react';

import { setGlobalSoundEnabled, playClickSound, playWarpSound, playTraditionalInstrument, startCandleBurningSound, stopCandleBurningSound } from './utils/audio';

export default function App() {
  const [phase, setPhase] = useState<ExplorePhase>('HOME');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isAROpen, setIsAROpen] = useState(false);

  // Resume Web Audio context on first user interaction if suspended by browser policy
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      setGlobalSoundEnabled(soundEnabled);
    };
    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('keydown', handleFirstUserInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, [soundEnabled]);

  // Sync sound setting with synthesizer
  useEffect(() => {
    setGlobalSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Handle candle burning sound on the homepage
  useEffect(() => {
    if (soundEnabled && phase === 'HOME') {
      startCandleBurningSound();
    } else {
      stopCandleBurningSound();
    }
  }, [soundEnabled, phase]);

  // Handle phase transitions and play respective sound effects
  const transitionTo = (newPhase: ExplorePhase) => {
    if (newPhase === 'TUNNEL' || newPhase === 'DESCENT') {
      playWarpSound();
    } else {
      playClickSound();
    }
    setPhase(newPhase);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    // Explicitly play a click sound if enabling sound
    if (nextState) {
      setTimeout(() => {
        playClickSound();
      }, 100);
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full absolute inset-0"
        >
          {phase === 'HOME' && (
            <Phase1_Home 
              onStart={() => {
                setSoundEnabled(true);
                playTraditionalInstrument();
                // Delay transition slightly to let the gorgeous guzheng instrument start cleanly
                setTimeout(() => {
                  transitionTo('TUNNEL');
                }, 200);
              }} 
              soundEnabled={soundEnabled}
              toggleSound={toggleSound}
              lang={lang}
              setLang={setLang}
            />
          )}

          {phase === 'TUNNEL' && (
            <Phase2_Tunnel 
              onComplete={() => transitionTo('OUTDOOR')} 
              lang={lang}
            />
          )}

          {phase === 'OUTDOOR' && (
            <Phase3_Mound 
              onEnterTomb={() => transitionTo('DESCENT')} 
              lang={lang}
            />
          )}

          {phase === 'DESCENT' && (
            <Phase3_Descent 
              onComplete={() => transitionTo('ROAMING')} 
              lang={lang}
            />
          )}

          {phase === 'ROAMING' && (
            <Phase4_Roaming 
              onBackToHome={() => transitionTo('HOME')}
              onGoToMuralHall={() => transitionTo('MURAL_HALL')}
              lang={lang}
            />
          )}

          {phase === 'MURAL_HALL' && (
            <Phase5_MuralHall 
              onBackToHome={() => transitionTo('HOME')}
              onGoToWorkshop={() => transitionTo('RESTORATION')}
              lang={lang}
            />
          )}

          {phase === 'RESTORATION' && (
            <Phase6_Restoration 
              onBackToHome={() => transitionTo('HOME')}
              lang={lang}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Global upper-right control buttons (AR Experience, Language toggle, Sound) */}
      <div className="absolute top-2.5 right-2.5 sm:top-5 sm:right-6 z-50 flex items-center space-x-2 sm:space-x-3 pointer-events-auto">
        {/* AR Real-time Experience Button (Mobile Only) */}
        <button
          onClick={() => {
            playWarpSound();
            setIsAROpen(true);
          }}
          className="flex md:hidden h-8 px-2.5 rounded-full border-2 border-amber-400 bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-black items-center justify-center transition-all shadow-2xl text-xs font-serif font-bold cursor-pointer ring-2 ring-amber-500/30 active:scale-95 animate-pulse"
          title={lang === 'zh' ? '开启 AR 移动端实时虚实重叠体验' : 'Launch Mobile AR Real-time Experience'}
        >
          <Camera className="w-3.5 h-3.5 mr-1 text-amber-300" />
          <span>{lang === 'zh' ? 'AR 实时体验' : 'AR View'}</span>
        </button>

        {/* Language Toggle Button */}
        <button
          onClick={() => {
            playClickSound();
            setLang(prev => prev === 'zh' ? 'en' : 'zh');
          }}
          className="h-8 px-2.5 sm:h-10 sm:px-4 rounded-full border-2 border-amber-500/60 bg-black/90 hover:bg-neutral-900 text-amber-300 hover:text-amber-200 flex items-center justify-center transition-all shadow-2xl text-xs sm:text-sm font-mono font-bold cursor-pointer ring-2 ring-amber-500/20 active:scale-95"
          title={lang === 'zh' ? '切换为英文 / Switch to English' : '切换为中文 / Switch to Chinese'}
        >
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-amber-400" />
          <span>{lang === 'zh' ? 'CN' : 'EN'}</span>
        </button>

        {/* Sound Toggle Button */}
        <button
          onClick={toggleSound}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-500/60 bg-black/90 hover:bg-neutral-900 text-amber-400 hover:text-amber-300 flex items-center justify-center transition-all shadow-2xl cursor-pointer ring-2 ring-amber-500/20 active:scale-95"
          title={soundEnabled ? (lang === 'zh' ? '静音音乐' : 'Mute Sound') : (lang === 'zh' ? '开启音乐' : 'Enable Sound')}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />
          )}
        </button>
      </div>

      {/* AR Real-time Experience Modal */}
      <ARExperienceModal
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        lang={lang}
      />
    </div>
  );
}
