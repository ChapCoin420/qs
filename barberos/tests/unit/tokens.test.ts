import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** WCAG 2 contrast ratio between two #rrggbb colors. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const css = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8");
const token = (name: string) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, "i"));
  if (!m?.[1]) throw new Error(`token ${name} not found`);
  return m[1];
};

// Text pairs actually used for body-size text (AA: 4.5:1).
const textPairs: [string, string][] = [
  ["linen", "ink"],
  ["linen", "ink-soft"],
  ["linen", "sea"],
  ["ink", "linen"],
  ["brass", "ink"],
  ["brass-deep", "linen"],
  ["ink", "brass"],
];

describe("design token contrast", () => {
  it.each(textPairs)("%s on %s meets 4.5:1", (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it("brass on sea is at least 3:1 (large text / UI only)", () => {
    expect(contrast(token("brass"), token("sea"))).toBeGreaterThanOrEqual(3);
  });
});
