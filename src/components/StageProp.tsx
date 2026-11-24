import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FONTS } from "../fonts";
import type { StagePropType } from "../episodes/types";

export interface StagePropProps {
  type: StagePropType;
  variant?: string;
  /** Frame sejak prop jenis ini pertama muncul di scene (untuk kontinuitas gerak) */
  propFrame: number;
  /** Frame lokal di dalam beat aktif (untuk animasi sub-aksi seperti stamp/crash) */
  beatFrame: number;
}

export const StageProp: React.FC<StagePropProps> = ({
  type,
  variant = "default",
  propFrame,
  beatFrame,
}) => {
  const globalFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = globalFrame / fps;

  // Animasi masuk elastis setiap ganti jenis prop utama
  const enterSpring = spring({
    frame: propFrame,
    fps,
    config: { damping: 13, stiffness: 190, mass: 0.75 },
  });
  const enterScale = interpolate(enterSpring, [0, 1], [0.65, 1]);
  const enterY = interpolate(enterSpring, [0, 1], [45, 0]);

  // Micro-punch elastis setiap pergantian variant / beat
  const beatPunch = spring({
    frame: beatFrame,
    fps,
    config: { damping: 14, stiffness: 240, mass: 0.6 },
  });
  const variantScale = 0.96 + beatPunch * 0.04;

  // Floating lembut
  const floatY = Math.sin(t * 3.2) * 5;

  const renderIllustration = () => {
    switch (type) {
      /* =====================================================================
         1. APP CRASH (Scene 1: Aplikasi error / crash -> BUG)
         ===================================================================== */
      case "app-crash": {
        const isCrashing = variant === "crashing" || variant === "bug-tag";
        const isBugTag = variant === "bug-tag";
        const glitchX = isCrashing ? Math.sin(globalFrame * 2.3) * 6 : 0;
        const glitchY = isCrashing ? Math.cos(globalFrame * 3.1) * 3 : 0;
        const alertScale = isCrashing
          ? spring({ frame: beatFrame, fps, config: { damping: 10, stiffness: 220 } })
          : 0;
        const bugTagScale = isBugTag
          ? spring({ frame: beatFrame, fps, config: { damping: 10, stiffness: 210 } })
          : 0;
        const loadProgress = (propFrame * 4) % 340;

        return (
          <g transform={`translate(${glitchX}, ${glitchY})`}>
            {/* Jendela Aplikasi / Smartphone Landscape Blueprint */}
            <rect x="130" y="55" width="540" height="330" rx="22" fill="#0F172A" stroke={isCrashing ? "#F43F5E" : "#38BDF8"} strokeWidth="6" />
            {/* Header Window */}
            <rect x="130" y="55" width="540" height="52" rx="18" fill={isCrashing ? "#4C0519" : "#1E293B"} stroke={isCrashing ? "#F43F5E" : "#38BDF8"} strokeWidth="4" />
            <circle cx="168" cy="81" r="9" fill="#F43F5E" />
            <circle cx="198" cy="81" r="9" fill="#FACC15" />
            <circle cx="228" cy="81" r="9" fill="#10B981" />
            <rect x="265" y="71" width="240" height="20" rx="10" fill="#0F172A" opacity="0.65" />

            {/* Baris UI Kode Aplikasi */}
            <rect x="175" y="138" width="210" height="18" rx="6" fill="#38BDF8" opacity="0.5" />
            <rect x="175" y="172" width="320" height="18" rx="6" fill="#818CF8" opacity="0.45" />
            <rect x="175" y="206" width="160" height="18" rx="6" fill="#38BDF8" opacity="0.35" />
            <rect x="355" y="206" width="180" height="18" rx="6" fill={isCrashing ? "#F43F5E" : "#10B981"} opacity="0.7" />

            {/* Loading Bar yang Macet */}
            <rect x="175" y="256" width="450" height="26" rx="13" fill="#1E293B" stroke="#334155" strokeWidth="3" />
            <rect
              x="179"
              y="260"
              width={isCrashing ? 310 : Math.min(442, loadProgress + 80)}
              height="18"
              rx="9"
              fill={isCrashing ? "#F43F5E" : "#00F5FF"}
            />

            {/* Garis Glitch Horizontal saat Crash */}
            {isCrashing && (
              <g opacity="0.75">
                <rect x="115" y={145 + (globalFrame % 120)} width="570" height="8" fill="#00F5FF" opacity="0.55" />
                <rect x="145" y={210 + ((globalFrame * 3) % 100)} width="510" height="6" fill="#F43F5E" opacity="0.65" />
              </g>
            )}

            {/* Popup Crash Merah Memantul */}
            {isCrashing && !isBugTag && (
              <g transform={`translate(400, 225) scale(${alertScale}) translate(-400, -225)`}>
                <rect x="210" y="140" width="380" height="170" rx="20" fill="#7F1D1D" stroke="#FACC15" strokeWidth="6" />
                {/* Segitiga Peringatan */}
                <polygon points="278,175 312,240 244,240" fill="#FACC15" stroke="#0F172A" strokeWidth="4" strokeLinejoin="round" />
                <text x="278" y="228" fontFamily={FONTS.title} fontSize="34" fontWeight="900" fill="#0F172A" textAnchor="middle">!</text>
                <text x="445" y="208" fontFamily={FONTS.title} fontSize="42" fontWeight="900" fill="#FFFFFF" textAnchor="middle">ERROR!</text>
                <text x="445" y="256" fontFamily={FONTS.label} fontSize="26" fontWeight="800" fill="#FDE047" textAnchor="middle">APP CRASHED</text>
              </g>
            )}

            {/* Tag Besar "BUG?" Saat Beat Menyebutnya Bug */}
            {isBugTag && (
              <g transform={`translate(400, 225) scale(${bugTagScale}) rotate(${Math.sin(t * 7) * 3}) translate(-400, -225)`}>
                <rect x="200" y="130" width="400" height="185" rx="28" fill="#FACC15" stroke="#0F172A" strokeWidth="8" />
                <rect x="216" y="146" width="368" height="153" rx="18" fill="none" stroke="#0F172A" strokeWidth="3" strokeDasharray="10 8" />
                <text x="400" y="252" fontFamily={FONTS.title} fontSize="112" fontWeight="900" fill="#0F172A" textAnchor="middle">“BUG”</text>
              </g>
            )}

            {/* Ikon X Merah Melayang di Sudut */}
            {isCrashing && (
              <>
                <g transform={`translate(105, ${100 + Math.sin(t * 6) * 10}) rotate(-12)`}>
                  <circle cx="0" cy="0" r="30" fill="#F43F5E" stroke="#0F172A" strokeWidth="5" />
                  <path d="M -11 -11 L 11 11 M 11 -11 L -11 11" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                </g>
                <g transform={`translate(700, ${325 + Math.cos(t * 5) * 10}) rotate(14)`}>
                  <circle cx="0" cy="0" r="28" fill="#FACC15" stroke="#0F172A" strokeWidth="5" />
                  <text x="0" y="12" fontFamily={FONTS.title} fontSize="34" fontWeight="900" fill="#0F172A" textAnchor="middle">?</text>
                </g>
              </>
            )}
          </g>
        );
      }

      /* =====================================================================
         2. BUG RADAR (Scene 1: Apakah benar dari serangga sungguhan?)
         ===================================================================== */
      case "bug-radar": {
        const sweep = (globalFrame * 4) % 360;
        const wingFlap = Math.sin(t * 24) * 14;
        const bugX = 400 + Math.sin(t * 2.6) * 115;
        const bugY = 215 + Math.cos(t * 4.2) * 42;
        const bugRot = Math.cos(t * 2.6) * 18;
        const isCloseup = variant === "closeup";
        const zoomF = isCloseup ? 1.18 : 1.0;

        return (
          <g transform={`translate(400, 225) scale(${zoomF}) translate(-400, -225)`}>
            {/* Lingkaran Radar Scanner */}
            <circle cx="400" cy="225" r="185" fill="#082F49" fillOpacity="0.65" stroke="#38BDF8" strokeWidth="5" />
            <circle cx="400" cy="225" r="125" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="10 8" opacity="0.65" />
            <circle cx="400" cy="225" r="65" fill="none" stroke="#00F5FF" strokeWidth="2" opacity="0.5" />
            <line x1="215" y1="225" x2="585" y2="225" stroke="#38BDF8" strokeWidth="1.5" opacity="0.4" />
            <line x1="400" y1="40" x2="400" y2="410" stroke="#38BDF8" strokeWidth="1.5" opacity="0.4" />

            {/* Sinar Sapuan Radar */}
            <g transform={`translate(400, 225) rotate(${sweep})`}>
              <path d="M 0 0 L 0 -182 A 182 182 0 0 1 110 -145 Z" fill="#00F5FF" opacity="0.22" />
              <line x1="0" y1="0" x2="0" y2="-182" stroke="#00F5FF" strokeWidth="3.5" />
            </g>

            {/* Jejak Terbang Putus-Putus */}
            <path
              d="M 275 230 Q 340 155 400 215 T 520 205"
              fill="none"
              stroke="#FACC15"
              strokeWidth="4"
              strokeDasharray="10 10"
              opacity="0.7"
            />

            {/* Serangga Hidup Terbang + Reticle Target */}
            <g transform={`translate(${bugX}, ${bugY}) rotate(${bugRot})`}>
              {/* Kotak Bidik Target */}
              <path d="M -58 -48 L -38 -48 M -58 -48 L -58 -28" stroke="#FACC15" strokeWidth="4" />
              <path d="M 58 -48 L 38 -48 M 58 -48 L 58 -28" stroke="#FACC15" strokeWidth="4" />
              <path d="M -58 48 L -38 48 M -58 48 L -58 28" stroke="#FACC15" strokeWidth="4" />
              <path d="M 58 48 L 38 48 M 58 48 L 58 28" stroke="#FACC15" strokeWidth="4" />

              {/* Sayap Mengepak */}
              <path d={`M 0 -5 C ${-65 + wingFlap} -55, ${-80 + wingFlap} 15, 0 22 Z`} fill="#FDE68A" stroke="#0F172A" strokeWidth="4.5" />
              <path d={`M 0 -5 C ${65 - wingFlap} -55, ${80 - wingFlap} 15, 0 22 Z`} fill="#FDE68A" stroke="#0F172A" strokeWidth="4.5" />
              {/* Antena */}
              <path d="M -5 -26 Q -22 -52 -34 -42" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 5 -26 Q 22 -52 34 -42" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="-34" cy="-42" r="5" fill="#FACC15" />
              <circle cx="34" cy="-42" r="5" fill="#FACC15" />
              {/* Badan Serangga */}
              <ellipse cx="0" cy="8" rx="15" ry="30" fill="#92400E" stroke="#0F172A" strokeWidth="4" />
              <line x1="-11" y1="-2" x2="11" y2="-2" stroke="#F59E0B" strokeWidth="3.5" />
              <line x1="-12" y1="10" x2="12" y2="10" stroke="#F59E0B" strokeWidth="3.5" />
              <line x1="-10" y1="22" x2="10" y2="22" stroke="#F59E0B" strokeWidth="3.5" />
              {/* Kepala & Mata Kartun Hidup */}
              <circle cx="0" cy="-22" r="13" fill="#451A03" stroke="#0F172A" strokeWidth="3.5" />
              <circle cx="-5" cy="-24" r="4.5" fill="#FFFFFF" />
              <circle cx="-5" cy="-24" r="2" fill="#0F172A" />
              <circle cx="5" cy="-24" r="4.5" fill="#FFFFFF" />
              <circle cx="5" cy="-24" r="2" fill="#0F172A" />
            </g>

            {/* Label Scanner Bawah */}
            <rect x="275" y="380" width="250" height="44" rx="12" fill="#FACC15" stroke="#0F172A" strokeWidth="4" />
            <text x="400" y="410" fontFamily={FONTS.title} fontSize="26" fontWeight="900" fill="#0F172A" textAnchor="middle">
              SERANGGA ASLI?
            </text>
          </g>
        );
      }

      /* =====================================================================
         3. CALENDAR 1947 (Scene 2: Iya beneran! -> 9 September 1947)
         ===================================================================== */
      case "calendar-1947": {
        const isConfirm = variant === "confirm";
        if (isConfirm) {
          const checkScale = spring({ frame: beatFrame, fps, config: { damping: 9, stiffness: 200 } });
          return (
            <g transform={`translate(400, 225) scale(${checkScale}) translate(-400, -225)`}>
              {/* Burst Lingkaran Hijau Cerah */}
              <circle cx="400" cy="215" r="165" fill="#065F46" stroke="#10B981" strokeWidth="8" />
              <circle cx="400" cy="215" r="135" fill="#10B981" stroke="#0F172A" strokeWidth="6" />
              {/* Centang Besar */}
              <path
                d="M 332 218 L 380 264 L 474 166"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="26"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Sparkle Bintang */}
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const dist = 195 + Math.sin(t * 8 + deg) * 12;
                const sx = 400 + Math.cos(rad) * dist;
                const sy = 215 + Math.sin(rad) * dist;
                return <circle key={deg} cx={sx} cy={sy} r="10" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />;
              })}
              <rect x="255" y="365" width="290" height="52" rx="16" fill="#FACC15" stroke="#0F172A" strokeWidth="5" />
              <text x="400" y="401" fontFamily={FONTS.title} fontSize="32" fontWeight="900" fill="#0F172A" textAnchor="middle">
                FAKTA NYATA!
              </text>
            </g>
          );
        }

        // Flip Calendar mendarat di 9 SEPTEMBER 1947
        const flipProg = Math.min(1, beatFrame / 18);
        const dayNum = flipProg < 1 ? Math.floor(1 + flipProg * 8) : 9;
        const yearNum = flipProg < 1 ? Math.floor(1940 + flipProg * 7) : 1947;
        const slamScale = spring({ frame: Math.max(0, beatFrame - 16), fps, config: { damping: 10, stiffness: 240 } });
        const calScale = flipProg < 1 ? 0.94 : 0.94 + slamScale * 0.1;

        return (
          <g transform={`translate(400, 225) scale(${calScale}) translate(-400, -225)`}>
            {/* Bayangan Kalender */}
            <rect x="218" y="68" width="380" height="330" rx="28" fill="#020617" opacity="0.45" />
            {/* Badan Kalender Retro */}
            <rect x="205" y="55" width="390" height="335" rx="26" fill="#FEF3C7" stroke="#0F172A" strokeWidth="7" />
            {/* Header Merah Kalender */}
            <path d="M 205 81 Q 205 55 231 55 L 569 55 Q 595 55 595 81 L 595 142 L 205 142 Z" fill="#DC2626" stroke="#0F172A" strokeWidth="7" />
            {/* Ring Pengait Besi */}
            <rect x="280" y="30" width="22" height="52" rx="10" fill="#94A3B8" stroke="#0F172A" strokeWidth="5" />
            <rect x="498" y="30" width="22" height="52" rx="10" fill="#94A3B8" stroke="#0F172A" strokeWidth="5" />

            {/* Bulan */}
            <text x="400" y="114" fontFamily={FONTS.title} fontSize="42" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="4">
              SEPTEMBER
            </text>
            {/* Tanggal Besar */}
            <text x="400" y="285" fontFamily={FONTS.title} fontSize="165" fontWeight="900" fill="#0F172A" textAnchor="middle">
              {dayNum}
            </text>
            {/* Pita Tahun 1947 */}
            <rect x="285" y="315" width="230" height="56" rx="14" fill="#0F172A" />
            <text x="400" y="355" fontFamily={FONTS.title} fontSize="40" fontWeight="900" fill="#FACC15" textAnchor="middle" letterSpacing="6">
              {yearNum}
            </text>
          </g>
        );
      }

      /* =====================================================================
         4. HARVARD MARK II MAINFRAME (Scene 2: Komputer raksasa -> Macet total!)
         ===================================================================== */
      case "harvard-mark2": {
        const isCrashing = variant === "crashing";
        const isLabel = variant === "label" || isCrashing;
        const reelSpin = isCrashing ? Math.sin(globalFrame * 2) * 8 : propFrame * 5.5;
        const shakeX = isCrashing ? Math.sin(globalFrame * 2.8) * 9 : 0;
        const shakeY = isCrashing ? Math.cos(globalFrame * 3.4) * 5 : 0;

        return (
          <g transform={`translate(${shakeX}, ${shakeY})`}>
            {/* Rak Mainframe Raksasa Harvard Mark II (3 Kabinet Besar) */}
            <rect x="75" y="60" width="650" height="335" rx="18" fill="#1E293B" stroke="#0F172A" strokeWidth="7" />
            {/* Sekat 3 Panel */}
            <rect x="95" y="80" width="190" height="295" rx="10" fill="#334155" stroke="#0F172A" strokeWidth="4" />
            <rect x="305" y="80" width="190" height="295" rx="10" fill="#334155" stroke="#0F172A" strokeWidth="4" />
            <rect x="515" y="80" width="190" height="295" rx="10" fill="#334155" stroke="#0F172A" strokeWidth="4" />

            {/* Gulungan Pita Kertas / Reel Kiri & Kanan */}
            <g transform={`translate(190, 175) rotate(${reelSpin})`}>
              <circle cx="0" cy="0" r="62" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
              <circle cx="0" cy="0" r="46" fill="#E2E8F0" stroke="#0F172A" strokeWidth="3" />
              <line x1="-42" y1="0" x2="42" y2="0" stroke="#0F172A" strokeWidth="8" />
              <line x1="0" y1="-42" x2="0" y2="42" stroke="#0F172A" strokeWidth="8" />
              <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            </g>
            <g transform={`translate(610, 175) rotate(${-reelSpin * 1.15})`}>
              <circle cx="0" cy="0" r="62" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
              <circle cx="0" cy="0" r="46" fill="#E2E8F0" stroke="#0F172A" strokeWidth="3" />
              <line x1="-42" y1="0" x2="42" y2="0" stroke="#0F172A" strokeWidth="8" />
              <line x1="0" y1="-42" x2="0" y2="42" stroke="#0F172A" strokeWidth="8" />
              <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            </g>

            {/* Panel Tengah: Deretan Lampu Indikator Tabung Vakum */}
            <rect x="325" y="102" width="150" height="105" rx="8" fill="#0F172A" stroke="#475569" strokeWidth="3" />
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3, 4].map((col) => {
                const blink = ((globalFrame + row * 7 + col * 11) % 24) < 12;
                const lampColor = isCrashing
                  ? blink
                    ? "#EF4444"
                    : "#7F1D1D"
                  : blink
                    ? col % 2 === 0
                      ? "#38BDF8"
                      : "#FACC15"
                    : "#1E293B";
                return (
                  <circle
                    key={`l-${row}-${col}`}
                    cx={346 + col * 27}
                    cy={122 + row * 22}
                    r="7"
                    fill={lampColor}
                  />
                );
              })
            )}

            {/* Meteran Jarum Analog di Panel Tengah */}
            <rect x="325" y="224" width="150" height="65" rx="8" fill="#FEF3C7" stroke="#0F172A" strokeWidth="4" />
            <path d="M 345 276 A 55 55 0 0 1 455 276" fill="none" stroke="#94A3B8" strokeWidth="4" />
            <line
              x1="400"
              y1="278"
              x2={400 + Math.sin(isCrashing ? Math.sin(globalFrame * 3) * 1.4 : Math.sin(t * 4) * 0.9) * 46}
              y2={278 - Math.cos(isCrashing ? 0.6 : Math.sin(t * 4) * 0.9) * 46}
              stroke="#DC2626"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="400" cy="278" r="6" fill="#0F172A" />

            {/* Kisi Ventilasi Bawah */}
            {[0, 1, 2, 3].map((i) => (
              <g key={`v-${i}`}>
                <rect x="115" y={272 + i * 22} width="150" height="10" rx="4" fill="#0F172A" />
                <rect x="535" y={272 + i * 22} width="150" height="10" rx="4" fill="#0F172A" />
              </g>
            ))}

            {/* Plat Nama Kuningan HARVARD MARK II (aman dari progress bar atas) */}
            {isLabel && (
              <g>
                <rect x="245" y="42" width="310" height="46" rx="10" fill="#FACC15" stroke="#0F172A" strokeWidth="5" />
                <text x="400" y="74" fontFamily={FONTS.title} fontSize="28" fontWeight="900" fill="#0F172A" textAnchor="middle">
                  HARVARD MARK II
                </text>
              </g>
            )}

            {/* Percikan Listrik, Asap & Banner MACET TOTAL! saat crashing */}
            {isCrashing && (
              <g>
                {/* Petir Korslet */}
                <path d="M 290 120 L 335 160 L 308 175 L 360 225" fill="none" stroke="#FACC15" strokeWidth="8" strokeLinejoin="round" />
                <path d="M 520 130 L 475 170 L 502 185 L 455 230" fill="none" stroke="#00F5FF" strokeWidth="7" strokeLinejoin="round" />
                {/* Kepulan Asap Kartun Naik */}
                {[0, 1, 2, 3].map((i) => {
                  const rise = ((beatFrame * 2.5 + i * 28) % 110);
                  const op = Math.max(0, 0.85 - rise / 110);
                  return (
                    <circle
                      key={`sm-${i}`}
                      cx={270 + i * 85 + Math.sin(t * 5 + i) * 14}
                      cy={105 - rise}
                      r={24 + rise * 0.25}
                      fill="#CBD5E1"
                      stroke="#475569"
                      strokeWidth="3"
                      opacity={op}
                    />
                  );
                })}
                {/* Banner Merah MACET TOTAL! */}
                <g transform={`translate(400, 340) rotate(${Math.sin(t * 14) * 2.5}) translate(-400, -340)`}>
                  <rect x="210" y="305" width="380" height="72" rx="16" fill="#DC2626" stroke="#FACC15" strokeWidth="6" />
                  <text x="400" y="354" fontFamily={FONTS.title} fontSize="42" fontWeight="900" fill="#FFFFFF" textAnchor="middle">
                    ⚠ MACET TOTAL!
                  </text>
                </g>
              </g>
            )}
          </g>
        );
      }

      /* =====================================================================
         5. HOPPER INSPECT (Scene 3: Dibongkar oleh tim Grace Hopper)
         ===================================================================== */
      case "hopper-inspect": {
        const openProg = spring({ frame: propFrame, fps, config: { damping: 14, stiffness: 120 } });
        const doorSlide = openProg * 145;
        const wrenchRot = Math.sin(t * 8) * 28;
        const showBadge = variant === "portrait";
        const badgeScale = showBadge
          ? spring({ frame: beatFrame, fps, config: { damping: 12, stiffness: 200 } })
          : 0;

        return (
          <g>
            {/* Kabinet Mesin Terbuka */}
            <rect x="145" y="55" width="510" height="330" rx="20" fill="#090D16" stroke="#FACC15" strokeWidth="6" />
            {/* Kabel & Sirkuit Bagian Dalam */}
            <path d="M 200 120 Q 320 190 400 130 T 600 180" fill="none" stroke="#38BDF8" strokeWidth="5" opacity="0.6" />
            <path d="M 200 280 Q 340 210 460 290 T 600 240" fill="none" stroke="#F43F5E" strokeWidth="5" opacity="0.6" />
            <circle cx="400" cy="215" r="78" fill="#FACC15" opacity="0.16" />

            {/* Pintu Baja Kiri & Kanan Membuka Keluar */}
            <rect x={145 - doorSlide * 0.4} y="55" width={Math.max(40, 255 - doorSlide)} height="330" rx="12" fill="#334155" stroke="#0F172A" strokeWidth="6" />
            <rect x={400 + doorSlide * 1.4} y="55" width={Math.max(40, 255 - doorSlide)} height="330" rx="12" fill="#334155" stroke="#0F172A" strokeWidth="6" />

            {/* Kunci Inggris Memutar Baut (saat opening) */}
            {!showBadge && (
              <g transform={`translate(400, 220) rotate(${wrenchRot})`}>
                <rect x="-18" y="-95" width="36" height="190" rx="14" fill="#CBD5E1" stroke="#0F172A" strokeWidth="6" />
                <circle cx="0" cy="-95" r="42" fill="#CBD5E1" stroke="#0F172A" strokeWidth="6" />
                <rect x="-18" y="-140" width="36" height="52" fill="#090D16" />
                <circle cx="0" cy="95" r="30" fill="#CBD5E1" stroke="#0F172A" strokeWidth="6" />
                <circle cx="0" cy="95" r="12" fill="#0F172A" />
              </g>
            )}

            {/* Kartu Penghormatan Tim Grace Hopper */}
            {showBadge && (
              <g transform={`translate(400, 220) scale(${badgeScale}) translate(-400, -220)`}>
                <rect x="190" y="95" width="420" height="250" rx="22" fill="#1E293B" stroke="#38BDF8" strokeWidth="6" />
                {/* Emblem Bintang Navy */}
                <circle cx="280" cy="215" r="60" fill="#0EA5E9" stroke="#FACC15" strokeWidth="5" />
                <polygon
                  points="280,170 293,200 326,200 299,220 309,252 280,232 251,252 261,220 234,200 267,200"
                  fill="#FACC15"
                  stroke="#0F172A"
                  strokeWidth="3.5"
                />
                {/* Teks Profil Ilmiah */}
                <text x="360" y="175" fontFamily={FONTS.label} fontSize="22" fontWeight="800" fill="#38BDF8">TIM ILMUWAN 1947</text>
                <text x="360" y="222" fontFamily={FONTS.title} fontSize="36" fontWeight="900" fill="#FFFFFF">GRACE HOPPER</text>
                <rect x="360" y="245" width="215" height="38" rx="10" fill="#FACC15" />
                <text x="468" y="272" fontFamily={FONTS.label} fontSize="20" fontWeight="900" fill="#0F172A" textAnchor="middle">HARVARD MARK II</text>
              </g>
            )}
          </g>
        );
      }

      /* =====================================================================
         6. RELAY MOTH TRAP (Scene 3: Ngengat gosong terjepit di Relay #70!)
         ===================================================================== */
      case "relay-moth-trap": {
        const isRelay70 = variant === "relay70";
        const isMothZoom = variant === "moth-zoom";
        const macroScale = isMothZoom ? 1.03 : 1.0;
        const zapOn = (globalFrame % 8) < 4;
        const wingTremble = Math.sin(globalFrame * 2.5) * 6;

        return (
          <g transform={`translate(400, 235) scale(${macroScale}) translate(-400, -235)`}>
            {/* Bingkai Makro Relay Panel F */}
            <rect x="110" y="75" width="580" height="325" rx="26" fill="#1E293B" stroke={isRelay70 ? "#FACC15" : "#FB7185"} strokeWidth="7" />
            <rect x="132" y="97" width="536" height="281" rx="16" fill="#0F172A" stroke="#334155" strokeWidth="3" />

            {/* Kumparan Tembaga Relay (Kiri) */}
            <rect x="165" y="148" width="115" height="172" rx="12" fill="#92400E" stroke="#0F172A" strokeWidth="5" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line key={`coil-${i}`} x1="168" y1={168 + i * 22} x2="277" y2={168 + i * 22} stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
            ))}
            <rect x="155" y="135" width="135" height="18" rx="6" fill="#94A3B8" stroke="#0F172A" strokeWidth="4" />
            <rect x="155" y="315" width="135" height="18" rx="6" fill="#94A3B8" stroke="#0F172A" strokeWidth="4" />

            {/* Capit / Sakelar Kontak Logam Relay (Kanan) Menjepit Ngengat! */}
            <line x1="355" y1="348" x2="460" y2="238" stroke="#94A3B8" strokeWidth="18" strokeLinecap="round" />
            <line x1="610" y1="348" x2="515" y2="238" stroke="#38BDF8" strokeWidth="18" strokeLinecap="round" />
            <circle cx="462" cy="238" r="18" fill="#E2E8F0" stroke="#0F172A" strokeWidth="5" />
            <circle cx="514" cy="238" r="18" fill="#E2E8F0" stroke="#0F172A" strokeWidth="5" />

            {/* NGENGAT GOSONG TERJEPIT DI TENGAH KONTAK! */}
            <g transform={`translate(488, 228) rotate(${Math.sin(globalFrame * 1.6) * 4})`}>
              {/* Asap Gosong Naik */}
              {[0, 1, 2].map((i) => {
                const rise = ((globalFrame * 2 + i * 32) % 85);
                return (
                  <circle
                    key={`ms-${i}`}
                    cx={-18 + i * 18 + Math.sin(t * 6 + i) * 8}
                    cy={-52 - rise}
                    r={13 + rise * 0.14}
                    fill="#94A3B8"
                    opacity={Math.max(0, 0.75 - rise / 85)}
                  />
                );
              })}
              {/* Sayap Ngengat Gosong */}
              <path d={`M 0 -5 C ${-78 + wingTremble} -60, ${-92 + wingTremble} 28, 0 34 Z`} fill="#FDE68A" stroke="#0F172A" strokeWidth="5" />
              <path d={`M 0 -5 C ${78 - wingTremble} -60, ${92 - wingTremble} 28, 0 34 Z`} fill="#FDE68A" stroke="#0F172A" strokeWidth="5" />
              {/* Noda Gosong di Sayap */}
              <circle cx="-42" cy="2" r="12" fill="#451A03" opacity="0.55" />
              <circle cx="44" cy="4" r="12" fill="#451A03" opacity="0.55" />
              {/* Antena Keriting */}
              <path d="M -8 -34 Q -24 -64 -40 -52" fill="none" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
              <path d="M 8 -34 Q 24 -64 40 -52" fill="none" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
              {/* Badan Ngengat */}
              <ellipse cx="0" cy="14" rx="18" ry="38" fill="#78350F" stroke="#0F172A" strokeWidth="5" />
              <line x1="-14" y1="2" x2="14" y2="2" stroke="#D97706" strokeWidth="4" />
              <line x1="-15" y1="16" x2="15" y2="16" stroke="#D97706" strokeWidth="4" />
              <line x1="-13" y1="30" x2="13" y2="30" stroke="#D97706" strokeWidth="4" />
              {/* Kepala & Mata Silang × × */}
              <circle cx="0" cy="-28" r="16" fill="#451A03" stroke="#0F172A" strokeWidth="4" />
              <text x="-6" y="-23" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="#FFFFFF" textAnchor="middle">×</text>
              <text x="6" y="-23" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="#FFFFFF" textAnchor="middle">×</text>
            </g>

            {/* Percikan Listrik ZAP! */}
            {zapOn && (
              <g>
                <path d="M 435 178 L 460 203 L 444 218 L 474 241" fill="none" stroke="#00F5FF" strokeWidth="6" strokeLinejoin="round" />
                <path d="M 548 173 L 520 205 L 538 218 L 508 245" fill="none" stroke="#FACC15" strokeWidth="6" strokeLinejoin="round" />
              </g>
            )}

            {/* Plat Label Kuning RELAY #70 · PANEL F (lebar lega & aman dari tepi atas) */}
            <g transform={`translate(400, 72) scale(${isRelay70 ? 1.08 + Math.sin(t * 10) * 0.03 : 1}) translate(-400, -72)`}>
              <rect x="215" y="42" width="370" height="58" rx="14" fill="#FACC15" stroke="#0F172A" strokeWidth="6" />
              <text x="400" y="81" fontFamily={FONTS.title} fontSize="32" fontWeight="900" fill="#0F172A" textAnchor="middle">
                RELAY #70 · PANEL F
              </text>
            </g>
          </g>
        );
      }

      /* =====================================================================
         7. LOGBOOK TAPE (Scene 4: Dicabut -> Ditempel di Logbook -> Stamp!)
         ===================================================================== */
      case "logbook-tape": {
        const isPull = variant === "pull";
        const isStamp = variant === "stamp";

        if (isPull) {
          const liftY = interpolate(beatFrame, [0, 24], [60, -35], { extrapolateRight: "clamp" });
          return (
            <g>
              {/* Pinset Perak Mencabut Ngengat */}
              <g transform={`translate(400, ${210 + liftY})`}>
                {/* Bilah Pinset */}
                <path d="M -85 -170 L -14 -12" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
                <path d="M 85 -170 L 14 -12" stroke="#CBD5E1" strokeWidth="14" strokeLinecap="round" />
                <path d="M -85 -170 L 85 -170" stroke="#94A3B8" strokeWidth="18" strokeLinecap="round" />
                {/* Ngengat yang Diangkat */}
                <path d="M 0 0 C -65 -35, -75 30, 0 38 Z" fill="#FDE68A" stroke="#0F172A" strokeWidth="4.5" />
                <path d="M 0 0 C 65 -35, 75 30, 0 38 Z" fill="#FDE68A" stroke="#0F172A" strokeWidth="4.5" />
                <ellipse cx="0" cy="18" rx="15" ry="30" fill="#78350F" stroke="#0F172A" strokeWidth="4" />
                <circle cx="0" cy="-16" r="12" fill="#451A03" stroke="#0F172A" strokeWidth="3.5" />
                <text x="-5" y="-12" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#FFFFFF" textAnchor="middle">×</text>
                <text x="5" y="-12" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#FFFFFF" textAnchor="middle">×</text>
              </g>
              {/* Indikator Panah Cabut */}
              <path d="M 210 280 L 210 155 M 188 182 L 210 150 L 232 182" fill="none" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 590 280 L 590 155 M 568 182 L 590 150 L 612 182" fill="none" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        }

        // Buku Logbook Resmi Harvard Mark II Terbuka + Selotip + Stempel!
        const tapeProgress = interpolate(beatFrame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
        const stampSpring = isStamp
          ? spring({ frame: beatFrame, fps, config: { damping: 9, stiffness: 260 } })
          : 0;

        return (
          <g>
            {/* Sampul Kulit Cokelat Buku Logbook */}
            <rect x="85" y="48" width="630" height="354" rx="18" fill="#78350F" stroke="#0F172A" strokeWidth="7" />
            {/* Halaman Kiri & Kanan Kertas Krem Arsip */}
            <rect x="106" y="64" width="290" height="322" rx="6" fill="#FEF3C7" stroke="#0F172A" strokeWidth="3.5" />
            <rect x="404" y="64" width="290" height="322" rx="6" fill="#FFFBEB" stroke="#0F172A" strokeWidth="3.5" />
            <line x1="400" y1="56" x2="400" y2="394" stroke="#451A03" strokeWidth="6" />

            {/* Garis Buku Tulis */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((r) => (
              <g key={`ln-${r}`} stroke="#93C5FD" strokeWidth="2" opacity="0.65">
                <line x1="126" y1={115 + r * 34} x2="376" y2={115 + r * 34} />
                <line x1="424" y1={115 + r * 34} x2="674" y2={115 + r * 34} />
              </g>
            ))}

            {/* Catatan Kiri: Tanggal & Jam Asli Sejarah (15:45) */}
            <text x="130" y="102" fontFamily={FONTS.label} fontSize="22" fontWeight="900" fill="#1E3A8A">9 SEPT 1947</text>
            <text x="130" y="142" fontFamily="monospace" fontSize="22" fontWeight="700" fill="#334155">15:45 · RELAY #70</text>
            <text x="130" y="176" fontFamily="monospace" fontSize="19" fontWeight="700" fill="#475569">PANEL F · MARK II</text>
            <text x="130" y="246" fontFamily={FONTS.label} fontSize="20" fontWeight="800" fill="#0F172A">“First actual case</text>
            <text x="130" y="278" fontFamily={FONTS.label} fontSize="20" fontWeight="800" fill="#0F172A">of bug being found.”</text>

            {/* Halaman Kanan: Ngengat Ditempel dengan Selotip Transparan! */}
            <g transform="translate(550, 210) rotate(-14)">
              <path d="M 0 -4 C -58 -40, -68 20, 0 26 Z" fill="#FDE68A" stroke="#0F172A" strokeWidth="4" />
              <path d="M 0 -4 C 58 -40, 68 20, 0 26 Z" fill="#FDE68A" stroke="#0F172A" strokeWidth="4" />
              <ellipse cx="0" cy="10" rx="12" ry="26" fill="#78350F" stroke="#0F172A" strokeWidth="3.5" />
              <circle cx="0" cy="-18" r="10" fill="#451A03" stroke="#0F172A" strokeWidth="3" />
              {/* Selotip Bening Menempel Melintang */}
              <rect
                x="-82"
                y="-14"
                width={isStamp ? 164 : 164 * tapeProgress}
                height="36"
                rx="4"
                fill="#FDE047"
                fillOpacity="0.48"
                stroke="#CA8A04"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            </g>

            {/* Stempel Merah Membanting saat variant="stamp" */}
            {isStamp && (
              <g transform={`translate(548, 310) rotate(-8) scale(${interpolate(stampSpring, [0, 1], [2.1, 1])}) translate(-548, -310)`}>
                <rect x="422" y="274" width="252" height="72" rx="10" fill="#FEE2E2" fillOpacity="0.92" stroke="#DC2626" strokeWidth="6" />
                <text x="548" y="307" fontFamily={FONTS.title} fontSize="23" fontWeight="900" fill="#DC2626" textAnchor="middle">
                  1ST ACTUAL BUG
                </text>
                <text x="548" y="334" fontFamily={FONTS.label} fontSize="18" fontWeight="900" fill="#991B1B" textAnchor="middle">
                  ★ TERVERIFIKASI ★
                </text>
              </g>
            )}
          </g>
        );
      }

      /* =====================================================================
         8. DEBUGGING GLOBE (Scene 4: Dari sinilah istilah debugging mendunia!)
         ===================================================================== */
      case "debugging-globe": {
        const isGlobal = variant === "global";
        const rot = globalFrame * 1.5;
        const pulse = (globalFrame * 4) % 160;
        const tags = [
          { label: "DEBUGGING", x: 400, y: 78, bg: "#FACC15", fg: "#0F172A" },
          { label: "FIX()", x: 165, y: 175, bg: "#38BDF8", fg: "#0F172A" },
          { label: "PATCH", x: 635, y: 175, bg: "#10B981", fg: "#0F172A" },
          { label: "NO BUGS ✓", x: 625, y: 330, bg: "#818CF8", fg: "#FFFFFF" },
          { label: "0x70", x: 175, y: 330, bg: "#F43F5E", fg: "#FFFFFF" },
        ];

        return (
          <g>
            {/* Gelombang Sinyal Mendunia */}
            <circle cx="400" cy="235" r={120 + pulse} fill="none" stroke="#00F5FF" strokeWidth="4" opacity={Math.max(0, 0.7 - pulse / 160)} />
            <circle cx="400" cy="235" r={120 + ((pulse + 80) % 160)} fill="none" stroke="#FACC15" strokeWidth="3" opacity={Math.max(0, 0.65 - ((pulse + 80) % 160) / 160)} />

            {/* Bola Dunia Blueprint */}
            <circle cx="400" cy="235" r="135" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="6" />
            {/* Garis Lintang & Bujur Berputar */}
            <ellipse cx="400" cy="235" rx={Math.abs(Math.cos((rot * Math.PI) / 180)) * 130 + 12} ry="135" fill="none" stroke="#38BDF8" strokeWidth="3" opacity="0.7" />
            <ellipse cx="400" cy="235" rx={Math.abs(Math.sin((rot * Math.PI) / 180)) * 130 + 12} ry="135" fill="none" stroke="#00F5FF" strokeWidth="2.5" opacity="0.55" />
            <ellipse cx="400" cy="235" rx="135" ry="52" fill="none" stroke="#38BDF8" strokeWidth="3" opacity="0.65" />
            <line x1="265" y1="235" x2="535" y2="235" stroke="#38BDF8" strokeWidth="3" opacity="0.7" />
            <line x1="400" y1="100" x2="400" y2="370" stroke="#38BDF8" strokeWidth="2.5" opacity="0.5" />

            {/* Node Kota Bercahaya */}
            {[
              { x: 350, y: 195 },
              { x: 455, y: 210 },
              { x: 410, y: 280 },
              { x: 330, y: 265 },
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r={7 + Math.sin(t * 7 + i) * 2.5} fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
            ))}

            {/* Pill Tag Istilah Debugging Menyebar */}
            {tags.map((tg, i) => {
              const show = isGlobal || i === 0;
              if (!show) return null;
              const s = spring({ frame: Math.max(0, beatFrame - i * 3), fps, config: { damping: 12, stiffness: 210 } });
              const bob = Math.sin(t * 4 + i * 1.4) * 7;
              return (
                <g key={tg.label} transform={`translate(${tg.x}, ${tg.y + bob}) scale(${s})`}>
                  <rect x="-105" y="-28" width="210" height="56" rx="16" fill={tg.bg} stroke="#0F172A" strokeWidth="5" />
                  <text x="0" y="10" fontFamily={FONTS.title} fontSize="28" fontWeight="900" fill={tg.fg} textAnchor="middle">
                    {tg.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }

      /* =====================================================================
         9. TIME REWIND (Scene 5: Tapi plot twist-nya... 1947 -> 1878!)
         ===================================================================== */
      case "time-rewind": {
        const rewindProg = Math.min(1, propFrame / 36);
        const yearDisplay = Math.round(1947 - rewindProg * (1947 - 1878));
        const handMin = -globalFrame * 18;
        const handHour = -globalFrame * 4;

        return (
          <g>
            {/* Lingkaran Jam Mesin Waktu Mundur */}
            <circle cx="400" cy="195" r="145" fill="#291A0B" stroke="#FBBF24" strokeWidth="8" />
            <circle cx="400" cy="195" r="122" fill="#451A03" stroke="#F59E0B" strokeWidth="3" strokeDasharray="10 8" />
            {/* Angka Jam */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={400 + Math.cos(rad) * 102}
                  y1={195 + Math.sin(rad) * 102}
                  x2={400 + Math.cos(rad) * 116}
                  y2={195 + Math.sin(rad) * 116}
                  stroke="#FDE047"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              );
            })}
            {/* Jarum Jam Berputar Mundur Cepat! */}
            <g transform={`translate(400, 195) rotate(${handHour})`}>
              <line x1="0" y1="0" x2="0" y2="-68" stroke="#FDE047" strokeWidth="10" strokeLinecap="round" />
            </g>
            <g transform={`translate(400, 195) rotate(${handMin})`}>
              <line x1="0" y1="0" x2="0" y2="-98" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
            </g>
            <circle cx="400" cy="195" r="12" fill="#FACC15" stroke="#0F172A" strokeWidth="4" />

            {/* Panah Melengkung Rewind */}
            <path d="M 225 195 A 175 175 0 0 1 320 45" fill="none" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" strokeDasharray="16 10" />
            <polygon points="212,186 244,186 226,220" fill="#FACC15" />

            {/* Odometer Tahun Mundur 1947 -> 1878 */}
            <rect x="235" y="348" width="330" height="72" rx="18" fill="#0F172A" stroke="#FACC15" strokeWidth="6" />
            <text x="400" y="400" fontFamily={FONTS.title} fontSize="52" fontWeight="900" fill="#FACC15" textAnchor="middle" letterSpacing="8">
              ⏪ {yearDisplay}
            </text>
          </g>
        );
      }

      /* =====================================================================
         10. EDISON 1878 (Scene 5: Cacat mesin ditulis Thomas Edison 1878!)
         ===================================================================== */
      case "edison-1878": {
        const isBulb = variant === "bulb";
        const isQuill = variant === "quill" || isBulb;
        const gearAngle = variant === "gears" ? Math.sin(globalFrame * 0.9) * 14 : globalFrame * 1.4;
        const glowPulse = 0.25 + 0.15 * Math.sin(t * 7);
        const quillX = 638 + Math.sin(t * 9) * 16;
        const quillY = 324 + Math.cos(t * 14) * 5;

        return (
          <g>
            {/* Kiri: Roda Gigi Mesin Cacat / Macet */}
            <g transform={`translate(185, 225) rotate(${gearAngle})`}>
              <circle cx="0" cy="0" r="78" fill="#B45309" stroke="#0F172A" strokeWidth="6" />
              <circle cx="0" cy="0" r="88" fill="none" stroke="#F59E0B" strokeWidth="18" strokeDasharray="20 15" />
              <circle cx="0" cy="0" r="32" fill="#291A0B" stroke="#0F172A" strokeWidth="5" />
            </g>
            <g transform={`translate(285, 315) rotate(${-gearAngle * 1.4})`}>
              <circle cx="0" cy="0" r="46" fill="#D97706" stroke="#0F172A" strokeWidth="5" />
              <circle cx="0" cy="0" r="54" fill="none" stroke="#FBBF24" strokeWidth="14" strokeDasharray="14 11" />
              <circle cx="0" cy="0" r="18" fill="#291A0B" stroke="#0F172A" strokeWidth="4" />
            </g>

            {/* Kanan: Surat Perkamen Edison 1878 */}
            <rect x="345" y="95" width="355" height="275" rx="16" fill="#FEF3C7" stroke="#0F172A" strokeWidth="7" />
            <line x1="378" y1="158" x2="665" y2="158" stroke="#D97706" strokeWidth="3" opacity="0.5" />
            <line x1="378" y1="210" x2="665" y2="210" stroke="#D97706" strokeWidth="3" opacity="0.5" />
            <line x1="378" y1="262" x2="665" y2="262" stroke="#D97706" strokeWidth="3" opacity="0.5" />

            <text x="522" y="144" fontFamily={FONTS.label} fontSize="24" fontWeight="900" fill="#92400E" textAnchor="middle">
              SURAT PATEN · 1878
            </text>
            <text x="522" y="202" fontFamily={FONTS.title} fontSize="42" fontWeight="900" fill="#0F172A" textAnchor="middle">
              “BUGS”
            </text>
            <text x="522" y="250" fontFamily={FONTS.label} fontSize="22" fontWeight="800" fill="#78350F" textAnchor="middle">
              = Cacat Mekanis Mesin
            </text>
            <text x="522" y="330" fontFamily={FONTS.title} fontSize="28" fontWeight="900" fill="#B45309" textAnchor="middle">
              — Thomas Edison
            </text>

            {/* Pena Bulu Menulis Aktif */}
            {isQuill && (
              <g transform={`translate(${quillX}, ${quillY}) rotate(-28)`}>
                <path d="M 0 0 Q 25 -55 75 -115 Q 92 -72 28 -18 Z" fill="#FDE68A" stroke="#0F172A" strokeWidth="4.5" />
                <line x1="0" y1="0" x2="72" y2="-110" stroke="#92400E" strokeWidth="4" />
                <circle cx="0" cy="0" r="5" fill="#0F172A" />
              </g>
            )}

            {/* Bohlam Filamen Edison Bersinar di Atas Kiri (aman dari HUD atas) */}
            <g transform={`translate(195, 132) scale(${isBulb ? 1.05 : 0.9})`}>
              <circle cx="0" cy="0" r="88" fill="#FDE047" opacity={glowPulse} />
              <path
                d="M -32 -12 C -32 -52 32 -52 32 -12 C 32 8 18 20 18 38 L -18 38 C -18 20 -32 8 -32 -12 Z"
                fill="#FACC15"
                stroke="#0F172A"
                strokeWidth="6"
              />
              {/* Filamen Menyala */}
              <path d="M -8 34 L -8 6 Q 0 -16 8 6 L 8 34" fill="none" stroke="#FFFFFF" strokeWidth="4" />
              <rect x="-18" y="38" width="36" height="22" rx="5" fill="#94A3B8" stroke="#0F172A" strokeWidth="4.5" />
              {/* Sinar Bohlam */}
              {[-60, -30, 0, 30, 60].map((deg) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                return (
                  <line
                    key={deg}
                    x1={Math.cos(rad) * 52}
                    y1={Math.sin(rad) * 52}
                    x2={Math.cos(rad) * 72}
                    y2={Math.sin(rad) * 72}
                    stroke="#FDE047"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          </g>
        );
      }

      /* =====================================================================
         11. VS COMPARE (Scene 5: Bedanya, tim Grace Hopper menemukan serangga aslinya!)
         ===================================================================== */
      case "vs-compare": {
        const isWinner = variant === "winner";
        const wingFlap = Math.sin(t * 20) * 10;
        const winBounce = isWinner ? 1 + Math.sin(t * 9) * 0.04 : 1;

        return (
          <g>
            {/* Kartu Kiri: 1878 Edison (Kiasan) */}
            <g transform="translate(0, 10)">
              <rect x="48" y="65" width="315" height="310" rx="22" fill="#291A0B" stroke="#F59E0B" strokeWidth="6" />
              <rect x="85" y="88" width="240" height="44" rx="12" fill="#F59E0B" />
              <text x="205" y="119" fontFamily={FONTS.title} fontSize="26" fontWeight="900" fill="#0F172A" textAnchor="middle">1878 · EDISON</text>
              {/* Ikon Gear */}
              <g transform={`translate(205, 215) rotate(${globalFrame * 1.5})`}>
                <circle cx="0" cy="0" r="46" fill="#D97706" stroke="#0F172A" strokeWidth="5" />
                <circle cx="0" cy="0" r="54" fill="none" stroke="#FBBF24" strokeWidth="12" strokeDasharray="15 11" />
                <circle cx="0" cy="0" r="18" fill="#291A0B" stroke="#0F172A" strokeWidth="4" />
              </g>
              <text x="205" y="320" fontFamily={FONTS.title} fontSize="26" fontWeight="900" fill="#FDE68A" textAnchor="middle">CACAT MESIN</text>
              <text x="205" y="352" fontFamily={FONTS.label} fontSize="20" fontWeight="700" fill="#FCD34D" textAnchor="middle">(Istilah Kiasan)</text>
            </g>

            {/* Kartu Kanan: 1947 Grace Hopper (Serangga Asli!) */}
            <g transform={`translate(595, 225) scale(${winBounce}) translate(-595, -225)`}>
              <rect
                x="438"
                y="60"
                width="315"
                height="325"
                rx="22"
                fill="#0C4A6E"
                stroke={isWinner ? "#FACC15" : "#38BDF8"}
                strokeWidth={isWinner ? "8" : "6"}
              />
              <rect x="475" y="85" width="240" height="44" rx="12" fill="#FACC15" />
              <text x="595" y="116" fontFamily={FONTS.title} fontSize="26" fontWeight="900" fill="#0F172A" textAnchor="middle">1947 · HOPPER</text>
              {/* Ngengat Hidup Muncul Menonjol */}
              <g transform="translate(595, 215)">
                <path d={`M 0 -6 C ${-66 + wingFlap} -48, ${-78 + wingFlap} 22, 0 28 Z`} fill="#FDE68A" stroke="#0F172A" strokeWidth="4.5" />
                <path d={`M 0 -6 C ${66 - wingFlap} -48, ${78 - wingFlap} 22, 0 28 Z`} fill="#FDE68A" stroke="#0F172A" strokeWidth="4.5" />
                <ellipse cx="0" cy="12" rx="15" ry="30" fill="#78350F" stroke="#0F172A" strokeWidth="4" />
                <circle cx="0" cy="-22" r="13" fill="#451A03" stroke="#0F172A" strokeWidth="3.5" />
                <text x="-5" y="-17" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#FFFFFF" textAnchor="middle">×</text>
                <text x="5" y="-17" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#FFFFFF" textAnchor="middle">×</text>
              </g>
              <text x="595" y="322" fontFamily={FONTS.title} fontSize="27" fontWeight="900" fill="#FFFFFF" textAnchor="middle">SERANGGA ASLI!</text>
              <text x="595" y="355" fontFamily={FONTS.label} fontSize="20" fontWeight="800" fill="#4ADE80" textAnchor="middle">✓ BUKTI FISIK</text>
            </g>

            {/* Emblem VS di Tengah */}
            <g transform={`translate(400, 225) scale(${1 + Math.sin(t * 8) * 0.08})`}>
              <circle cx="0" cy="0" r="46" fill="#F43F5E" stroke="#0F172A" strokeWidth="7" />
              <text x="0" y="15" fontFamily={FONTS.title} fontSize="42" fontWeight="900" fill="#FFFFFF" textAnchor="middle">VS</text>
            </g>
          </g>
        );
      }

      /* =====================================================================
         12. RAM MOSQUITO (Scene 6: Kodingan error -> Nyamuk kejepit di RAM!)
         ===================================================================== */
      case "ram-mosquito": {
        const isCodeOnly = variant === "code";
        const isZoomPin = variant === "ram-pin";

        if (isCodeOnly) {
          const blink = (globalFrame % 16) < 9;
          return (
            <g>
              {/* Jendela Code Editor Modern */}
              <rect x="115" y="58" width="570" height="330" rx="22" fill="#0F172A" stroke="#818CF8" strokeWidth="6" />
              <rect x="115" y="58" width="570" height="48" rx="18" fill="#1E1B4B" stroke="#818CF8" strokeWidth="4" />
              <circle cx="152" cy="82" r="8" fill="#F43F5E" />
              <circle cx="180" cy="82" r="8" fill="#FACC15" />
              <circle cx="208" cy="82" r="8" fill="#10B981" />
              <text x="400" y="90" fontFamily="monospace" fontSize="22" fontWeight="700" fill="#C7D2FE" textAnchor="middle">main.ts</text>

              {/* Baris Kode Sintaks */}
              <text x="155" y="155" fontFamily="monospace" fontSize="26" fontWeight="700" fill="#38BDF8">function runApp() {"{"}</text>
              <text x="185" y="200" fontFamily="monospace" fontSize="26" fontWeight="700" fill="#A78BFA">const status = "OK";</text>
              <text x="185" y="248" fontFamily="monospace" fontSize="26" fontWeight="700" fill="#FB7185">return crashError();</text>
              {/* Garis Merah Bergelombang Error */}
              <path d="M 185 260 Q 200 268 215 260 T 245 260 T 275 260 T 305 260 T 335 260 T 365 260 T 395 260 T 425 260 T 455 260 T 485 260" fill="none" stroke="#F43F5E" strokeWidth="5" />
              <text x="155" y="305" fontFamily="monospace" fontSize="26" fontWeight="700" fill="#38BDF8">{"}"}</text>

              {/* Banner SyntaxError Berkedip */}
              {blink && (
                <g>
                  <rect x="200" y="325" width="400" height="48" rx="12" fill="#DC2626" stroke="#FACC15" strokeWidth="4" />
                  <text x="400" y="357" fontFamily={FONTS.title} fontSize="26" fontWeight="900" fill="#FFFFFF" textAnchor="middle">
                    ✖ ERROR TERDETEKSI!
                  </text>
                </g>
              )}
            </g>
          );
        }

        // Stick DDR RAM + Nyamuk Lucu Kejepit di Pin Emas!
        const wingBuzz = Math.sin(globalFrame * 3.8) * 14;
        const zoomScale = isZoomPin ? 1.12 : 1.0;
        const magX = 445 + Math.sin(t * 3.5) * 30;
        const magY = 235 + Math.cos(t * 2.8) * 12;

        return (
          <g transform={`translate(400, 225) scale(${zoomScale}) translate(-400, -225)`}>
            {/* Keping PCB RAM Cyber */}
            <rect x="85" y="135" width="630" height="175" rx="14" fill="#065F46" stroke="#0F172A" strokeWidth="7" />
            {/* Sirkuit Garis PCB */}
            <line x1="115" y1="160" x2="685" y2="160" stroke="#34D399" strokeWidth="3" opacity="0.45" />
            <line x1="115" y1="275" x2="685" y2="275" stroke="#34D399" strokeWidth="3" opacity="0.45" />
            {/* 6 Chip Memori Hitam DDR */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={`chip-${i}`}>
                <rect x={125 + i * 94} y="175" width="74" height="90" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="3.5" />
                <text x={162 + i * 94} y="226" fontFamily="monospace" fontSize="16" fontWeight="800" fill="#38BDF8" textAnchor="middle">RAM</text>
              </g>
            ))}
            {/* Deretan Pin Emas Bawah */}
            {Array.from({ length: 24 }, (_, i) => {
              if (i === 11) return null; // Notch slot DDR
              return (
                <rect
                  key={`pin-${i}`}
                  x={108 + i * 24.5}
                  y="302"
                  width="14"
                  height="32"
                  rx="2"
                  fill="#FACC15"
                  stroke="#0F172A"
                  strokeWidth="2.5"
                />
              );
            })}

            {/* NYAMUK KARTUN LUCU KEJEPIT DI PIN RAM! */}
            <g transform={`translate(455, 290) rotate(${Math.sin(globalFrame * 2.2) * 7})`}>
              {/* Sayap Nyamuk Bergetar Cepat */}
              <ellipse cx="-26" cy="-24" rx="34" ry="12" fill="#E0F2FE" fillOpacity="0.85" stroke="#0F172A" strokeWidth="3.5" transform={`rotate(${-24 + wingBuzz} -26 -24)`} />
              <ellipse cx="26" cy="-24" rx="34" ry="12" fill="#E0F2FE" fillOpacity="0.85" stroke="#0F172A" strokeWidth="3.5" transform={`rotate(${24 - wingBuzz} 26 -24)`} />
              {/* Kaki Nyamuk Panjang */}
              <path d="M -14 14 L -40 34 L -52 24" fill="none" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
              <path d="M 14 14 L 42 34 L 54 24" fill="none" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
              {/* Badan Belang Nyamuk */}
              <ellipse cx="0" cy="4" rx="16" ry="28" fill="#334155" stroke="#0F172A" strokeWidth="4" />
              <line x1="-13" y1="-4" x2="13" y2="-4" stroke="#FFFFFF" strokeWidth="3.5" />
              <line x1="-14" y1="8" x2="14" y2="8" stroke="#FFFFFF" strokeWidth="3.5" />
              <line x1="-11" y1="20" x2="11" y2="20" stroke="#FFFFFF" strokeWidth="3.5" />
              {/* Kepala + Belalai Nyamuk */}
              <circle cx="0" cy="-26" r="13" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
              <line x1="0" y1="-38" x2="0" y2="-66" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="-5" cy="-28" r="4.5" fill="#FACC15" />
              <circle cx="-5" cy="-28" r="2" fill="#0F172A" />
              <circle cx="5" cy="-28" r="4.5" fill="#FACC15" />
              <circle cx="5" cy="-28" r="2" fill="#0F172A" />
            </g>

            {/* Teks BZZZ! */}
            <text
              x={555 + Math.sin(t * 14) * 6}
              y={238 + Math.cos(t * 12) * 5}
              fontFamily={FONTS.title}
              fontSize="36"
              fontWeight="900"
              fill="#FACC15"
              stroke="#0F172A"
              strokeWidth="6"
              paintOrder="stroke fill"
            >
              BZZZ!
            </text>

            {/* Kaca Pembesar Memindai Nyamuk */}
            <g transform={`translate(${magX}, ${magY})`}>
              <circle cx="0" cy="0" r="95" fill="#38BDF8" fillOpacity="0.14" stroke="#00F5FF" strokeWidth="10" />
              <circle cx="0" cy="0" r="95" fill="none" stroke="#0F172A" strokeWidth="4" />
              <path d="M -55 -48 A 72 72 0 0 1 12 -68" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" opacity="0.65" />
              <line x1="68" y1="68" x2="145" y2="145" stroke="#0F172A" strokeWidth="26" strokeLinecap="round" />
              <line x1="68" y1="68" x2="145" y2="145" stroke="#38BDF8" strokeWidth="16" strokeLinecap="round" />
            </g>
          </g>
        );
      }

      /* =====================================================================
         13. CTA COMMENT (Scene 6: Tulis di komentar ya!)
         ===================================================================== */
      case "cta-comment": {
        const bounce = 1 + Math.sin(t * 8) * 0.04;
        const tapOffset = Math.max(0, Math.sin(t * 9)) * 12;

        return (
          <g>
            {/* Kotak Komentar Interaktif */}
            <g transform={`translate(400, 225) scale(${bounce}) translate(-400, -225)`}>
              <rect x="135" y="125" width="530" height="195" rx="34" fill="#FFFFFF" stroke="#0F172A" strokeWidth="8" />
              {/* Ekor Balon Komentar */}
              <polygon points="365,318 400,368 435,318" fill="#FFFFFF" stroke="#0F172A" strokeWidth="8" strokeLinejoin="round" />
              <rect x="355" y="305" width="90" height="22" fill="#FFFFFF" />

              {/* Teks CTA */}
              <text x="400" y="198" fontFamily={FONTS.title} fontSize="42" fontWeight="900" fill="#0F172A" textAnchor="middle">
                PERNAH KENA BUG?
              </text>

              {/* Input Bar + Tombol Kirim */}
              <rect x="175" y="226" width="340" height="58" rx="29" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="4" />
              <text x="208" y="264" fontFamily={FONTS.label} fontSize="24" fontWeight="800" fill="#475569">
                Tulis di komentar{((Math.floor(globalFrame / 8) % 3) === 0) ? "." : ((Math.floor(globalFrame / 8) % 3) === 1) ? ".." : "..."}
              </text>
              <rect x="528" y="226" width="100" height="58" rx="29" fill="#0EA5E9" stroke="#0F172A" strokeWidth="4" />
              <polygon points="566,242 602,255 566,268 574,255" fill="#FFFFFF" />
            </g>

            {/* Gelembung Reaksi Melayang di Luar Sudut Kartu */}
            {[
              { emoji: "💬", x: 75, y: 98, phase: 0 },
              { emoji: "🔥", x: 725, y: 98, phase: 1.5 },
              { emoji: "👍", x: 85, y: 350, phase: 2.8 },
              { emoji: "⚡", x: 715, y: 350, phase: 4.1 },
            ].map((it, i) => (
              <g key={i} transform={`translate(${it.x}, ${it.y + Math.sin(t * 4.5 + it.phase) * 14})`}>
                <circle cx="0" cy="0" r="36" fill="#1E1B4B" stroke="#22D3EE" strokeWidth="4.5" />
                <text x="0" y="13" fontSize="34" textAnchor="middle">{it.emoji}</text>
              </g>
            ))}

            {/* Kursor Mengetuk Tombol Kirim */}
            <g transform={`translate(${595 - tapOffset * 0.5}, ${290 - tapOffset})`}>
              <polygon points="0,0 0,48 14,36 26,56 36,50 24,30 42,28" fill="#FACC15" stroke="#0F172A" strokeWidth="4.5" strokeLinejoin="round" />
            </g>
          </g>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(${enterY + floatY}px) scale(${enterScale * variantScale})`,
        transformOrigin: "center center",
        width: "820px",
        height: "460px",
        filter: "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.45))",
      }}
    >
      <svg
        viewBox="0 0 800 450"
        width={820}
        height={460}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {renderIllustration()}
      </svg>
    </div>
  );
};
