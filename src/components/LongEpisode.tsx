import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { LongChapter } from "./LongChapter";
import { LongAudioMix } from "../lib/long-audio-mix";
import { getSfxStaticPath } from "../lib/sfx-events";
import type { LongEpisodeData } from "../episodes/long-types";

export interface LongEpisodeProps {
  episode: LongEpisodeData;
}

export const LongEpisode: React.FC<LongEpisodeProps> = ({ episode }) => {
  let accumulatedFrame = 0;

  // Kumpulkan semua event SFX dari seluruh chapter
  const allSfxCues: { frame: number; src: string }[] = [];
  let sfxTimeline = 0;
  episode.chapters.forEach((ch) => {
    const totalBeats = Math.max(1, ch.beats.length);
    const beatDur = Math.floor(ch.durationInFrames / totalBeats);
    ch.beats.forEach((b, bIdx) => {
      if (b.sfx) {
        allSfxCues.push({
          frame: sfxTimeline + bIdx * beatDur + 5,
          src: getSfxStaticPath(b.sfx),
        });
      }
    });
    sfxTimeline += ch.durationInFrames;
  });

  const totalDuration = episode.chapters.reduce(
    (acc, ch) => acc + ch.durationInFrames,
    0
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#EEF5FF" }}>
      {/* Sequence Tiap Chapter */}
      {episode.chapters.map((chapter, index) => {
        const from = accumulatedFrame;
        const duration = chapter.durationInFrames;
        accumulatedFrame += duration;

        return (
          <Sequence
            key={`chapter-${index}-${chapter.kind}`}
            from={from}
            durationInFrames={duration}
          >
            <LongChapter chapter={chapter} chapterNumber={index + 1} />
          </Sequence>
        );
      })}

      {/* Audio Layering Long Video dengan Auto-Ducking */}
      <LongAudioMix
        voiceoverSrc={episode.voiceoverSrc}
        sfxCues={allSfxCues}
        durationInFrames={totalDuration}
      />
    </AbsoluteFill>
  );
};
