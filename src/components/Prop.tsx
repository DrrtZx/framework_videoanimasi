import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE } from "../config";
import { popIn } from "../lib/anim";

export type PropType =
  | "book"
  | "magnifier"
  | "lightbulb"
  | "star"
  | "arrow"
  | "question-mark"
  | "flask"
  | "atom"
  | "moth"
  | "relay";

export interface PropProps {
  type: PropType;
  size?: number;
  delay?: number;
  animate?: boolean;
  style?: React.CSSProperties;
}

export const Prop: React.FC<PropProps> = ({
  type,
  size = 120,
  delay = 0,
  animate = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = animate ? popIn(frame, fps, delay) : 1;
  const floatY = animate ? Math.sin((frame / fps) * 4) * 6 : 0;

  const renderShape = () => {
    switch (type) {
      case "moth": {
        // Animasi kepak sayap ngengat lembut
        const wingFlap = Math.sin((frame / fps) * 16) * 8;
        return (
          <g>
            {/* Sayap Kiri */}
            <path
              d={`M 50 48 C ${15 + wingFlap} 15, ${5 + wingFlap} 60, 50 68 Z`}
              fill="#FDE68A"
              stroke={PALETTE.ink}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="28" cy="42" r="5" fill="#F59E0B" opacity="0.6" />

            {/* Sayap Kanan */}
            <path
              d={`M 50 48 C ${85 - wingFlap} 15, ${95 - wingFlap} 60, 50 68 Z`}
              fill="#FDE68A"
              stroke={PALETTE.ink}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="72" cy="42" r="5" fill="#F59E0B" opacity="0.6" />

            {/* Antena Kiri & Kanan */}
            <path d="M 48 30 Q 38 12 30 18" fill="none" stroke={PALETTE.ink} strokeWidth="3" strokeLinecap="round" />
            <path d="M 52 30 Q 62 12 70 18" fill="none" stroke={PALETTE.ink} strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="18" r="3" fill={PALETTE.accentYellow} />
            <circle cx="70" cy="18" r="3" fill={PALETTE.accentYellow} />

            {/* Badan Ngengat Bersegmen */}
            <ellipse cx="50" cy="55" rx="10" ry="22" fill="#78350F" stroke={PALETTE.ink} strokeWidth="3.5" />
            <line x1="43" y1="46" x2="57" y2="46" stroke="#D97706" strokeWidth="2.5" />
            <line x1="42" y1="55" x2="58" y2="55" stroke="#D97706" strokeWidth="2.5" />
            <line x1="44" y1="64" x2="56" y2="64" stroke="#D97706" strokeWidth="2.5" />

            {/* Kepala Ngengat */}
            <circle cx="50" cy="34" r="8" fill="#451A03" stroke={PALETTE.ink} strokeWidth="3" />
            {/* Mata Karikatur Kaget (Bintang / X tanda gosong/mati) */}
            <text x="46" y="36" fontFamily="sans-serif" fontSize="9" fontWeight="900" fill="#FFFFFF" textAnchor="middle">×</text>
            <text x="54" y="36" fontFamily="sans-serif" fontSize="9" fontWeight="900" fill="#FFFFFF" textAnchor="middle">×</text>
          </g>
        );
      }

      case "relay":
        return (
          <g>
            {/* Kotak Plat Relay Industri */}
            <rect x="15" y="20" width="70" height="60" rx="8" fill="#E2E8F0" stroke={PALETTE.ink} strokeWidth="5" />
            <rect x="22" y="27" width="56" height="46" rx="4" fill="#334155" stroke={PALETTE.ink} strokeWidth="3" />

            {/* Kumparan Koil Tembaga */}
            <rect x="28" y="34" width="20" height="32" rx="3" fill="#B45309" stroke={PALETTE.ink} strokeWidth="2" />
            <line x1="28" y1="40" x2="48" y2="40" stroke="#F59E0B" strokeWidth="2" />
            <line x1="28" y1="46" x2="48" y2="46" stroke="#F59E0B" strokeWidth="2" />
            <line x1="28" y1="52" x2="48" y2="52" stroke="#F59E0B" strokeWidth="2" />
            <line x1="28" y1="58" x2="48" y2="58" stroke="#F59E0B" strokeWidth="2" />

            {/* Sakelar Kontak Logam */}
            <line x1="56" y1="62" x2="68" y2="38" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="56" cy="62" r="4" fill="#E2E8F0" stroke={PALETTE.ink} strokeWidth="2" />
            <circle cx="68" cy="38" r="4" fill="#E2E8F0" stroke={PALETTE.ink} strokeWidth="2" />

            {/* Label Plat Angka 70 */}
            <rect x="35" y="8" width="30" height="14" rx="3" fill={PALETTE.accentYellow} stroke={PALETTE.ink} strokeWidth="2.5" />
            <text x="50" y="19" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill={PALETTE.ink} textAnchor="middle">#70</text>
          </g>
        );

      case "magnifier":
        return (
          <g>
            <circle cx="50" cy="50" r="30" fill="#E0F2FE" stroke={PALETTE.ink} strokeWidth="6" />
            <ellipse cx="44" cy="42" rx="14" ry="7" fill="#FFFFFF" opacity="0.6" />
            <line x1="72" y1="72" x2="105" y2="105" stroke={PALETTE.accentBlue} strokeWidth="12" strokeLinecap="round" />
            <line x1="72" y1="72" x2="105" y2="105" stroke={PALETTE.ink} strokeWidth="12" strokeLinecap="round" opacity="0.2" />
          </g>
        );

      case "book":
        return (
          <g>
            <path d="M 50 85 C 35 80 15 85 10 90 L 10 30 C 15 25 35 20 50 25 Z" fill="#F8FAFC" stroke={PALETTE.ink} strokeWidth="5" />
            <path d="M 50 85 C 65 80 85 85 90 90 L 90 30 C 85 25 65 20 50 25 Z" fill={PALETTE.accentBlue} stroke={PALETTE.ink} strokeWidth="5" />
            <line x1="50" y1="25" x2="50" y2="85" stroke={PALETTE.ink} strokeWidth="5" />
            <line x1="18" y1="42" x2="42" y2="38" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <line x1="18" y1="56" x2="42" y2="52" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case "lightbulb":
        return (
          <g>
            <path d="M 35 45 C 35 25 65 25 65 45 C 65 55 58 62 58 72 L 42 72 C 42 62 35 55 35 45 Z" fill={PALETTE.accentYellow} stroke={PALETTE.ink} strokeWidth="5" />
            <rect x="42" y="73" width="16" height="12" rx="2" fill="#94A3B8" stroke={PALETTE.ink} strokeWidth="3" />
            <line x1="50" y1="12" x2="50" y2="2" stroke={PALETTE.accentYellow} strokeWidth="5" strokeLinecap="round" />
            <line x1="22" y1="24" x2="14" y2="16" stroke={PALETTE.accentYellow} strokeWidth="5" strokeLinecap="round" />
            <line x1="78" y1="24" x2="86" y2="16" stroke={PALETTE.accentYellow} strokeWidth="5" strokeLinecap="round" />
          </g>
        );

      case "star":
        return (
          <g>
            <polygon
              points="50,10 62,38 92,38 68,56 78,86 50,68 22,86 32,56 8,38 38,38"
              fill={PALETTE.accentYellow}
              stroke={PALETTE.ink}
              strokeWidth="5"
              strokeLinejoin="round"
            />
          </g>
        );

      case "arrow":
        return (
          <g>
            <path
              d="M 20 50 L 60 50 L 60 30 L 95 60 L 60 90 L 60 70 L 20 70 Z"
              fill={PALETTE.accentPurple}
              stroke={PALETTE.ink}
              strokeWidth="5"
              strokeLinejoin="round"
            />
          </g>
        );

      case "flask":
        return (
          <g>
            <path d="M 42 20 L 58 20 L 58 40 L 85 85 C 88 90 84 96 78 96 L 22 96 C 16 96 12 90 15 85 L 42 40 Z" fill="#EEF2FF" stroke={PALETTE.ink} strokeWidth="5" strokeLinejoin="round" />
            <path d="M 24 88 L 76 88 L 68 65 Q 50 62 32 65 Z" fill={PALETTE.accentPurple} />
            <circle cx="48" cy="74" r="4" fill="#FFFFFF" opacity="0.7" />
            <circle cx="58" cy="78" r="2.5" fill="#FFFFFF" opacity="0.7" />
          </g>
        );

      case "atom":
        return (
          <g>
            <circle cx="50" cy="50" r="12" fill={PALETTE.accentBlue} stroke={PALETTE.ink} strokeWidth="3" />
            <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke={PALETTE.ink} strokeWidth="3" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke={PALETTE.ink} strokeWidth="3" transform="rotate(-30 50 50)" />
            <circle cx="78" cy="35" r="4" fill={PALETTE.accentYellow} />
          </g>
        );

      case "question-mark":
      default:
        return (
          <g>
            <circle cx="50" cy="50" r="42" fill={PALETTE.accentYellow} stroke={PALETTE.ink} strokeWidth="5" />
            <path d="M 40 38 C 40 28 60 28 60 38 C 60 46 50 48 50 58" fill="none" stroke={PALETTE.ink} strokeWidth="6" strokeLinecap="round" />
            <circle cx="50" cy="72" r="4" fill={PALETTE.ink} />
          </g>
        );
    }
  };

  return (
    <div
      style={{
        display: "inline-block",
        transform: `translateY(${floatY}px) scale(${scale})`,
        transformOrigin: "center center",
        width: size,
        height: size,
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {renderShape()}
      </svg>
    </div>
  );
};
