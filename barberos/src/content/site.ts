/**
 * Customer-facing Hebrew copy. Facts here (founding year, booking link) come from public sources
 * (docs/BUSINESS_PROFILE.md) and must be confirmed by the owner before launch.
 */
export const brand = {
  name: "Wein's Barbershop",
  shortName: "Wein's",
  city: "חיפה",
  foundedYear: 2019,
  tagline: "דיוק של תער. סטייל של חיפה.",
  description:
    "Wein's Barbershop — מספרת בוטיק לגברים בבת חן 64, חיפה. תספורות, פיסול זקן וגילוח תער מסורתי, בתיאום מראש.",
} as const;

/** Phase 1: booking goes to the shop's current system. Phase 2 replaces it with BarberOS booking. */
export const booking = {
  url: "https://calmark.io/p/4XrY0",
  label: "קביעת תור",
} as const;

export const social = [
  { label: "אינסטגרם", href: "https://www.instagram.com/weins_barbershop/" },
  { label: "טיקטוק", href: "https://www.tiktok.com/@weins_bs" },
  { label: "פייסבוק", href: "https://www.facebook.com/weinsbs/" },
] as const;

export const nav = [
  { href: "/services", label: "שירותים ומחירים" },
  { href: "/about", label: "הסיפור" },
  { href: "/visit", label: "ביקור" },
] as const;

export const home = {
  hero: {
    eyebrow: "בת חן 64 · חיפה",
    title: ["דיוק של תער.", "סטייל של חיפה."],
    lead: "מספרת בוטיק לגברים. תספורת, זקן וגילוח — בקצב שלך, עם תשומת לב לכל קו.",
    secondary: "שירותים ומחירים",
  },
  manifesto: {
    label: "Wein's",
    text: "יש מספרות, ויש מקום שגברים מכל הצפון נוסעים אליו. אנחנו לא ממהרים, לא מתפשרים על הקו, ולא משחררים אותך מהכיסא עד שזה מדויק.",
  },
  craft: {
    label: "המלאכה",
    title: "כל תספורת מתחילה בשיחה ונגמרת בתער.",
    pillars: [
      {
        title: "ייעוץ אישי",
        text: "מבנה פנים, סוג שיער, איך אתה חי עם התספורת ביום־יום. מתאימים לך — לא לטרנד.",
      },
      {
        title: "קו נקי",
        text: "דירוג מדויק, מעברים חלקים וקווי מתאר שמחזיקים גם שבועיים אחרי.",
      },
      {
        title: "גימור בתער",
        text: "תער ישר ומגבת חמה לסיום. הפרט הקטן שעושה את ההבדל.",
      },
    ],
  },
  services: {
    label: "השירותים",
    title: "מה עושים אצלנו",
    cta: "לכל השירותים והמחירים",
  },
  story: {
    label: "הסיפור",
    title: "חלום ילדות עם כיסא ותער.",
    text: "ברוך ויין ידע שהוא רוצה להיות ספר עוד לפני שידע להחזיק מספריים. ב־2019 הוא פתח את Wein's בבת חן — ומאז המקום הפך לכתובת של גברים שמחפשים יותר מתספורת.",
    cta: "לסיפור המלא",
  },
  visit: {
    label: "ביקור",
    title: "בת חן 64\u200F, חיפה",
    text: "מגיעים בתיאום מראש. הכיסא שלך מחכה.",
  },
  closing: {
    title: "התור הבא שלך מתחיל כאן.",
  },
} as const;

export const about = {
  title: "הסיפור",
  lead: "Wein's נולדה מחלום של ילד אחד מחיפה, והפכה למקום שגברים מכל הצפון חוזרים אליו.",
  sections: [
    {
      title: "ההתחלה",
      text: "ברוך ויין חלם להיות ספר כל חייו. לא כעבודה — כמקצוע, כמלאכה. ב־2019 הוא פתח את Wein's ברחוב בת חן בחיפה, עם רעיון פשוט: כל לקוח יוצא מכאן נראה ומרגיש הכי טוב שלו.",
    },
    {
      title: "הסטנדרט",
      text: "אצלנו אין ״בערך״. כל תספורת מתחילה בייעוץ, כל קו נבדק פעמיים, וכל גימור נעשה בתער. זו הסיבה שהלקוחות שלנו חוזרים — ומביאים חברים.",
    },
    {
      title: "המקום",
      text: "חלל אינטימי, אור חם, מוזיקה טובה ואנשים שאוהבים את מה שהם עושים. מקום שנעים לשבת בו גם כשלא ממהרים לשום מקום.",
    },
  ],
} as const;

export const servicesPage = {
  title: "שירותים ומחירים",
  lead: "כל השירותים כוללים ייעוץ אישי. המחירים כוללים מע״מ.",
  priceOnRequest: "לפי התאמה",
  minutes: (n: number) => `${n} דקות`,
  faqTitle: "שאלות נפוצות",
  faq: [
    {
      q: "צריך לקבוע תור מראש?",
      a: "כן. אנחנו עובדים בתיאום מראש בלבד, כדי שכל לקוח יקבל את הזמן המלא שלו בכיסא.",
    },
    {
      q: "מה אם אני מאחר?",
      a: "עדכנו אותנו בהקדם בטלפון או בוואטסאפ. נעשה כמיטב יכולתנו לשמור על התור, אבל ייתכן שנצטרך לקצר את השירות או לקבוע מחדש.",
    },
    {
      q: "איך מבטלים או משנים תור?",
      a: "דרך מערכת התורים או בהודעה אלינו. נשמח לקבל עדכון מוקדם ככל האפשר, כדי שנוכל להציע את הזמן ללקוח אחר.",
    },
  ],
} as const;

export const visitPage = {
  title: "ביקור",
  lead: "בת חן 64\u200F, חיפה. מגיעים בתיאום מראש.",
  hoursTitle: "שעות פעילות",
  hoursByAppointment: "פועלים בתיאום מראש. לשעות פנויות — דרך מערכת התורים או בטלפון.",
  closed: "סגור",
  contactTitle: "יצירת קשר",
  directionsTitle: "הגעה",
  accessibilityTitle: "נגישות המקום",
  accessibilityPending:
    "מידע מפורט על נגישות המבנה יפורסם בקרוב. לשאלות על הגעה ונגישות אפשר לפנות אלינו בטלפון.",
} as const;
