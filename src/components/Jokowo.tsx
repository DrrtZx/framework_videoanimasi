import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { PALETTE } from "../config";
import type { Expression, Pose } from "../episodes/types";

export interface JokowoProps {
  pose?: Pose;
  expression?: Expression;
  mouthOpen?: number; // 0.0 (tutup) s/d 1.0 (buka penuh)
  scale?: number;
  flip?: boolean;
  showShadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Jokowo: React.FC<JokowoProps> = ({
  pose = "idle",
  expression = "neutral",
  mouthOpen = 0,
  scale = 1,
  flip = false,
  showShadow = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Nilai bukaan bibir efektif (sinkron RMS suara asli)
  const effectiveMouth = Math.max(0, Math.min(1, mouthOpen));
  const mouthHeight = interpolate(effectiveMouth, [0, 1], [3, 15]);

  // 1. Animasi nafas, bobbing tubuh, dan gerak dinamis sesuai pose
  const isWalking = pose === "walking";
  const isCelebrating = pose === "celebrating";
  const isShocked = expression === "shocked";

  const walkPhase = t * 11;
  const walkBounce = isWalking ? -Math.abs(Math.sin(walkPhase)) * 10 : 0;
  const celebBounce = isCelebrating ? -Math.abs(Math.sin(t * 9)) * 12 : 0;
  const talkBounce =
    (pose === "talking" || pose === "pointing") && effectiveMouth > 0.1
      ? -Math.abs(Math.sin(t * 10)) * 3.5 * effectiveMouth
      : 0;
  const breathing = Math.sin(t * 3.2) * 2.2;
  const totalBodyY = breathing + walkBounce + celebBounce + talkBounce;

  // Kemiringan tubuh halus (squash & sway hidup)
  const bodyTilt = isWalking
    ? 3.5 + Math.sin(walkPhase) * 2
    : isCelebrating
      ? Math.sin(t * 8) * 3.5
      : pose === "thinking"
        ? -2.5 + Math.sin(t * 2.2) * 1.2
        : pose === "pointing"
          ? 3 + Math.sin(t * 4) * 1.5
          : Math.sin(t * 2.6) * 1.8;

  // Getaran mikro saat kaget (deterministik)
  const shockJitterX = isShocked && !isWalking ? Math.sin(frame * 1.7) * 1.8 : 0;

  // 2. Gerak Kaki (langkah berayun + lutut/sepatu terangkat saat walking)
  const legRotL = isWalking ? Math.sin(walkPhase) * 24 : isCelebrating ? Math.sin(t * 9) * 5 : 0;
  const legRotR = isWalking ? -Math.sin(walkPhase) * 24 : isCelebrating ? -Math.sin(t * 9) * 5 : 0;
  const legLiftL = isWalking ? Math.max(0, Math.sin(walkPhase)) * -8 : 0;
  const legLiftR = isWalking ? Math.max(0, -Math.sin(walkPhase)) * -8 : 0;

  // 3. Animasi Lengan Kiri & Kanan (sudut rotasi SVG benar: + = kiri/searah jarum jam, - = kanan/berlawanan jarum jam)
  const talkWave = (0.35 + effectiveMouth * 0.85) * Math.sin(t * 8.5);
  const talkWaveAlt = (0.35 + effectiveMouth * 0.85) * Math.cos(t * 7.2);
  const celebWave = Math.sin(t * 12) * 14;
  const pointPulse = Math.sin(t * 7.5) * 6;

  // 4. Animasi Kepala (anggukan bicara, miring penasaran/berpikir)
  const headTilt =
    pose === "thinking"
      ? -7 + Math.sin(t * 2.4) * 2
      : expression === "curious"
        ? 5.5 + Math.sin(t * 3.2) * 2.5
        : isCelebrating || expression === "laughing"
          ? Math.sin(t * 9) * 5
          : Math.sin(t * 5.5) * (1.8 + effectiveMouth * 3.2);

  const headBobY = effectiveMouth * -1.8 + Math.sin(t * 4) * 1;

  // 5. Kedipan Mata Alami Deterministik (setiap ~3.1 detik)
  const blinkCycle = frame % 94;
  const isBlinking =
    blinkCycle >= 90 &&
    blinkCycle <= 93 &&
    expression !== "shocked" &&
    expression !== "laughing";

  // 6. Skala Bayangan Panggung (mengecil saat melompat)
  const liftAmount = Math.abs(walkBounce + celebBounce);
  const shadowScale = Math.max(0.75, 1 - liftAmount * 0.015);

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale}) ${flip ? "scaleX(-1)" : ""}`,
        transformOrigin: "bottom center",
        ...style,
      }}
    >
      <svg
        viewBox="-45 -15 290 420"
        width={290}
        height={420}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          {/* Motif batik cyan blueprint di saku kemeja */}
          <pattern id="batikPattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 0 3 L 3 0 L 6 3 L 3 6 Z" fill="none" stroke="#0EA5E9" strokeWidth="0.9" />
          </pattern>
        </defs>

        {/* ================= 0. BAYANGAN PANGGUNG ================= */}
        {showShadow && (
          <ellipse
            cx="100"
            cy="374"
            rx={52 * shadowScale}
            ry={11 * shadowScale}
            fill="#020617"
            opacity="0.45"
          />
        )}

        <g transform={`translate(${shockJitterX}, 0)`}>
          {/* ================= 1. KAKI & SEPATU ================= */}
          {/* Kaki Kiri */}
          <g transform={`translate(85, ${280 + legLiftL}) rotate(${legRotL})`}>
            <rect
              x="-8"
              y="0"
              width="16"
              height="85"
              rx="5"
              fill={PALETTE.charPants}
              stroke={PALETTE.ink}
              strokeWidth="2.5"
            />
            {/* Sepatu Kiri */}
            <ellipse
              cx="-2"
              cy="88"
              rx="15"
              ry="7"
              fill={PALETTE.charShoes}
              stroke={PALETTE.ink}
              strokeWidth="2.2"
            />
            <path d="M -13 87 Q -2 92 10 87" stroke="#94A3B8" strokeWidth="1.6" />
          </g>

          {/* Kaki Kanan */}
          <g transform={`translate(115, ${280 + legLiftR}) rotate(${legRotR})`}>
            <rect
              x="-8"
              y="0"
              width="16"
              height="85"
              rx="5"
              fill={PALETTE.charPants}
              stroke={PALETTE.ink}
              strokeWidth="2.5"
            />
            {/* Sepatu Kanan */}
            <ellipse
              cx="2"
              cy="88"
              rx="15"
              ry="7"
              fill={PALETTE.charShoes}
              stroke={PALETTE.ink}
              strokeWidth="2.2"
            />
            <path d="M -10 87 Q 2 92 13 87" stroke="#94A3B8" strokeWidth="1.6" />
          </g>

          {/* ================= 2. TUBUH, KEMEJA & LENGAN ================= */}
          <g transform={`translate(100, ${280 + totalBodyY}) rotate(${bodyTilt}) translate(-100, -280)`}>
            {/* LENGAN KIRI (di belakang sisi kiri kemeja untuk kedalaman natural) */}
            {pose === "celebrating" ? (
              /* Lengan kiri terangkat tinggi ke atas-kiri (+142 deg) */
              <g transform={`translate(66, 160) rotate(${142 + celebWave})`}>
                <rect x="-7" y="0" width="14" height="62" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="68" r="9" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            ) : pose === "walking" ? (
              <g transform={`translate(66, 160) rotate(${18 + Math.sin(walkPhase) * 32})`}>
                <rect x="-7" y="0" width="14" height="62" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="68" r="8.5" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            ) : pose === "talking" ? (
              /* Gestur persuasif hidup dengan siku tertekuk */
              <g transform={`translate(66, 160) rotate(${26 + talkWave * 16})`}>
                <rect x="-7" y="0" width="14" height="36" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <g transform={`translate(0, 32) rotate(${28 + talkWaveAlt * 18})`}>
                  <rect x="-6.5" y="0" width="13" height="30" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                  <circle cx="0" cy="35" r="8.5" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
                </g>
              </g>
            ) : pose === "pointing" ? (
              /* Tangan kiri santai bertolak pinggang / keseimbangan */
              <g transform={`translate(66, 160) rotate(${24 + Math.sin(t * 4) * 4})`}>
                <rect x="-7" y="0" width="14" height="34" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <g transform="translate(0, 30) rotate(-38)">
                  <rect x="-6.5" y="0" width="13" height="28" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                  <circle cx="0" cy="32" r="8" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
                </g>
              </g>
            ) : pose === "thinking" ? (
              /* Tangan kiri melintang menopang siku kanan */
              <g transform={`translate(66, 160) rotate(${16 + Math.sin(t * 2.5) * 3})`}>
                <rect x="-7" y="0" width="14" height="36" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <g transform="translate(0, 32) rotate(-72)">
                  <rect x="-6.5" y="0" width="13" height="36" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                  <circle cx="0" cy="38" r="8" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
                </g>
              </g>
            ) : isShocked ? (
              /* Kaget: tangan kiri terentang keluar */
              <g transform={`translate(66, 160) rotate(${82 + Math.sin(t * 14) * 6})`}>
                <rect x="-7" y="0" width="14" height="60" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="66" r="9" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            ) : (
              /* Idle: ayunan alami lembut */
              <g transform={`translate(66, 160) rotate(${14 + Math.sin(t * 2.8) * 4})`}>
                <rect x="-7" y="0" width="14" height="62" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="68" r="8.5" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            )}

            {/* Badan Utama / Kemeja Putih Khas Jokowo */}
            <path
              d="M 68 150 L 132 150 L 138 285 L 62 285 Z"
              fill="url(#shirtGrad)"
              stroke={PALETTE.ink}
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Garis Kancing Kemeja Tengah */}
            <line x1="100" y1="150" x2="100" y2="285" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="100" cy="180" r="2.2" fill={PALETTE.ink} />
            <circle cx="100" cy="215" r="2.2" fill={PALETTE.ink} />
            <circle cx="100" cy="250" r="2.2" fill={PALETTE.ink} />

            {/* Saku Dada Kiri dengan Garis Batik Cyan Blueprint */}
            <rect
              x="76"
              y="185"
              width="18"
              height="22"
              rx="2"
              fill="url(#batikPattern)"
              stroke={PALETTE.ink}
              strokeWidth="1.6"
            />
            <line x1="76" y1="185" x2="94" y2="185" stroke="#0EA5E9" strokeWidth="2.2" />

            {/* Kerah Kemeja Putih */}
            <path d="M 85 150 L 100 168 L 115 150 Z" fill="#F8FAFC" stroke={PALETTE.ink} strokeWidth="2" />
            <path d="M 80 148 L 95 166 L 85 150" stroke={PALETTE.ink} strokeWidth="2" fill="#E2E8F0" />
            <path d="M 120 148 L 105 166 L 115 150" stroke={PALETTE.ink} strokeWidth="2" fill="#E2E8F0" />

            {/* ================= 3. LEHER & KEPALA (DENGAN ANGGUKAN HIDUP) ================= */}
            {/* Leher */}
            <rect x="92" y="136" width="16" height="18" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />

            <g transform={`translate(100, ${142 + headBobY}) rotate(${headTilt}) translate(-100, -142)`}>
              {/* Bentuk Wajah Ramah Jokowo */}
              <ellipse cx="100" cy="95" rx="34" ry="42" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="3" />

              {/* Telinga Kiri & Kanan */}
              <ellipse cx="65" cy="98" rx="6" ry="10" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              <ellipse cx="135" cy="98" rx="6" ry="10" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />

              {/* ================= 4. RAMBUT BELAH SAMPING KHAS ================= */}
              <path
                d="M 66 85 C 66 52 82 48 100 48 C 122 48 136 55 135 85 C 132 80 125 70 100 68 C 78 66 70 78 66 85 Z"
                fill={PALETTE.charHair}
                stroke={PALETTE.ink}
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Sisiran Rambut Belah Samping Kanan */}
              <path d="M 88 56 Q 115 54 130 72" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 94 62 Q 118 60 128 78" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* ================= 5. ALIS & MATA BERDASARKAN EKSPRESI ================= */}
              {expression === "shocked" ? (
                <>
                  {/* Alis terangkat tinggi kaget */}
                  <path d="M 78 70 Q 86 62 94 70" stroke={PALETTE.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
                  <path d="M 106 70 Q 114 62 122 70" stroke={PALETTE.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
                  {/* Mata bulat lebar terkejut */}
                  <circle cx="86" cy="85" r="7.5" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
                  <circle cx="86" cy="85" r="3.2" fill={PALETTE.ink} />
                  <circle cx="87.5" cy="83.5" r="1.2" fill="#FFFFFF" />
                  <circle cx="114" cy="85" r="7.5" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
                  <circle cx="114" cy="85" r="3.2" fill={PALETTE.ink} />
                  <circle cx="115.5" cy="83.5" r="1.2" fill="#FFFFFF" />
                </>
              ) : expression === "laughing" ? (
                <>
                  {/* Alis melengkung tawa gembira */}
                  <path d="M 78 73 Q 86 67 94 74" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 106 74 Q 114 67 122 73" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  {/* Mata menyipit melengkung ke atas (senyum bahagia) */}
                  <path d="M 78 88 Q 86 79 94 88" stroke={PALETTE.ink} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                  <path d="M 106 88 Q 114 79 122 88" stroke={PALETTE.ink} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                  {/* Pipi merona */}
                  <ellipse cx="75" cy="98" rx="6" ry="3.2" fill="#F43F5E" opacity="0.35" />
                  <ellipse cx="125" cy="98" rx="6" ry="3.2" fill="#F43F5E" opacity="0.35" />
                </>
              ) : isBlinking ? (
                <>
                  {/* Kedipan mata alami */}
                  <path d="M 78 74 Q 86 70 94 74" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" />
                  <path d="M 106 74 Q 114 70 122 74" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" />
                  <path d="M 80 86 Q 86 89 92 86" stroke={PALETTE.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />
                  <path d="M 108 86 Q 114 89 120 86" stroke={PALETTE.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />
                </>
              ) : expression === "curious" ? (
                <>
                  {/* Satu alis terangkat tinggi tanda penasaran */}
                  <path d="M 78 69 Q 86 61 94 68" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 106 76 Q 114 73 122 77" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  {/* Mata melirik sedikit ke atas melihat prop */}
                  <circle cx="86" cy="84" r="5.8" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
                  <circle cx="86" cy="82" r="3" fill={PALETTE.ink} />
                  <circle cx="87.2" cy="80.8" r="1.1" fill="#FFFFFF" />
                  <circle cx="114" cy="85" r="5.8" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
                  <circle cx="114" cy="83" r="3" fill={PALETTE.ink} />
                  <circle cx="115.2" cy="81.8" r="1.1" fill="#FFFFFF" />
                </>
              ) : expression === "amused" ? (
                <>
                  {/* Alis asimetris jenaka */}
                  <path d="M 78 71 Q 86 65 94 72" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 106 74 Q 114 70 122 75" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <circle cx="86" cy="85" r="5.2" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
                  <circle cx="87" cy="85" r="2.8" fill={PALETTE.ink} />
                  <circle cx="88" cy="83.8" r="1" fill="#FFFFFF" />
                  <circle cx="114" cy="85" r="5.2" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
                  <circle cx="115" cy="85" r="2.8" fill={PALETTE.ink} />
                  <circle cx="116" cy="83.8" r="1" fill="#FFFFFF" />
                </>
              ) : (
                <>
                  {/* Netral / Storytelling ramah */}
                  <path d="M 78 74 Q 86 70 94 74" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 106 74 Q 114 70 122 74" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <circle cx="86" cy="85" r="5.2" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
                  <circle cx="87" cy="85" r="2.8" fill={PALETTE.ink} />
                  <circle cx="88" cy="83.8" r="1" fill="#FFFFFF" />
                  <circle cx="114" cy="85" r="5.2" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
                  <circle cx="115" cy="85" r="2.8" fill={PALETTE.ink} />
                  <circle cx="116" cy="83.8" r="1" fill="#FFFFFF" />
                </>
              )}

              {/* Hidung Bersahaja Karakter */}
              <path d="M 100 86 Q 103 96 97 99" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Garis Senyum Khas Jokowo */}
              <path d="M 76 98 Q 80 106 82 112" stroke="#D97706" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M 124 98 Q 120 106 118 112" stroke="#D97706" strokeWidth="1.5" fill="none" opacity="0.6" />

              {/* ================= 6. MULUT & LIP SYNC AUDIO ================= */}
              {effectiveMouth > 0.12 ? (
                <g>
                  <path
                    d={`M 90 110 Q 100 ${110 + mouthHeight * 1.35} 110 110 Q 100 ${110 - mouthHeight * 0.35} 90 110 Z`}
                    fill="#9F1239"
                    stroke={PALETTE.ink}
                    strokeWidth="2"
                  />
                  {/* Aksen lidah kartun saat buka mulut lebar */}
                  {effectiveMouth > 0.45 && (
                    <ellipse cx="100" cy={112 + mouthHeight * 0.45} rx="5" ry="2.5" fill="#FB7185" />
                  )}
                </g>
              ) : expression === "laughing" ? (
                <path d="M 90 108 Q 100 122 110 108 Z" fill="#9F1239" stroke={PALETTE.ink} strokeWidth="2" />
              ) : expression === "curious" ? (
                <circle cx="100" cy="112" r="4.2" fill="#9F1239" stroke={PALETTE.ink} strokeWidth="1.6" />
              ) : expression === "amused" ? (
                <path d="M 91 111 Q 99 114 111 108" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 92 110 Q 100 116 108 110" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* ================= 7. LENGAN KANAN (DI DEPAN UNTUK GESTUR JELAS) ================= */}
            {pose === "celebrating" ? (
              /* Lengan kanan terangkat tinggi ke atas-kanan (-142 deg) */
              <g transform={`translate(134, 160) rotate(${-142 - celebWave})`}>
                <rect x="-7" y="0" width="14" height="62" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="68" r="9" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            ) : pose === "pointing" ? (
              /* Lengan kanan menunjuk tegas ke atas-kanan ke arah visual prop */
              <g transform={`translate(134, 160) rotate(${-118 + pointPulse})`}>
                <rect x="-7" y="0" width="14" height="58" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="63" r="8" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
                {/* Jari telunjuk menunjuk */}
                <line x1="0" y1="68" x2="0" y2="82" stroke={PALETTE.ink} strokeWidth="4" strokeLinecap="round" />
                <line x1="0" y1="68" x2="0" y2="81" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
              </g>
            ) : pose === "thinking" ? (
              /* Lengan kanan 2-segmen tertekuk tepat menuju dagu! */
              <g transform={`translate(134, 160) rotate(${-20 + Math.sin(t * 2.5) * 2})`}>
                <rect x="-7" y="0" width="14" height="32" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <g transform={`translate(0, 28) rotate(${174 + Math.sin(t * 3) * 3})`}>
                  <rect x="-6.5" y="0" width="13" height="50" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                  <circle cx="0" cy="54" r="8.5" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
                </g>
              </g>
            ) : pose === "talking" ? (
              /* Lengan kanan beraksi persuasif dinamis mengikuti irama suara */
              <g transform={`translate(134, 160) rotate(${-38 - talkWave * 18})`}>
                <rect x="-7" y="0" width="14" height="36" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <g transform={`translate(0, 32) rotate(${-45 - talkWaveAlt * 22})`}>
                  <rect x="-6.5" y="0" width="13" height="32" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                  <circle cx="0" cy="36" r="8.5" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
                </g>
              </g>
            ) : pose === "walking" ? (
              <g transform={`translate(134, 160) rotate(${-18 - Math.sin(walkPhase) * 32})`}>
                <rect x="-7" y="0" width="14" height="62" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="68" r="8.5" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            ) : isShocked ? (
              <g transform={`translate(134, 160) rotate(${-82 - Math.sin(t * 14) * 6})`}>
                <rect x="-7" y="0" width="14" height="60" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="66" r="9" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            ) : (
              /* Idle: gerak santai */
              <g transform={`translate(134, 160) rotate(${-14 - Math.sin(t * 2.8) * 4})`}>
                <rect x="-7" y="0" width="14" height="62" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.5" />
                <circle cx="0" cy="68" r="8.5" fill="url(#skinGrad)" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};
