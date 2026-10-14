import { describe, expect, it } from "vitest";
import { formatAgorot } from "@/lib/money";

describe("formatAgorot", () => {
  it("formats whole shekels without decimals", () => {
    expect(formatAgorot(5000).replace(/[\u200f\s]/g, "")).toBe("50₪");
  });
  it("keeps agorot when present", () => {
    expect(formatAgorot(4990)).toContain("49.9");
  });
  it("rejects non-integer agorot", () => {
    expect(() => formatAgorot(10.5)).toThrow(TypeError);
  });
});
