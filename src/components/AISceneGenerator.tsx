/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Terminal, ArrowRight, Loader2, Info } from "lucide-react";
import { SimulationConfig, ColorTheme, EffectType, AISceneResponse } from "../types";
import { playClickSound, playAISuccessChord } from "../utils/audio";

interface AISceneGeneratorProps {
  onApplyConfig: (partial: Partial<SimulationConfig>, aiRecommendation: string) => void;
  accentColor: string;
}

export const AISceneGenerator: React.FC<AISceneGeneratorProps> = ({ 
  onApplyConfig, 
  accentColor 
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(
    "Initiate atmospheric prompt vector. Our integrated Gemini AI core will automatically synthesize corresponding kinematical gravity, density, and kinetic color margins."
  );

  const samplePrompts = [
    { label: "Winter Storm", text: "A heavy arctic glacier snowstorm blowing east at high speed" },
    { label: "Galaxy Birth", text: "A deep cosmic nebula stardust nursery floating in zero-gravity" },
    { label: "Gala Party", text: "A festive birthday multi-colored confetti festival with soft upward drafts" },
    { label: "Solar Flare", text: "Vibrant emerald northern solar aurora lights weaving over sky planes" },
  ];

  const handleGenerate = async (textToUse: string) => {
    if (!textToUse.trim()) return;
    
    playClickSound();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/simulation/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToUse }),
      });

      if (!response.ok) {
        throw new Error("Simulation compiler reported a bad response.");
      }

      const data: AISceneResponse = await response.json();
      
      // Update simulator config with AI-assigned settings
      onApplyConfig({
        effectType: data.effectType,
        intensity: data.intensity,
        windSpeed: data.windSpeed,
        gravity: data.gravity,
        particleSize: data.particleSize,
        particleCount: data.particleCount,
        colorTheme: data.colorTheme,
        is3D: true // enforce beautiful orbits space by default
      }, data.recommendation);

      setRecommendation(data.recommendation);
      playAISuccessChord();
    } catch (err: any) {
      console.error(err);
      setError("AI generation failed or timed out. Falling back to default preset.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(prompt);
  };

  return (
    <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md select-none font-mono text-neutral-300">
      {/* HUD Telemetry label */}
      <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3 block flex items-center gap-1.5 border-b border-white/5 pb-2.5">
        <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
        Atmospheric Generative Engine
      </span>

      {/* Suggestion command chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => {
              setPrompt(p.text);
              handleGenerate(p.text);
            }}
            className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] uppercase tracking-wider transition-all disabled:opacity-40 select-none cursor-pointer border border-white/5"
            style={{ 
              borderColor: prompt === p.text ? accentColor : "rgba(255,255,255,0.05)"
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          placeholder="e.g. A hyper-realistic rainstorm under a heavy volcanic twilight..."
          className="flex-1 bg-black/40 border border-white/15 focus:border-[#D4AF37]/50 rounded-lg px-3.5 py-3 text-xs tracking-wider outline-none disabled:opacity-50 text-white placeholder-neutral-500 font-mono transition-colors"
          style={{ 
            borderColor: isLoading ? accentColor : "rgba(255, 255, 255, 0.15)"
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="h-10 px-4 rounded-lg flex items-center justify-center transition-all bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 cursor-pointer text-black font-semibold text-xs shrink-0 select-none uppercase tracking-widest gap-1.5"
          style={{ 
            backgroundColor: !prompt.trim() ? "transparent" : accentColor,
            color: !prompt.trim() ? "#525252" : "#000"
          }}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5" />
              SENS
            </>
          )}
        </button>
      </form>

      {/* AI Recommendation Quote Box detailing values */}
      {error ? (
        <div className="p-3.5 bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs rounded-lg flex items-start gap-2 animate-[shake_0.5s_ease-in-out]">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{error}</p>
        </div>
      ) : (
        <div 
          className="p-4 bg-black/30 border border-white/5 rounded-lg flex items-start gap-3 text-xs relative overflow-hidden transition-all duration-500"
          style={{ 
            borderLeft: `3px solid ${isLoading ? "rgba(255,255,255,0.4)" : accentColor}` 
          }}
        >
          <Info className="w-4 h-4 shrink-0 text-neutral-500 mt-0.5" />
          <div className="space-y-1.5 flex-1 select-text">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">
              {isLoading ? "AETHER INTELLECT RE-SYNTHESIS ACTIVE..." : "ORCHESTRATOR SPECS RECOMMENDATION"}
            </span>
            <p className={`leading-relaxed transition-all duration-300 ${isLoading ? "text-neutral-500 italic blur-[1px]" : "text-neutral-400"}`}>
              {recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
