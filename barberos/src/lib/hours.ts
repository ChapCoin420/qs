export const HEBREW_WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"] as const;

export interface OpeningSlot {
  weekday: number;
  opensAt: string; // "HH:MM" or "HH:MM:SS"
  closesAt: string;
}

export interface DayHours {
  weekday: number;
  label: string;
  ranges: string[]; // e.g. ["09:00–14:00", "16:00–20:00"]; empty = closed
}

const hhmm = (t: string) => t.slice(0, 5);

/** Groups opening slots into a full Sunday→Saturday week, ranges sorted by start time. */
export function weekSchedule(slots: readonly OpeningSlot[]): DayHours[] {
  return HEBREW_WEEKDAYS.map((label, weekday) => ({
    weekday,
    label,
    ranges: slots
      .filter((s) => s.weekday === weekday)
      .sort((a, b) => a.opensAt.localeCompare(b.opensAt))
      .map((s) => `${hhmm(s.opensAt)}–${hhmm(s.closesAt)}`),
  }));
}

/** schema.org `openingHoursSpecification` entries. */
export function openingHoursSpecification(slots: readonly OpeningSlot[]) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return slots.map((s) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days[s.weekday],
    opens: hhmm(s.opensAt),
    closes: hhmm(s.closesAt),
  }));
}
