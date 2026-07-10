import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AmbientPlayer() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create the audio element with user-provided web.mp3
    const audio = new Audio("/web.mp3");
    audio.loop = true;
    audio.volume = 0.5; // strictly set to 50% volume as requested

    // Initialize state from localStorage (default to muted/true for pleasant initial landing)
    const savedMutedState = localStorage.getItem('ambient_music_muted');
    const shouldMute = savedMutedState === null ? true : savedMutedState === 'true';
    
    audio.muted = shouldMute;
    setIsMuted(shouldMute);
    audioRef.current = audio;

    // Start playback (will play if browser allows, otherwise wait for click/gesture)
    const playAudio = () => {
      audio.play().catch((err) => {
        console.log("Autoplay waiting for user gesture to activate:", err);
      });
    };

    playAudio();

    // Unmute or play silently on first click/touchstart gesture
    const handleFirstUserInteraction = () => {
      if (audioRef.current) {
        if (!audioRef.current.muted) {
          audioRef.current.play().catch((err) => console.log("Play error on first interaction:", err));
        } else {
          // Play in background silently so unmuting later works instantly
          audioRef.current.play().catch(() => {});
        }
      }
      // Clean up interactions immediately after first gesture
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('touchstart', handleFirstUserInteraction);

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;

    const newMuted = !audioRef.current.muted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
    localStorage.setItem('ambient_music_muted', String(newMuted));

    if (!newMuted) {
      audioRef.current.play().catch((err) => {
        console.error("Playback failed on toggle unmuting:", err);
      });
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none">
      <div className="relative group animate-fadeIn">
        
        {/* Decorative Ambient Pulsing Ring (when active and unmuted) */}
        {!isMuted && (
          <span className="absolute inset-0 rounded-full bg-[#C5A059]/30 animate-ping opacity-75 pointer-events-none" />
        )}

        {/* Minimal luxury volume toggle button */}
        <button
          onClick={toggleMute}
          className={`h-12 w-12 rounded-full flex items-center justify-center border transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer ${
            !isMuted 
              ? 'bg-[#14261C] border-[#C5A059]/50 text-[#FAF5F0] hover:scale-105' 
              : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white hover:border-[#C5A059]/40 hover:scale-105'
          }`}
          title={!isMuted ? "Mute Ambient Theme" : "Play Ambient Theme"}
        >
          <AnimatePresence mode="wait">
            {!isMuted ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                <Volume2 className="w-5.5 h-5.5 text-[#E8C888]" />
                
                {/* Micro sound waves bouncing indicator */}
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C888] opacity-75 animate-duration-1000"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8C888]"></span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="muted"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <VolumeX className="w-5.5 h-5.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Elegant Hover Tooltip */}
        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-neutral-950 text-[#FAF5F0] text-[9px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-[#C5A059]/25 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${!isMuted ? 'bg-[#C5A059] animate-pulse' : 'bg-neutral-600'}`} />
          {!isMuted ? "Music: On (50%)" : "Muted"}
        </div>

      </div>
    </div>
  );
}
