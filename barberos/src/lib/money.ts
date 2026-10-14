const ils = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

/** Formats integer agorot as a Hebrew-locale shekel amount, e.g. 5000 → "‏50 ₪". */
export function formatAgorot(agorot: number): string {
  if (!Number.isInteger(agorot)) throw new TypeError("agorot must be an integer");
  return ils.format(agorot / 100);
}
