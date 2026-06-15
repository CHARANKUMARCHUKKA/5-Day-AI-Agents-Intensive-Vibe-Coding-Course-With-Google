/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { SidebarControls } from "./components/SidebarControls";
import { AISceneGenerator } from "./components/AISceneGenerator";
import { LiveAnalytics } from "./components/LiveAnalytics";
import { SimulationCanvas } from "./components/SimulationCanvas";
import { SimulationConfig, PerformanceStats, ColorTheme, EffectType } from "./types";
import { playClickSound, playSimulationSweep, setSoundEnabled, initAudio } from "./utils/audio";
import { Eye, EyeOff, LayoutTemplate, HelpCircle } from "lucide-react";
import { PRESETS } from "./utils/presets";

export default function App() {
  // Global View Navigation Mode
  const [showStudio, setShowStudio] = useState(false);
  
  // HUD layout collapses (Cinema mode toggle)
  const [showHUD, setShowHUD] = useState(true);

  // Manual pyrotechnic blast state incrementer
  const [triggerExplosions, setTriggerExplosions] = useState(0);

  // Simulation parameters configurations
  const [config, setConfig] = useState<SimulationConfig>({
    effectType: "snowfall",
    intensity: 60,
    windSpeed: 1.0,
    gravity: 1.2,
    particleSize: 4.0,
    particleCount: 250,
    colorTheme: "luxury_gold",
    speedMultiplier: 1.0,
    is3D: true
  });

  // Simulator performance status outputs
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    activeParticles: 0,
    fps: 60,
    renderTimeMs: 1.2,
    systemPerformance: "Optimal",
    status: "Running"
  });

  // Sound master switcher
  const [soundOn, setSoundOn] = useState(false);

  // Derive precise theme colors for high-end glowing borders
  const getThemeHighlightColor = (theme: ColorTheme): string => {
    const highlights: Record<ColorTheme, string> = {
      luxury_gold: "#D4AF37", // Warm Gold
      ice_blue: "#70D6FF",    // Glacier Cyan
      neon_purple: "#FF007F", // Cyberpunk Hot-Pink / Violet
      cosmic_gold: "#FFD700", // Stars Amber
      forest_neon: "#00F5D4", // Mint Emerald
      neon_rainbow: "#FF0054",// Prismatic Crimson
      ruby_red: "#E63946",    // Crimson Rose
      emerald_wave: "#06D6A0" // Ocean Jade
    };
    return highlights[theme] || "#D4AF37";
  };

  const accentColor = getThemeHighlightColor(config.colorTheme);

  // Listen for keyboard events on window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Direct key binding actions inside simulation cockpit
      if (!showStudio) return;

      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      // Disable keys if user is typing on search/AI prompts
      if (tag === "input" || tag === "textarea") return;

      if (e.code === "Space") {
        e.preventDefault();
        playClickSound();
        setPerformanceStats((prev) => ({
          ...prev,
          status: prev.status === "Paused" ? "Running" : "Paused"
        }));
      } else if (e.code === "KeyR") {
        e.preventDefault();
        randomizeConfiguration();
      } else if (e.code === "KeyC") {
        e.preventDefault();
        triggerManualAtmosphericBlast();
      } else if (e.code === "KeyH") {
        e.preventDefault();
        playClickSound();
        setShowHUD((prev) => !prev);
      } else if (e.code === "KeyF") {
        e.preventDefault();
        playClickSound();
        const doc = document as any;
        if (!doc.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showStudio, config]);

  // Launches simulation from landing CTA
  const handleLaunchSimulation = () => {
    playSimulationSweep();
    setShowStudio(true);
    // Initialize Web Audio API safely on interaction
    if (soundOn) {
      initAudio();
    }
  };

  // Instant pre-configured landing selects
  const handleSelectPresetFromLanding = (presetId: string) => {
    const selected = PRESETS.find((p) => p.id === presetId);
    if (selected) {
      setConfig(selected.config);
      setShowStudio(true);
      playSimulationSweep();
    }
  };

  const randomizeConfiguration = () => {
    playSimulationSweep();
    const effects: EffectType[] = ["snowfall", "rain", "aurora", "fireworks", "stars", "meteor_shower", "balloons", "confetti", "particles"];
    const themes: ColorTheme[] = ["luxury_gold", "ice_blue", "neon_purple", "cosmic_gold", "forest_neon", "neon_rainbow", "ruby_red", "emerald_wave"];

    const rEffect = effects[Math.floor(Math.random() * effects.length)];
    const rTheme = themes[Math.floor(Math.random() * themes.length)];

    let gravity = parseFloat((Math.random() * 4.5 - 0.5).toFixed(2));
    if (rEffect === "balloons") gravity = -parseFloat((Math.random() * 1.5 + 0.2).toFixed(2));

    setConfig({
      effectType: rEffect,
      intensity: Math.floor(Math.random() * 90) + 10,
      windSpeed: parseFloat((Math.random() * 16 - 8).toFixed(2)),
      gravity,
      particleSize: parseFloat((Math.random() * 12 + 1.5).toFixed(1)),
      particleCount: Math.floor(Math.random() * 700) + 100,
      colorTheme: rTheme,
      speedMultiplier: parseFloat((Math.random() * 1.8 + 0.3).toFixed(1)),
      is3D: Math.random() > 0.2
    });
  };

  const triggerManualAtmosphericBlast = () => {
    setTriggerExplosions((prev) => prev + 1);
  };

  const clearEnvironmentalWorkspace = () => {
    playSimulationSweep();
    setConfig((prev) => ({
      ...prev,
      intensity: 10,
      windSpeed: 0,
      gravity: 0,
      particleSize: 1.0,
      particleCount: 50,
      speedMultiplier: 0.1
    }));
  };

  const handleApplyAIConfig = (partialUpdates: Partial<SimulationConfig>, aiRecommendation: string) => {
    setConfig((prev) => ({
      ...prev,
      ...partialUpdates
    }));
  };

  return (
    <div className="relative w-full min-h-screen bg-neutral-950 text-white flex flex-col font-mono text-xs overflow-x-hidden select-none">
      
      {/* Premium Navigation Header */}
      <Header 
        onLaunchDemo={() => {
          playClickSound();
          setShowStudio((prev) => !prev);
        }} 
        showStudio={showStudio}
        onToggleSound={(enabled) => setSoundOn(enabled)}
        accentColor={accentColor}
      />

      {showStudio ? (
        /* Simulation Portal Shell Cockpit */
        <div className="flex-1 w-full relative flex flex-col lg:flex-row overflow-hidden bg-neutral-950">
          
          {/* Main Full-Viewport 3D physics rendering space behind controls */}
          <div className="absolute inset-0 z-0">
            <SimulationCanvas 
              config={config} 
              onPerformanceUpdate={(stats) => setPerformanceStats(stats)}
              isPaused={performanceStats.status === "Paused"}
              interactiveExplosionTrigger={triggerExplosions}
            />
          </div>

          {/* Collapsible glassmorphic sidebar parameters controllers */}
          {showHUD && (
            <div className="absolute lg:relative z-10 top-0 left-0 bottom-y lg:bottom-0 w-full sm:w-[350px] lg:w-[360px] h-[calc(100vh-140px)] lg:h-[calc(100vh-76px)] overflow-y-auto bg-black/60 lg:bg-black/45 backdrop-blur-xl border-r border-white/5 py-4 px-5 space-y-4 shadow-2xl transition-all duration-500 animate-[slideInLeft_0.35s_ease-out]">
              <SidebarControls
                config={config}
                onChangeConfig={(newConfig) => setConfig(newConfig)}
                isPaused={performanceStats.status === "Paused"}
                onTogglePlayPause={() => {
                  setPerformanceStats((prev) => ({
                    ...prev,
                    status: prev.status === "Paused" ? "Running" : "Paused"
                  }));
                }}
                onClear={clearEnvironmentalWorkspace}
                onRandomize={randomizeConfiguration}
                onTriggerExplosion={triggerManualAtmosphericBlast}
                accentColor={accentColor}
              />
            </div>
          )}

          {/* Right sidebar: AI console & live analytics modules */}
          {showHUD && (
            <div className="absolute lg:relative z-10 top-0 right-0 lg:ml-auto w-full sm:w-[350px] lg:w-[380px] h-[calc(100vh-140px)] lg:h-[calc(100vh-76px)] overflow-y-auto bg-black/60 lg:bg-black/45 backdrop-blur-xl border-l border-white/5 py-4 px-5 space-y-4 shadow-2xl transition-all duration-500 animate-[slideInRight_0.35s_ease-out]">
              
              {/* Module A: Generative Gemini parameters AI */}
              <AISceneGenerator 
                onApplyConfig={handleApplyAIConfig}
                accentColor={accentColor}
              />

              {/* Module B: Instrument Avionics Cluster details */}
              <LiveAnalytics 
                stats={performanceStats}
                colorTheme={config.colorTheme}
                accentColor={accentColor}
              />
            </div>
          )}

          {/* Floating UI controls anchors (Bottom margin HUD togglers) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {/* Show / Hide HUD Button */}
            <button
              onClick={() => {
                playClickSound();
                setShowHUD((prev) => !prev);
              }}
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest uppercase bg-black/55 backdrop-blur-md hover:bg-neutral-900 border border-white/10 hover:border-white/20 text-white rounded-lg transition-all shadow-xl select-none cursor-pointer"
              title="Toggle full screen cinematic viewport (Shortcut: H)"
            >
              {showHUD ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                  Cinema Mode
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  Restore HUD
                </>
              )}
            </button>

            {/* Manual randomize button */}
            <button
              onClick={randomizeConfiguration}
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest uppercase bg-black/55 backdrop-blur-md hover:bg-neutral-900 border border-white/10 hover:border-white/20 text-white rounded-lg transition-all shadow-xl select-none cursor-pointer"
              title="Radically randomize physics variables (Shortcut: R)"
            >
              <LayoutTemplate className="w-3.5 h-3.5" style={{ color: accentColor }} />
              MUTATE
            </button>
          </div>

          {/* Ambient help layout on bottom margins */}
          <div className="absolute bottom-4 left-6 z-10 pointer-events-none hidden md:block select-none text-[9px] font-mono text-neutral-500 tracking-wider">
            DRAG MOUSE ORBIT PERSPECTIVE // CLICK DETONATES SPARKS
          </div>

        </div>
      ) : (
        /* Cinematic Product Landing Page (SpaceX / Tesla visual style) */
        <LandingPage 
          onLaunch={handleLaunchSimulation}
          onSelectPreset={(presetId) => {
            // Apply coordinates directly on preselect and jump to Studio
            const selected = PRESETS.find((p) => p.id === presetId);
            if (selected) {
              setConfig(selected.config);
              setShowStudio(true);
              playSimulationSweep();
            }
          }}
        />
      )}

    </div>
  );
}
