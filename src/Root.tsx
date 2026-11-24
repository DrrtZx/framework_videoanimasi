import React from "react";
import { Composition } from "remotion";
import { SHORTS_CONFIG, LONG_CONFIG } from "./config";
import { Episode } from "./components/Episode";
import { LongEpisode } from "./components/LongEpisode";
import { Thumbnail } from "./components/Thumbnail";
import { LongThumbnail } from "./components/LongThumbnail";
import { ChannelBanner } from "./components/ChannelBanner";
import { ChannelAvatar } from "./components/ChannelAvatar";
import { episodeAsalUsulBug } from "./episodes/episode-asal-usul-bug";
import { sampleShortsEpisode } from "./episodes/sample-shorts";
import { sampleLongEpisode } from "./episodes/sample-long";

export const RemotionRoot: React.FC = () => {
  const asalUsulBugDuration = episodeAsalUsulBug.scenes.reduce(
    (acc, sc) => acc + sc.durationInFrames,
    0
  );

  const longDuration = sampleLongEpisode.chapters.reduce(
    (acc, ch) => acc + ch.durationInFrames,
    0
  );

  return (
    <>
      {/* 1. YouTube Shorts Aktif: Asal Usul Bug (9:16 - 1080x1920) */}
      <Composition
        id="ShortsEpisode"
        component={Episode}
        durationInFrames={asalUsulBugDuration || 1722}
        fps={SHORTS_CONFIG.fps}
        width={SHORTS_CONFIG.width}
        height={SHORTS_CONFIG.height}
        defaultProps={{
          episode: episodeAsalUsulBug,
        }}
      />

      {/* 2. YouTube Shorts Thumbnail (1080x1920) */}
      <Composition
        id="ShortsThumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={SHORTS_CONFIG.fps}
        width={SHORTS_CONFIG.width}
        height={SHORTS_CONFIG.height}
        defaultProps={{
          title: "KENAPA ERROR KOMPUTER DISEBUT BUG?",
          subtitle: "GARA-GARA HEWAN INI!",
        }}
      />

      {/* 3. YouTube Shorts Sample Alternatif */}
      <Composition
        id="ShortsSampleEpisode"
        component={Episode}
        durationInFrames={900}
        fps={SHORTS_CONFIG.fps}
        width={SHORTS_CONFIG.width}
        height={SHORTS_CONFIG.height}
        defaultProps={{
          episode: sampleShortsEpisode,
        }}
      />

      {/* 4. YouTube Long Video (16:9 - 1920x1080) */}
      <Composition
        id="LongEpisode"
        component={LongEpisode}
        durationInFrames={longDuration || 8400}
        fps={LONG_CONFIG.fps}
        width={LONG_CONFIG.width}
        height={LONG_CONFIG.height}
        defaultProps={{
          episode: sampleLongEpisode,
        }}
      />

      {/* 5. YouTube Long Video Thumbnail (1280x720) */}
      <Composition
        id="LongThumbnail"
        component={LongThumbnail}
        durationInFrames={1}
        fps={LONG_CONFIG.fps}
        width={1280}
        height={720}
        defaultProps={{
          title: "DARI MANA ASAL OKSIGEN BUMI?",
          badge: "BUKAN HUTAN AMAZON!",
        }}
      />

      {/* 6. YouTube Channel Banner (2560x1440 - All-Device Safe Area 1546x423) */}
      <Composition
        id="YouTubeBanner"
        component={ChannelBanner}
        durationInFrames={1}
        fps={30}
        width={2560}
        height={1440}
        defaultProps={{
          channelName: "FAKTA STUDIO",
          tagline: "EDUKASI SAINS & TEKNOLOGI",
          showSafeGuide: false,
        }}
      />

      {/* 7. YouTube Channel Profile Avatar (1080x1080 - Circular Safe) */}
      <Composition
        id="YouTubeAvatar"
        component={ChannelAvatar}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          showCircleGuide: false,
        }}
      />
    </>
  );
};
