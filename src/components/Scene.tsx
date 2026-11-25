import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, random, AbsoluteFill } from "remotion";
import { calculateShake } from "../lib/anim";
import { getPreset } from "../presets";
import type { PresetConfig } from "../presets/types";
import type { SceneTheme, SceneTransitionType } from "../core/types";

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
  preset?: PresetConfig;
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

// Partikel melayang deterministik (18 partikel)
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
  preset = getPreset(),
  theme,
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

  const activeTheme = theme ?? preset.defaultTheme;
  const th = preset.themes[activeTheme] ?? preset.themes[preset.defaultTheme];
  const isCleanStudio =
    preset.stageStyle === "clean-studio" || preset.stageStyle === "minimal";

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
  let shutterGap = 1;

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

  // 4. Animasi latar dinamis
  const gridShiftY = (frame * 0.65) % 120;
  const scanlineY = ((frame * 9) % 2100) - 100;
  const spotlightAngle = Math.sin(t * 1.4) * 18;
  const gearSpin = frame * 0.9;

  // Drift lembut 3 orb ambient untuk mode Clean Studio
  const orb1X = 240 + Math.sin(t * 0.55) * 48;
  const orb1Y = 390 + Math.cos(t * 0.45) * 36;
  const orb2X = 830 + Math.cos(t * 0.5) * 52;
  const orb2Y = 640 + Math.sin(t * 0.4) * 42;
  const orb3X = 540 + Math.sin(t * 0.35 + 1.2) * 38;
  const orb3Y = 1120 + Math.cos(t * 0.48) * 28;

  // Equalizer bars (7 batang hidup mengikuti rmsLevel)
  const eqBars = [0.55, 0.9, 0.7, 1.0, 0.8, 0.65, 0.45].map((weight, i) => {
    const wave = 0.25 + 0.75 * Math.abs(Math.sin(t * 12 + i * 1.1));
    const h = 6 + rmsLevel * weight * wave * 24;
    return Math.max(5, Math.min(30, h));
  });

  const bgMidColor = backgroundColor ?? th.bgMid;
  const svgKey = `${preset.id}-${activeTheme}`;

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
        {/* ================= 1. LATAR BELAKANG TEMA HIDUP ================= */}
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
        >
          <defs>
            {!isCleanStudio && (
              <>
                <pattern
                  id={`gridSmall-${svgKey}`}
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                  patternTransform={`translate(0, ${gridShiftY * 0.5})`}
                >
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke={th.gridMinor} strokeWidth="0.75" opacity="0.22" />
                </pattern>
                <pattern
                  id={`gridMajor-${svgKey}`}
                  width="120"
                  height="120"
                  patternUnits="userSpaceOnUse"
                  patternTransform={`translate(0, ${gridShiftY * 0.5})`}
                >
                  <rect width="120" height="120" fill={`url(#gridSmall-${svgKey})`} />
                  <path d="M 120 0 L 0 0 0 120" fill="none" stroke={th.gridMajor} strokeWidth="1.5" opacity="0.35" />
                </pattern>
              </>
            )}
            <linearGradient id={`floorGrad-${svgKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={th.floorTop} stopOpacity={isCleanStudio ? "0.86" : "0.92"} />
              <stop offset="100%" stopColor={th.floorBottom} stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id={`horizonFade-${svgKey}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={th.accent} stopOpacity="0" />
              <stop offset="20%" stopColor={th.accent} stopOpacity="0.32" />
              <stop offset="50%" stopColor={th.accent} stopOpacity="0.52" />
              <stop offset="80%" stopColor={th.accent} stopOpacity="0.32" />
              <stop offset="100%" stopColor={th.accent} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`spotGrad-${svgKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={th.accent} stopOpacity={isCleanStudio ? "0.18" : "0.26"} />
              <stop offset="100%" stopColor={th.accent} stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`orb1-${svgKey}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={th.accent} stopOpacity="0.22" />
              <stop offset="55%" stopColor={th.accent} stopOpacity="0.06" />
              <stop offset="100%" stopColor={th.accent} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`orb2-${svgKey}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={th.accentAlt} stopOpacity="0.16" />
              <stop offset="55%" stopColor={th.accentAlt} stopOpacity="0.04" />
              <stop offset="100%" stopColor={th.accentAlt} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`orb3-${svgKey}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={th.gridMajor} stopOpacity="0.18" />
              <stop offset="60%" stopColor={th.gridMajor} stopOpacity="0.04" />
              <stop offset="100%" stopColor={th.gridMajor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {isCleanStudio ? (
            /* === CLEAN STUDIO AMBIENT GLOW ORBS (TANPA GARIS GRID) === */
            <g>
              <circle cx={orb1X} cy={orb1Y} r="420" fill={`url(#orb1-${svgKey})`} />
              <circle cx={orb2X} cy={orb2Y} r="460" fill={`url(#orb2-${svgKey})`} />
              <circle cx={orb3X} cy={orb3Y} r="480" fill={`url(#orb3-${svgKey})`} />
              {activeTheme === "spotlight-twist" && (
                <g transform={`translate(540, 0) rotate(${spotlightAngle})`}>
                  <polygon points="-80,0 80,0 440,1500 -440,1500" fill={`url(#spotGrad-${svgKey})`} />
                </g>
              )}
              {activeTheme === "cyber-crash" && (
                <circle
                  cx="540"
                  cy="440"
                  r={260 + Math.sin(t * 3.5) * 28}
                  fill={`url(#orb1-${svgKey})`}
                  opacity={0.55 + Math.sin(t * 4) * 0.2}
                />
              )}
            </g>
          ) : (
            /* === MODE BLUEPRINT KLASIK === */
            <>
              <rect width="1080" height="1920" fill={`url(#gridMajor-${svgKey})`} />
              {activeTheme === "cyber-crash" && (
                <g opacity="0.35">
                  <circle cx="540" cy="440" r={180 + ((frame * 3) % 240)} fill="none" stroke={th.accent} strokeWidth="2.5" opacity={1 - ((frame * 3) % 240) / 240} />
                  <circle cx="540" cy="440" r="280" fill="none" stroke={th.accentAlt} strokeWidth="2" strokeDasharray="14 10" transform={`rotate(${frame * 0.5} 540 440)`} />
                  <rect x="0" y={scanlineY} width="1080" height="6" fill={th.accent} opacity="0.35" />
                  <rect x="0" y={scanlineY + 12} width="1080" height="2" fill={th.accentAlt} opacity="0.4" />
                </g>
              )}
              {activeTheme === "vintage-1947" && (
                <g opacity="0.35">
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
                  <circle cx="140" cy="760" r="95" fill="none" stroke={th.accentAlt} strokeWidth="2" strokeDasharray="8 8" transform={`rotate(${-gearSpin * 0.6} 140 760)`} />
                  <circle cx="940" cy="760" r="110" fill="none" stroke={th.accent} strokeWidth="2" strokeDasharray="12 10" transform={`rotate(${gearSpin * 0.5} 940 760)`} />
                </g>
              )}
              {activeTheme === "spotlight-twist" && (
                <g>
                  <g transform={`translate(540, 0) rotate(${spotlightAngle})`}>
                    <polygon points="-80,0 80,0 440,1500 -440,1500" fill={`url(#spotGrad-${svgKey})`} />
                  </g>
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
              {activeTheme === "archive-paper" && (
                <g opacity="0.32">
                  <circle cx="540" cy="430" r="340" fill="none" stroke={th.accent} strokeWidth="2" strokeDasharray="16 12" transform={`rotate(${frame * 0.35} 540 430)`} />
                  <circle cx="540" cy="430" r="440" fill="none" stroke={th.accentAlt} strokeWidth="1.5" strokeDasharray="6 14" transform={`rotate(${-frame * 0.25} 540 430)`} />
                </g>
              )}
              {activeTheme === "edison-1878" && (
                <g opacity="0.28">
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
                  <circle cx="540" cy="420" r="320" fill={th.accent} opacity="0.08" />
                </g>
              )}
              {activeTheme === "neon-coder" && (
                <g opacity="0.35">
                  <circle cx="540" cy="440" r="310" fill="none" stroke={th.accent} strokeWidth="2.5" strokeDasharray="24 14" transform={`rotate(${frame * 0.6} 540 440)`} />
                  <circle cx="540" cy="440" r="390" fill="none" stroke={th.accentAlt} strokeWidth="2" strokeDasharray="10 18" transform={`rotate(${-frame * 0.45} 540 440)`} />
                  <rect x="0" y={scanlineY} width="1080" height="4" fill={th.accent} opacity="0.4" />
                </g>
              )}
            </>
          )}

          {/* ================= 2. PARTIKEL AMBIENT MELAYANG (HALUS DI CLEAN STUDIO) ================= */}
          <g>
            {AMBIENT_PARTICLES.map((p) => {
              const py = ((p.y - frame * p.speed + 1400) % 1350) + 60;
              const px = p.x + Math.sin(t * p.speed + p.phase) * 18;
              const op = isCleanStudio
                ? 0.08 + 0.14 * (0.5 + 0.5 * Math.sin(t * 2.2 + p.phase))
                : 0.18 + 0.25 * (0.5 + 0.5 * Math.sin(t * 2.5 + p.phase));

              if (isCleanStudio) {
                return (
                  <circle
                    key={p.id}
                    cx={px}
                    cy={py}
                    r={p.size * 1.15}
                    fill={th.particleColor}
                    opacity={op}
                  />
                );
              }

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

          {/* ================= 3. LANTAI PANGGUNG STUDIO ================= */}
          <g>
            <rect x="0" y="1395" width="1080" height="525" fill={`url(#floorGrad-${svgKey})`} />
            {isCleanStudio ? (
              <>
                <line x1="0" y1="1395" x2="1080" y2="1395" stroke={`url(#horizonFade-${svgKey})`} strokeWidth="2.5" />
                <ellipse cx="540" cy="1445" rx="380" ry="46" fill={th.accent} opacity="0.14" />
              </>
            ) : (
              <>
                <line x1="0" y1="1395" x2="1080" y2="1395" stroke={th.accent} strokeWidth="3" opacity="0.65" />
                <line x1="0" y1="1399" x2="1080" y2="1399" stroke={th.gridMajor} strokeWidth="8" opacity="0.16" />
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
                <ellipse cx="540" cy="1445" rx="340" ry="38" fill={th.accent} opacity="0.1" />
              </>
            )}
          </g>

          {/* Corner Crop Marks (+) hanya di mode blueprint */}
          {preset.stageStyle === "blueprint" && (
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
          )}
        </svg>

        {/* Subtle Studio Vignette untuk kedalaman clean-studio */}
        {isCleanStudio && (
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(circle at 50% 45%, transparent 56%, rgba(2, 6, 18, 0.38) 100%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* Konten Utama Adegan (StageProp, Mascot, SFX) */}
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
