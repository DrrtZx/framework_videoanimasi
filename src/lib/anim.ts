import { spring, interpolate, Easing } from "remotion";

/**
 * Animasi Pop-in elastis berbasis Remotion spring()
 */
export function popIn(
  frame: number,
  fps: number,
  delay: number = 0,
  damping: number = 12,
  stiffness: number = 200,
  mass: number = 0.8
): number {
  return spring({
    frame: frame - delay,
    fps,
    config: {
      damping,
      stiffness,
      mass,
    },
  });
}

/**
 * Easing halus 0 ke 1
 */
export function ease01(
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = Easing.bezier(0.16, 1, 0.3, 1)
): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

/**
 * Wobble / getar elastis (untuk SFX, kartun punchline, atau shock)
 * Menggunakan trigonometri berbasis frame deterministik tanpa Math.random()
 */
export function wobble(
  frame: number,
  start: number,
  duration: number = 20,
  amplitude: number = 8,
  frequency: number = 0.35
): number {
  if (frame < start || frame > start + duration) return 0;
  const progress = (frame - start) / duration;
  const decay = Math.exp(-progress * 4);
  return Math.sin((frame - start) * frequency * 2 * Math.PI) * amplitude * decay;
}

/**
 * Perhitungan camera shake deterministik berbasis seed
 */
export function calculateShake(
  frame: number,
  shakeAt?: { frame: number; intensity: number; duration: number }
): { x: number; y: number } {
  if (!shakeAt) return { x: 0, y: 0 };
  const { frame: start, intensity, duration } = shakeAt;
  if (frame < start || frame > start + duration) return { x: 0, y: 0 };

  const elapsed = frame - start;
  const decay = 1 - elapsed / duration;
  const x = Math.sin(elapsed * 1.5) * intensity * decay;
  const y = Math.cos(elapsed * 1.8) * intensity * decay;
  return { x, y };
}
