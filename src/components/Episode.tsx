import React from "react";
import {
  Sequence,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from "remotion";
import { Scene } from "./Scene";
import { Caption } from "./Caption";
import { Prop } from "./Prop";
import { StageProp } from "./StageProp";
import { Sfx } from "./Sfx";
import { SpeechBubble } from "./SpeechBubble";
import { ShortsAudioMix } from "../lib/audio-mix";
import { getSfxStaticPath } from "../lib/sfx-events";
import { getPreset } from "../presets";
import type { PresetConfig } from "../presets/types";
import type {
  EpisodeData,
  EyeTarget,
  Pose,
  PropFocusMode,
  PropType,
  Scene as SceneData,
} from "../episodes/types";

export type EpisodeProps = {
  episode: EpisodeData;
};

export const Episode: React.FC<EpisodeProps> = ({ episode }) => {
  const preset = getPreset(episode.preset);
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
    <AbsoluteFill style={{ backgroundColor: preset.palette.bg }}>
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
              preset={preset}
            />
          </Sequence>
        );
      })}

      {/* Audio Mix Shorts sesuai profil preset */}
      <ShortsAudioMix
        voiceoverSrc={episode.voiceoverSrc}
        sfxCues={allSfxCues}
        bgmSrc={staticFile(preset.audio.bgmSrc)}
        audioLevels={preset.audio.levels}
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
  preset: PresetConfig;
}

const SingleShortsScene: React.FC<SingleShortsSceneProps> = ({
  scene,
  sceneIndex,
  sceneStartFrame,
  totalDuration,
  rmsFrames,
  preset,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const globalFrame = sceneStartFrame + frame;
  const Mascot = preset.Mascot;

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
  const nextBeat =
    activeBeatIndex < scene.beats.length - 1 ? scene.beats[activeBeatIndex + 1] : null;
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

  // 3. Lip-sync & Audio Equalizer berbasis RMS WAV nyata
  let rmsLevel = 0;
  if (rmsFrames && rmsFrames.length > 0) {
    const idx = Math.max(0, Math.min(rmsFrames.length - 1, globalFrame));
    const idxPrev = Math.max(0, idx - 1);
    rmsLevel = (rmsFrames[idx] + rmsFrames[idxPrev]) / 200;
  } else {
    const isSpeaking = localFrame < currentBeatDuration - 4;
    rmsLevel = isSpeaking ? Math.abs(Math.sin((frame / fps) * 16)) * 0.85 : 0;
  }
  const mouthOpen = rmsLevel;

  // 4. Blocking & Gerak Karakter + Interpolasi Sendi Mulus
  const transitionSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 150, mass: 0.85 },
  });

  const defaultPrevX = sceneIndex === 0 && activeBeatIndex === 0 ? -340 : 0;
  const fromX = prevBeat ? (prevBeat.charX ?? 0) : defaultPrevX;
  const toX = currentBeat.charX ?? 0;
  const currentCharX = interpolate(transitionSpring, [0, 1], [fromX, toX]);

  const fromY = prevBeat ? (prevBeat.charY ?? 0) : 0;
  const toY = currentBeat.charY ?? 0;
  const currentCharY = interpolate(transitionSpring, [0, 1], [fromY, toY]);

  const defaultScale = preset.mascotLayout.shortsDefaultScale;
  const fromScale = prevBeat ? (prevBeat.charScale ?? defaultScale) : defaultScale;
  const toScale = currentBeat.charScale ?? defaultScale;
  const currentCharScale = interpolate(transitionSpring, [0, 1], [fromScale, toScale]);

  const moveDeltaX = toX - fromX;
  const isWalkingTransition = Math.abs(moveDeltaX) >= 55 && localFrame < 14;
  const activePose: Pose = isWalkingTransition
    ? "walking"
    : (currentBeat.pose ?? "talking");
  const rawPrevPose: Pose = prevBeat
    ? (prevBeat.pose ?? "talking")
    : sceneIndex === 0 && activeBeatIndex === 0
      ? "walking"
      : "talking";
  const poseTransitionProgress = isWalkingTransition ? 1 : transitionSpring;
  const activeFlip = isWalkingTransition
    ? moveDeltaX < 0
    : Boolean(currentBeat.charFlip);

  // 5. Dynamic Prop Focus System: "co-push" (sama-sama maju) & "hero-pop" (maju lewati maskot lalu mundur)
  const rawFocusMode: PropFocusMode = currentBeat.propFocus ?? "normal";
  const prevFocusMode: PropFocusMode = prevBeat?.propFocus ?? "normal";
  const nextFocusMode: PropFocusMode = nextBeat?.propFocus ?? "normal";

  const coPushAmount = interpolate(
    transitionSpring,
    [0, 1],
    [prevFocusMode === "co-push" ? 1 : 0, rawFocusMode === "co-push" ? 1 : 0]
  );

  const heroEnter =
    rawFocusMode === "hero-pop"
      ? prevFocusMode === "hero-pop"
        ? 1
        : spring({
            frame: localFrame,
            fps,
            config: { damping: 13, stiffness: 190, mass: 0.8 },
          })
      : 0;
  const retractStart = Math.max(14, currentBeatDuration - 12);
  const heroExit =
    rawFocusMode === "hero-pop" &&
    nextFocusMode !== "hero-pop" &&
    localFrame >= retractStart
      ? spring({
          frame: localFrame - retractStart,
          fps,
          config: { damping: 16, stiffness: 180, mass: 0.75 },
        })
      : 0;
  const heroAmount = Math.max(0, Math.min(1, heroEnter - heroExit));

  const propTop = 190 - coPushAmount * 22 + heroAmount * 290;
  const propScale = 1 + coPushAmount * 0.12 + heroAmount * 0.22;
  const propZIndex = heroAmount > 0.15 ? 36 : 22;
  const shadowY = Math.round(12 + heroAmount * 28 + coPushAmount * 8);
  const shadowBlur = Math.round(18 + heroAmount * 36 + coPushAmount * 10);
  const shadowAlpha = (0.28 + heroAmount * 0.45 + coPushAmount * 0.12).toFixed(2);

  const effectiveCharScale = currentCharScale * (1 + coPushAmount * 0.11 - heroAmount * 0.08);
  const mascotBottom =
    preset.mascotLayout.shortsBottom - currentCharY - coPushAmount * 15;
  const mascotFilter =
    heroAmount > 0.02
      ? `blur(${(heroAmount * 4.5).toFixed(2)}px) brightness(${(1 - heroAmount * 0.32).toFixed(2)})`
      : undefined;

  // Lirikan mata otomatis mengarah ke komponen saat menunjuk/co-push/penasaran
  const activeEyeTarget: EyeTarget =
    currentBeat.eyeTarget ??
    (activePose === "pointing" ||
    rawFocusMode === "co-push" ||
    currentBeat.expression === "curious"
      ? "prop"
      : "camera");

  // 6. Koreografi Kamera Halus per Beat
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

  const comicSfxText =
    currentBeat.sfxLabel ?? (!currentBeat.stageProp ? currentBeat.sfx : undefined);

  const totalProgress =
    totalDuration > 0 ? Math.min(1, globalFrame / totalDuration) : 0;

  return (
    <AbsoluteFill>
      <Scene
        preset={preset}
        theme={scene.theme ?? preset.defaultTheme}
        sceneTransition={scene.sceneTransition ?? "none"}
        cameraScale={cameraScale}
        cameraPanX={cameraPanX}
        cameraPanY={cameraPanY}
        shakeAt={shake}
        progress={totalProgress}
        rmsLevel={rmsLevel}
      >
        {/* ================= 1. MASKOT PRESET DI ATAS LANTAI PANGGUNG ================= */}
        <div
          style={{
            position: "absolute",
            bottom: `${mascotBottom}px`,
            left: "50%",
            transform: `translateX(calc(-50% + ${currentCharX}px))`,
            filter: mascotFilter,
            zIndex: 25,
          }}
        >
          <Mascot
            pose={activePose}
            prevPose={rawPrevPose}
            poseTransitionProgress={poseTransitionProgress}
            expression={currentBeat.expression ?? "neutral"}
            eyeTarget={activeEyeTarget}
            mouthOpen={mouthOpen}
            scale={effectiveCharScale}
            flip={activeFlip}
          />
        </div>

        {/* ================= 2. SCRIM FOKUS SAAT KOMPONEN HERO-POP MAJU ================= */}
        {heroAmount > 0.02 && (
          <AbsoluteFill
            style={{
              backgroundColor: `rgba(3, 7, 18, ${(heroAmount * 0.34).toFixed(3)})`,
              zIndex: 28,
              pointerEvents: "none",
            }}
          />
        )}

        {/* ================= 3. STAGE PROP INTERAKTIF / LEGACY PROP ================= */}
        {currentBeat.stageProp ? (
          <div
            style={{
              position: "absolute",
              top: `${propTop}px`,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${propScale})`,
              transformOrigin: "center top",
              filter: `drop-shadow(0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha}))`,
              zIndex: propZIndex,
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

        {/* ================= 4. BALON BICARA OPSIONAL ================= */}
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
              preset={preset}
            />
          </div>
        )}

        {/* ================= 5. SFX COMIC POP-OUT TERJADWAL PER BEAT ================= */}
        {comicSfxText && (
          <Sfx
            key={`sfx-pop-${activeBeatIndex}-${comicSfxText}`}
            text={comicSfxText}
            delay={beatStartFrame + 3}
            duration={24}
            fontSize={64}
            preset={preset}
            style={{
              top: heroAmount > 0.2 ? "310px" : "665px",
              left: toX > 40 ? "115px" : undefined,
              right: toX <= 40 ? "115px" : undefined,
            }}
          />
        )}
      </Scene>

      {/* ================= 6. CAPTION SHORTS (DI LUAR ZOOM KAMERA!) ================= */}
      {/* CATATAN: DILARANG MERENDER beat.headline atau badge scene.kind */}
      <Caption
        text={currentBeat.dialogue}
        activeWord={currentBeat.activeWord}
        variant="shorts"
        preset={preset}
      />
    </AbsoluteFill>
  );
};
