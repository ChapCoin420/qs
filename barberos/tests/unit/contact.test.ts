import { describe, expect, it } from "vitest";
import { displayAddress, telHref, wazeHref, whatsappHref } from "@/lib/contact";

describe("contact helpers", () => {
  it("converts Israeli local numbers to international tel links", () => {
    expect(telHref("04-6016383")).toBe("tel:+97246016383");
    expect(telHref("050-966-4604")).toBe("tel:+972509664604");
  });
  it("builds wa.me links from E.164", () => {
    expect(whatsappHref("+972509664604")).toBe("https://wa.me/972509664604");
  });
  it("encodes Hebrew addresses in navigation links", () => {
    expect(wazeHref("בת חן 64, חיפה")).toContain("q=%D7%91");
  });
  it("adds an RLM after the street so the house number stays in place", () => {
    expect(displayAddress("בת חן 64", "חיפה")).toBe("בת חן 64‏, חיפה");
  });
});
