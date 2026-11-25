import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type MediaHighlightSpot = {
  /** Posisi horizontal pusat lingkaran dalam persen terhadap lebar foto (0–100) */
  xPct: number;
  /** Posisi vertikal pusat lingkaran dalam persen terhadap tinggi foto (0–100) */
  yPct: number;
  /** Radius lingkaran dalam persen terhadap lebar foto */
  radiusPct: number;
  /** Warna garis utama lingkaran (default "#FACC15") */
  color?: string;
  /** Warna pendar luar (default "#F43F5E") */
  glowColor?: string;
  /** Progres animasi gambar lingkaran 0..1 */
  progress?: number;
  /** Denyut ringan saat aktif */
  pulse?: boolean;
};

export type AnimatedMediaCardProps = {
  /** Path relatif di dalam public/, mis. "assets/episodes/cpu-igpu-vs-non-igpu/intel-i5-14400f.jpg" */
  assetPath: string;
  /** Posisi & ukuran dalam koordinat viewBox 800×450 (otomatis dikonversi ke % terhadap container 820×460) */
  x: number;
  y: number;
  width: number;
  height: number;
  borderColor?: string;
  glowColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  /** Amplitudo tilt 3D halus dalam derajat (default 3.5) */
  tiltAmp?: number;
  /** Fase offset animasi agar 2 kartu berdampingan bergerak bergantian (default 0) */
  phaseOffset?: number;
  /** Tampilkan kilau diagonal metalik menyapu permukaan foto (default true) */
  sheen?: boolean;
  /** Opsional lingkaran highlight vektor tepat di atas titik tertentu foto (mis. huruf "F") */
  highlightSpot?: MediaHighlightSpot;
};

/**
 * Menampilkan foto produk/hardware asli di dalam frame studio 3D yang bergerak deterministik,
 * dilengkapi kilau metalik dan highlight lingkaran vektor presisi di atas detail penting.
 */
export const AnimatedMediaCard: React.FC<AnimatedMediaCardProps> = ({
  assetPath,
  x,
  y,
  width,
  height,
  borderColor = "#38BDF8",
  glowColor = "rgba(56, 189, 248, 0.45)",
  borderWidth = 4,
  borderRadius = 16,
  tiltAmp = 3.5,
  phaseOffset = 0,
  sheen = true,
  highlightSpot,
}) => {
  const globalFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = globalFrame / fps;

  // Gerak 3D mengambang halus & tilt studio deterministik
  const rotY = Math.sin(t * 2.1 + phaseOffset) * tiltAmp;
  const rotX = Math.cos(t * 1.7 + phaseOffset) * (tiltAmp * 0.55);
  const bobY = Math.sin(t * 2.6 + phaseOffset) * 3.5;

  // Kilau metalik diagonal menyapu foto tiap ~3 detik
  const cycleFrames = Math.round(fps * 3);
  const offsetFrames = Math.round(Math.abs(phaseOffset) * 14);
  const cyclePos = (globalFrame + offsetFrames) % cycleFrames;
  const sweepFrames = Math.max(18, Math.round(fps * 1.05));
  const sheenActive = sheen && cyclePos <= sweepFrames;
  const sheenX = sheenActive
    ? interpolate(cyclePos, [0, sweepFrames], [-145, 195], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : -145;
  const sheenOpacity = sheenActive
    ? interpolate(cyclePos, [0, sweepFrames * 0.3, sweepFrames * 0.7, sweepFrames], [0, 0.85, 0.85, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Hitung parameter lingkaran highlight (tetap bulat proporsional meski box bukan 1:1)
  const clampedProgress = Math.max(0, Math.min(1, highlightSpot?.progress ?? 1));
  const spotColor = highlightSpot?.color ?? "#FACC15";
  const spotGlow = highlightSpot?.glowColor ?? "#F43F5E";
  const spotRx = highlightSpot?.radiusPct ?? 15;
  const spotRy = spotRx * (width / Math.max(1, height));
  // Keliling elips dengan rumus Ramanujan agar animasi strokeDashoffset mulus
  const ellipsePerimeter =
    Math.PI *
    (3 * (spotRx + spotRy) - Math.sqrt((3 * spotRx + spotRy) * (spotRx + 3 * spotRy)));
  const pulseWave = highlightSpot?.pulse ? 0.5 + 0.5 * Math.sin(t * 7.5 + phaseOffset) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: `${(x / 800) * 100}%`,
        top: `${(y / 450) * 100}%`,
        width: `${(width / 800) * 100}%`,
        height: `${(height / 450) * 100}%`,
        transform: `perspective(900px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translateY(${bobY.toFixed(2)}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: `${borderRadius}px`,
          overflow: "hidden",
          border: `${borderWidth}px solid ${borderColor}`,
          boxShadow: `0 14px 28px rgba(0, 0, 0, 0.48), 0 0 22px ${glowColor}`,
          backgroundColor: "#0B1324",
          boxSizing: "border-box",
        }}
      >
        <Img
          src={staticFile(assetPath)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {sheen && (
          <div
            style={{
              position: "absolute",
              top: "-15%",
              left: 0,
              width: "58%",
              height: "130%",
              background:
                "linear-gradient(110deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.34) 50%, rgba(255,255,255,0) 80%)",
              transform: `translateX(${sheenX}%) skewX(-18deg)`,
              opacity: sheenOpacity,
              pointerEvents: "none",
            }}
          />
        )}

        {highlightSpot && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
              pointerEvents: "none",
            }}
          >
            {highlightSpot.pulse && (
              <ellipse
                cx={highlightSpot.xPct}
                cy={highlightSpot.yPct}
                rx={spotRx * (1.12 + pulseWave * 0.2)}
                ry={spotRy * (1.12 + pulseWave * 0.2)}
                fill="none"
                stroke={spotGlow}
                strokeWidth="2.4"
                opacity={clampedProgress * (0.28 + (1 - pulseWave) * 0.42)}
              />
            )}
            <ellipse
              cx={highlightSpot.xPct}
              cy={highlightSpot.yPct}
              rx={spotRx}
              ry={spotRy}
              fill="rgba(250, 204, 21, 0.14)"
              fillOpacity={clampedProgress}
              stroke={spotGlow}
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeDasharray={ellipsePerimeter}
              strokeDashoffset={ellipsePerimeter * (1 - clampedProgress)}
            />
            <ellipse
              cx={highlightSpot.xPct}
              cy={highlightSpot.yPct}
              rx={spotRx}
              ry={spotRy}
              fill="none"
              stroke={spotColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={ellipsePerimeter}
              strokeDashoffset={ellipsePerimeter * (1 - clampedProgress)}
            />
          </svg>
        )}
      </div>
    </div>
  );
};
