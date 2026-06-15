/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  HelpCircle, 
  Settings, 
  Cpu, 
  Sparkles,
  Command
} from "lucide-react";
import { playClickSound, setSoundEnabled, isSoundEnabled } from "../utils/audio";

interface HeaderProps {
  onLaunchDemo: () => void;
  showStudio: boolean;
  onToggleSound: (enabled: boolean) => void;
  accentColor: string; // Hex color string matching current theme
}

export const Header: React.FC<HeaderProps> = ({ 
  onLaunchDemo, 
  showStudio, 
  onToggleSound,
  accentColor 
}) => {
  const [sound, setSound] = useState(isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const handleSoundToggle = () => {
    const newState = !sound;
    setSound(newState);
    setSoundEnabled(newState);
    onToggleSound(newState);
    playClickSound();
  };

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn(`Fullscreen activation error: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <header className="relative z-50 w-full bg-neutral-950/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between select-none">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={onLaunchDemo}>
        <div 
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-500 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
            border: `1px solid ${accentColor}55`
          }}
        >
          {/* Inner futuristic gyro icon spinner */}
          <Compass 
            className="w-5 h-5 animate-[spin_12s_linear_infinite]" 
            style={{ color: accentColor }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-[pulse_4s_ease-in-out_infinite]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-[0.25em] text-white flex items-center gap-1.5 font-sans">
            AETHER
            <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-400">
              V2.5
            </span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
            Climatology Research Studio
          </span>
        </div>
      </div>

      {/* Navigation and Studio Controls */}
      <div className="flex items-center gap-2">
        {/* Launch / Mode Toggler */}
        <button
          onClick={() => {
            playClickSound();
            onLaunchDemo();
          }}
          className="relative group overflow-hidden px-4 py-1.5 rounded-lg border text-xs font-mono tracking-wider transition-all duration-300 select-none cursor-pointer"
          style={{ 
            borderColor: showStudio ? "rgba(255,255,255,0.1)" : `${accentColor}44`,
            color: showStudio ? "#a3a3a3" : "#ffffff",
            backgroundColor: showStudio ? "transparent" : `${accentColor}11`
          }}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            {showStudio ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                RETURN LANDING
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-[pulse_1.5s_infinite]" style={{ color: accentColor }} />
                LAUNCH SIMULATION
              </>
            )}
          </span>
          {/* Glowing slide fill on hover */}
          <div 
            className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${accentColor}22, transparent)` 
            }}
          />
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-2" />

        {/* Global Sound Switcher */}
        <button
          onClick={handleSoundToggle}
          title={sound ? "Mute cybernetic feedback sounds" : "Enable synthetic sound synthesizer"}
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 hover:border-white/15 bg-white/0 hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          {sound ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {/* Fullscreen API Toggler */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen Simulation View"
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 hover:border-white/15 bg-white/0 hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* Keyboard Shortcuts Help Manual */}
        <button
          onClick={() => {
            playClickSound();
            setShowShortcutsModal(true);
          }}
          title="Keyboard Shortcuts Manual"
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 hover:border-white/15 bg-white/0 hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md select-none">
          <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/30">
              <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-2">
                <Command className="w-4 h-4" />
                Studio Keyboard Shortcuts
              </span>
              <button 
                onClick={() => {
                  playClickSound();
                  setShowShortcutsModal(false);
                }}
                className="text-neutral-500 hover:text-white text-xs font-mono uppercase bg-white/5 px-2 py-1 rounded border border-white/10 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-neutral-300 font-sans text-xs">
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 border-b border-white/5 pb-4 font-mono">
                <div className="text-neutral-400">Spacebar</div>
                <div className="text-white text-right">Play / Pause simulation</div>

                <div className="text-neutral-400">C</div>
                <div className="text-white text-right">Detonate center Firework</div>

                <div className="text-neutral-400">3</div>
                <div className="text-white text-right">Toggle perspective 3D coordinate system</div>

                <div className="text-neutral-400">R</div>
                <div className="text-white text-right">Randomize settings configuration</div>

                <div className="text-neutral-400">F</div>
                <div className="text-white text-right">Enable device Fullscreen</div>

                <div className="text-neutral-400">H</div>
                <div className="text-white text-right">Toggle visual panels HUD</div>
              </div>

              {/* Footer Tip */}
              <div className="text-[11px] text-neutral-500 leading-relaxed font-mono mt-2">
                Pro-Tip: Click and drag anywhere across the 3D grid layout to orchestrate orbital camera rotation and pitch alignments. Moving your mouse over elements produces electrostatic displacement forces.
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
