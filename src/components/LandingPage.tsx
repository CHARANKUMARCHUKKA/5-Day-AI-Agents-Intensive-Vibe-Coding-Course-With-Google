/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Wind, 
  Sparkles, 
  Cpu, 
  Layers, 
  Compass, 
  Volume2, 
  Play, 
  ArrowRight,
  ShieldCheck, 
  Hourglass,
  Gauge
} from "lucide-react";
import { playClickSound } from "../utils/audio";

interface LandingPageProps {
  onLaunch: () => void;
  onSelectPreset: (presetId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, onSelectPreset }) => {

  const bentoFeatures = [
    {
      icon: <Layers className="w-5 h-5 text-[#D4AF37]" />,
      title: "Interactive 3D Kinematics",
      description: "Atmospheric elements are projected in dynamic 3D focal space with realistic air-resistance, buoyancy multipliers, and gravitational field interactions."
    },
    {
      icon: <Cpu className="w-5 h-5 text-sky-400" />,
      title: "Built-In Gemini AI",
      description: "Generate corresponding microparticle setups dynamically from complex textual prompts like 'galactic event' or 'cyberpunk typhoons' instantly."
    },
    {
      icon: <Wind className="w-5 h-5 text-fuchsia-400" />,
      title: "Electrostatic Drifts",
      description: "Touch-displacement creates dynamic wind repulsion forces. Particles respond organically to cursor hovers and click-based meteor flares."
    },
    {
      icon: <Gauge className="w-5 h-5 text-emerald-400" />,
      title: "Avionics Telemetry HUD",
      description: "Real-time measurements track system frame rates (FPS), active entity indexes, and computation draw latency down to the millisecond."
    },
    {
      icon: <Compass className="w-5 h-5 text-[#D4AF37]" />,
      title: "Focal Orbit Perspective",
      description: "Rotate and align virtual cameras with intuitive mouse drags to alter global yaw, pitch orientations, and depth focal margins."
    },
    {
      icon: <Volume2 className="w-5 h-5 text-rose-400" />,
      title: "Cybernetic soundscapes",
      description: "Synchronized synth sweep and chord oscillations are generated dynamically using standard browser Web Audio oscillators on interactions."
    },
  ];

  const showcases = [
    { id: "zen_garden", name: "Zen Drift", theme: "gold", desc: "Warm champagne golden embers", accent: "#D4AF37" },
    { id: "titanium_blizzard", name: "Titanium storm", theme: "blue", desc: "Extreme Arctic blizzard", accent: "#70D6FF" },
    { id: "cyberpunk_downpour", name: "Digirain v9", theme: "purple", desc: "Cyberpunk neon rain", accent: "#9D4EDD" },
    { id: "emerald_borealis", name: "Aurora light", theme: "green", desc: "Green magnetospheric band", accent: "#00F5D4" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      {/* Background radial soft light blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Tesla style pill badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 animate-[pulse_1.5s_infinite]" />
          AETHER PHYSICAL SIMULATION SUITE
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-400 max-w-4xl text-center leading-[1.1] mb-6"
        >
          Orchestrate the physical laws of the <span className="text-[#D4AF37]">Atmosphere</span>.
        </motion.h1>

        {/* Descriptive intro paragraph */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="text-sm md:text-base text-neutral-400 font-mono tracking-wide max-w-2xl leading-relaxed mb-10 text-center"
        >
          An interactive laboratory built to model particle kinetics, solar flares, and meteorological structures in real-time 3D coordinate systems. Powered by server-side Gemini AI.
        </motion.p>

        {/* Launch button cluster */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <button
            onClick={() => {
              playClickSound();
              onLaunch();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#AA8844] to-[#D4AF37] hover:brightness-110 text-black text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#D4AF37]/15 select-none cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            Launch Studio Portal
          </button>

          <a
            href="#features_grid"
            onClick={playClickSound}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 select-none cursor-pointer"
          >
            Examine Mechanics
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Dynamic Horizontal preset showcase cards */}
        <div className="w-full border-t border-white/5 pt-12">
          <p className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase mb-8">
            Click to instantiate fine-tuned atmospheric states
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {showcases.map((sc, idx) => (
              <motion.div
                key={sc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                onClick={() => {
                  playClickSound();
                  onSelectPreset(sc.id);
                }}
                className="group relative bg-neutral-900/45 hover:bg-neutral-900 border border-white/5 hover:border-white/15 rounded-xl p-5 text-left cursor-pointer transition-all duration-300 backdrop-blur-sm shadow-xl"
              >
                {/* Visual Accent Corner Pipe */}
                <div 
                  className="absolute top-0 right-0 w-8 h-[2px] rounded-full transition-all duration-300 opacity-60 group-hover:opacity-100"
                  style={{ backgroundColor: sc.accent }}
                />
                
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-1 block">
                  Preset Mode {idx + 1}
                </span>

                <h3 className="text-sm font-semibold tracking-wide text-white group-hover:text-neutral-200 transition-colors mb-1.5 flex items-center gap-1.5 font-sans">
                  {sc.name}
                </h3>

                <p className="text-xs text-neutral-400 line-clamp-1 font-mono tracking-tight leading-relaxed">
                  {sc.desc}
                </p>

                {/* Micro layout indicator line */}
                <div className="mt-4 pt-3 border-t border-white/5 group-hover:border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500 group-hover:text-white transition-all">
                  <span>LOAD ENVIRONMENT</span>
                  <ArrowRight className="w-3 h-3 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features_grid" className="relative max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="max-w-2xl mb-16 text-left">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase mb-3 block">
            AETHER FLUID DYNAMICS ENGINE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans leading-tight">
            High-Performance rendering meets advanced physical math.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bentoFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group relative overflow-hidden bg-neutral-900/30 border border-white/5 hover:border-white/10 hover:bg-neutral-900/50 rounded-2xl p-6 transition-all duration-300"
            >
              {/* Glowing backlighting bubble on card hover */}
              <div className="absolute -top-1/4 -right-1/4 w-[120px] h-[120px] bg-white/[0.01] group-hover:bg-white/[0.04] rounded-full blur-2xl transition-all duration-500" />
              
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {feat.icon}
              </div>

              <h3 className="text-base font-semibold text-white tracking-wide mb-2.5 font-sans">
                {feat.title}
              </h3>

              <p className="text-xs text-neutral-400 font-mono tracking-wide leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 border-t border-white/5 bg-black/20">
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase mb-3 text-center">
            VALUED BY CREATORS & ENGINEERS
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white font-sans text-center">
            Praise for Aether Studio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Quote 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between bg-neutral-900/35 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
          >
            <p className="text-xs text-neutral-300 tracking-wide font-mono leading-relaxed mb-6 italic">
              "The kinetic wind deflection algorithms are strikingly realistic. We used Aether Studio to visualize atmospheric density constraints for our sci-fi cinema trailers. The real-time camera orbits are phenomenal."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#CCAA55] flex items-center justify-center text-black font-bold font-mono text-[10px]">
                MR
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-sans">Marcus Vance</h4>
                <p className="text-[10px] font-mono text-neutral-500 uppercase">Director // Vanguard VFX Films</p>
              </div>
            </div>
          </motion.div>

          {/* Quote 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between bg-neutral-900/35 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
          >
            <p className="text-xs text-neutral-300 tracking-wide font-mono leading-relaxed mb-6 italic">
              "Integrating server-side Gemini AI content mapping allowed our digital design team to construct rapid atmospheric proofs-of-concept in seconds. Dynamic soundscapes give key clicks a majestic feedback vibe."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-sky-700 flex items-center justify-center text-black font-bold font-mono text-[10px]">
                EK
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-sans">Elena Khasanov</h4>
                <p className="text-[10px] font-mono text-neutral-500 uppercase">Interactive Architect // Tesla Labs</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SpaceX / Apple inspired futuristic elegant minimal footer */}
      <footer className="relative border-t border-white/5 py-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <span className="text-xs font-bold tracking-[0.25em] text-white">
              AETHER ENVIRONMENTAL LABORATORY
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">
              REVOLUTIONIZING CLIMATOLOGICAL VISUAL MECHANICS // ALL RIGHTS PERSISTED © 2026
            </span>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase select-none">
            <a href="#features_grid" onClick={playClickSound} className="hover:text-white transition-colors">PHYSICS</a>
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
            <a href="#" className="hover:text-white transition-colors" onClick={() => { playClickSound(); onLaunch(); }}>PORTAL</a>
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
            <span className="text-neutral-500">SYSTEM SECURE STATUS: OK</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
