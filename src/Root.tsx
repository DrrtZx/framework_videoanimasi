import React from "react";
import { Composition, Folder } from "remotion";
import { SHORTS_CONFIG, LONG_CONFIG } from "./core/config";
import { Episode } from "./components/Episode";
import { LongEpisode } from "./components/LongEpisode";
import { Thumbnail } from "./components/Thumbnail";
import { LongThumbnail } from "./components/LongThumbnail";
import { ChannelBanner } from "./components/ChannelBanner";
import { ChannelAvatar } from "./components/ChannelAvatar";
import { DEFAULT_PRESET_ID, getPreset, listPresets } from "./presets";
import {
  ACTIVE_SHORTS_EPISODE,
  ACTIVE_LONG_EPISODE,
  getShortsEpisodesByPreset,
  getLongEpisodesByPreset,
} from "./episodes/registry";

export const RemotionRoot: React.FC = () => {
  const defaultPreset = getPreset(DEFAULT_PRESET_ID);
  const activeShortsDuration = ACTIVE_SHORTS_EPISODE.scenes.reduce(
    (acc, sc) => acc + sc.durationInFrames,
    0
  );
  const activeLongDuration = ACTIVE_LONG_EPISODE.chapters.reduce(
    (acc, ch) => acc + ch.durationInFrames,
    0
  );

  const activeShortsThumb =
    ACTIVE_SHORTS_EPISODE.thumbnail ?? defaultPreset.branding.defaultShortsThumbnail;
  const activeLongThumb =
    ACTIVE_LONG_EPISODE.thumbnail ?? defaultPreset.branding.defaultLongThumbnail;

  return (
    <>
      {/* ================= 1. KOMPOSISI SHORTCUT AKTIF (BACKWARD-COMPATIBLE) ================= */}
      <Composition
        id="ShortsEpisode"
        component={Episode}
        durationInFrames={activeShortsDuration || 1979}
        fps={SHORTS_CONFIG.fps}
        width={SHORTS_CONFIG.width}
        height={SHORTS_CONFIG.height}
        defaultProps={{
          episode: ACTIVE_SHORTS_EPISODE,
        }}
      />

      <Composition
        id="ShortsThumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={SHORTS_CONFIG.fps}
        width={SHORTS_CONFIG.width}
        height={SHORTS_CONFIG.height}
        defaultProps={{
          presetId: ACTIVE_SHORTS_EPISODE.preset ?? DEFAULT_PRESET_ID,
          ...activeShortsThumb,
        }}
      />

      <Composition
        id="LongEpisode"
        component={LongEpisode}
        durationInFrames={activeLongDuration || 8400}
        fps={LONG_CONFIG.fps}
        width={LONG_CONFIG.width}
        height={LONG_CONFIG.height}
        defaultProps={{
          episode: ACTIVE_LONG_EPISODE,
        }}
      />

      <Composition
        id="LongThumbnail"
        component={LongThumbnail}
        durationInFrames={1}
        fps={LONG_CONFIG.fps}
        width={1280}
        height={720}
        defaultProps={{
          presetId: ACTIVE_LONG_EPISODE.preset ?? DEFAULT_PRESET_ID,
          ...activeLongThumb,
        }}
      />

      <Composition
        id="YouTubeBanner"
        component={ChannelBanner}
        durationInFrames={1}
        fps={30}
        width={2560}
        height={1440}
        defaultProps={{
          presetId: DEFAULT_PRESET_ID,
          channelName: defaultPreset.branding.channelName,
          tagline: defaultPreset.branding.tagline,
          showSafeGuide: false,
        }}
      />

      <Composition
        id="YouTubeAvatar"
        component={ChannelAvatar}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          presetId: DEFAULT_PRESET_ID,
          showCircleGuide: false,
        }}
      />

      {/* ================= 2. KOMPOSISI TERORGANISIR PER PRESET MASKOT ================= */}
      {listPresets().map((preset) => {
        const shortsEpisodes = getShortsEpisodesByPreset(preset.id);
        const longEpisodes = getLongEpisodesByPreset(preset.id);

        return (
          <Folder key={preset.id} name={preset.id}>
            {shortsEpisodes.map((ep) => {
              const duration = ep.scenes.reduce(
                (acc, sc) => acc + sc.durationInFrames,
                0
              );
              return (
                <Composition
                  key={`${preset.id}-shorts-${ep.slug}`}
                  id={`${preset.id}-shorts-${ep.slug}`}
                  component={Episode}
                  durationInFrames={duration || 900}
                  fps={SHORTS_CONFIG.fps}
                  width={SHORTS_CONFIG.width}
                  height={SHORTS_CONFIG.height}
                  defaultProps={{
                    episode: ep,
                  }}
                />
              );
            })}

            {longEpisodes.map((ep) => {
              const duration = ep.chapters.reduce(
                (acc, ch) => acc + ch.durationInFrames,
                0
              );
              return (
                <Composition
                  key={`${preset.id}-long-${ep.slug}`}
                  id={`${preset.id}-long-${ep.slug}`}
                  component={LongEpisode}
                  durationInFrames={duration || 8400}
                  fps={LONG_CONFIG.fps}
                  width={LONG_CONFIG.width}
                  height={LONG_CONFIG.height}
                  defaultProps={{
                    episode: ep,
                  }}
                />
              );
            })}

            <Composition
              id={`${preset.id}-shorts-thumbnail`}
              component={Thumbnail}
              durationInFrames={1}
              fps={SHORTS_CONFIG.fps}
              width={SHORTS_CONFIG.width}
              height={SHORTS_CONFIG.height}
              defaultProps={{
                presetId: preset.id,
                ...preset.branding.defaultShortsThumbnail,
              }}
            />

            <Composition
              id={`${preset.id}-long-thumbnail`}
              component={LongThumbnail}
              durationInFrames={1}
              fps={LONG_CONFIG.fps}
              width={1280}
              height={720}
              defaultProps={{
                presetId: preset.id,
                ...preset.branding.defaultLongThumbnail,
              }}
            />

            <Composition
              id={`${preset.id}-banner`}
              component={ChannelBanner}
              durationInFrames={1}
              fps={30}
              width={2560}
              height={1440}
              defaultProps={{
                presetId: preset.id,
                channelName: preset.branding.channelName,
                tagline: preset.branding.tagline,
                showSafeGuide: false,
              }}
            />

            <Composition
              id={`${preset.id}-avatar`}
              component={ChannelAvatar}
              durationInFrames={1}
              fps={30}
              width={1080}
              height={1080}
              defaultProps={{
                presetId: preset.id,
                showCircleGuide: false,
              }}
            />
          </Folder>
        );
      })}
    </>
  );
};
