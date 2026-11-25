import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { Expression, EyeTarget, MascotProps, Pose } from "../../core/types";

const JOKOWO_COLORS = {
  ink: "#0F172A",
  hairDark: "#0F172A",
  hairMid: "#1E293B",
  charPants: "#0F172A",
  charShoes: "#334155",
  iris: "#2A1B12",
  pupil: "#0B0F19",
  mouthInside: "#881337",
  cheekFlush: "#E07A5F",
} as const;

export type JokowoProps = MascotProps;

interface PoseRig {
  bodyTilt: number;
  headTilt: number;
  leftUpper: number;
  leftFore: number;
  rightUpper: number;
  rightFore: number;
  legRotL: number;
  legRotR: number;
  legLiftL: number;
  legLiftR: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getPoseRig(
  pose: Pose,
  expression: Expression,
  t: number,
  effectiveMouth: number
): PoseRig {
  const walkPhase = t * 11;
  const talkWave = (0.35 + effectiveMouth * 0.85) * Math.sin(t * 7.8);
  const talkWaveAlt = (0.35 + effectiveMouth * 0.85) * Math.cos(t * 6.5 - 0.5);
  const celebWave = Math.sin(t * 11) * 12;
  const pointPulse = Math.sin(t * 7.0) * 5;

  let bodyTilt = Math.sin(t * 2.4) * 1.4;
  let headTilt =
    expression === "curious"
      ? 5.0 + Math.sin(t * 3.0) * 2.2
      : expression === "laughing"
        ? Math.sin(t * 8.5) * 4.5
        : Math.sin(t * 5.0) * (1.4 + effectiveMouth * 2.8);

  let leftUpper = 10 + Math.sin(t * 2.4) * 3;
  let leftFore = -12 + Math.cos(t * 2.4) * 2;
  let rightUpper = -10 - Math.sin(t * 2.4) * 3;
  let rightFore = 12 - Math.cos(t * 2.4) * 2;
  let legRotL = 0;
  let legRotR = 0;
  let legLiftL = 0;
  let legLiftR = 0;

  switch (pose) {
    case "walking": {
      bodyTilt = 3.2 + Math.sin(walkPhase) * 1.8;
      leftUpper = 12 + Math.sin(walkPhase) * 26;
      leftFore = -18 - Math.max(0, -Math.sin(walkPhase)) * 18;
      rightUpper = -12 - Math.sin(walkPhase) * 26;
      rightFore = 18 + Math.max(0, Math.sin(walkPhase)) * 18;
      legRotL = Math.sin(walkPhase) * 22;
      legRotR = -Math.sin(walkPhase) * 22;
      legLiftL = Math.max(0, Math.sin(walkPhase)) * -7;
      legLiftR = Math.max(0, -Math.sin(walkPhase)) * -7;
      break;
    }
    case "celebrating": {
      bodyTilt = Math.sin(t * 7.5) * 3.2;
      headTilt = Math.sin(t * 8.5) * 4.5;
      leftUpper = 134 + celebWave;
      leftFore = 14 + Math.cos(t * 11) * 5;
      rightUpper = -134 - celebWave;
      rightFore = -14 - Math.cos(t * 11) * 5;
      legRotL = Math.sin(t * 9) * 4;
      legRotR = -Math.sin(t * 9) * 4;
      break;
    }
    case "pointing": {
      bodyTilt = 2.6 + Math.sin(t * 3.8) * 1.2;
      leftUpper = 20 + Math.sin(t * 3.5) * 3;
      leftFore = -56 + Math.cos(t * 3.5) * 4;
      rightUpper = -108 + pointPulse;
      rightFore = -16 + pointPulse * 0.4;
      break;
    }
    case "thinking": {
      bodyTilt = -2.2 + Math.sin(t * 2.0) * 1.0;
      headTilt = -6.5 + Math.sin(t * 2.2) * 1.8;
      leftUpper = 20 + Math.sin(t * 2.4) * 2;
      leftFore = -112 + Math.cos(t * 2.4) * 3;
      rightUpper = 68 + Math.sin(t * 2.2) * 2;
      rightFore = 104 + Math.cos(t * 2.5) * 3;
      break;
    }
    case "talking": {
      bodyTilt = Math.sin(t * 3.2) * 1.8;
      leftUpper = 18 + talkWave * 9;
      leftFore = -42 + talkWaveAlt * 12;
      rightUpper = -44 - talkWave * 12;
      rightFore = -46 - talkWaveAlt * 16;
      break;
    }
    case "idle":
    default: {
      if (expression === "shocked") {
        leftUpper = 62 + Math.sin(t * 13) * 5;
        leftFore = -22 + Math.cos(t * 13) * 4;
        rightUpper = -62 - Math.sin(t * 13) * 5;
        rightFore = 22 - Math.cos(t * 13) * 4;
      }
      break;
    }
  }

  return {
    bodyTilt,
    headTilt,
    leftUpper,
    leftFore,
    rightUpper,
    rightFore,
    legRotL,
    legRotR,
    legLiftL,
    legLiftR,
  };
}

function getEyeOffset(eyeTarget: EyeTarget, flip: boolean, t: number) {
  if (eyeTarget === "prop") {
    return { dx: flip ? -1.4 : 1.4, dy: -2.4 };
  }
  if (eyeTarget === "left") {
    return { dx: -2.2, dy: -0.4 };
  }
  if (eyeTarget === "right") {
    return { dx: 2.2, dy: -0.4 };
  }
  return {
    dx: Math.sin(t * 0.9) * 0.5,
    dy: Math.cos(t * 0.7) * 0.3,
  };
}

interface ArmProps {
  shoulderX: number;
  shoulderY: number;
  upperAngle: number;
  foreAngle: number;
  side: "left" | "right";
  showPointingFinger?: boolean;
}

const ArticulatedArm: React.FC<ArmProps> = ({
  shoulderX,
  shoulderY,
  upperAngle,
  foreAngle,
  side,
  showPointingFinger = false,
}) => {
  const thumbX = side === "left" ? 6.2 : -6.2;

  return (
    <g transform={`translate(${shoulderX}, ${shoulderY}) rotate(${upperAngle})`}>
      {/* PASS 1: Outline luar siluet lengan utuh (tanpa garis putus di bahu/siku) */}
      <rect
        x="-8"
        y="-7"
        width="16"
        height="41"
        rx="8"
        fill={JOKOWO_COLORS.ink}
        stroke={JOKOWO_COLORS.ink}
        strokeWidth="4.6"
        strokeLinejoin="round"
      />
      <g transform={`translate(0, 32) rotate(${foreAngle})`}>
        <rect
          x="-7.5"
          y="-6"
          width="15"
          height="37"
          rx="7.5"
          fill={JOKOWO_COLORS.ink}
          stroke={JOKOWO_COLORS.ink}
          strokeWidth="4.6"
          strokeLinejoin="round"
        />
        {/* Tangan & telunjuk menyatu halus */}
        <g transform="translate(0, 34)">
          {showPointingFinger && (
            <rect
              x="-2.6"
              y="2"
              width="5.2"
              height="16"
              rx="2.6"
              fill="#E2A578"
              stroke={JOKOWO_COLORS.ink}
              strokeWidth="4.2"
            />
          )}
          <ellipse
            cx={thumbX}
            cy="-1"
            rx="3.6"
            ry="5"
            transform={`rotate(${side === "left" ? 24 : -24} ${thumbX} -1)`}
            fill="url(#jokowoSkinGrad)"
            stroke={JOKOWO_COLORS.ink}
            strokeWidth="2.0"
          />
          <ellipse
            cx="0"
            cy="2"
            rx="7.6"
            ry="8.4"
            fill="url(#jokowoSkinGrad)"
            stroke={JOKOWO_COLORS.ink}
            strokeWidth="2.1"
          />
          {showPointingFinger && (
            <rect
              x="-2.4"
              y="3"
              width="4.8"
              height="15"
              rx="2.4"
              fill="url(#jokowoSkinGrad)"
            />
          )}
        </g>
      </g>

      {/* PASS 2: Isi kemeja putih mulus menyambung bahu -> siku -> pergelangan */}
      <rect
        x="-8"
        y="-7"
        width="16"
        height="41"
        rx="8"
        fill="url(#jokowoShirtGrad)"
      />
      <g transform={`translate(0, 32) rotate(${foreAngle})`}>
        <rect
          x="-7.5"
          y="-6"
          width="15"
          height="36"
          rx="7.5"
          fill="url(#jokowoShirtGrad)"
        />
        {/* Lipatan manset pergelangan halus */}
        <line x1="-6" y1="25" x2="6" y2="25" stroke="#CBD5E1" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </g>
  );
};

export const Jokowo: React.FC<JokowoProps> = ({
  pose = "idle",
  prevPose,
  poseTransitionProgress = 1,
  expression = "neutral",
  eyeTarget = "camera",
  mouthOpen = 0,
  scale = 1,
  flip = false,
  showShadow = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Bukaan bibir kontinu dari RMS WAV
  const effectiveMouth = Math.max(0, Math.min(1, mouthOpen));
  const mouthHeight = interpolate(effectiveMouth, [0, 1], [3, 14.5]);

  // 1. Hitung rig sendi + interpolasi mulus antar pose
  const currRig = getPoseRig(pose, expression, t, effectiveMouth);
  const blend = Math.max(0, Math.min(1, poseTransitionProgress));
  const rig: PoseRig =
    prevPose && prevPose !== pose && blend < 1
      ? (() => {
          const pRig = getPoseRig(prevPose, expression, t, effectiveMouth);
          return {
            bodyTilt: lerp(pRig.bodyTilt, currRig.bodyTilt, blend),
            headTilt: lerp(pRig.headTilt, currRig.headTilt, blend),
            leftUpper: lerp(pRig.leftUpper, currRig.leftUpper, blend),
            leftFore: lerp(pRig.leftFore, currRig.leftFore, blend),
            rightUpper: lerp(pRig.rightUpper, currRig.rightUpper, blend),
            rightFore: lerp(pRig.rightFore, currRig.rightFore, blend),
            legRotL: lerp(pRig.legRotL, currRig.legRotL, blend),
            legRotR: lerp(pRig.legRotR, currRig.legRotR, blend),
            legLiftL: lerp(pRig.legLiftL, currRig.legLiftL, blend),
            legLiftR: lerp(pRig.legLiftR, currRig.legLiftR, blend),
          };
        })()
      : currRig;

  // 2. Pantulan tubuh & pernapasan hidup
  const walkPhase = t * 11;
  const walkBounce = pose === "walking" ? -Math.abs(Math.sin(walkPhase)) * 9 : 0;
  const celebBounce = pose === "celebrating" ? -Math.abs(Math.sin(t * 9)) * 10 : 0;
  const talkBounce =
    (pose === "talking" || pose === "pointing") && effectiveMouth > 0.1
      ? -Math.abs(Math.sin(t * 9.5)) * 3.0 * effectiveMouth
      : 0;
  const breathing = Math.sin(t * 3.0) * 2.0;
  const totalBodyY = breathing + walkBounce + celebBounce + talkBounce;

  const isShocked = expression === "shocked";
  const shockJitterX = isShocked && pose !== "walking" ? Math.sin(frame * 1.7) * 1.6 : 0;
  const headBobY = effectiveMouth * -1.6 + Math.sin(t * 3.6) * 0.9;

  // 3. Kedipan mata deterministik & lirikan pupil
  const blinkCycle = frame % 94;
  const isBlinking =
    blinkCycle >= 90 &&
    blinkCycle <= 93 &&
    expression !== "shocked" &&
    expression !== "laughing";

  const { dx: pupilDx, dy: pupilDy } = getEyeOffset(eyeTarget, flip, t);

  // 4. Skala bayangan lantai
  const liftAmount = Math.abs(walkBounce + celebBounce);
  const shadowScale = Math.max(0.75, 1 - liftAmount * 0.015);

  // Tampilkan jari telunjuk saat pointing (tetap muncul mulus setelah blend > 0.5)
  const showPointFinger = pose === "pointing" && blend > 0.45;
  // Di pose celebrating atau talking, biarkan kedua lengan tampil hangat;
  // di pose thinking, render lengan kanan di atas badan agar tepat di depan dagu.
  const leftArmInFront = pose === "thinking";

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
          {/* Kulit sawo matang Indonesia natural & hangat */}
          <linearGradient id="jokowoSkinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F3C69F" />
            <stop offset="55%" stopColor="#E2A578" />
            <stop offset="100%" stopColor="#C78254" />
          </linearGradient>
          <linearGradient id="jokowoNeckGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D99768" />
            <stop offset="100%" stopColor="#B57246" />
          </linearGradient>
          <linearGradient id="jokowoHairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={JOKOWO_COLORS.hairMid} />
            <stop offset="100%" stopColor={JOKOWO_COLORS.hairDark} />
          </linearGradient>
          <linearGradient id="jokowoShirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          {/* Motif batik cyan di saku dada */}
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
            opacity="0.48"
          />
        )}

        <g transform={`translate(${shockJitterX}, 0)`}>
          {/* ================= 1. PINGGUL, KAKI & SEPATU ================= */}
          {/* Kaki Kiri */}
          <g transform={`translate(85, ${280 + rig.legLiftL}) rotate(${rig.legRotL})`}>
            <path
              d="M -9 0 L 9 0 L 7.5 85 L -7 85 Z"
              fill={JOKOWO_COLORS.charPants}
              stroke={JOKOWO_COLORS.ink}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <line x1="0" y1="14" x2="0" y2="74" stroke="#334155" strokeWidth="1.4" opacity="0.6" />
            <ellipse
              cx="-2"
              cy="88"
              rx="16"
              ry="7.5"
              fill={JOKOWO_COLORS.charShoes}
              stroke={JOKOWO_COLORS.ink}
              strokeWidth="2.2"
            />
            <path d="M -14 88 Q -2 93 11 88" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Kaki Kanan */}
          <g transform={`translate(115, ${280 + rig.legLiftR}) rotate(${rig.legRotR})`}>
            <path
              d="M -9 0 L 9 0 L 7 85 L -7.5 85 Z"
              fill={JOKOWO_COLORS.charPants}
              stroke={JOKOWO_COLORS.ink}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <line x1="0" y1="14" x2="0" y2="74" stroke="#334155" strokeWidth="1.4" opacity="0.6" />
            <ellipse
              cx="2"
              cy="88"
              rx="16"
              ry="7.5"
              fill={JOKOWO_COLORS.charShoes}
              stroke={JOKOWO_COLORS.ink}
              strokeWidth="2.2"
            />
            <path d="M -11 88 Q 2 93 14 88" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Sambungan Pinggul/Celana */}
          <path
            d="M 73 274 L 127 274 L 125 294 Q 100 299 75 294 Z"
            fill={JOKOWO_COLORS.charPants}
            stroke={JOKOWO_COLORS.ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* ================= 2. TUBUH, KEMEJA ANATOMIS & LENGAN ================= */}
          <g transform={`translate(100, ${280 + totalBodyY}) rotate(${rig.bodyTilt}) translate(-100, -280)`}>
            {/* Lengan Kiri (di belakang badan kecuali pose thinking) */}
            {!leftArmInFront && (
              <ArticulatedArm
                shoulderX={65}
                shoulderY={166}
                upperAngle={rig.leftUpper}
                foreAngle={rig.leftFore}
                side="left"
              />
            )}

            {/* Badan Kemeja Putih dengan Bahu Melengkung & Lipatan Kain Alami */}
            <path
              d="M 84 148 C 72 150 64 156 63 166 L 65 215 Q 67 245 63 282 Q 100 288 137 282 Q 133 245 135 215 L 137 166 C 136 156 128 150 116 148 Z"
              fill="url(#jokowoShirtGrad)"
              stroke={JOKOWO_COLORS.ink}
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            {/* Kontur lipatan kain lembut di pinggir kemeja */}
            <path
              d="M 67 175 Q 72 225 68 278"
              stroke="#CBD5E1"
              strokeWidth="1.8"
              opacity="0.6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 133 175 Q 128 225 132 278"
              stroke="#CBD5E1"
              strokeWidth="1.8"
              opacity="0.6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Garis Kancing Kemeja Tengah */}
            <line x1="100" y1="164" x2="100" y2="283" stroke="#CBD5E1" strokeWidth="1.8" />
            <circle cx="100" cy="184" r="2.1" fill={JOKOWO_COLORS.ink} />
            <circle cx="100" cy="218" r="2.1" fill={JOKOWO_COLORS.ink} />
            <circle cx="100" cy="252" r="2.1" fill={JOKOWO_COLORS.ink} />

            {/* Saku Dada Kiri dengan Batik Cyan Khas */}
            <rect
              x="75"
              y="186"
              width="18"
              height="22"
              rx="2.5"
              fill="url(#batikPattern)"
              stroke={JOKOWO_COLORS.ink}
              strokeWidth="1.6"
            />
            <line x1="75" y1="186" x2="93" y2="186" stroke="#0EA5E9" strokeWidth="2.2" />

            {/* Kerah Kemeja */}
            <path d="M 86 148 L 100 166 L 114 148 Z" fill="#F8FAFC" stroke={JOKOWO_COLORS.ink} strokeWidth="2" />
            <path d="M 81 149 L 95 165 L 86 148" stroke={JOKOWO_COLORS.ink} strokeWidth="2" fill="#E2E8F0" />
            <path d="M 119 149 L 105 165 L 114 148" stroke={JOKOWO_COLORS.ink} strokeWidth="2" fill="#E2E8F0" />

            {/* ================= 3. LEHER & KEPALA (RAHANG ANATOMIS & SHADING) ================= */}
            <rect
              x="91"
              y="132"
              width="18"
              height="20"
              rx="4"
              fill="url(#jokowoNeckGrad)"
              stroke={JOKOWO_COLORS.ink}
              strokeWidth="2"
            />

            <g transform={`translate(100, ${142 + headBobY}) rotate(${rig.headTilt}) translate(-100, -142)`}>
              {/* Bayangan Dagu Lembut di Leher */}
              <ellipse cx="100" cy="138" rx="9" ry="3.8" fill="#9A5C35" opacity="0.38" />

              {/* Telinga Kiri & Kanan dengan Detail Dalam */}
              <ellipse cx="66" cy="96" rx="6" ry="10.5" fill="url(#jokowoSkinGrad)" stroke={JOKOWO_COLORS.ink} strokeWidth="2" />
              <path d="M 65 92 Q 63 96 66 100" stroke="#B8764B" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              <ellipse cx="134" cy="96" rx="6" ry="10.5" fill="url(#jokowoSkinGrad)" stroke={JOKOWO_COLORS.ink} strokeWidth="2" />
              <path d="M 135 92 Q 137 96 134 100" stroke="#B8764B" strokeWidth="1.4" fill="none" strokeLinecap="round" />

              {/* Wajah Manusiawi dengan Rahang & Pipi Melengkung */}
              <path
                d="M 67 88 C 67 56 80 48 100 48 C 120 48 133 56 133 88 C 133 114 119 135 100 136 C 81 135 67 114 67 88 Z"
                fill="url(#jokowoSkinGrad)"
                stroke={JOKOWO_COLORS.ink}
                strokeWidth="2.8"
                strokeLinejoin="round"
              />

              {/* Rona Pipi Natural Hangat */}
              <ellipse
                cx="76"
                cy="99"
                rx="6.2"
                ry="3.4"
                fill={JOKOWO_COLORS.cheekFlush}
                opacity={expression === "laughing" ? 0.36 : 0.18}
              />
              <ellipse
                cx="124"
                cy="99"
                rx="6.2"
                ry="3.4"
                fill={JOKOWO_COLORS.cheekFlush}
                opacity={expression === "laughing" ? 0.36 : 0.18}
              />

              {/* ================= 4. RAMBUT BELAH SAMPING NATURAL ================= */}
              <path
                d="M 66 86 C 65 56 79 44 101 44 C 122 44 135 54 134 86 C 131 78 124 68 102 65 C 94 64 89 67 84 71 C 76 70 70 77 66 86 Z"
                fill="url(#jokowoHairGrad)"
                stroke={JOKOWO_COLORS.ink}
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              {/* Helaian sisiran lembut */}
              <path d="M 86 53 Q 112 51 128 69" stroke="#475569" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M 92 59 Q 116 58 126 74" stroke="#475569" strokeWidth="1.4" fill="none" strokeLinecap="round" />

              {/* ================= 5. ALIS & MATA EKSPRESIF + LIRIKAN ================= */}
              {expression === "shocked" ? (
                <>
                  <path d="M 78 70 Q 86 62 94 70" stroke={JOKOWO_COLORS.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
                  <path d="M 106 70 Q 114 62 122 70" stroke={JOKOWO_COLORS.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
                  <circle cx="86" cy="85" r="7.4" fill="#FFFFFF" stroke={JOKOWO_COLORS.ink} strokeWidth="2.2" />
                  <circle cx={86 + pupilDx * 0.5} cy={85 + pupilDy * 0.5} r="3.4" fill={JOKOWO_COLORS.iris} />
                  <circle cx={86 + pupilDx * 0.5} cy={85 + pupilDy * 0.5} r="2.0" fill={JOKOWO_COLORS.pupil} />
                  <circle cx={87.5 + pupilDx * 0.5} cy={83.5 + pupilDy * 0.5} r="1.2" fill="#FFFFFF" />
                  <circle cx="114" cy="85" r="7.4" fill="#FFFFFF" stroke={JOKOWO_COLORS.ink} strokeWidth="2.2" />
                  <circle cx={114 + pupilDx * 0.5} cy={85 + pupilDy * 0.5} r="3.4" fill={JOKOWO_COLORS.iris} />
                  <circle cx={114 + pupilDx * 0.5} cy={85 + pupilDy * 0.5} r="2.0" fill={JOKOWO_COLORS.pupil} />
                  <circle cx={115.5 + pupilDx * 0.5} cy={83.5 + pupilDy * 0.5} r="1.2" fill="#FFFFFF" />
                </>
              ) : expression === "laughing" ? (
                <>
                  <path d="M 78 73 Q 86 67 94 74" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 106 74 Q 114 67 122 73" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 78 88 Q 86 79 94 88" stroke={JOKOWO_COLORS.ink} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                  <path d="M 106 88 Q 114 79 122 88" stroke={JOKOWO_COLORS.ink} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                </>
              ) : isBlinking ? (
                <>
                  <path d="M 78 74 Q 86 70 94 74" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 106 74 Q 114 70 122 74" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 79 86 Q 86 90 93 86" stroke={JOKOWO_COLORS.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />
                  <path d="M 107 86 Q 114 90 121 86" stroke={JOKOWO_COLORS.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Alis ekspresif sesuai curious / amused / neutral */}
                  {expression === "curious" ? (
                    <>
                      <path d="M 78 69 Q 86 61 94 68" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 106 76 Q 114 73 122 77" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </>
                  ) : expression === "amused" ? (
                    <>
                      <path d="M 78 71 Q 86 65 94 72" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 106 74 Q 114 70 122 75" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <path d="M 78 74 Q 86 70 94 74" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 106 74 Q 114 70 122 74" stroke={JOKOWO_COLORS.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </>
                  )}
                  {/* Mata dengan bola mata lembut + kelopak atas + iris cokelat + lirikan */}
                  <ellipse cx="86" cy="85.5" rx="6.2" ry="5.6" fill="#FFFFFF" stroke={JOKOWO_COLORS.ink} strokeWidth="1.8" />
                  <path d="M 79.5 84 Q 86 78 92.5 84" stroke={JOKOWO_COLORS.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
                  <circle cx={86 + pupilDx} cy={85.5 + pupilDy} r="3.4" fill={JOKOWO_COLORS.iris} />
                  <circle cx={86 + pupilDx} cy={85.5 + pupilDy} r="2.0" fill={JOKOWO_COLORS.pupil} />
                  <circle cx={87.2 + pupilDx} cy={84.2 + pupilDy} r="1.1" fill="#FFFFFF" />

                  <ellipse cx="114" cy="85.5" rx="6.2" ry="5.6" fill="#FFFFFF" stroke={JOKOWO_COLORS.ink} strokeWidth="1.8" />
                  <path d="M 107.5 84 Q 114 78 120.5 84" stroke={JOKOWO_COLORS.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
                  <circle cx={114 + pupilDx} cy={85.5 + pupilDy} r="3.4" fill={JOKOWO_COLORS.iris} />
                  <circle cx={114 + pupilDx} cy={85.5 + pupilDy} r="2.0" fill={JOKOWO_COLORS.pupil} />
                  <circle cx={115.2 + pupilDx} cy={84.2 + pupilDy} r="1.1" fill="#FFFFFF" />
                </>
              )}

              {/* Hidung Bersahaja */}
              <path d="M 100 86 Q 103 95 97 99" stroke={JOKOWO_COLORS.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />

              {/* Garis Senyum Lembut */}
              <path d="M 77 98 Q 81 105 83 111" stroke="#B8764B" strokeWidth="1.4" fill="none" opacity="0.65" strokeLinecap="round" />
              <path d="M 123 98 Q 119 105 117 111" stroke="#B8764B" strokeWidth="1.4" fill="none" opacity="0.65" strokeLinecap="round" />

              {/* ================= 6. MULUT & LIP SYNC (DENGAN AKSEN GIGI HALUS) ================= */}
              {effectiveMouth > 0.12 ? (
                <g>
                  <path
                    d={`M 90 110 Q 100 ${110 + mouthHeight * 1.32} 110 110 Q 100 ${110 - mouthHeight * 0.28} 90 110 Z`}
                    fill={JOKOWO_COLORS.mouthInside}
                    stroke={JOKOWO_COLORS.ink}
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Aksen gigi atas putih lembut saat mulut terbuka cukup lebar */}
                  {effectiveMouth > 0.32 && (
                    <path
                      d={`M 93 110 Q 100 ${110 - mouthHeight * 0.14} 107 110 L 105.5 ${111 + Math.min(3.2, mouthHeight * 0.22)} L 94.5 ${111 + Math.min(3.2, mouthHeight * 0.22)} Z`}
                      fill="#FFFFFF"
                      opacity="0.92"
                    />
                  )}
                  {effectiveMouth > 0.55 && (
                    <ellipse cx="100" cy={113 + mouthHeight * 0.42} rx="5" ry="2.4" fill="#FB7185" />
                  )}
                </g>
              ) : expression === "laughing" ? (
                <g>
                  <path d="M 90 108 Q 100 122 110 108 Z" fill={JOKOWO_COLORS.mouthInside} stroke={JOKOWO_COLORS.ink} strokeWidth="2" strokeLinejoin="round" />
                  <path d="M 92.5 109 L 107.5 109 L 106 112 L 94 112 Z" fill="#FFFFFF" opacity="0.92" />
                </g>
              ) : expression === "curious" ? (
                <circle cx="100" cy="112" r="4" fill={JOKOWO_COLORS.mouthInside} stroke={JOKOWO_COLORS.ink} strokeWidth="1.6" />
              ) : expression === "amused" ? (
                <path d="M 91 111 Q 99 114.5 110 108.5" stroke={JOKOWO_COLORS.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 92 110 Q 100 116 108 110" stroke={JOKOWO_COLORS.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Pada pose thinking, render lengan kiri di depan tubuh menopang siku */}
            {leftArmInFront && (
              <ArticulatedArm
                shoulderX={65}
                shoulderY={166}
                upperAngle={rig.leftUpper}
                foreAngle={rig.leftFore}
                side="left"
              />
            )}

            {/* ================= 7. LENGAN KANAN TERARTIKULASI ================= */}
            <ArticulatedArm
              shoulderX={135}
              shoulderY={166}
              upperAngle={rig.rightUpper}
              foreAngle={rig.rightFore}
              side="right"
              showPointingFinger={showPointFinger}
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export const Mascot = Jokowo;
