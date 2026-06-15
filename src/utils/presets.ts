/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Preset } from "../types";

export const PRESETS: Preset[] = [
  {
    id: "zen_garden",
    name: "Zen Garden Ember Drift",
    description: "Delicate golden ambient ember particles suspended in high thermal convection, slowly rotating and reflecting dynamic depth fields.",
    config: {
      effectType: "particles",
      intensity: 35,
      windSpeed: 0.8,
      gravity: 0.1,
      particleSize: 6,
      particleCount: 220,
      colorTheme: "luxury_gold",
      speedMultiplier: 0.4,
      is3D: true,
    },
    citation: "Aesthetic Core v1.2"
  },
  {
    id: "titanium_blizzard",
    name: "Titanium Glacier Blizzard",
    description: "Rapidly falling high-velocity crystalline flakes drifting on a horizontal glacier vector, casting sharp glacier-blue lighting silhouettes.",
    config: {
      effectType: "snowfall",
      intensity: 85,
      windSpeed: 6.5,
      gravity: 2.2,
      particleSize: 4.5,
      particleCount: 650,
      colorTheme: "ice_blue",
      speedMultiplier: 1.3,
      is3D: true,
    },
    citation: "AeroDynamics v4.0"
  },
  {
    id: "cyberpunk_downpour",
    name: "Cyberpunk Digirain",
    description: "Extreme hyper-density rain strings falling near terminal velocities, refracting high-voltage electric purple and magenta glow profiles.",
    config: {
      effectType: "rain",
      intensity: 95,
      windSpeed: -4.0,
      gravity: 4.5,
      particleSize: 1.8,
      particleCount: 880,
      colorTheme: "neon_purple",
      speedMultiplier: 1.6,
      is3D: true,
    },
    citation: "NeonGrid Core"
  },
  {
    id: "nebula_nursery",
    name: "Gemini Stellar Nursery",
    description: "Zero-gravity stardust stellar nurseries drifting slowly in infinite 3D rotational coordinate fields, glimmering at deep spectrum cycles.",
    config: {
      effectType: "stars",
      intensity: 75,
      windSpeed: -0.2,
      gravity: 0.0,
      particleSize: 2.8,
      particleCount: 750,
      colorTheme: "cosmic_gold",
      speedMultiplier: 0.25,
      is3D: true,
    },
    citation: "Nebula Engine v9"
  },
  {
    id: "emerald_borealis",
    name: "Emerald Aurora Magnetosphere",
    description: "Weaving streams of solar plasma solar winds drifting across a slow organic wave curve, illuminating the digital atmosphere with emerald luminescence.",
    config: {
      effectType: "aurora",
      intensity: 45,
      windSpeed: 1.2,
      gravity: 0.05,
      particleSize: 12,
      particleCount: 160,
      colorTheme: "forest_neon",
      speedMultiplier: 0.6,
      is3D: true,
    },
    citation: "Helios Solar Physics"
  },
  {
    id: "meteor_rush",
    name: "Helion Meteor Shower",
    description: "Supercharged atmospheric meteor trails burning at steep diagonal vectors, leaving trails with deep amber tails.",
    config: {
      effectType: "meteor_shower",
      intensity: 60,
      windSpeed: -7.5,
      gravity: 3.5,
      particleSize: 3.2,
      particleCount: 240,
      colorTheme: "luxury_gold",
      speedMultiplier: 1.8,
      is3D: true,
    },
    citation: "Orion Belt Core"
  },
  {
    id: "gala_burst",
    name: "New Year Celebration Burst",
    description: "Sequential pyrotechnic charges firing from central cores, expanding outward in high-frequency multi-saturated color shards.",
    config: {
      effectType: "fireworks",
      intensity: 75,
      windSpeed: 0.5,
      gravity: 0.9,
      particleSize: 3.0,
      particleCount: 600,
      colorTheme: "neon_rainbow",
      speedMultiplier: 1.1,
      is3D: true,
    },
    citation: "Tokyo Pyro Tech"
  },
  {
    id: "aerostatic_ascent",
    name: "Buoyant Aerostatic Ascent",
    description: "Lighter-than-air vacuum cells slowly climbing against gravity, swayed softly by horizontal air drafts and fluctuating string physics.",
    config: {
      effectType: "balloons",
      intensity: 30,
      windSpeed: 1.5,
      gravity: -0.7,
      particleSize: 16.0,
      particleCount: 90,
      colorTheme: "ruby_red",
      speedMultiplier: 0.7,
      is3D: true,
    },
    citation: "Stratos Air v0.4"
  },
  {
    id: "carnival_cascade",
    name: "Prismatic Carnival Cascade",
    description: "Slow tumbling confetti squares drifting and twisting, reflecting ambient lights across a wide spectrum of visual colors.",
    config: {
      effectType: "confetti",
      intensity: 65,
      windSpeed: 2.2,
      gravity: 1.2,
      particleSize: 9.0,
      particleCount: 380,
      colorTheme: "neon_rainbow",
      speedMultiplier: 0.9,
      is3D: true,
    },
    citation: "Carnival Rio v11"
  }
];
