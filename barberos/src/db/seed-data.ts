/**
 * Seed data for Wein's Barbershop.
 * Sources: public listings researched 2026-10-14 (docs/BUSINESS_PROFILE.md).
 * Every value marked VERIFY must be confirmed by the owner before launch.
 */
export const seedShop = {
  slug: "weins",
  name: "Wein's Barbershop",
  location: {
    name: "Wein's Barbershop חיפה",
    street: "בת חן 64",
    city: "חיפה",
    phone: "04-6016383", // VERIFY
    whatsappE164: "+972509664604", // VERIFY: is this the WhatsApp line?
    accessibilityInfo: null as string | null, // VERIFY on site (a listing mentions wheelchair access)
  },
  /** Empty until the owner confirms hours (sources conflict). The site then shows "by appointment". */
  hours: [] as { weekday: number; opensAt: string; closesAt: string }[],
  services: [
    {
      slug: "mens-cut",
      name: "תספורת גבר",
      description: "ייעוץ, תספורת מדויקת בהתאמה למבנה הפנים, שטיפה ועיצוב.",
      category: "hair",
      durationMin: 30, // VERIFY
      priceAgorot: 5000, // VERIFY (Calmark listing)
    },
    {
      slug: "cut-and-beard",
      name: "תספורת וזקן",
      description: "התספורת המלאה יחד עם פיסול זקן וקווים נקיים בתער.",
      category: "hair",
      durationMin: 45, // VERIFY
      priceAgorot: 6000, // VERIFY (Calmark listing)
    },
    {
      slug: "beard-sculpt",
      name: "פיסול זקן",
      description: "עיצוב צורה, דירוג אורך וקווי מתאר בתער.",
      category: "beard",
      durationMin: 20, // VERIFY
      priceAgorot: null, // VERIFY
    },
    {
      slug: "hot-towel-shave",
      name: "גילוח תער מסורתי",
      description: "מגבת חמה, הכנת עור וגילוח בתער ישר. הטקס הקלאסי.",
      category: "beard",
      durationMin: 30, // VERIFY
      priceAgorot: null, // VERIFY
    },
    {
      slug: "kids-cut",
      name: "תספורת ילד",
      description: "עד גיל 15.",
      category: "hair",
      durationMin: 25, // VERIFY
      priceAgorot: 4000, // VERIFY (Calmark listing)
    },
  ],
  staff: [
    {
      slug: "baruch-wein",
      displayName: "ברוך ויין",
      role: "מייסד וספר ראשי",
      bio: "חלם להיות ספר מאז שהוא זוכר את עצמו, ובשנת 2019 פתח את Wein's בבת חן. מוביל את הצוות ואת הסטנדרט.",
    },
  ],
} as const;
