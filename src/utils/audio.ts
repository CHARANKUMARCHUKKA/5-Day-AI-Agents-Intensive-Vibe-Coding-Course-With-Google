/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Global AudioContext wrapper to conform with browser auto-play policies.
let audioCtx: AudioContext | null = null;
let soundEnabled = false;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (enabled) {
    initAudio();
    playSynthBeep(600, 0.08, "sine", 0.05);
  }
}

export function isSoundEnabled() {
  return soundEnabled;
}

// Low-level synthesizer utility for crisp UI audio cues
export function playSynthBeep(
  frequency = 440,
  duration = 0.1,
  type: OscillatorType = "sine",
  volume = 0.1
) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Apply smooth amplitude envelope to prevent popping noises
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn("Failed to generate synthetic audio cue:", err);
  }
}

// Smooth mechanical click sound for parameter controls
export function playClickSound() {
  playSynthBeep(880, 0.05, "sine", 0.04);
}

// Deep atmospheric low sweep when a simulation is launched or mutated
export function playSimulationSweep() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.6);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.6);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch (err) {
    console.warn("Feedback audio sweep failed to compile safely:", err);
  }
}

// Golden ambient major scale sweep representing complete AI creation
export function playAISuccessChord() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (C Major)
    const now = audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gainNode.gain.setValueAtTime(0, now + idx * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.7);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.7);
    });
  } catch (err) {
    console.warn("AI celebration chord synthesis failed:", err);
  }
}

// Cybernetic spark sound when fireworks explode or interactive triggers are triggered
export function playSparkSound() {
  playSynthBeep(1200, 0.07, "triangle", 0.03);
}
