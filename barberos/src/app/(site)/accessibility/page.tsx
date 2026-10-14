import type { Metadata } from "next";
import { displayAddress, telHref } from "@/lib/contact";
import { getShopProfile } from "@/modules/shop";
import { Container } from "@/ui/container";
import { PageHeader } from "@/ui/page-header";
import { Prose } from "@/ui/prose";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  alternates: { canonical: "/accessibility" },
};

/**
 * DRAFT accessibility statement. Before launch it must be completed with the accessibility
 * coordinator's details, verified premises information and the audit date, and reviewed by a
 * certified accessibility consultant (docs/ACCESSIBILITY.md).
 */
const LAST_UPDATED = "אוקטובר 2026";

export default async function AccessibilityPage() {
  const shop = await getShopProfile();
  const phone = shop.location.phone;
  return (
    <>
      <PageHeader title="הצהרת נגישות" lead={`עודכנה לאחרונה: ${LAST_UPDATED}`} />
      <section aria-label="תוכן ההצהרה" className="surface-light py-20 sm:py-28">
        <Container>
          <Prose>
            <p>
              ב־<span lang="en">Wein&rsquo;s Barbershop</span> אנו רואים חשיבות רבה במתן שירות
              שוויוני ונגיש לכל הלקוחות, ובכלל זה לאנשים עם מוגבלות. האתר נבנה מתוך מטרה לעמוד
              בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013,
              ובתקן הישראלי ת״י 5568 ברמה AA, ובהתאם להנחיות <span lang="en">WCAG 2.2</span> ברמה
              AA.
            </p>

            <h2>מה עשינו באתר</h2>
            <ul>
              <li>מבנה כותרות וסימון אזורים (ניווט, תוכן ראשי, כותרת תחתונה) לשימוש בקוראי מסך.</li>
              <li>ניווט מלא במקלדת, כולל קישור ״דילוג לתוכן הראשי״ וסימון פוקוס בולט.</li>
              <li>ניגודיות צבעים שנבדקה לכל צירופי הטקסט והרקע.</li>
              <li>טקסט חלופי לתמונות בעלות משמעות.</li>
              <li>התאמה לתצוגה בטלפון ולהגדלת טקסט עד 200% ללא אובדן תוכן.</li>
              <li>כיבוד הגדרת ״הפחתת תנועה״ של מערכת ההפעלה.</li>
              <li>בדיקות נגישות אוטומטיות בכל שינוי באתר.</li>
            </ul>
            <p>האתר אינו משתמש ב״תוסף נגישות״ חיצוני; ההתאמות מובנות בקוד האתר עצמו.</p>

            <h2>מגבלות ידועות</h2>
            <p>
              קביעת התורים מתבצעת כרגע במערכת חיצונית שאינה בשליטתנו, וייתכן שאינה נגישה במלואה. אם
              נתקלתם בקושי — נשמח לקבוע עבורכם תור בטלפון{phone ? " " : ""}
              {phone && (
                <a href={telHref(phone)}>
                  <span dir="ltr">{phone}</span>
                </a>
              )}{" "}
              או בוואטסאפ.
            </p>

            <h2>נגישות המספרה</h2>
            <p>
              {shop.location.accessibilityInfo ??
                "מידע מפורט על נגישות המבנה (כניסה, חניה ושירותים) יפורסם לאחר בדיקה במקום. לפרטים ניתן לפנות אלינו בטלפון."}
            </p>

            <h2>פנייה בנושא נגישות</h2>
            <p>נתקלתם בבעיה? נשמח לשמוע ולתקן. פנו אלינו ונחזור אליכם בהקדם.</p>
            <ul>
              <li>רכז/ת נגישות: יעודכן בקרוב</li>
              {phone && (
                <li>
                  טלפון:{" "}
                  <a href={telHref(phone)}>
                    <span dir="ltr">{phone}</span>
                  </a>
                </li>
              )}
              <li>כתובת: {displayAddress(shop.location.street, shop.location.city)}</li>
            </ul>
          </Prose>
        </Container>
      </section>
    </>
  );
}
