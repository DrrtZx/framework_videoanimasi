import React from "react";
import { Audio, Loop, Sequence, staticFile } from "remotion";
import { AUDIO_LEVELS } from "../config";

export interface SfxCueItem {
  frame: number;
  src: string;
  volume?: number;
}

export interface ShortsAudioMixProps {
  voiceoverSrc?: string;
  sfxCues?: SfxCueItem[];
  bgmSrc?: string;
  durationInFrames: number;
}

export const ShortsAudioMix: React.FC<ShortsAudioMixProps> = ({
  voiceoverSrc,
  sfxCues = [],
  bgmSrc = staticFile("audio/music/bgm-loop.wav"),
  durationInFrames,
}) => {
  const children: React.ReactNode[] = [];

  // 1. Voice-Over Track (100% Volume)
  if (voiceoverSrc) {
    children.push(
      React.createElement(Audio, {
        key: "vo-track",
        src: voiceoverSrc,
        volume: AUDIO_LEVELS.vo,
      })
    );
  }

  // 2. Procedural / Triggered SFX (35% - 45% Volume) - dijadwalkan tepat di cue.frame!
  sfxCues.forEach((cue, idx) => {
    const startFrame = Math.max(0, Math.round(cue.frame));
    const remaining = Math.max(1, durationInFrames - startFrame);
    const sfxDur = Math.min(90, remaining);

    children.push(
      React.createElement(
        Sequence,
        {
          key: `sfx-seq-${startFrame}-${idx}`,
          from: startFrame,
          durationInFrames: sfxDur,
        },
        React.createElement(Audio, {
          src: cue.src,
          volume: cue.volume ?? AUDIO_LEVELS.sfx,
          playbackRate: 1,
        })
      )
    );
  });

  // 3. Background Music Loop (10% - 15% Volume)
  if (bgmSrc) {
    children.push(
      React.createElement(
        Loop,
        {
          key: "bgm-loop",
          durationInFrames: Math.max(1, durationInFrames),
        },
        React.createElement(Audio, {
          src: bgmSrc,
          volume: AUDIO_LEVELS.bgmNormal,
        })
      )
    );
  }

  return React.createElement(React.Fragment, null, ...children);
};
