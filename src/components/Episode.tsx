import React from "react";
import {
  Sequence,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Scene } from "./Scene";
import { Jokowo } from "./Jokowo";
import { Caption } from "./Caption";
import { Prop } from "./Prop";
import { StageProp } from "./StageProp";
import { Sfx } from "./Sfx";
import { SpeechBubble } from "./SpeechBubble";
import { ShortsAudioMix } from "../lib/audio-mix";
import { getSfxStaticPath } from "../lib/sfx-events";
import type { EpisodeData, Scene as SceneData, Pose } from "../episodes/types";
import type { PropType } from "./Prop";

export interface EpisodeProps {
  episode: EpisodeData;
}

export const Episode: React.FC<EpisodeProps> = ({ episode }) => {
  let accumulatedFrame = 0;

  // Kumpulkan seluruh SFX audio cue dengan frame mulai presisi per beat
  const allSfxCues: { frame: number; src: string; volume?: number }[] = [];
  let sfxTimeline = 0;
  episode.scenes.forEach((sc) => {
    let beatAccum = 0;
    sc.beats.forEach((b) => {
      const bDur =
        b.durationInFrames ??
        Math.floor(sc.durationInFrames / Math.max(1, sc.beats.length));
      if (b.sfx) {
        allSfxCues.push({
          frame: sfxTimeline + beatAccum + 2,
          src: getSfxStaticPath(b.sfx),
        });
      }
      beatAccum += bDur;
    });
    sfxTimeline += sc.durationInFrames;
  });

  const totalDuration = episode.scenes.reduce(
    (acc, sc) => acc + sc.durationInFrames,
    0
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A192F" }}>
      {episode.scenes.map((scene, scIdx) => {
        const from = accumulatedFrame;
        const duration = scene.durationInFrames;
        accumulatedFrame += duration;

        return (
          <Sequence
            key={`scene-${scIdx}-${scene.kind}`}
            from={from}
            durationInFrames={duration}
          >
            <SingleShortsScene
              scene={scene}
              sceneIndex={scIdx}
              sceneStartFrame={from}
              totalDuration={totalDuration}
              rmsFrames={episode.rmsFrames}
            />
          </Sequence>
        );
      })}

      {/* Audio Mix Shorts (VO 100%, SFX berjadwal presisi 40%, BGM 12%) */}
      <ShortsAudioMix
        voiceoverSrc={episode.voiceoverSrc}
        sfxCues={allSfxCues}
        durationInFrames={totalDuration}
      />
    </AbsoluteFill>
  );
};

interface SingleShortsSceneProps {
  scene: SceneData;
  sceneIndex: number;
  sceneStartFrame: number;
  totalDuration: number;
  rmsFrames?: readonly number[];
}

const SingleShortsScene: React.FC<SingleShortsSceneProps> = ({
  scene,
  sceneIndex,
  sceneStartFrame,
  totalDuration,
  rmsFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const globalFrame = sceneStartFrame + frame;

  // 1. Hitung beat aktif dan start/durasi masing-masing beat secara presisi
  let activeBeatIndex = 0;
  let beatStartFrame = 0;
  let accumulated = 0;

  const beatStarts: number[] = [];
  for (let i = 0; i < scene.beats.length; i++) {
    beatStarts.push(accumulated);
    const bDur =
      scene.beats[i].durationInFrames ??
      Math.floor(scene.durationInFrames / Math.max(1, scene.beats.length));
    if (frame < accumulated + bDur || i === scene.beats.length - 1) {
      activeBeatIndex = i;
      beatStartFrame = accumulated;
      break;
    }
    accumulated += bDur;
  }

  const currentBeat = scene.beats[activeBeatIndex] || scene.beats[0];
  const prevBeat = activeBeatIndex > 0 ? scene.beats[activeBeatIndex - 1] : null;
  const currentBeatDuration =
    currentBeat.durationInFrames ??
    Math.floor(scene.durationInFrames / Math.max(1, scene.beats.length));

  const localFrame = frame - beatStartFrame;

  // 2. Hitung kontinuitas propFrame jika beat berturut-turut memakai stageProp yang sama
  let propGroupStart = beatStartFrame;
  if (currentBeat.stageProp) {
    for (let j = activeBeatIndex - 1; j >= 0; j--) {
      if (scene.beats[j].stageProp === currentBeat.stageProp) {
        propGroupStart = beatStarts[j];
      } else {
        break;
      }
    }
  }
  const propElapsedFrame = frame - propGroupStart;

  // 3. Lip-sync & Audio Equalizer berbasis RMS WAV nyata (fallback ke simulasi ritme jika belum ada RMS)
  let rmsLevel = 0;
  if (rmsFrames && rmsFrames.length > 0) {
    const idx = Math.max(0, Math.min(rmsFrames.length - 1, globalFrame));
    const idxPrev = Math.max(0, idx - 1);
    // Smoothing ringan 2-frame agar gerakan mulut mulus dan ekspresif
    rmsLevel = ((rmsFrames[idx] + rmsFrames[idxPrev]) / 200);
  } else {
    const isSpeaking = localFrame < currentBeatDuration - 4;
    rmsLevel = isSpeaking ? Math.abs(Math.sin((frame / fps) * 16)) * 0.85 : 0;
  }
  const mouthOpen = rmsLevel;

  // 4. Blocking & Gerak Karakter Jokowo yang Mulus (Berjalan otomatis saat berpindah X!)
  const transitionSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 150, mass: 0.85 },
  });

  // Pada awal scene 0 beat 0, Jokowo berjalan masuk panggung dari kiri!
  const defaultPrevX = sceneIndex === 0 && activeBeatIndex === 0 ? -340 : 0;
  const fromX = prevBeat ? (prevBeat.charX ?? 0) : defaultPrevX;
  const toX = currentBeat.charX ?? 0;
  const currentCharX = interpolate(transitionSpring, [0, 1], [fromX, toX]);

  const fromY = prevBeat ? (prevBeat.charY ?? 0) : 0;
  const toY = currentBeat.charY ?? 0;
  const currentCharY = interpolate(transitionSpring, [0, 1], [fromY, toY]);

  const fromScale = prevBeat ? (prevBeat.charScale ?? 2.0) : 2.0;
  const toScale = currentBeat.charScale ?? 2.0;
  const currentCharScale = interpolate(transitionSpring, [0, 1], [fromScale, toScale]);

  // Jika sedang melangkah jauh secara horizontal di 14 frame pertama beat, aktifkan animasi berjalan!
  const moveDeltaX = toX - fromX;
  const isWalkingTransition = Math.abs(moveDeltaX) >= 55 && localFrame < 14;
  const activePose: Pose = isWalkingTransition
    ? "walking"
    : (currentBeat.pose ?? "talking");
  const activeFlip = isWalkingTransition
    ? moveDeltaX < 0
    : Boolean(currentBeat.charFlip);

  // 5. Koreografi Kamera Halus per Beat (Wide -> Medium -> Close-Up -> Relax)
  const camSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 110, mass: 1.0 },
  });
  const fromZoom = prevBeat ? (prevBeat.cameraZoom ?? 1.0) : 1.0;
  const toZoom =
    currentBeat.cameraZoom ?? (scene.kind === "TWIST" ? 1.12 : 1.0);
  const cameraScale = interpolate(camSpring, [0, 1], [fromZoom, toZoom]);

  const fromPanX = prevBeat ? (prevBeat.cameraPanX ?? 0) : 0;
  const toPanX = currentBeat.cameraPanX ?? 0;
  const cameraPanX = interpolate(camSpring, [0, 1], [fromPanX, toPanX]);

  const fromPanY = prevBeat ? (prevBeat.cameraPanY ?? 0) : 0;
  const toPanY = currentBeat.cameraPanY ?? 0;
  const cameraPanY = interpolate(camSpring, [0, 1], [fromPanY, toPanY]);

  // Shake kamera deterministik saat momen crash / twist / shock
  const shakeIntensity =
    currentBeat.shakeIntensity ??
    (scene.kind === "TWIST" && activeBeatIndex === 0 ? 8 : 0);
  const shake =
    shakeIntensity > 0
      ? { frame: beatStartFrame + 2, intensity: shakeIntensity, duration: 16 }
      : undefined;

  // Teks komik SFX onomatopoeia (hanya tampil jika sfxLabel ditentukan, atau fallback untuk legacy sample-shorts)
  const comicSfxText =
    currentBeat.sfxLabel ?? (!currentBeat.stageProp ? currentBeat.sfx : undefined);

  const totalProgress =
    totalDuration > 0 ? Math.min(1, globalFrame / totalDuration) : 0;

  return (
    <AbsoluteFill>
      <Scene
        theme={scene.theme ?? "cyber-blueprint"}
        sceneTransition={scene.sceneTransition ?? "none"}
        cameraScale={cameraScale}
        cameraPanX={cameraPanX}
        cameraPanY={cameraPanY}
        shakeAt={shake}
        progress={totalProgress}
        rmsLevel={rmsLevel}
      >
        {/* ================= 1. STAGE PROP INTERAKTIF / LEGACY PROP (ZONA ATAS AMAN DARI HUD & ZOOM) ================= */}
        {currentBeat.stageProp ? (
          <div
            style={{
              position: "absolute",
              top: "190px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 18,
              pointerEvents: "none",
            }}
          >
            <StageProp
              type={currentBeat.stageProp}
              variant={currentBeat.propVariant}
              propFrame={propElapsedFrame}
              beatFrame={localFrame}
            />
          </div>
        ) : currentBeat.prop ? (
          <div
            style={{
              position: "absolute",
              top: "260px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 15,
            }}
          >
            <Prop
              key={`prop-${activeBeatIndex}-${currentBeat.prop}`}
              type={currentBeat.prop as PropType}
              size={220}
              delay={beatStartFrame + 3}
            />
          </div>
        ) : null}

        {/* ================= 2. BALON BICARA OPSIONAL (JIKA ADA) ================= */}
        {currentBeat.speechBubble && (
          <div
            style={{
              position: "absolute",
              top: "590px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              zIndex: 30,
            }}
          >
            <SpeechBubble
              text={currentBeat.speechBubble}
              position="top"
              delay={beatStartFrame + 5}
            />
          </div>
        )}

        {/* ================= 3. KARAKTER JOKOWO DI ATAS LANTAI PANGGUNG 3D ================= */}
        <div
          style={{
            position: "absolute",
            bottom: `${450 - currentCharY}px`,
            left: "50%",
            transform: `translateX(calc(-50% + ${currentCharX}px))`,
            zIndex: 25,
          }}
        >
          <Jokowo
            pose={activePose}
            expression={currentBeat.expression ?? "neutral"}
            mouthOpen={mouthOpen}
            scale={currentCharScale}
            flip={activeFlip}
          />
        </div>

        {/* ================= 4. SFX COMIC POP-OUT TERJADWAL PER BEAT ================= */}
        {comicSfxText && (
          <Sfx
            key={`sfx-pop-${activeBeatIndex}-${comicSfxText}`}
            text={comicSfxText}
            delay={beatStartFrame + 3}
            duration={24}
            fontSize={64}
            style={{
              top: "665px",
              left: toX > 40 ? "115px" : undefined,
              right: toX <= 40 ? "115px" : undefined,
            }}
          />
        )}
      </Scene>

      {/* ================= 5. CAPTION SHORTS (TERPISAH DARI ZOOM KAMERA AGAR SELALU TAJAM & AMAN!) ================= */}
      {/* CATATAN: DILARANG MERENDER beat.headline atau badge scene.kind */}
      <Caption
        text={currentBeat.dialogue}
        activeWord={currentBeat.activeWord}
        variant="shorts"
      />
    </AbsoluteFill>
  );
};
