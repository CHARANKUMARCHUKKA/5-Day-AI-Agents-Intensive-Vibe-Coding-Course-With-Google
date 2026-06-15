/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Snowflake, 
  ArrowUpCircle, 
  CloudRain, 
  Sparkles, 
  Grid, 
  Star, 
  Zap, 
  Waves, 
  Atom,
  RefreshCcw,
  Trash2,
  Play,
  Pause,
  Sliders,
  Palette,
  Layers,
  Bomb
} from "lucide-react";
import { SimulationConfig, EffectType, ColorTheme, Preset } from "../types";
import { playClickSound, playSimulationSweep } from "../utils/audio";
import { PRESETS } from "../utils/presets";

interface SidebarControlsProps {
  config: SimulationConfig;
  onChangeConfig: (newConfig: SimulationConfig) => void;
  isPaused: boolean;
  onTogglePlayPause: () => void;
  onClear: () => void;
  onRandomize: () => void;
  onTriggerExplosion: () => void;
  accentColor: string;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  config,
  onChangeConfig,
  isPaused,
  onTogglePlayPause,
  onClear,
  onRandomize,
  onTriggerExplosion,
  accentColor
}) => {
  
  // Custom Effect Selection Card Configuration
  const effectTypes: { type: EffectType; label: string; icon: React.ReactNode }[] = [
    { type: "snowfall", label: "Snowfall", icon: <Snowflake className="w-4 h-4" /> },
    { type: "rain", label: "Precipitation", icon: <CloudRain className="w-4 h-4" /> },
    { type: "aurora", label: "Aurora Lights", icon: <Waves className="w-4 h-4" /> },
    { type: "fireworks", label: "Pyrotechnics", icon: <Sparkles className="w-4 h-4" /> },
    { type: "stars", label: "Starlight Drift", icon: <Star className="w-4 h-4" /> },
    { type: "meteor_shower", label: "Meteor Shower", icon: <Zap className="w-4 h-4" /> },
    { type: "balloons", label: "Aerostatics", icon: <ArrowUpCircle className="w-4 h-4" /> },
    { type: "confetti", label: "Confetti", icon: <Grid className="w-4 h-4" /> },
    { type: "particles", label: "Ambient Dust", icon: <Atom className="w-4 h-4" /> },
  ];

  // Colors Palette Definition
  const colorThemes: { theme: ColorTheme; label: string; gradient: string }[] = [
    { theme: "luxury_gold", label: "Champagne Gold", gradient: "from-[#d4af37] to-[#8a6d20]" },
    { theme: "ice_blue", label: "Glacier Blue", gradient: "from-sky-400 to-indigo-600" },
    { theme: "neon_purple", label: "Cyber Violet", gradient: "from-fuchsia-500 to-indigo-900" },
    { theme: "cosmic_gold", label: "Deep Space", gradient: "from-purple-600 to-amber-400" },
    { theme: "forest_neon", label: "Aurora Mint", gradient: "from-[#00F5D4] to-[#40916C]" },
    { theme: "neon_rainbow", label: "Carnival Tones", gradient: "from-pink-500 via-teal-400 to-amber-400" },
    { theme: "ruby_red", label: "Velvet Crimson", gradient: "from-rose-500 to-red-900" },
    { theme: "emerald_wave", label: "Oceanic Jade", gradient: "from-teal-400 to-emerald-700" }
  ];

  const handleUpdate = (updates: Partial<SimulationConfig>) => {
    onChangeConfig({ ...config, ...updates });
  };

  const handleEffectChange = (type: EffectType) => {
    // Custom sweep audio effect on changing environment type
    playSimulationSweep();
    
    // Auto adapt appropriate gravity vectors on modal changes
    let gravity = config.gravity;
    if (type === "balloons") gravity = -0.7; // default upwards buoyancy
    else if (type === "rain") gravity = 4.2;   // fast rainfall
    else if (type === "stars") gravity = 0.02; // space float
    else if (type === "particles") gravity = 0.15; // light dust drift
    else if (gravity < 0) gravity = 1.0;       // reset downwards for others if previous was negative

    // Adjust count default to keep fluid simulation transitions
    let count = config.particleCount;
    if (type === "aurora") count = 150; // aurora ribbons perform best with lower node counts
    
    onChangeConfig({ ...config, effectType: type, gravity, particleCount: count });
  };

  const handleThemeChange = (theme: ColorTheme) => {
    playClickSound();
    handleUpdate({ colorTheme: theme });
  };

  const loadPreset = (preset: Preset) => {
    playSimulationSweep();
    onChangeConfig(preset.config);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-mono text-[11px] select-none text-neutral-300">
      
      {/* 1. Environment Presets Hub */}
      <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-md">
        <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3 block flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-neutral-400" />
          Climatology Presets
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((p) => {
            const isActive = PRESETS.find((pr) => pr.id === p.id)?.config.effectType === config.effectType && PRESETS.find((pr) => pr.id === p.id)?.config.colorTheme === config.colorTheme;
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className="px-2 py-1.5 rounded bg-white/5 border hover:bg-white/10 transition-all text-left truncate cursor-pointer text-[10px] uppercase font-mono tracking-wider"
                style={{ 
                  borderColor: isActive ? accentColor : "rgba(255,255,255,0.05)",
                  color: isActive ? "#FFFFFF" : "#a3a3a3"
                }}
                title={p.description}
              >
                {p.name.replace("Glacier ", "").replace("Stellar ", "").split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Simulation Modality Select Grid */}
      <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-md">
        <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3 block flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-neutral-400" />
          Renderer Modality
        </span>
        <div className="grid grid-cols-3 gap-2">
          {effectTypes.map((item) => {
            const isSelected = config.effectType === item.type;
            return (
              <button
                key={item.type}
                onClick={() => handleEffectChange(item.type)}
                className="group relative flex flex-col items-center justify-center py-3 px-1.5 rounded-xl border transition-all duration-300 bg-white/0 hover:bg-white/5 cursor-pointer"
                style={{ 
                  borderColor: isSelected ? accentColor : "rgba(255,255,255,0.05)",
                  backgroundColor: isSelected ? `${accentColor}0D` : "transparent"
                }}
              >
                <div 
                  className="mb-1.5 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: isSelected ? accentColor : "#a3a3a3" }}
                >
                  {item.icon}
                </div>
                <span className={`text-[9px] uppercase tracking-wider text-center transition-all ${isSelected ? "text-white font-bold" : "text-neutral-400"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Color Palettes Selection */}
      <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-md">
        <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3 block flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-neutral-400" />
          Color Spectrum Theme
        </span>
        <div className="grid grid-cols-2 gap-2">
          {colorThemes.map((item) => {
            const isSelected = config.colorTheme === item.theme;
            return (
              <button
                key={item.theme}
                onClick={() => handleThemeChange(item.theme)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all hover:bg-white/5 text-left cursor-pointer"
                style={{ 
                  borderColor: isSelected ? accentColor : "rgba(255,255,255,0.05)",
                  backgroundColor: isSelected ? "rgba(255,255,255,0.02)" : "transparent"
                }}
              >
                {/* Visual color bubble gradient preview */}
                <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${item.gradient} shrink-0 border border-white/20`} />
                <span className={`text-[9px] uppercase tracking-wider truncate ${isSelected ? "text-white font-bold" : "text-neutral-400"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Fine-Tuning Parameter Sliders Block */}
      <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-md space-y-4">
        <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-1 block flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-neutral-400" />
          Physics Hyper-Parameters
        </span>

        {/* Global Particle Density / Intensity Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-neutral-400">GLOBAL INTENSITY</span>
            <span style={{ color: accentColor }}>{config.intensity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={config.intensity}
            onChange={(e) => {
              playClickSound();
              handleUpdate({ intensity: parseInt(e.target.value) });
            }}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            style={{ accentColor: accentColor }}
          />
        </div>

        {/* Particle Count Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-neutral-400">PARTICLE COUNT</span>
            <span style={{ color: accentColor }}>{config.particleCount} QTY</span>
          </div>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={config.particleCount}
            onChange={(e) => {
              playClickSound();
              handleUpdate({ particleCount: parseInt(e.target.value) });
            }}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            style={{ accentColor: accentColor }}
          />
        </div>

        {/* Wind Speed (Horizontal) Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-neutral-400">WIND VELOCITY</span>
            <span style={{ color: accentColor }}>
              {config.windSpeed === 0 ? "STILL" : config.windSpeed > 0 ? `+${config.windSpeed} R` : `${config.windSpeed} L`}
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={config.windSpeed}
            onChange={(e) => {
              playClickSound();
              handleUpdate({ windSpeed: parseFloat(e.target.value) });
            }}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            style={{ accentColor: accentColor }}
          />
        </div>

        {/* Gravity (Vertical) Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-neutral-400">GRAVITY / BUOYANCY</span>
            <span style={{ color: accentColor }}>
              {config.gravity === 0 ? "ZERO-G" : config.gravity > 0 ? `${config.gravity} DOWN` : `${Math.abs(config.gravity)} ASCENT`}
            </span>
          </div>
          <input
            type="range"
            min="-4"
            max="5"
            step="0.2"
            value={config.gravity}
            onChange={(e) => {
              playClickSound();
              handleUpdate({ gravity: parseFloat(e.target.value) });
            }}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            style={{ accentColor: accentColor }}
          />
        </div>

        {/* Particle Size (Diameter) Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-neutral-400">PRIMARY RADIUS</span>
            <span style={{ color: accentColor }}>{config.particleSize} PX</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={config.particleSize}
            onChange={(e) => {
              playClickSound();
              handleUpdate({ particleSize: parseFloat(e.target.value) });
            }}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            style={{ accentColor: accentColor }}
          />
        </div>

        {/* Time dilation / speedMultiplier Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-neutral-400">CINEMATIC DILATION</span>
            <span style={{ color: accentColor }}>{config.speedMultiplier.toFixed(1)}x SPEED</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={config.speedMultiplier}
            onChange={(e) => {
              playClickSound();
              handleUpdate({ speedMultiplier: parseFloat(e.target.value) });
            }}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            style={{ accentColor: accentColor }}
          />
        </div>

        {/* Orbit coordinate 3D perspective switcher */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">3D Coordinate Orbit</span>
            <span className="text-[9px] text-neutral-500 font-mono">ENFORCE PERSPECTIVE LAYERING</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              handleUpdate({ is3D: !config.is3D });
            }}
            className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-neutral-800"
            style={{ 
              backgroundColor: config.is3D ? accentColor : "rgb(38 38 38)" 
            }}
          >
            <span
              className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              style={{ transform: config.is3D ? "translateX(20px)" : "translateX(0px)" }}
            />
          </button>
        </div>
      </div>

      {/* 5. Physical Dashboard Control Buttons Group */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => {
            playClickSound();
            onTogglePlayPause();
          }}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase transition-all cursor-pointer shadow-lg"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              RESUME
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              SUSPEND
            </>
          )}
        </button>

        <button
          onClick={() => {
            playClickSound();
            onTriggerExplosion();
          }}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 hover:border-white/15 bg-gradient-to-r from-neutral-900 to-neutral-800 text-amber-400 hover:text-amber-300 font-bold uppercase transition-all cursor-pointer shadow-lg"
          title="Fires a heavy manual fireworks detonation cloud centered on viewport grid coordinates"
        >
          <Bomb className="w-3.5 h-3.5 text-amber-400" />
          BURST IGNITE
        </button>

        <button
          onClick={onRandomize}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/5 bg-white/0 hover:bg-white/5 hover:border-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          RANDOMIZE
        </button>

        <button
          onClick={onClear}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/5 bg-white/0 hover:bg-white/5 hover:border-white/10 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          RESET FIELD
        </button>
      </div>

    </div>
  );
};
