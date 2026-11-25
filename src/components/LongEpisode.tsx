import React from "react";
import { Sequence, AbsoluteFill, staticFile } from "remotion";
import { LongChapter } from "./LongChapter";
import { LongAudioMix } from "../lib/long-audio-mix";
import { getSfxStaticPath } from "../lib/sfx-events";
import { getPreset } from "../presets";
import type { LongEpisodeData } from "../episodes/long-types";

export type LongEpisodeProps = {
  episode: LongEpisodeData;
};

export const LongEpisode: React.FC<LongEpisodeProps> = ({ episode }) => {
  const preset = getPreset(episode.preset);
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
    <AbsoluteFill style={{ backgroundColor: preset.palette.bg }}>
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
            <LongChapter
              chapter={chapter}
              chapterNumber={index + 1}
              preset={preset}
            />
          </Sequence>
        );
      })}

      {/* Audio Layering Long Video dengan Auto-Ducking sesuai preset */}
      <LongAudioMix
        voiceoverSrc={episode.voiceoverSrc}
        sfxCues={allSfxCues}
        bgmSrc={staticFile(preset.audio.bgmSrc)}
        audioLevels={preset.audio.levels}
        durationInFrames={totalDuration}
      />
    </AbsoluteFill>
  );
};
