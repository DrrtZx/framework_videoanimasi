import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "./Caption";
import { ChapterBackdrop } from "./ChapterBackdrop";
import { ChapterCard } from "./ChapterCard";
import { AnimatedDiagram } from "./AnimatedDiagram";
import { Prop } from "./Prop";
import { Sfx } from "./Sfx";
import { SpeechBubble } from "./SpeechBubble";
import { getPreset } from "../presets";
import type { PresetConfig } from "../presets/types";
import type { Chapter } from "../episodes/long-types";
import type { PropType } from "./Prop";

export interface LongChapterProps {
  chapter: Chapter;
  chapterNumber: number;
  preset?: PresetConfig;
}

export const LongChapter: React.FC<LongChapterProps> = ({
  chapter,
  chapterNumber,
  preset = getPreset(),
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Mascot = preset.Mascot;

  // Hitung durasi per beat secara proporsional
  const totalBeats = Math.max(1, chapter.beats.length);
  const beatDuration = Math.floor(chapter.durationInFrames / totalBeats);

  // Tentukan beat yang sedang aktif berdasarkan frame saat ini
  const activeBeatIndex = Math.min(
    totalBeats - 1,
    Math.floor(frame / beatDuration)
  );
  const currentBeat = chapter.beats[activeBeatIndex] || chapter.beats[0];

  // Frame relatif di dalam beat aktif
  const localBeatFrame = frame - activeBeatIndex * beatDuration;

  // Lip-sync simulasi berdasarkan ritme bicara beat (aktif buka tutup)
  const isSpeaking = localBeatFrame < beatDuration - 15;
  const mouthOpen = isSpeaking ? Math.abs(Math.sin((frame / fps) * 14)) : 0;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* 1. Backdrop Babak */}
      <ChapterBackdrop
        kind={chapter.kind}
        seed={`ch-${chapterNumber}`}
        preset={preset}
      />

      {/* 2. Kartu Judul Babak (Tampil di frame awal babak) */}
      <ChapterCard
        title={chapter.title}
        chapterNumber={chapterNumber}
        durationInFrames={75}
        preset={preset}
      />

      {/* 3. Area Visual Konten (Sebelah Kiri / Tengah: Diagram atau Prop) */}
      <div
        style={{
          position: "absolute",
          left: "140px",
          top: "160px",
          width: "900px",
          height: "560px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {currentBeat.diagram ? (
          <AnimatedDiagram data={currentBeat.diagram} delay={5} preset={preset} />
        ) : currentBeat.prop ? (
          <Prop
            type={currentBeat.prop as PropType}
            size={220}
            delay={5}
          />
        ) : null}

        {/* Balon Bicara sesekali jika ada */}
        {currentBeat.speechBubble && (
          <SpeechBubble
            text={currentBeat.speechBubble}
            position="top"
            delay={10}
            preset={preset}
            style={{ position: "absolute", top: "40px", left: "20px" }}
          />
        )}
      </div>

      {/* 4. Karakter Maskot Sesuai Preset (Sebelah Kanan Layar 16:9) */}
      <div
        style={{
          position: "absolute",
          right: `${preset.mascotLayout.longRight}px`,
          bottom: `${preset.mascotLayout.longBottom}px`,
          zIndex: 25,
        }}
      >
        <Mascot
          pose={currentBeat.pose ?? "talking"}
          expression={currentBeat.expression ?? "neutral"}
          mouthOpen={mouthOpen}
          scale={preset.mascotLayout.longDefaultScale}
        />
      </div>

      {/* 5. SFX Text Overlay */}
      {currentBeat.sfx && (
        <Sfx
          text={currentBeat.sfx}
          delay={5}
          duration={25}
          preset={preset}
          style={{ top: "200px", right: "240px" }}
        />
      )}

      {/* 6. Caption Wajib (Bottom: 110px, 1 Baris Pendek 3-6 kata, Outline 12px) */}
      <Caption
        text={currentBeat.narration}
        activeWord={currentBeat.activeWord}
        variant="long"
        preset={preset}
      />
    </div>
  );
};
