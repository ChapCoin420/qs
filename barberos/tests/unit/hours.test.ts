import { describe, expect, it } from "vitest";
import { openingHoursSpecification, weekSchedule } from "@/lib/hours";

describe("weekSchedule", () => {
  it("returns all seven days starting Sunday, closed days empty", () => {
    const week = weekSchedule([]);
    expect(week.map((d) => d.label)).toEqual([
      "ראשון",
      "שני",
      "שלישי",
      "רביעי",
      "חמישי",
      "שישי",
      "שבת",
    ]);
    expect(week.every((d) => d.ranges.length === 0)).toBe(true);
  });

  it("sorts split shifts and trims seconds", () => {
    const week = weekSchedule([
      { weekday: 1, opensAt: "16:00:00", closesAt: "20:00:00" },
      { weekday: 1, opensAt: "09:00:00", closesAt: "13:00:00" },
    ]);
    expect(week[1]?.ranges).toEqual(["09:00–13:00", "16:00–20:00"]);
  });
});

describe("openingHoursSpecification", () => {
  it("maps weekday numbers to schema.org day names", () => {
    expect(
      openingHoursSpecification([{ weekday: 5, opensAt: "08:00:00", closesAt: "14:00:00" }]),
    ).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "08:00",
        closes: "14:00",
      },
    ]);
  });
});
