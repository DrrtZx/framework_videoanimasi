import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { PALETTE } from "../config";
import { FONTS } from "../fonts";
import { popIn } from "../lib/anim";
import type { DiagramData } from "../episodes/long-types";

export interface AnimatedDiagramProps {
  data: DiagramData;
  delay?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const AnimatedDiagram: React.FC<AnimatedDiagramProps> = ({
  data,
  delay = 10,
  width = 650,
  height = 420,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerScale = popIn(frame, fps, delay);
  const animProgress = interpolate(frame, [delay + 5, delay + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chartColors = [
    PALETTE.accentBlue,
    PALETTE.accentPurple,
    PALETTE.accentYellow,
    "#10B981", // Emerald
    "#F43F5E", // Rose
  ];

  const renderContent = () => {
    if (data.type === "bar") {
      const maxValue = Math.max(...data.values, 1);
      const barWidth = Math.min(80, (width - 120) / data.values.length);
      const gap = (width - 120 - barWidth * data.values.length) / (data.values.length + 1);

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
          {/* Axis Garis Bawah */}
          <line
            x1="50"
            y1={height - 60}
            x2={width - 40}
            y2={height - 60}
            stroke={PALETTE.ink}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {data.values.map((val, i) => {
            const barH = (val / maxValue) * (height - 140) * animProgress;
            const x = 60 + gap + i * (barWidth + gap);
            const y = height - 60 - barH;
            const color = chartColors[i % chartColors.length];

            return (
              <g key={`bar-${i}`}>
                {/* Batang Diagram */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(4, barH)}
                  rx="6"
                  fill={color}
                  stroke={PALETTE.ink}
                  strokeWidth="2.5"
                />
                {/* Nilai di atas batang */}
                <text
                  x={x + barWidth / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fontFamily={FONTS.label}
                  fontSize="20"
                  fontWeight="800"
                  fill={PALETTE.ink}
                >
                  {Math.round(val * animProgress)}%
                </text>
                {/* Label Kategori */}
                <text
                  x={x + barWidth / 2}
                  y={height - 30}
                  textAnchor="middle"
                  fontFamily={FONTS.label}
                  fontSize="16"
                  fontWeight="700"
                  fill="#475569"
                >
                  {data.labels[i] || ""}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    if (data.type === "pie") {
      const total = data.values.reduce((a, b) => a + b, 0) || 1;
      const cx = width / 3;
      const cy = height / 2;
      const r = 110;

      let accumulatedAngle = 0;
      const slices = data.values.map((val, i) => {
        const sliceAngle = (val / total) * 360 * animProgress;
        const startA = accumulatedAngle;
        const endA = startA + sliceAngle;
        accumulatedAngle = endA;

        const startRad = (startA - 90) * (Math.PI / 180);
        const endRad = (endA - 90) * (Math.PI / 180);

        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);

        const largeArc = sliceAngle > 180 ? 1 : 0;
        const pathData =
          sliceAngle >= 359.9
            ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
            : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        return {
          path: pathData,
          color: chartColors[i % chartColors.length],
          label: data.labels[i] || "",
          percent: Math.round((val / total) * 100),
        };
      });

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
          {/* Irisan Pie */}
          {slices.map((s, idx) => (
            <path
              key={`pie-${idx}`}
              d={s.path}
              fill={s.color}
              stroke={PALETTE.ink}
              strokeWidth="2.5"
            />
          ))}

          {/* Legenda di Kanan */}
          {slices.map((s, idx) => (
            <g key={`leg-${idx}`} transform={`translate(${width * 0.58}, ${height * 0.25 + idx * 45})`}>
              <rect x="0" y="0" width="20" height="20" rx="4" fill={s.color} stroke={PALETTE.ink} strokeWidth="2" />
              <text x="32" y="16" fontFamily={FONTS.label} fontSize="18" fontWeight="700" fill={PALETTE.ink}>
                {s.label} ({s.percent}%)
              </text>
            </g>
          ))}
        </svg>
      );
    }

    // Default flow / comparison
    return (
      <div style={{ padding: "30px", display: "flex", gap: "20px", justifyContent: "center" }}>
        {data.labels.map((lbl, idx) => (
          <div
            key={`box-${idx}`}
            style={{
              backgroundColor: chartColors[idx % chartColors.length],
              padding: "20px",
              borderRadius: "14px",
              border: `3px solid ${PALETTE.ink}`,
              boxShadow: "0 6px 0 rgba(30, 41, 59, 0.2)",
              textAlign: "center",
              minWidth: "140px",
            }}
          >
            <div style={{ fontFamily: FONTS.title, fontSize: "28px", fontWeight: 900, color: "#FFFFFF" }}>
              {data.values[idx] || 0}
            </div>
            <div style={{ fontFamily: FONTS.label, fontSize: "16px", fontWeight: 700, color: PALETTE.ink }}>
              {lbl}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: `3px solid ${PALETTE.ink}`,
        borderRadius: "24px",
        padding: "20px",
        boxShadow: "0 12px 0 rgba(30, 41, 59, 0.2)",
        transform: `scale(${containerScale})`,
        transformOrigin: "center center",
        display: "inline-block",
        ...style,
      }}
    >
      {data.title && (
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: "26px",
            fontWeight: 800,
            color: PALETTE.ink,
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {data.title}
        </div>
      )}
      {renderContent()}
    </div>
  );
};
