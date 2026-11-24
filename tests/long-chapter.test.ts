import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Aturan Tampilan Visual LongChapter.tsx", () => {
  it("DILARANG merender beat.headline, scene.kind, dan fact.source di layar Long Video", () => {
    const filePath = path.resolve(__dirname, "../src/components/LongChapter.tsx");
    expect(fs.existsSync(filePath)).toBe(true);

    const rawContent = fs.readFileSync(filePath, "utf8");
    // Hilangkan komentar JSX dan JS agar hanya memeriksa kode render aktif
    const codeOnly = rawContent
      .replace(/{\/\*[\s\S]*?\*\/}/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");

    // 1. DILARANG merender beat.headline di DOM JSX
    expect(codeOnly).not.toMatch(/{[^}]*beat\.headline[^}]*}/i);
    expect(codeOnly).not.toMatch(/{[^}]*currentBeat\.headline[^}]*}/i);

    // 2. DILARANG merender badge scene.kind
    expect(codeOnly).not.toMatch(/{[^}]*scene\.kind[^}]*}/i);

    // 3. DILARANG merender fact.source atau fact.confidence
    expect(codeOnly).not.toMatch(/{[^}]*fact\.source[^}]*}/i);
    expect(codeOnly).not.toMatch(/{[^}]*fact\.confidence[^}]*}/i);
  });
});
