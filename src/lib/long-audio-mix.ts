import React from "react";
import { Audio, Loop, staticFile, useCurrentFrame, interpolate } from "remotion";
import { AUDIO_LEVELS } from "../config";
import type { SfxCueItem } from "./audio-mix";

/**
 * Menganalisis buffer audio WAV (16-bit mono 44.1kHz PCM)
 * dan menghitung energi RMS per frame (30fps).
 * Menghasilkan array boolean apakah narator sedang bicara pada frame tersebut.
 */
export function extractSpeechFramesFromWav(
  wavBuffer: ArrayBuffer | Uint8Array,
  threshold: number = 0.035,
  sampleRate: number = 44100,
  fps: number = 30
): boolean[] {
  const bytes = wavBuffer instanceof Uint8Array ? wavBuffer : new Uint8Array(wavBuffer);
  // Cari 'data' subchunk
  let dataOffset = 44;
  for (let i = 0; i < Math.min(bytes.length - 8, 200); i++) {
    if (
      bytes[i] === 0x64 && // 'd'
      bytes[i + 1] === 0x61 && // 'a'
      bytes[i + 2] === 0x74 && // 't'
      bytes[i + 3] === 0x61 // 'a'
    ) {
      dataOffset = i + 8;
      break;
    }
  }

  const samplesCount = Math.floor((bytes.length - dataOffset) / 2);
  if (samplesCount <= 0) return [];

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const samplesPerFrame = Math.floor(sampleRate / fps); // 1470 samples pada 44.1kHz @ 30fps
  const totalFrames = Math.ceil(samplesCount / samplesPerFrame);
  const speechFrames: boolean[] = new Array(totalFrames);

  for (let f = 0; f < totalFrames; f++) {
    const startSample = f * samplesPerFrame;
    const endSample = Math.min(samplesCount, startSample + samplesPerFrame);
    let sumSquares = 0;
    let count = 0;

    for (let s = startSample; s < endSample; s++) {
      const byteIdx = dataOffset + s * 2;
      if (byteIdx + 1 < bytes.length) {
        const int16 = view.getInt16(byteIdx, true);
        const norm = int16 / 32768.0;
        sumSquares += norm * norm;
        count++;
      }
    }

    const rms = count > 0 ? Math.sqrt(sumSquares / count) : 0;
    speechFrames[f] = rms >= threshold;
  }

  return speechFrames;
}

export interface AlignedSegment {
  startFrame: number;
  durationInFrames: number;
  text: string;
}

/**
 * Menyelaraskan teks narasi dengan segmen audio aktif
 */
export function alignNarrationToWav(
  speechFrames: boolean[],
  narrationLines: string[],
  minSilenceGapFrames: number = 9 // ~300ms hening antar baris
): AlignedSegment[] {
  if (speechFrames.length === 0 || narrationLines.length === 0) return [];

  // Temukan segmen-segmen aktif
  const segments: { start: number; end: number }[] = [];
  let inSpeech = false;
  let segStart = 0;
  let silenceCount = 0;

  for (let i = 0; i < speechFrames.length; i++) {
    if (speechFrames[i]) {
      if (!inSpeech) {
        inSpeech = true;
        segStart = i;
      }
      silenceCount = 0;
    } else {
      if (inSpeech) {
        silenceCount++;
        if (silenceCount >= minSilenceGapFrames || i === speechFrames.length - 1) {
          segments.push({ start: segStart, end: i - silenceCount });
          inSpeech = false;
          silenceCount = 0;
        }
      }
    }
  }

  // Petakan garis narasi ke segmen aktif
  return narrationLines.map((text, idx) => {
    if (idx < segments.length) {
      return {
        startFrame: segments[idx].start,
        durationInFrames: Math.max(30, segments[idx].end - segments[idx].start),
        text,
      };
    }
    // Fallback estimasi jika segmen lebih sedikit dari teks
    const fallbackStart = idx * 90;
    return {
      startFrame: fallbackStart,
      durationInFrames: 90,
      text,
    };
  });
}

export interface LongAudioMixProps {
  voiceoverSrc?: string;
  speechFrames?: boolean[];
  sfxCues?: SfxCueItem[];
  bgmSrc?: string;
  durationInFrames: number;
}

/**
 * Komponen mixing audio Long Video (16:9) dengan fitur Auto-Ducking cerdas
 */
export const LongAudioMix: React.FC<LongAudioMixProps> = ({
  voiceoverSrc,
  speechFrames = [],
  sfxCues = [],
  bgmSrc = staticFile("audio/music/bgm-loop.wav"),
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Evaluasi apakah narator sedang bicara pada window frame saat ini
  const isSpeakingNow = speechFrames.length > 0 ? Boolean(speechFrames[frame]) : true;

  // Smoothing ducking volume
  const bgmVolume = interpolate(
    Number(isSpeakingNow),
    [0, 1],
    [AUDIO_LEVELS.bgmNormal, AUDIO_LEVELS.bgmDucked]
  );

  const children: React.ReactNode[] = [];

  // 1. Master Voice-Over (100% Volume)
  if (voiceoverSrc) {
    children.push(
      React.createElement(Audio, {
        key: "long-vo-track",
        src: voiceoverSrc,
        volume: AUDIO_LEVELS.vo,
      })
    );
  }

  // 2. SFX Cues
  sfxCues.forEach((cue, idx) => {
    children.push(
      React.createElement(Audio, {
        key: `long-sfx-${cue.frame}-${idx}`,
        src: cue.src,
        volume: cue.volume ?? AUDIO_LEVELS.sfx,
      })
    );
  });

  // 3. Background Music dengan Auto-Ducking Real-Time
  if (bgmSrc) {
    children.push(
      React.createElement(
        Loop,
        {
          key: "long-bgm-loop",
          durationInFrames: Math.max(1, durationInFrames),
        },
        React.createElement(Audio, {
          src: bgmSrc,
          volume: bgmVolume,
        })
      )
    );
  }

  return React.createElement(React.Fragment, null, ...children);
};
