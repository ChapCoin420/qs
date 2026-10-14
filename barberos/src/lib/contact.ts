/** "04-6016383" → "tel:+97246016383". Assumes Israeli local format with a leading 0. */
export function telHref(localPhone: string): string {
  const digits = localPhone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
  return `tel:+${international}`;
}

/** "+972509664604" → "https://wa.me/972509664604". */
export function whatsappHref(e164: string): string {
  return `https://wa.me/${e164.replace(/\D/g, "")}`;
}

export function wazeHref(address: string): string {
  return `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
}

export function googleMapsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Hebrew display address. A right-to-left mark after the street keeps a trailing house number
 * from being reordered next to the comma in RTL text ("בת חן ,64" → "בת חן 64,").
 */
export function displayAddress(street: string, city: string): string {
  return `${street}‏, ${city}`;
}
