import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, random, AbsoluteFill } from "remotion";
import { PALETTE } from "../config";
import { calculateShake } from "../lib/anim";
import type { SceneTheme, SceneTransitionType } from "../episodes/types";

export interface CameraZoomConfig {
  frame: number;
  scale: number;
  duration: number;
}

export interface ShakeConfig {
  frame: number;
  intensity: number;
  duration: number;
}

export interface SceneProps {
  children: React.ReactNode;
  theme?: SceneTheme;
  sceneTransition?: SceneTransitionType;
  cameraZoomAt?: CameraZoomConfig;
  shakeAt?: ShakeConfig;
  /** Kontrol kamera kontinu yang dihitung per frame oleh Episode */
  cameraScale?: number;
  cameraPanX?: number;
  cameraPanY?: number;
  /** Progress total video (0..1) untuk progress bar interaktif atas */
  progress?: number;
  /** Amplitudo suara VO (0..1) untuk equalizer HUD */
  rmsLevel?: number;
  backgroundColor?: string;
  style?: React.CSSProperties;
}

interface ThemeStyle {
  bgCenter: string;
  bgMid: string;
  bgOuter: string;
  gridMinor: string;
  gridMajor: string;
  accent: string;
  accentAlt: string;
  floorTop: string;
  floorBottom: string;
  particleColor: string;
}

const THEME_PALETTES: Record<SceneTheme, ThemeStyle> = {
  "cyber-blueprint": {
    bgCenter: "#0F2F57",
    bgMid: PALETTE.bg,
    bgOuter: "#030812",
    gridMinor: "#0284C7",
    gridMajor: "#38BDF8",
    accent: "#00F5FF",
    accentAlt: "#FACC15",
    floorTop: "#0B2442",
    floorBottom: "#040D1B",
    particleColor: "#38BDF8",
  },
  "cyber-crash": {
    bgCenter: "#241335",
    bgMid: "#0B152B",
    bgOuter: "#050712",
    gridMinor: "#0EA5E9",
    gridMajor: "#F43F5E",
    accent: "#FB7185",
    accentAlt: "#38BDF8",
    floorTop: "#1A1230",
    floorBottom: "#060814",
    particleColor: "#FB7185",
  },
  "vintage-1947": {
    bgCenter: "#154354",
    bgMid: "#0A2330",
    bgOuter: "#040E14",
    gridMinor: "#0D9488",
    gridMajor: "#38BDF8",
    accent: "#F59E0B",
    accentAlt: "#2DD4BF",
    floorTop: "#103240",
    floorBottom: "#05121A",
    particleColor: "#FBBF24",
  },
  "spotlight-twist": {
    bgCenter: "#3B0D2C",
    bgMid: "#190A26",
    bgOuter: "#080310",
    gridMinor: "#A855F7",
    gridMajor: "#F43F5E",
    accent: "#FACC15",
    accentAlt: "#FB7185",
    floorTop: "#290D29",
    floorBottom: "#0B0414",
    particleColor: "#FACC15",
  },
  "archive-paper": {
    bgCenter: "#2C2822",
    bgMid: "#17202C",
    bgOuter: "#0A0E14",
    gridMinor: "#64748B",
    gridMajor: "#F59E0B",
    accent: "#FDE047",
    accentAlt: "#38BDF8",
    floorTop: "#22252A",
    floorBottom: "#0B0F17",
    particleColor: "#FDE68A",
  },
  "edison-1878": {
    bgCenter: "#472B10",
    bgMid: "#231509",
    bgOuter: "#0E0703",
    gridMinor: "#92400E",
    gridMajor: "#F59E0B",
    accent: "#FDE047",
    accentAlt: "#FB923C",
    floorTop: "#331F0D",
    floorBottom: "#120A04",
    particleColor: "#FCD34D",
  },
  "neon-coder": {
    bgCenter: "#23195C",
    bgMid: "#0E0D2E",
    bgOuter: "#050414",
    gridMinor: "#6366F1",
    gridMajor: "#22D3EE",
    accent: "#00F5FF",
    accentAlt: "#C084FC",
    floorTop: "#191547",
    floorBottom: "#06051A",
    particleColor: "#22D3EE",
  },
};

// Partikel melayang deterministik (20 partikel)
const AMBIENT_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: random(`p-x-${i}`) * 1020 + 30,
  y: random(`p-y-${i}`) * 1350 + 80,
  size: random(`p-s-${i}`) * 5 + 3,
  speed: random(`p-v-${i}`) * 1.6 + 0.6,
  phase: random(`p-ph-${i}`) * Math.PI * 2,
  shape: i % 3, // 0: dot, 1: plus, 2: ring
}));

export const Scene: React.FC<SceneProps> = ({
  children,
  theme = "cyber-blueprint",
  sceneTransition = "none",
  cameraZoomAt,
  shakeAt,
  cameraScale,
  cameraPanX = 0,
  cameraPanY = 0,
  progress,
  rmsLevel = 0,
  backgroundColor,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const th = THEME_PALETTES[theme] ?? THEME_PALETTES["cyber-blueprint"];

  // 1. Kamera Zoom (gabungkan kontinu cameraScale & legacy cameraZoomAt)
  let zoom = cameraScale ?? 1.0;
  if (cameraZoomAt && cameraScale === undefined) {
    const { frame: start, scale: targetScale, duration } = cameraZoomAt;
    zoom = interpolate(frame, [start, start + duration], [1.0, targetScale], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // 2. Transisi Masuk Adegan Sinematik (Anti-PPT!)
  let transX = 0;
  let transScale = 1;
  let flashOpacity = 0;
  let shutterGap = 1; // 1 = terbuka penuh

  if (sceneTransition === "slide-left") {
    const s = spring({ frame, fps, config: { damping: 16, stiffness: 180, mass: 0.7 } });
    transX = interpolate(s, [0, 1], [220, 0]);
  } else if (sceneTransition === "zoom-burst") {
    const s = spring({ frame, fps, config: { damping: 14, stiffness: 200, mass: 0.7 } });
    transScale = interpolate(s, [0, 1], [0.88, 1.0]);
    flashOpacity = interpolate(frame, [0, 8], [0.35, 0], { extrapolateRight: "clamp" });
  } else if (sceneTransition === "shutter") {
    shutterGap = spring({ frame, fps, config: { damping: 18, stiffness: 210, mass: 0.6 } });
  } else if (sceneTransition === "flash") {
    flashOpacity = interpolate(frame, [0, 10], [0.75, 0], { extrapolateRight: "clamp" });
    const s = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
    transScale = interpolate(s, [0, 1], [1.08, 1.0]);
  }

  // 3. Kamera Shake Deterministik
  const shake = calculateShake(frame, shakeAt);

  // 4. Animasi latar dinamis (grid drift, scanline, spotlight, gears)
  const gridShiftY = (frame * 0.65) % 120;
  const scanlineY = ((frame * 9) % 2100) - 100;
  const spotlightAngle = Math.sin(t * 1.4) * 18;
  const gearSpin = frame * 0.9;

  // Equalizer bars (7 batang hidup mengikuti rmsLevel)
  const eqBars = [0.55, 0.9, 0.7, 1.0, 0.8, 0.65, 0.45].map((weight, i) => {
    const wave = 0.25 + 0.75 * Math.abs(Math.sin(t * 12 + i * 1.1));
    const h = 6 + rmsLevel * weight * wave * 24;
    return Math.max(5, Math.min(30, h));
  });

  const bgMidColor = backgroundColor ?? th.bgMid;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, ${th.bgCenter} 0%, ${bgMidColor} 65%, ${th.bgOuter} 100%)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Layer Kamera Utama (gerak zoom, pan, shake, transisi) */}
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x + cameraPanX + transX}px, ${shake.y + cameraPanY}px) scale(${zoom * transScale})`,
          transformOrigin: "center 28%",
        }}
      >
        {/* ================= 1. LATAR BELAKANG TEMA HIDUP (MINIMAL 2 LAPIS) ================= */}
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
        >
          <defs>
            <pattern
              id={`gridSmall-${theme}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(0, ${gridShiftY * 0.5})`}
            >
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke={th.gridMinor} strokeWidth="0.75" opacity="0.22" />
            </pattern>
            <pattern
              id={`gridMajor-${theme}`}
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(0, ${gridShiftY * 0.5})`}
            >
              <rect width="120" height="120" fill={`url(#gridSmall-${theme})`} />
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke={th.gridMajor} strokeWidth="1.5" opacity="0.35" />
            </pattern>
            <linearGradient id={`floorGrad-${theme}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={th.floorTop} stopOpacity="0.92" />
              <stop offset="100%" stopColor={th.floorBottom} stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id={`spotGrad-${theme}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={th.accent} stopOpacity="0.26" />
              <stop offset="100%" stopColor={th.accent} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Blueprint Bergerak Halus */}
          <rect width="1080" height="1920" fill={`url(#gridMajor-${theme})`} />

          {/* === DEKORASI KHUSUS PER TEMA === */}
          {theme === "cyber-crash" && (
            <g opacity="0.35">
              {/* Radar lingkaran berdenyut */}
              <circle cx="540" cy="440" r={180 + ((frame * 3) % 240)} fill="none" stroke={th.accent} strokeWidth="2.5" opacity={1 - ((frame * 3) % 240) / 240} />
              <circle cx="540" cy="440" r="280" fill="none" stroke={th.accentAlt} strokeWidth="2" strokeDasharray="14 10" transform={`rotate(${frame * 0.5} 540 440)`} />
              {/* Scanline glitch berjalan */}
              <rect x="0" y={scanlineY} width="1080" height="6" fill={th.accent} opacity="0.35" />
              <rect x="0" y={scanlineY + 12} width="1080" height="2" fill={th.accentAlt} opacity="0.4" />
            </g>
          )}

          {theme === "vintage-1947" && (
            <g opacity="0.35">
              {/* Gelombang Osiloskop Retro 1947 */}
              <path
                d={Array.from({ length: 37 }, (_, i) => {
                  const x = i * 30;
                  const y = 760 + Math.sin(i * 0.45 + t * 5) * 28 + Math.cos(i * 0.9 - t * 3) * 14;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                }).join(" ")}
                fill="none"
                stroke={th.accent}
                strokeWidth="3"
              />
              {/* Lingkaran dial teknik */}
              <circle cx="140" cy="760" r="95" fill="none" stroke={th.accentAlt} strokeWidth="2" strokeDasharray="8 8" transform={`rotate(${-gearSpin * 0.6} 140 760)`} />
              <circle cx="940" cy="760" r="110" fill="none" stroke={th.accent} strokeWidth="2" strokeDasharray="12 10" transform={`rotate(${gearSpin * 0.5} 940 760)`} />
            </g>
          )}

          {theme === "spotlight-twist" && (
            <g>
              {/* Lampu Sorot Investigasi Menyapu */}
              <g transform={`translate(540, 0) rotate(${spotlightAngle})`}>
                <polygon points="-80,0 80,0 440,1500 -440,1500" fill={`url(#spotGrad-${theme})`} />
              </g>
              {/* Garis bahaya hazard halus di pinggir atas */}
              <g opacity="0.3">
                {Array.from({ length: 16 }, (_, i) => (
                  <polygon
                    key={`hz-${i}`}
                    points={`${i * 80 - 40},0 ${i * 80},0 ${i * 80 - 20},24 ${i * 80 - 60},24`}
                    fill="#FACC15"
                  />
                ))}
              </g>
            </g>
          )}

          {theme === "archive-paper" && (
            <g opacity="0.32">
              {/* Lingkaran orbit peta dunia & arsip */}
              <circle cx="540" cy="430" r="340" fill="none" stroke={th.accent} strokeWidth="2" strokeDasharray="16 12" transform={`rotate(${frame * 0.35} 540 430)`} />
              <circle cx="540" cy="430" r="440" fill="none" stroke={th.accentAlt} strokeWidth="1.5" strokeDasharray="6 14" transform={`rotate(${-frame * 0.25} 540 430)`} />
            </g>
          )}

          {theme === "edison-1878" && (
            <g opacity="0.28">
              {/* Roda Gigi Mesin Vintage 1878 Berputar */}
              <g transform={`translate(130, 820) rotate(${gearSpin})`}>
                <circle cx="0" cy="0" r="85" fill="none" stroke={th.accent} strokeWidth="10" strokeDasharray="18 14" />
                <circle cx="0" cy="0" r="56" fill="none" stroke={th.accentAlt} strokeWidth="4" />
                <circle cx="0" cy="0" r="18" fill={th.accent} />
              </g>
              <g transform={`translate(950, 740) rotate(${-gearSpin * 1.2})`}>
                <circle cx="0" cy="0" r="105" fill="none" stroke={th.accentAlt} strokeWidth="12" strokeDasharray="22 16" />
                <circle cx="0" cy="0" r="70" fill="none" stroke={th.accent} strokeWidth="4" />
                <circle cx="0" cy="0" r="22" fill={th.accentAlt} />
              </g>
              {/* Cahaya hangat filamen atas */}
              <circle cx="540" cy="420" r="320" fill={th.accent} opacity="0.08" />
            </g>
          )}

          {theme === "neon-coder" && (
            <g opacity="0.35">
              {/* Cincin neon cyber berputar */}
              <circle cx="540" cy="440" r="310" fill="none" stroke={th.accent} strokeWidth="2.5" strokeDasharray="24 14" transform={`rotate(${frame * 0.6} 540 440)`} />
              <circle cx="540" cy="440" r="390" fill="none" stroke={th.accentAlt} strokeWidth="2" strokeDasharray="10 18" transform={`rotate(${-frame * 0.45} 540 440)`} />
              <rect x="0" y={scanlineY} width="1080" height="4" fill={th.accent} opacity="0.4" />
            </g>
          )}

          {/* ================= 2. PARTIKEL AMBIENT MELAYANG (DETERMINISTIK) ================= */}
          <g>
            {AMBIENT_PARTICLES.map((p) => {
              const py = ((p.y - frame * p.speed + 1400) % 1350) + 60;
              const px = p.x + Math.sin(t * p.speed + p.phase) * 18;
              const op = 0.18 + 0.25 * (0.5 + 0.5 * Math.sin(t * 2.5 + p.phase));

              if (p.shape === 1) {
                return (
                  <g key={p.id} transform={`translate(${px}, ${py})`} stroke={th.particleColor} strokeWidth="2" opacity={op}>
                    <line x1={-p.size} y1="0" x2={p.size} y2="0" />
                    <line x1="0" y1={-p.size} x2="0" y2={p.size} />
                  </g>
                );
              }
              if (p.shape === 2) {
                return (
                  <circle key={p.id} cx={px} cy={py} r={p.size + 1} fill="none" stroke={th.particleColor} strokeWidth="1.8" opacity={op} />
                );
              }
              return <circle key={p.id} cx={px} cy={py} r={p.size} fill={th.particleColor} opacity={op} />;
            })}
          </g>

          {/* ================= 3. LANTAI PANGGUNG 3D PERSPEKTIF (AGAR JOKOWO BERPIJAK!) ================= */}
          <g>
            <rect x="0" y="1395" width="1080" height="525" fill={`url(#floorGrad-${theme})`} />
            {/* Garis Cakrawala Panggung Bercahaya */}
            <line x1="0" y1="1395" x2="1080" y2="1395" stroke={th.accent} strokeWidth="3" opacity="0.65" />
            <line x1="0" y1="1399" x2="1080" y2="1399" stroke={th.gridMajor} strokeWidth="8" opacity="0.16" />
            {/* Garis Grid Perspektif Panggung */}
            <g stroke={th.gridMajor} strokeWidth="1.4" opacity="0.24">
              <line x1="540" y1="1395" x2="540" y2="1920" />
              <line x1="360" y1="1395" x2="180" y2="1920" />
              <line x1="720" y1="1395" x2="900" y2="1920" />
              <line x1="180" y1="1395" x2="-180" y2="1920" />
              <line x1="900" y1="1395" x2="1260" y2="1920" />
              <line x1="0" y1="1450" x2="1080" y2="1450" />
              <line x1="0" y1="1530" x2="1080" y2="1530" />
              <line x1="0" y1="1640" x2="1080" y2="1640" />
              <line x1="0" y1="1780" x2="1080" y2="1780" />
            </g>
            {/* Spotlight lantai melingkar di bawah panggung */}
            <ellipse cx="540" cy="1445" rx="340" ry="38" fill={th.accent} opacity="0.1" />
          </g>

          {/* Corner Crop Marks (+) Khas Blueprint */}
          <g stroke={th.gridMajor} strokeWidth="2.5" opacity="0.55">
            <line x1="34" y1="22" x2="34" y2="44" />
            <line x1="23" y1="33" x2="45" y2="33" />
            <line x1="1046" y1="22" x2="1046" y2="44" />
            <line x1="1035" y1="33" x2="1057" y2="33" />
            <line x1="34" y1="1876" x2="34" y2="1898" />
            <line x1="23" y1="1887" x2="45" y2="1887" />
            <line x1="1046" y1="1876" x2="1046" y2="1898" />
            <line x1="1035" y1="1887" x2="1057" y2="1887" />
          </g>
        </svg>

        {/* Konten Utama Adegan (StageProp, Jokowo, SFX, Caption) */}
        {children}
      </AbsoluteFill>

      {/* ================= 4. OVERLAY HUD INTERAKTIF ATAS (NON-KAMERA, BERSIH) ================= */}
      {typeof progress === "number" && (
        <div
          style={{
            position: "absolute",
            top: "58px",
            left: "56px",
            right: "56px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            zIndex: 60,
            pointerEvents: "none",
          }}
        >
          {/* Mini Equalizer Audio Reaktif (7 batang) */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "4px",
              height: "32px",
              padding: "4px 10px",
              borderRadius: "10px",
              backgroundColor: "rgba(10, 25, 47, 0.55)",
              border: `2px solid ${th.accent}66`,
            }}
          >
            {eqBars.map((h, idx) => (
              <div
                key={`eq-${idx}`}
                style={{
                  width: "5px",
                  height: `${h}px`,
                  borderRadius: "3px",
                  backgroundColor: idx % 2 === 0 ? th.accent : th.accentAlt,
                }}
              />
            ))}
          </div>

          {/* Story Progress Bar Halus */}
          <div
            style={{
              flex: 1,
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.14)",
              border: "2px solid rgba(255, 255, 255, 0.22)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.max(0, Math.min(100, progress * 100))}%`,
                height: "100%",
                borderRadius: "999px",
                background: `linear-gradient(90deg, ${th.accent}, ${th.accentAlt})`,
                boxShadow: `0 0 12px ${th.accent}`,
              }}
            />
          </div>
        </div>
      )}

      {/* ================= 5. OVERLAY TRANSISI SHUTTER / FLASH ================= */}
      {sceneTransition === "shutter" && shutterGap < 0.99 && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${(1 - shutterGap) * 50}%`,
              backgroundColor: "#040B16",
              borderBottom: `4px solid ${th.accent}`,
              zIndex: 80,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${(1 - shutterGap) * 50}%`,
              backgroundColor: "#040B16",
              borderTop: `4px solid ${th.accent}`,
              zIndex: 80,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {flashOpacity > 0.01 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity,
            zIndex: 85,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
