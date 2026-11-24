import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

function getAllTsFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllTsFiles(fullPath));
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      results.push(fullPath);
    }
  }

  return results;
}

describe("Larangan Math.random() di src/", () => {
  it("seluruh file di src/ DILARANG menggunakan Math.random() demi determinisme render", () => {
    const srcDir = path.resolve(__dirname, "../src");
    const tsFiles = getAllTsFiles(srcDir);

    expect(tsFiles.length).toBeGreaterThan(0);

    const violations: { file: string; line: number }[] = [];

    for (const file of tsFiles) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, idx) => {
        // Abaikan komentar
        if (line.includes("Math.random()") && !line.trim().startsWith("//") && !line.trim().startsWith("*")) {
          violations.push({
            file: path.relative(srcDir, file),
            line: idx + 1,
          });
        }
      });
    }

    if (violations.length > 0) {
      const msg = violations
        .map((v) => `${v.file}:${v.line} menggunakan Math.random()`)
        .join("\n");
      expect.fail(`Ditemukan penggunaan Math.random() di dalam src/:\n${msg}`);
    }

    expect(violations).toHaveLength(0);
  });
});
