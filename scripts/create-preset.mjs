#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { listPresetManifests } from "./lib/presets.mjs";

function toPascalCase(kebab) {
  return kebab
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function toCamelCase(kebab) {
  const pascal = toPascalCase(kebab);
  return pascal ? pascal[0].toLowerCase() + pascal.slice(1) : "";
}

function parseCli(args) {
  const opts = {
    list: false,
    id: "",
    name: "",
    channel: "",
    concept: "Custom Stage & Mascot",
  };

  for (const arg of args) {
    if (arg === "--list" || arg === "-l") {
      opts.list = true;
    } else if (arg.startsWith("--name=")) {
      opts.name = arg.replace("--name=", "").trim();
    } else if (arg.startsWith("--channel=")) {
      opts.channel = arg.replace("--channel=", "").trim();
    } else if (arg.startsWith("--concept=")) {
      opts.concept = arg.replace("--concept=", "").trim();
    } else if (!arg.startsWith("--") && !opts.id) {
      opts.id = arg.trim().toLowerCase();
    }
  }

  return opts;
}

function printPresetList() {
  const manifests = listPresetManifests();
  console.log("=================================================");
  console.log(`🎭 PRESET MASKOT TERDAFTAR (${manifests.length})`);
  console.log("=================================================");
  for (const m of manifests) {
    console.log(
      `- ${m.id.padEnd(14)} | Maskot: ${(m.name || m.id).padEnd(14)} | Channel: ${(m.branding?.channelName || "-").padEnd(16)} | Output: ${m.outputDir} | Konsep: ${m.concept}`
    );
  }
}

function createPresetFiles(opts) {
  if (!opts.id) {
    console.log("Usage:");
    console.log("  npm run preset:list");
    console.log('  npm run preset:new -- <preset-id> [--name="Nama Maskot"] [--channel="NAMA CHANNEL"] [--concept="Konsep"]');
    process.exit(1);
  }

  if (!/^[a-z][a-z0-9-]*$/.test(opts.id) || opts.id.startsWith("_")) {
    console.error(`[preset:new] ERROR: Preset ID '${opts.id}' harus kebab-case huruf kecil/angka (contoh: 'cyber-cat').`);
    process.exit(1);
  }

  const presetDir = path.resolve(process.cwd(), "src/presets", opts.id);
  if (existsSync(presetDir)) {
    console.error(`[preset:new] ERROR: Folder preset sudah ada: ${presetDir}`);
    process.exit(1);
  }

  const pascal = toPascalCase(opts.id);
  const camel = toCamelCase(opts.id);
  const upper = opts.id.replace(/-/g, "_").toUpperCase();
  const displayName = opts.name || pascal;
  const channelName = (opts.channel || `${displayName} STUDIO`).toUpperCase();
  const tagSlug = `#${opts.id.replace(/-/g, "")}`;

  mkdirSync(presetDir, { recursive: true });
  mkdirSync(path.resolve(process.cwd(), "src/episodes", opts.id, "shorts"), { recursive: true });
  mkdirSync(path.resolve(process.cwd(), "src/episodes", opts.id, "long"), { recursive: true });

  const presetJson = {
    id: opts.id,
    name: displayName,
    concept: opts.concept,
    description: `Preset maskot ${displayName} dengan konsep visual ${opts.concept}.`,
    outputDir: `out/${opts.id}`,
    voDir: `public/audio/vo/${opts.id}`,
    stageStyle: "blueprint",
    defaultTheme: "cyber-blueprint",
    palette: {
      bg: "#0F172A",
      bgLight: "#1E293B",
      bgCenter: "#1E1B4B",
      bgOuter: "#020617",
      gridMajor: "#818CF8",
      gridMinor: "#4F46E5",
      ink: "#0F172A",
      blueprintCyan: "#22D3EE",
      accentBlue: "#38BDF8",
      accentPurple: "#A855F7",
      accentYellow: "#FACC15",
      accentGreen: "#10B981",
      white: "#FFFFFF",
      captionText: "#FFFFFF",
      captionActive: "#FACC15",
      captionStroke: "#000000",
    },
    caption: {
      shorts: { bottom: 380, fontSize: 58, maxWords: 4, strokeWidth: 12 },
      long: { bottom: 110, fontSize: 50, maxWords: 6, strokeWidth: 12 },
    },
    mascotLayout: {
      shortsBottom: 450,
      shortsDefaultScale: 2.0,
      longRight: 260,
      longBottom: 160,
      longDefaultScale: 1.4,
      thumbnailShortsScale: 3.0,
      thumbnailLongScale: 2.1,
      bannerScale: 1.48,
      avatarScale: 4.0,
    },
    audio: {
      bgmSrc: "audio/music/bgm-loop.wav",
      voiceEqName: "Warm Bass EQ",
      voiceEqFilter:
        "highpass=f=75,equalizer=f=135:t=q:w=1.1:g=5.0,equalizer=f=240:t=q:w=1.2:g=2.5,equalizer=f=3200:t=q:w=1.4:g=-3.5,equalizer=f=5500:t=q:w=1.5:g=-3.0,acompressor=threshold=-18dB:ratio=3:attack=10:release=100,loudnorm=I=-16:TP=-1.5:LRA=11",
      levels: { vo: 1.0, sfx: 0.4, bgmNormal: 0.12, bgmDucked: 0.04 },
    },
    branding: {
      channelName,
      tagline: `EDUKASI & FAKTA BERSAMA ${displayName.toUpperCase()}`,
      kicker: "CHANNEL ANIMASI EDUKASI",
      coordLabel: `${upper}.STAGE // LAB.01`,
      footerKeywords: "EDUKASI · FAKTA UNIK · PENJELASAN VISUAL",
      defaultShortsThumbnail: {
        title: `FAKTA BARU BERSAMA ${displayName.toUpperCase()}!`,
        subtitle: "WAJIB TAHU!",
        floatingProps: ["lightbulb", "question-mark", "atom", "flask"],
      },
      defaultLongThumbnail: {
        title: `BEDAH TOPIK SERU BERSAMA ${displayName.toUpperCase()}`,
        badge: "EDUKASI VISUAL!",
      },
      defaultShortsHashtags: [tagSlug, "#edukasi", "#faktaunik", "#shorts"],
      defaultLongHashtags: [`#${pascal}`, "#Edukasi", "#FaktaUnik"],
    },
  };

  const themesTs = `import type { SceneTheme } from "../../core/types";
import type { PresetThemeStyle } from "../types";
import presetJson from "./preset.json";

export const ${upper}_THEMES: Record<SceneTheme, PresetThemeStyle> = {
  "cyber-blueprint": {
    bgCenter: presetJson.palette.bgCenter,
    bgMid: presetJson.palette.bg,
    bgOuter: presetJson.palette.bgOuter,
    gridMinor: presetJson.palette.gridMinor,
    gridMajor: presetJson.palette.gridMajor,
    accent: presetJson.palette.blueprintCyan,
    accentAlt: presetJson.palette.accentYellow,
    floorTop: presetJson.palette.bgLight,
    floorBottom: presetJson.palette.bgOuter,
    particleColor: presetJson.palette.gridMajor,
  },
  "cyber-crash": {
    bgCenter: "#241335",
    bgMid: "#0B152B",
    bgOuter: "#050712",
    gridMinor: "#0EA5E9",
    gridMajor: "#F43F5E",
    accent: "#FB7185",
    accentAlt: "#38BDF8",
    floorTop: "#1A1230",
    floorBottom: "#060814",
    particleColor: "#FB7185",
  },
  "vintage-1947": {
    bgCenter: "#154354",
    bgMid: "#0A2330",
    bgOuter: "#040E14",
    gridMinor: "#0D9488",
    gridMajor: "#38BDF8",
    accent: "#F59E0B",
    accentAlt: "#2DD4BF",
    floorTop: "#103240",
    floorBottom: "#05121A",
    particleColor: "#FBBF24",
  },
  "spotlight-twist": {
    bgCenter: "#3B0D2C",
    bgMid: "#190A26",
    bgOuter: "#080310",
    gridMinor: "#A855F7",
    gridMajor: "#F43F5E",
    accent: "#FACC15",
    accentAlt: "#FB7185",
    floorTop: "#290D29",
    floorBottom: "#0B0414",
    particleColor: "#FACC15",
  },
  "archive-paper": {
    bgCenter: "#2C2822",
    bgMid: "#17202C",
    bgOuter: "#0A0E14",
    gridMinor: "#64748B",
    gridMajor: "#F59E0B",
    accent: "#FDE047",
    accentAlt: "#38BDF8",
    floorTop: "#22252A",
    floorBottom: "#0B0F17",
    particleColor: "#FDE68A",
  },
  "edison-1878": {
    bgCenter: "#472B10",
    bgMid: "#231509",
    bgOuter: "#0E0703",
    gridMinor: "#92400E",
    gridMajor: "#F59E0B",
    accent: "#FDE047",
    accentAlt: "#FB923C",
    floorTop: "#331F0D",
    floorBottom: "#120A04",
    particleColor: "#FCD34D",
  },
  "neon-coder": {
    bgCenter: "#23195C",
    bgMid: "#0E0D2E",
    bgOuter: "#050414",
    gridMinor: "#6366F1",
    gridMajor: "#22D3EE",
    accent: "#00F5FF",
    accentAlt: "#C084FC",
    floorTop: "#191547",
    floorBottom: "#06051A",
    particleColor: "#22D3EE",
  },
};
`;

  const mascotTsx = `import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { MascotProps } from "../../core/types";

export const ${pascal}Mascot: React.FC<MascotProps> = ({
  pose = "idle",
  expression = "neutral",
  mouthOpen = 0,
  scale = 1,
  flip = false,
  showShadow = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const effectiveMouth = Math.max(0, Math.min(1, mouthOpen));
  const mouthHeight = interpolate(effectiveMouth, [0, 1], [3, 14]);
  const isWalking = pose === "walking";
  const isCelebrating = pose === "celebrating";

  const walkPhase = t * 11;
  const walkBounce = isWalking ? -Math.abs(Math.sin(walkPhase)) * 9 : 0;
  const celebBounce = isCelebrating ? -Math.abs(Math.sin(t * 9)) * 11 : 0;
  const breathing = Math.sin(t * 3.2) * 2;
  const bodyY = breathing + walkBounce + celebBounce;

  const armL = isCelebrating ? 135 : isWalking ? Math.sin(walkPhase) * 28 : 16 + Math.sin(t * 3) * 5;
  const armR = isCelebrating
    ? -135
    : pose === "pointing"
      ? -115
      : pose === "thinking"
        ? -25
        : isWalking
          ? -Math.sin(walkPhase) * 28
          : -16 - Math.sin(t * 3) * 5;

  return (
    <div
      style={{
        display: "inline-block",
        transform: \`scale(\${scale}) \${flip ? "scaleX(-1)" : ""}\`,
        transformOrigin: "bottom center",
        ...style,
      }}
    >
      <svg viewBox="-45 -15 290 420" width={290} height={420} fill="none">
        {showShadow && <ellipse cx="100" cy="374" rx="50" ry="11" fill="#020617" opacity="0.45" />}
        <g transform={\`translate(0, \${bodyY})\`}>
          <rect x="78" y="280" width="16" height="86" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <rect x="106" y="280" width="16" height="86" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <g transform={\`translate(66, 165) rotate(\${armL})\`}>
            <rect x="-7" y="0" width="14" height="62" rx="6" fill="#818CF8" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="0" cy="68" r="9" fill="#FDE68A" stroke="#0F172A" strokeWidth="2" />
          </g>
          <rect x="66" y="152" width="68" height="132" rx="18" fill="#6366F1" stroke="#0F172A" strokeWidth="3" />
          <circle cx="100" cy="100" r="38" fill="#FDE68A" stroke="#0F172A" strokeWidth="3" />
          <circle cx="86" cy="94" r={expression === "shocked" ? 7 : 5} fill="#0F172A" />
          <circle cx="114" cy="94" r={expression === "shocked" ? 7 : 5} fill="#0F172A" />
          {effectiveMouth > 0.12 ? (
            <ellipse cx="100" cy="114" rx="9" ry={mouthHeight * 0.7} fill="#9F1239" stroke="#0F172A" strokeWidth="2" />
          ) : (
            <path d="M 91 114 Q 100 120 109 114" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          <g transform={\`translate(134, 165) rotate(\${armR})\`}>
            <rect x="-7" y="0" width="14" height="62" rx="6" fill="#818CF8" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="0" cy="68" r="9" fill="#FDE68A" stroke="#0F172A" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export const Mascot = ${pascal}Mascot;
`;

  const indexTs = `import { FONTS } from "../../core/fonts";
import type { PropType, SceneTheme } from "../../core/types";
import type { PresetConfig, PresetStageStyle } from "../types";
import presetJson from "./preset.json";
import { ${pascal}Mascot } from "./Mascot";
import { ${upper}_THEMES } from "./themes";

const [prop1, prop2, prop3, prop4] = presetJson.branding.defaultShortsThumbnail
  .floatingProps as PropType[];

const defaultFloatingProps: [PropType, PropType, PropType, PropType] = [
  prop1,
  prop2,
  prop3,
  prop4,
];

export const ${camel}Preset: PresetConfig = {
  id: presetJson.id,
  name: presetJson.name,
  concept: presetJson.concept,
  description: presetJson.description,
  outputDir: presetJson.outputDir,
  voDir: presetJson.voDir,
  stageStyle: presetJson.stageStyle as PresetStageStyle,
  defaultTheme: presetJson.defaultTheme as SceneTheme,
  Mascot: ${pascal}Mascot,
  palette: presetJson.palette,
  fonts: FONTS,
  themes: ${upper}_THEMES,
  caption: presetJson.caption,
  mascotLayout: presetJson.mascotLayout,
  audio: presetJson.audio,
  branding: {
    ...presetJson.branding,
    defaultShortsThumbnail: {
      title: presetJson.branding.defaultShortsThumbnail.title,
      subtitle: presetJson.branding.defaultShortsThumbnail.subtitle,
      floatingProps: defaultFloatingProps,
    },
  },
};
`;

  const charSheetMd = `# CHARACTER REFERENCE SHEET: ${displayName.toUpperCase()}

- **Preset ID**: \`${opts.id}\`
- **Nama Maskot**: ${displayName}
- **Konsep Visual**: ${opts.concept}
- **Channel Target**: ${channelName}
- **Komponen SVG**: \`src/presets/${opts.id}/Mascot.tsx\`

> Sesuaikan desain SVG di \`Mascot.tsx\` serta palet di \`preset.json\` & \`themes.ts\` sesuai karakter dan tema channel Anda.
`;

  writeFileSync(path.join(presetDir, "preset.json"), `${JSON.stringify(presetJson, null, 2)}\n`, "utf8");
  writeFileSync(path.join(presetDir, "themes.ts"), themesTs, "utf8");
  writeFileSync(path.join(presetDir, "Mascot.tsx"), mascotTsx, "utf8");
  writeFileSync(path.join(presetDir, "index.ts"), indexTs, "utf8");
  writeFileSync(path.join(presetDir, "CHARACTER-SHEET.md"), charSheetMd, "utf8");
  writeFileSync(path.resolve(process.cwd(), "src/episodes", opts.id, "shorts/.gitkeep"), "", "utf8");
  writeFileSync(path.resolve(process.cwd(), "src/episodes", opts.id, "long/.gitkeep"), "", "utf8");

  console.log(`✅ Preset baru '${opts.id}' berhasil dibuat di: ${presetDir}`);
  console.log(`📁 Folder episode disiapkan di: src/episodes/${opts.id}/{shorts,long}/`);
  console.log("\n👉 Langkah terakhir — Daftarkan di src/presets/index.ts:");
  console.log(`   import { ${camel}Preset } from "./${opts.id}";`);
  console.log(`   "${opts.id}": ${camel}Preset,`);
}

const opts = parseCli(process.argv.slice(2));
if (opts.list) {
  printPresetList();
} else {
  createPresetFiles(opts);
}
