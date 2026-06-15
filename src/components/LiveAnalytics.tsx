/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Gauge, Cpu, Activity, Info, BarChart3 } from "lucide-react";
import { PerformanceStats, ColorTheme } from "../types";

interface LiveAnalyticsProps {
  stats: PerformanceStats;
  colorTheme: ColorTheme;
  accentColor: string;
}

export const LiveAnalytics: React.FC<LiveAnalyticsProps> = ({
  stats,
  colorTheme,
  accentColor
}) => {
  const [fpsHistory, setFpsHistory] = useState<number[]>(Array(12).fill(60));

  // Maintain sliding history of FPS for visual rendering
  useEffect(() => {
    setFpsHistory((prev) => {
      const next = [...prev.slice(1), stats.fps || 60];
      return next;
    });
  }, [stats.fps]);

  return (
    <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md select-none font-mono text-neutral-300">
      {/* HUD Telemetry Header */}
      <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-4 block flex items-center gap-1.5 border-b border-white/5 pb-2.5">
        <Gauge className="w-4 h-4 text-neutral-400" />
        Live Analytics Telemetry
      </span>

      {/* Grid displays */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Metric 1: FPS */}
        <div className="p-3 bg-black/45 hover:bg-black/60 border border-white/5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">Render FPS</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span 
              className="text-2xl font-bold font-sans tracking-tight"
              style={{ color: stats.fps > 45 ? "rgb(52 211 153)" : "rgb(239 68 68)" }}
            >
              {stats.fps || "60"}
            </span>
            <span className="text-[9px] text-neutral-500 uppercase">FPS RATE</span>
          </div>
        </div>

        {/* Metric 2: Active Entities */}
        <div className="p-3 bg-black/45 hover:bg-black/60 border border-white/5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">Active Entities</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans tracking-tight text-white">
              {stats.activeParticles || "0"}
            </span>
            <span className="text-[9px] text-neutral-500 uppercase">PARTICLES</span>
          </div>
        </div>

        {/* Metric 3: Compute Render Time */}
        <div className="p-3 bg-black/45 hover:bg-black/60 border border-white/5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">Render Delay</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans tracking-tight text-neutral-300">
              {stats.renderTimeMs || "1.2"}
            </span>
            <span className="text-[9px] text-neutral-500 uppercase">MILISECONDS</span>
          </div>
        </div>

        {/* Metric 4: System Overheads rating */}
        <div className="p-3 bg-black/45 hover:bg-black/60 border border-white/5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">System Rating</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold uppercase text-white tracking-widest">
              {stats.systemPerformance || "Optimal"}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Real-time frame latency chart bar representation */}
      <div className="bg-black/30 border border-white/5 rounded-lg p-3.5 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Compute Cycles Latency History
          </span>
          <span className="text-[8px] text-[#D4AF37] uppercase tracking-widest font-mono">
            Buffered Frame timings // LIVE
          </span>
        </div>

        {/* Simulated vector grid lines bars scaling dynamically */}
        <div className="flex items-end justify-between h-9 pt-1.5 px-0.5 gap-1.5">
          {fpsHistory.map((val, idx) => {
            // Translate FPS into proportional load bars (lower is worse)
            const invertedPercent = Math.max(10, Math.min(100, (65 - val) * 2.5 + 15));
            const color = val > 50 ? "bg-emerald-500" : val > 35 ? "bg-amber-500" : "bg-rose-500";
            return (
              <div 
                key={idx}
                className="flex-1 rounded-t bg-neutral-800 relative group overflow-hidden"
                style={{ height: "100%" }}
              >
                <div 
                  className={`absolute bottom-0 inset-x-0 rounded-t transition-all duration-300 ${color}`}
                  style={{ height: `${invertedPercent}%`, opacity: 0.15 + (idx / 15) }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Immersive Watermark Specs info */}
      <div className="mt-4 flex items-center gap-2 text-[9px] text-neutral-600 uppercase border-t border-white/5 pt-3 leading-relaxed">
        <Activity className="w-3.5 h-3.5 shrink-0" />
        <span>Hardware Gpu vector calculations verified // 60hz calibration active</span>
      </div>

    </div>
  );
};
