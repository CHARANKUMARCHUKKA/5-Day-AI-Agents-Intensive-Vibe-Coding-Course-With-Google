/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { SimulationConfig, PerformanceStats, EffectType, ColorTheme } from "../types";
import { playSparkSound } from "../utils/audio";

interface CanvasProps {
  config: SimulationConfig;
  onPerformanceUpdate: (stats: PerformanceStats) => void;
  isPaused: boolean;
  interactiveExplosionTrigger: number; // Increment to trigger a manual blast
}

// Particle class definition representing 3D spatial entity
class Particle {
  x: number; // 3D coordinate space (-500 to 500)
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  opacity: number;
  life: number;     // 0 to 1
  decay: number;    // rate of life drop
  angle: number;    // rotation angle for tumbling elements like confetti/snow
  spinSpeed: number;
  phase: number;    // sine wave starting offset
  extraData: any;   // custom details per type (e.g. firework trail, balloon string deflection)

  constructor(width: number, height: number, type: EffectType, theme: ColorTheme, customX?: number, customY?: number) {
    this.phase = Math.random() * Math.PI * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = (Math.random() - 0.5) * 0.1;
    this.life = 1.0;
    this.decay = 0.002 + Math.random() * 0.005;
    
    // Position allocation
    if (customX !== undefined && customY !== undefined) {
      // Projected click initialization
      this.x = customX - width / 2;
      this.y = customY - height / 2;
      this.z = (Math.random() - 0.5) * 100;
    } else {
      // Screen distributed initialization
      this.x = (Math.random() - 0.5) * width * 1.5;
      this.z = (Math.random() - 0.5) * 800; // Deep depth spectrum

      if (type === "balloons") {
        // Birth at bottom-boundary
        this.y = height / 2 + 50 + Math.random() * 200;
      } else if (type === "fireworks") {
        // Spark clouds or ambient flares
        this.y = (Math.random() - 0.5) * height;
        this.life = Math.random();
      } else if (type === "stars") {
        this.y = (Math.random() - 0.5) * height * 1.5;
      } else {
        // Rain/Snow fall from top boundary
        this.y = -height / 2 - 100 - Math.random() * 300;
      }
    }

    // Default physical speeds
    this.vx = (Math.random() - 0.5) * 1.0;
    this.vy = 0;
    this.vz = (Math.random() - 0.5) * 0.5;
    this.size = 2 + Math.random() * 5;
    this.opacity = 0.4 + Math.random() * 0.6;
    this.color = "#ffffff";
    this.extraData = {};

    this.selectThemeColor(theme, type);
    this.initializeEffectVectors(type);
  }

  // Refines matching theme palettes
  selectThemeColor(theme: ColorTheme, type: EffectType) {
    const colorsMap: Record<ColorTheme, string[]> = {
      luxury_gold: ["#D4AF37", "#FFD700", "#FFF3CD", "#C5A059", "#AA8844"],
      ice_blue: ["#70D6FF", "#00B4D8", "#ADE8F4", "#FFFFFF", "#E0F2FE"],
      neon_purple: ["#FF007F", "#9D4EDD", "#E0AAFF", "#3A0CA3", "#C77DFF"],
      cosmic_gold: ["#FFD700", "#AA00FF", "#3F00FF", "#FFFFFF", "#FFDF00"],
      forest_neon: ["#52B788", "#74C69D", "#00F5D4", "#D8F3DC", "#40916C"],
      neon_rainbow: ["#FF0054", "#9E00FF", "#00F5D4", "#FFBD00", "#70E000"],
      ruby_red: ["#E63946", "#FF4D6D", "#9B2226", "#FF758F", "#FFCCD5"],
      emerald_wave: ["#06D6A0", "#118AB2", "#073B4C", "#00F5D4", "#A8DADC"]
    };

    const palette = colorsMap[theme] || colorsMap.luxury_gold;
    this.color = palette[Math.floor(Math.random() * palette.length)];

    // Particular color logic overrides
    if (type === "snowfall") {
      // Keep snow mostly pale with structural theme tint
      this.color = Math.random() > 0.35 ? "#FFFFFF" : palette[0];
    } else if (type === "stars") {
      this.color = Math.random() > 0.8 ? palette[0] : "#FFFFFF";
    }
  }

  // Initializes trajectories based on kinematics and drag coefs
  initializeEffectVectors(type: EffectType) {
    if (type === "snowfall") {
      this.vy = 0.8 + Math.random() * 1.5;
      this.vz = (Math.random() - 0.5) * 0.2;
    } else if (type === "rain") {
      this.vy = 8.0 + Math.random() * 5.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.z = (Math.random() - 0.5) * 300; // shallow depth for fast rendering focus
    } else if (type === "balloons") {
      this.vy = -(1.0 + Math.random() * 1.5);
      this.vx = (Math.random() - 0.5) * 0.5;
      this.extraData.stringPhase = Math.random() * Math.PI * 2;
    } else if (type === "stars") {
      this.vy = (Math.random() - 0.5) * 0.05;
      this.vz = (Math.random() - 0.5) * 0.02;
    } else if (type === "meteor_shower") {
      // Extremely quick diagonal trajectory
      this.vx = -8 - Math.random() * 6;
      this.vy = 6 + Math.random() * 5;
      this.z = (Math.random() - 0.5) * 200;
    } else if (type === "particles") {
      this.vy = (Math.random() - 0.5) * 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vz = (Math.random() - 0.5) * 0.4;
    }
  }
}

export const SimulationCanvas: React.FC<CanvasProps> = ({
  config,
  onPerformanceUpdate,
  isPaused,
  interactiveExplosionTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  
  // Custom orbital properties
  const [camera, setCamera] = useState({ pitch: 0.1, yaw: 0, zoom: 1.0 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0, isOver: false });

  // Custom live stats calculating mechanics
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const lastMetricTimeRef = useRef(performance.now());

  // Trigger manual radial pyrotechnics detonation on click
  const triggerManualExplosion = (clientX?: number, clientY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Center coordinates as fallback if no coord is passed
    const spawnX = clientX !== undefined ? clientX : canvas.width / 2;
    const spawnY = clientY !== undefined ? clientY : canvas.height / 3;

    playSparkSound();

    // Create central flash expansion
    const flashParticle = new Particle(canvas.width, canvas.height, "fireworks", config.colorTheme, spawnX, spawnY);
    flashParticle.size = config.particleSize * 3;
    flashParticle.color = "#FFFFFF";
    flashParticle.life = 1.0;
    flashParticle.decay = 0.05;
    particlesRef.current.push(flashParticle);

    const colorsMap: Record<ColorTheme, string[]> = {
      luxury_gold: ["#FFD700", "#FFDF00", "#FFA500", "#FFF", "#AA8844"],
      ice_blue: ["#70D6FF", "#52B788", "#ADE8F4", "#FFF", "#E0F2FE"],
      neon_purple: ["#FF007F", "#9D4EDD", "#E0AAFF", "#9900EF"],
      cosmic_gold: ["#FFD700", "#AA00FF", "#00F5D4", "#FFFF00"],
      forest_neon: ["#00F5D4", "#52B788", "#74C69D", "#D8F3DC"],
      neon_rainbow: ["#FF0054", "#9E00FF", "#00F5D4", "#FFBD00", "#70E000"],
      ruby_red: ["#E63946", "#FF4D6D", "#D62828", "#FF758F"],
      emerald_wave: ["#06D6A0", "#118AB2", "#00F5D4", "#04F6E2"]
    };
    const palette = colorsMap[config.colorTheme] || colorsMap.luxury_gold;

    // Create 40-70 radial shards expanding outward in 3D coordinate spherical system
    const count = 40 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const p = new Particle(canvas.width, canvas.height, "fireworks", config.colorTheme, spawnX, spawnY);
      
      const speed = 4 + Math.random() * 6;
      const angleTheta = Math.random() * Math.PI * 2;
      const anglePhi = Math.acos(Math.random() * 2 - 1); // 3D sphere point distribution

      p.vx = speed * Math.sin(anglePhi) * Math.cos(angleTheta);
      p.vy = speed * Math.sin(anglePhi) * Math.sin(angleTheta) - 2; // direct upward inertia boost
      p.vz = speed * Math.cos(anglePhi);
      
      p.size = (0.4 + Math.random() * 0.6) * config.particleSize * 1.5;
      p.life = 1.0;
      p.decay = 0.015 + Math.random() * 0.02;
      p.color = palette[Math.floor(Math.random() * palette.length)];
      p.extraData.sparkTrail = [];
      
      particlesRef.current.push(p);
    }
  };

  // Monitor interactive triggers triggered externally
  useEffect(() => {
    if (interactiveExplosionTrigger > 0) {
      triggerManualExplosion();
    }
  }, [interactiveExplosionTrigger]);

  // Adjust canvas dimensions dynamically on panel resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Seed initial particles dynamically matching width
      reseedParticles(rect.width, rect.height, true);
    };

    const container = containerRef.current;
    let observer: ResizeObserver | null = null;
    if (container) {
      observer = new ResizeObserver(() => {
        handleResize();
      });
      observer.observe(container);
    }

    // Capture first sizing trigger
    setTimeout(handleResize, 100);

    return () => {
      if (observer && container) {
        observer.unobserve(container);
      }
    };
  }, [config.effectType]); // Re-seed on scenario switch too

  // Clear and reseed based on physical density rules
  const reseedParticles = (width: number, height: number, pruneOnly = false) => {
    const targetCount = Math.floor(config.particleCount * (config.intensity / 75));
    const current = particlesRef.current;

    if (pruneOnly) {
      if (current.length > targetCount) {
        particlesRef.current = current.slice(0, targetCount);
      }
    } else {
      particlesRef.current = [];
      const seedCount = Math.min(targetCount, 400); // initial allocation limit to maintain UI performance
      for (let i = 0; i < seedCount; i++) {
        particlesRef.current.push(new Particle(width, height, config.effectType, config.colorTheme));
      }
    }
  };

  // Main rendering simulation clock loop
  useEffect(() => {
    let frameId: number;
    
    const runFrame = (time: number) => {
      // Compute render cycles parameters
      const startMs = performance.now();
      const canvas = canvasRef.current;
      if (!canvas) {
        frameId = requestAnimationFrame(runFrame);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        frameId = requestAnimationFrame(runFrame);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Calculate relative delta time to smooth frame rate drops
      const deltaSec = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      // Compute FPS metrics periodically
      frameCountRef.current++;
      if (time - lastMetricTimeRef.current >= 1000) {
        const measuredFps = Math.round((frameCountRef.current * 1000) / (time - lastMetricTimeRef.current));
        frameCountRef.current = 0;
        lastMetricTimeRef.current = time;

        let perfRating: "Optimal" | "Good" | "Heavy" | "Overloaded" = "Optimal";
        if (measuredFps > 52) perfRating = "Optimal";
        else if (measuredFps > 40) perfRating = "Good";
        else if (measuredFps > 24) perfRating = "Heavy";
        else perfRating = "Overloaded";

        onPerformanceUpdate({
          activeParticles: particlesRef.current.length,
          fps: measuredFps,
          renderTimeMs: Math.round(performance.now() - startMs),
          systemPerformance: perfRating,
          status: isPaused ? "Paused" : "Running"
        });
      }

      // 1. Draw backing canvas workspace with translucent black layer for light kinetic motion blurring!
      ctx.fillStyle = config.colorTheme === "luxury_gold"
        ? "rgba(10, 8, 3, 0.15)" // Warm golden dark
        : config.colorTheme === "ice_blue"
        ? "rgba(10, 13, 16, 0.15)" // Frost dark
        : config.colorTheme === "forest_neon"
        ? "rgba(6, 12, 10, 0.15)" // Botanical organic dark
        : "rgba(10, 10, 10, 0.15)"; // Cyber dark
      ctx.fillRect(0, 0, w, h);

      // Render aesthetic background grid coordinate mesh (SpaceX style lines)
      renderBackgroundTelemetryGrid(ctx, w, h, camera);

      // 2. Draw special spline-based visual effects such as AURORA Ribbons
      if (config.effectType === "aurora") {
        renderAuroraLightBands(ctx, w, h, time, config.colorTheme, config.intensity, config.speedMultiplier);
      }

      // 3. Process each particle's physical calculations
      if (!isPaused) {
        updateSimulationParticlesPhysics(w, h, deltaSec);
      }

      // 4. Projection space calculations (3D perspectives orbit rotations)
      renderAndProject3DSpaceParticles(ctx, w, h, camera);

      // Render dynamic laser cursor indicator when hovering inside studio
      if (mousePosRef.current.isOver) {
        renderCursorHUDTelemetry(ctx, mousePosRef.current.x, mousePosRef.current.y, config.colorTheme);
      }

      frameId = requestAnimationFrame(runFrame);
    };

    frameId = requestAnimationFrame(runFrame);
    animationFrameIdRef.current = frameId;

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [config, isPaused, camera]);

  // Generates background structural Tesla-styled digital dashboard context
  const renderBackgroundTelemetryGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, cam: any) => {
    ctx.save();
    ctx.lineWidth = 0.5;
    
    const themeColors: Record<ColorTheme, string> = {
      luxury_gold: "rgba(212, 175, 55, 0.04)",
      ice_blue: "rgba(112, 214, 255, 0.04)",
      neon_purple: "rgba(157, 78, 221, 0.04)",
      cosmic_gold: "rgba(63, 0, 255, 0.04)",
      forest_neon: "rgba(82, 183, 136, 0.04)",
      neon_rainbow: "rgba(255, 255, 255, 0.03)",
      ruby_red: "rgba(230, 57, 70, 0.04)",
      emerald_wave: "rgba(6, 214, 160, 0.04)"
    };
    ctx.strokeStyle = themeColors[config.colorTheme] || "rgba(255, 255, 255, 0.03)";

    // Drawing concentric orbits rings reflecting depth layers
    const centerSubX = w / 2;
    const centerSubY = h / 2;
    const rings = 4;
    for (let r = 1; r <= rings; r++) {
      ctx.beginPath();
      // Orbit ellipse deformed and tilted by camera pitch/yaw
      const radiusX = r * 160 * cam.zoom;
      const radiusY = r * 80 * cam.zoom * Math.max(0.1, Math.cos(cam.pitch));
      ctx.ellipse(centerSubX, centerSubY, radiusX, radiusY, cam.yaw, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid crosshairs at screen origin
    ctx.beginPath();
    ctx.moveTo(centerSubX - 40, centerSubY);
    ctx.lineTo(centerSubX + 40, centerSubY);
    ctx.moveTo(centerSubX, centerSubY - 40);
    ctx.lineTo(centerSubX, centerSubY + 40);
    ctx.stroke();

    ctx.restore();
  };

  // Drifts and weaves aurora lights using custom trigonometry calculations
  const renderAuroraLightBands = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number,
    theme: ColorTheme,
    intensity: number,
    speedFactor: number
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const waveCount = 3 + Math.floor(intensity / 33);
    const timeScale = time * 0.0007 * speedFactor;

    const baseColors: Record<ColorTheme, string[]> = {
      luxury_gold: ["rgba(212,175,55,0.06)", "rgba(255,223,0,0.03)"],
      ice_blue: ["rgba(112,214,255,0.12)", "rgba(0,180,216,0.04)"],
      neon_purple: ["rgba(255,0,127,0.1)", "rgba(157,78,221,0.05)"],
      cosmic_gold: ["rgba(63,0,255,0.08)", "rgba(255,215,0,0.04)"],
      forest_neon: ["rgba(0,245,212,0.15)", "rgba(82,183,136,0.05)"],
      neon_rainbow: ["rgba(255,0,84,0.08)", "rgba(0,245,212,0.08)"],
      ruby_red: ["rgba(230,57,70,0.1)", "rgba(155,34,38,0.05)"],
      emerald_wave: ["rgba(6,214,160,0.12)", "rgba(17,138,178,0.04)"]
    };

    const palette = baseColors[theme] || baseColors.luxury_gold;

    for (let wave = 0; wave < waveCount; wave++) {
      const gradient = ctx.createLinearGradient(0, h * 0.1, 0, h * 0.65);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(0.3, palette[0]);
      gradient.addColorStop(0.55, palette[1] || palette[0]);
      gradient.addColorStop(0.9, "rgba(0,0,0,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();

      const offsetShift = wave * Math.PI * 0.4;
      const points: { x: number; y: number }[] = [];
      const resolution = 18;

      for (let i = 0; i <= resolution; i++) {
        const x = (i / resolution) * w;
        // Woven sinusoidal displacements
        const sin1 = Math.sin(x * 0.003 + timeScale + offsetShift);
        const sin2 = Math.sin(x * 0.007 - timeScale * 1.5 + offsetShift * 2);
        const yOffset = sin1 * 60 + sin2 * 25 + h * 0.35 + (wave * 30);
        
        points.push({ x, y: yOffset });
      }

      // Draw standard cardinal splines matching points
      ctx.moveTo(points[0].x, points[0].y - 80);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y - 80, xc, yc - 80);
      }
      ctx.lineTo(w, h * 0.65);
      ctx.lineTo(0, h * 0.65);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  };

  // Updates kinematics, boundaries, buoyancy forces, and hover kinetic fields
  const updateSimulationParticlesPhysics = (w: number, h: number, deltaSec: number) => {
    const particles = particlesRef.current;
    
    // Physical multipliers
    const gVal = config.gravity;
    const wVal = config.windSpeed;
    const speedMult = config.speedMultiplier;
    const effect = config.effectType;

    const rate = deltaSec * 60 * speedMult;

    // Spawn more particles periodically if threshold is not met
    const targetCount = Math.floor(config.particleCount * (config.intensity / 75));
    if (particles.length < targetCount && Math.random() < 0.4 * speedMult) {
      const needed = Math.min(targetCount - particles.length, 4);
      for (let i = 0; i < needed; i++) {
        particles.push(new Particle(w, h, effect, config.colorTheme));
      }
    }

    // Process particles in place
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= p.decay * rate;

      if (p.life <= 0) {
        // Recycle stars or ambient energy, delete explosive sparks
        if (effect === "fireworks") {
          particles.splice(i, 1);
          continue;
        } else {
          // Recycle loop at boundaries
          particles[i] = new Particle(w, h, effect, config.colorTheme);
          continue;
        }
      }

      // 1. Hover Deflection Physics (Electrostatic repulsion simulation)
      if (mousePosRef.current.isOver) {
        const mx = mousePosRef.current.x - w / 2;
        const my = mousePosRef.current.y - h / 2;
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 140) {
          // Repulsive force vector
          const force = (140 - dist) / 140;
          const forceFactor = effect === "rain" ? 1.5 : 4.5;
          p.vx += (dx / dist) * force * forceFactor * rate;
          p.vy += (dy / dist) * force * forceFactor * rate;
        }
      }

      // 2. Kinematical integrations
      p.angle += p.spinSpeed * rate;

      if (effect === "snowfall") {
        // Soft flutter drift path via trigonometry sine
        p.vx = (p.vx * 0.95) + (Math.sin(p.phase + p.life * 10) * 0.3 + wVal * 0.3) * rate;
        p.vy = (p.vy * 0.98) + (0.5 + gVal * 0.8) * rate;
      } else if (effect === "rain") {
        // Streamlined diagonal downward vector
        p.vx = wVal * 1.5;
        p.vy = (8.0 + gVal * 2.5) * rate;
      } else if (effect === "balloons") {
        // Aerostatic buoyancy ascends against gravity
        p.vx = (p.vx * 0.97) + (Math.sin(p.phase + p.life * 4) * 0.5 + wVal * 0.25) * rate;
        p.vy = (p.vy * 0.95) + gVal * 1.2 * rate; // gVal is negative, climbing up!
      } else if (effect === "meteor_shower") {
        // Extreme downward angled kinematics
        p.vx = (p.vx * 0.99) + wVal * 0.1 * rate;
        p.vy = (6.0 + gVal * 1.5) * rate;
      } else if (effect === "fireworks") {
        // Exploded sparks experience deceleration and gravity drop
        p.vx *= Math.pow(0.965, rate);
        p.vy *= Math.pow(0.965, rate);
        p.vy += (0.4 + gVal * 0.6) * rate;
        p.vz *= Math.pow(0.965, rate);

        // Record trailing trajectory for sparks
        if (p.extraData.sparkTrail) {
          p.extraData.sparkTrail.push({ x: p.x, y: p.y, z: p.z });
          if (p.extraData.sparkTrail.length > 8) {
            p.extraData.sparkTrail.shift();
          }
        }
      } else if (effect === "confetti") {
        // Tumbling falling fragments
        p.vx = (p.vx * 0.92) + (Math.sin(p.phase + p.life * 8) * 0.8 + wVal * 0.35) * rate;
        p.vy = (p.vy * 0.94) + (0.8 + gVal * 0.7) * rate;
      } else {
        // General floating microparticles / stars
        p.vx += wVal * 0.04 * rate;
        p.vy += gVal * 0.04 * rate;
        // Thermal drafts fluctuations
        p.vx += Math.sin(p.phase + timeConstant * 0.002) * 0.05 * rate;
        p.vy += Math.cos(p.phase + timeConstant * 0.002) * 0.05 * rate;
      }

      // 3. Integrate coordinates positions
      p.x += p.vx * rate;
      p.y += p.vy * rate;
      p.z += p.vz * rate;

      // 4. Boundary clipping or recycling
      clipBoundaryRecycle(p, w, h, effect);
    }
  };

  const timeConstant = performance.now();

  const clipBoundaryRecycle = (p: Particle, w: number, h: number, effect: EffectType) => {
    const buffer = 150;
    
    // Bounds boundaries defined
    const xMin = -w / 2 - buffer;
    const xMax = w / 2 + buffer;
    const yMin = -h / 2 - buffer;
    const yMax = h / 2 + buffer;

    if (effect === "balloons") {
      // Re-spawn bottom if popped / ascended past top
      if (p.y < yMin - 100 || p.x < xMin || p.x > xMax) {
        p.y = h / 2 + 100 + Math.random() * 200;
        p.x = (Math.random() - 0.5) * w * 1.3;
        p.vx = (Math.random() - 0.5) * 1.5;
        p.vy = -(1.0 + Math.random() * 1.5);
        p.life = 1.0;
      }
    } else if (effect === "rain" || effect === "snowfall" || effect === "confetti" || effect === "meteor_shower") {
      // Recycles bottom limits
      if (p.y > yMax) {
        p.y = yMin - 50 - Math.random() * 150;
        p.x = (Math.random() - 0.5) * w * 1.4;
        p.vx = (Math.random() - 0.5) * 1.0;
        p.life = 1.0;
        if (effect === "rain") {
          p.vy = 8.0 + Math.random() * 5.0;
        }
      }
      // Sidewall recycling
      if (p.x < xMin) {
        p.x = xMax - 20;
      } else if (p.x > xMax) {
        p.x = xMin + 20;
      }
    } else if (effect === "fireworks") {
      // Clean up past bounds
      if (p.y > yMax + 200) {
        p.life = 0;
      }
    } else {
      // Outer boundaries recycling
      if (p.x < xMin - 200 || p.x > xMax + 200 || p.y < yMin - 200 || p.y > yMax + 200) {
        p.x = (Math.random() - 0.5) * w * 1.5;
        p.y = (Math.random() - 0.5) * h * 1.5;
        p.z = (Math.random() - 0.5) * 600;
        p.life = 1.0;
      }
    }
  };

  // Projects deep coordinate properties onto Cartesian canvas planar
  const renderAndProject3DSpaceParticles = (ctx: CanvasRenderingContext2D, w: number, h: number, cam: any) => {
    const list = particlesRef.current;
    if (list.length === 0) return;

    // Camera trigonometric rotations
    const cosY = Math.cos(cam.yaw);
    const sinY = Math.sin(cam.yaw);
    const cosX = Math.cos(cam.pitch);
    const sinX = Math.sin(cam.pitch);

    const active3D = config.is3D;

    // Structural projected entities lists
    interface ProjectedEntity {
      particle: Particle;
      px: number;
      py: number;
      scale: number;
      depthZ: number;
    }

    const projectedList: ProjectedEntity[] = [];

    // focal projection parameter space
    const dFocal = 450; 

    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      let pX = p.x;
      let pY = p.y;
      let pZ = p.z;

      if (active3D) {
        // Orbit Pitch/Yaw translation
        // Yaw
        const rx1 = pX * cosY - pZ * sinY;
        const rz1 = pX * sinY + pZ * cosY;

        // Pitch
        const ry1 = pY * cosX - rz1 * sinX;
        const rz2 = pY * sinX + rz1 * cosX;

        pX = rx1;
        pY = ry1;
        pZ = rz2;
      }

      // perspective translation divisor
      const zTranslate = pZ + dFocal;
      if (zTranslate <= 20) continue; // behind layout clipping

      const scale = active3D ? dFocal / zTranslate : 1.0;
      const screenX = w / 2 + pX * scale * cam.zoom;
      const screenY = h / 2 + pY * scale * cam.zoom;

      // Skip bounds rendering to conserve compute resources if outside preview
      if (screenX < -100 || screenX > w + 100 || screenY < -100 || screenY > h + 100) {
        continue;
      }

      projectedList.push({
        particle: p,
        px: screenX,
        py: screenY,
        scale,
        depthZ: pZ
      });
    }

    // Sort structural layout by viewport depth (Z-Index calculation)
    if (active3D) {
      projectedList.sort((a, b) => b.depthZ - a.depthZ);
    }

    // Render sorted list
    const effect = config.effectType;
    for (let i = 0; i < projectedList.length; i++) {
      const ent = projectedList[i];
      const p = ent.particle;
      const sizeFactor = ent.scale * config.particleSize * (p.size / 5);

      ctx.save();
      ctx.globalAlpha = p.opacity * p.life;

      // Draw custom trailing path (SpaceX telemetries) for meteors or fireworks
      if (effect === "meteor_shower" && p.vx !== 0) {
        const trailLength = 80 * ent.scale;
        const dx = (p.vx / Math.sqrt(p.vx * p.vx + p.vy * p.vy)) * trailLength;
        const dy = (p.vy / Math.sqrt(p.vx * p.vx + p.vy * p.vy)) * trailLength;

        const grad = ctx.createLinearGradient(ent.px, ent.py, ent.px - dx, ent.py - dy);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = sizeFactor * 0.7;
        ctx.beginPath();
        ctx.moveTo(ent.px, ent.py);
        ctx.lineTo(ent.px - dx, ent.py - dy);
        ctx.stroke();

        // Bright nucleus
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(ent.px, ent.py, sizeFactor * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }

      // Pyrotechnic trails
      if (effect === "fireworks" && p.extraData.sparkTrail && p.extraData.sparkTrail.length > 1) {
        ctx.lineWidth = sizeFactor * 0.5;
        ctx.strokeStyle = p.color;
        ctx.lineCap = "round";
        ctx.beginPath();
        
        const trail = p.extraData.sparkTrail;
        // Project start point of trail
        const st0 = trail[0];
        let stX = st0.x;
        let stY = st0.y;
        let stZ = st0.z;
        if (active3D) {
          const rx1 = stX * cosY - stZ * sinY;
          const rz1 = stX * sinY + stZ * cosY;
          stX = rx1;
          stY = stY * cosX - rz1 * sinX;
        }
        const sScale0 = active3D ? dFocal / (st0.z + dFocal) : 1.0;
        ctx.moveTo(w / 2 + stX * sScale0 * cam.zoom, h / 2 + stY * sScale0 * cam.zoom);

        for (let t = 1; t < trail.length; t++) {
          const node = trail[t];
          let nx = node.x;
          let ny = node.y;
          let nz = node.z;
          if (active3D) {
            const rx1 = nx * cosY - nz * sinY;
            const rz1 = nx * sinY + nz * cosY;
            nx = rx1;
            ny = ny * cosX - rz1 * sinX;
          }
          const sScale = active3D ? dFocal / (node.z + dFocal) : 1.0;
          ctx.lineTo(w / 2 + nx * sScale * cam.zoom, h / 2 + ny * sScale * cam.zoom);
        }
        ctx.stroke();
      }

      // Shape render routes
      if (effect === "rain") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = sizeFactor * 0.35;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ent.px, ent.py);
        // Drag precipitation vector line
        ctx.lineTo(ent.px + p.vx * 0.8, ent.py + p.vy * 0.8);
        ctx.stroke();
      } else if (effect === "confetti") {
        ctx.fillStyle = p.color;
        ctx.translate(ent.px, ent.py);
        ctx.rotate(p.angle);
        // Tumbling aspect ration scaling
        const tumbleX = Math.sin(p.angle * 2) * sizeFactor;
        ctx.fillRect(-tumbleX / 2, -sizeFactor / 2, tumbleX, sizeFactor);
      } else if (effect === "balloons") {
        // Draw physical circular membrane body
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(ent.px, ent.py, sizeFactor * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw balloon organic structural knot
        ctx.beginPath();
        ctx.moveTo(ent.px - sizeFactor * 0.3, ent.py + sizeFactor * 2.5);
        ctx.lineTo(ent.px + sizeFactor * 0.3, ent.py + sizeFactor * 2.5);
        ctx.lineTo(ent.px, ent.py + sizeFactor * 2.5 + sizeFactor * 0.4);
        ctx.closePath();
        ctx.fill();

        // Draw dangling balloon physical string
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = sizeFactor * 0.15;
        ctx.beginPath();
        ctx.moveTo(ent.px, ent.py + sizeFactor * 2.5 + sizeFactor * 0.4);
        
        // Sway sinusoidal string
        const stringLength = sizeFactor * 12;
        const cpX = ent.px + Math.sin(p.phase + timeConstant * 0.005) * (sizeFactor * 1.5);
        ctx.quadraticCurveTo(
          cpX,
          ent.py + sizeFactor * 2.5 + stringLength * 0.5,
          ent.px,
          ent.py + sizeFactor * 2.5 + stringLength
        );
        ctx.stroke();
      } else if (effect === "stars") {
        // Stellar twinkling sparkles
        const twinkle = 0.5 + Math.sin(p.phase + timeConstant * 0.008) * 0.5;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * p.life * twinkle;

        // Draw quad starflares
        ctx.beginPath();
        ctx.ellipse(ent.px, ent.py, sizeFactor * 1.6, sizeFactor * 0.3, 0, 0, Math.PI * 2);
        ctx.ellipse(ent.px, ent.py, sizeFactor * 0.3, sizeFactor * 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect === "particles") {
        // Shimmering embers with a premium radial glow halo layout
        const glowRad = sizeFactor * 2.5;
        const grad = ctx.createRadialGradient(ent.px, ent.py, sizeFactor * 0.1, ent.px, ent.py, glowRad);
        grad.addColorStop(0, "#FFFFFF");
        grad.addColorStop(0.35, p.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ent.px, ent.py, glowRad, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Standard circle/snowfall shapes
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(ent.px, ent.py, Math.max(1, sizeFactor), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  };

  // Renders beautiful technical crosshairs overlays centered around cursor
  const renderCursorHUDTelemetry = (ctx: CanvasRenderingContext2D, cx: number, cy: number, theme: ColorTheme) => {
    ctx.save();
    
    const themeColor: Record<ColorTheme, string> = {
      luxury_gold: "#D4AF37",
      ice_blue: "#70D6FF",
      neon_purple: "#9D4EDD",
      cosmic_gold: "#FFD700",
      forest_neon: "#00F5D4",
      neon_rainbow: "#FF0054",
      ruby_red: "#E63946",
      emerald_wave: "#06D6A0"
    };

    const color = themeColor[theme] || "#D4AF37";
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    
    // Circle indicator
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary dotted bounds
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.stroke();

    // Deflection force boundary glow limit
    ctx.strokeStyle = `${color}1A`;
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  };

  // Setup orbital camera drag interaction structures
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click binds orbit pivot
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    mousePosRef.current = {
      x: mx,
      y: my,
      isOver: true,
    };

    if (!isDraggingRef.current) return;

    // Delta drag movement calculation
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Update orbit angles
    setCamera((prev) => ({
      ...prev,
      yaw: prev.yaw + dx * 0.005,
      pitch: Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, prev.pitch + dy * 0.005)),
    }));
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    mousePosRef.current.isOver = false;
  };

  const handleMouseEnter = () => {
    mousePosRef.current.isOver = true;
  };

  const handleInteractiveExplosion = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      // Don't detonate if client was dragging orbit pivot
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) return;
      }
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    triggerManualExplosion(clickX, clickY);
  };

  return (
    <div
      id="simulation_container"
      ref={containerRef}
      className="relative w-full h-full cursor-crosshair overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleInteractiveExplosion}
    >
      <canvas
        id="physics_renderer"
        ref={canvasRef}
        className="block w-full h-full bg-neutral-950 transition-colors duration-1000"
      />
      {/* Immersive HUD Telemetry watermark layout in margins */}
      <div className="absolute top-4 left-4 pointer-events-none bg-black/40 backdrop-blur-md border border-white/5 rounded px-2.5 py-1 text-[10px] font-mono tracking-widest text-[#D4AF37]/80 uppercase select-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        AETHER ENGINE CORE // ACTIVE {config.is3D ? "3D" : "2D"} COORDINATES
      </div>
    </div>
  );
};
