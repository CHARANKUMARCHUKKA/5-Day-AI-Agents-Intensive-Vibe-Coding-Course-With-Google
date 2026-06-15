/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EffectType =
  | "snowfall"
  | "balloons"
  | "rain"
  | "fireworks"
  | "confetti"
  | "stars"
  | "meteor_shower"
  | "aurora"
  | "particles";

export type ColorTheme =
  | "luxury_gold"
  | "ice_blue"
  | "neon_purple"
  | "cosmic_gold"
  | "forest_neon"
  | "neon_rainbow"
  | "ruby_red"
  | "emerald_wave";

export interface SimulationConfig {
  effectType: EffectType;
  intensity: number;      // 1 to 100
  windSpeed: number;      // -10 to 10
  gravity: number;        // -5 to 5
  particleSize: number;   // 1 to 20
  particleCount: number;  // 50 to 1000
  colorTheme: ColorTheme;
  speedMultiplier: number; // 0.1 to 3.0 (for cinematic time control)
  is3D: boolean;          // Toggle for deep 3D coordinate orbit & depth-sorting
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  config: SimulationConfig;
  citation?: string;
}

export interface PerformanceStats {
  activeParticles: number;
  fps: number;
  renderTimeMs: number;
  systemPerformance: "Optimal" | "Good" | "Heavy" | "Overloaded";
  status: "Running" | "Paused" | "Iterating" | "Stabilizing";
}

export interface SoundState {
  enabled: boolean;
  volume: number; // 0 to 1
}

export interface AISceneResponse {
  effectType: EffectType;
  intensity: number;
  windSpeed: number;
  gravity: number;
  particleSize: number;
  particleCount: number;
  colorTheme: ColorTheme;
  recommendation: string;
}
