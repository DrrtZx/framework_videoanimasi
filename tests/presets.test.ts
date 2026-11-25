import React from "react";
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_PRESET_ID,
  PRESETS,
  getPreset,
  isValidPresetId,
  listPresets,
  resolvePreset,
} from "../src/presets";
import type { PresetConfig } from "../src/presets/types";
import {
  ACTIVE_LONG_EPISODE,
  ACTIVE_SHORTS_EPISODE,
  findLongEpisode,
  findShortsEpisode,
  getLongEpisodesByPreset,
  getShortsEpisodesByPreset,
} from "../src/episodes/registry";

describe("Arsitektur Multi-Preset Maskot", () => {
  it("mendaftarkan preset default 'jokowo' dengan lengkap", () => {
    expect(DEFAULT_PRESET_ID).toBe("jokowo");
    expect(isValidPresetId("jokowo")).toBe(true);
    expect(isValidPresetId("unknown-mascot")).toBe(false);

    const presets = listPresets();
    expect(presets.length).toBeGreaterThanOrEqual(1);
    expect(presets.some((p) => p.id === "jokowo")).toBe(true);

    const jokowo = getPreset("jokowo");
    expect(jokowo.id).toBe("jokowo");
    expect(jokowo.stageStyle).toBe("clean-studio");
    expect(jokowo.outputDir).toBe("out/jokowo");
    expect(jokowo.voDir).toBe("public/audio/vo/jokowo");
    expect(typeof jokowo.Mascot).toBe("function");
    expect(getPreset()).toBe(PRESETS.jokowo);

    const element = React.createElement(jokowo.Mascot, {
      pose: "pointing",
      prevPose: "thinking",
      poseTransitionProgress: 0.5,
      eyeTarget: "prop",
      expression: "curious",
      mouthOpen: 0.4,
    });
    expect(element.props.eyeTarget).toBe("prop");
    expect(element.props.prevPose).toBe("thinking");
  });

  it("sinkron dengan file manifest src/presets/jokowo/preset.json", () => {
    const manifestPath = path.resolve(
      process.cwd(),
      "src/presets/jokowo/preset.json"
    );
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    const jokowo = getPreset("jokowo");
    expect(manifest.id).toBe(jokowo.id);
    expect(manifest.outputDir).toBe(jokowo.outputDir);
    expect(manifest.voDir).toBe(jokowo.voDir);
    expect(manifest.audio.voiceEqFilter).toBe(jokowo.audio.voiceEqFilter);
  });

  it("beralih ke preset lain mengganti maskot, palet, audio, branding, dan folder output tanpa mengubah jokowo", () => {
    const FakeMascot: PresetConfig["Mascot"] = () =>
      React.createElement("svg", { "data-mascot": "cyber-cat" });

    const cyberCatPreset: PresetConfig = {
      ...PRESETS.jokowo,
      id: "cyber-cat",
      name: "Kucing Cyber",
      concept: "Neon Pixel Lab",
      outputDir: "out/cyber-cat",
      voDir: "public/audio/vo/cyber-cat",
      Mascot: FakeMascot,
      palette: {
        ...PRESETS.jokowo.palette,
        bg: "#1E1B4B",
        accentYellow: "#34D399",
      },
      audio: {
        ...PRESETS.jokowo.audio,
        bgmSrc: "audio/music/cyber-cat-bgm.wav",
      },
      branding: {
        ...PRESETS.jokowo.branding,
        channelName: "MEONG SAINS",
      },
    };

    const mockRegistry = {
      jokowo: PRESETS.jokowo,
      "cyber-cat": cyberCatPreset,
    };

    const resolvedCat = resolvePreset("cyber-cat", mockRegistry, "jokowo");
    const resolvedJokowo = resolvePreset("jokowo", mockRegistry, "jokowo");
    const fallback = resolvePreset("tidak-ada", mockRegistry, "jokowo");

    expect(resolvedCat.Mascot).toBe(FakeMascot);
    expect(resolvedCat.palette.bg).toBe("#1E1B4B");
    expect(resolvedCat.outputDir).toBe("out/cyber-cat");
    expect(resolvedCat.audio.bgmSrc).toBe("audio/music/cyber-cat-bgm.wav");
    expect(resolvedCat.branding.channelName).toBe("MEONG SAINS");

    expect(resolvedJokowo.id).toBe("jokowo");
    expect(resolvedJokowo.Mascot).toBe(PRESETS.jokowo.Mascot);
    expect(resolvedJokowo.palette.bg).toBe("#0A192F");
    expect(resolvedJokowo.outputDir).toBe("out/jokowo");
    expect(fallback.id).toBe("jokowo");
  });

  it("mengelompokkan episode shorts dan long per preset melalui registry", () => {
    const jokowoShorts = getShortsEpisodesByPreset("jokowo");
    const jokowoLong = getLongEpisodesByPreset("jokowo");

    expect(jokowoShorts.length).toBeGreaterThanOrEqual(3);
    expect(jokowoLong.length).toBeGreaterThanOrEqual(1);
    expect(ACTIVE_SHORTS_EPISODE.preset).toBe("jokowo");
    expect(ACTIVE_LONG_EPISODE.preset).toBe("jokowo");

    expect(findShortsEpisode("jokowo", "cpu-igpu-vs-non-igpu")?.id).toBe(
      "shorts-cpu-igpu-vs-non-igpu"
    );
    expect(findLongEpisode("jokowo", "misteri-oksigen-bumi")?.id).toBe(
      "long-misteri-oksigen-bumi"
    );
    expect(getShortsEpisodesByPreset("unknown")).toHaveLength(0);
  });
});
