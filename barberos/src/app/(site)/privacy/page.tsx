import type { Metadata } from "next";
import { displayAddress, telHref } from "@/lib/contact";
import { getShopProfile } from "@/modules/shop";
import { Container } from "@/ui/container";
import { PageHeader } from "@/ui/page-header";
import { Prose } from "@/ui/prose";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  alternates: { canonical: "/privacy" },
};

/** DRAFT — must be reviewed by a lawyer before launch (docs/SECURITY.md). */
export default async function PrivacyPage() {
  const shop = await getShopProfile();
  const phone = shop.location.phone;
  return (
    <>
      <PageHeader title="מדיניות פרטיות" lead="עודכנה לאחרונה: אוקטובר 2026" />
      <section aria-label="תוכן המדיניות" className="surface-light py-20 sm:py-28">
        <Container>
          <Prose>
            <p>
              אנו מכבדים את פרטיותכם ואוספים רק את המידע הדרוש לנו כדי לתת לכם שירות. מדיניות זו
              מסבירה איזה מידע נאסף, למה, ומה הזכויות שלכם.
            </p>
            <h2>איזה מידע נאסף</h2>
            <ul>
              <li>
                גלישה באתר: האתר אינו משתמש בעוגיות פרסום או מעקב. ייתכן שיירשמו נתונים טכניים
                בסיסיים (כמו כתובת IP וסוג דפדפן) לצורכי אבטחה ותפעול.
              </li>
              <li>
                קביעת תור: התורים נקבעים כרגע במערכת חיצונית, והמידע שתמסרו שם כפוף גם למדיניות
                הפרטיות שלה.
              </li>
              <li>פנייה אלינו בטלפון או בוואטסאפ: נשתמש בפרטים רק כדי לטפל בפנייה.</li>
            </ul>
            <h2>דיוור ופרסום</h2>
            <p>
              לא נשלח אליכם הודעות פרסומיות בלי הסכמה מפורשת מראש. תמיד אפשר לבקש להפסיק לקבל
              הודעות.
            </p>
            <h2>הזכויות שלכם</h2>
            <p>
              לפי חוק הגנת הפרטיות, התשמ״א–1981, אתם רשאים לעיין במידע שנשמר עליכם, לבקש לתקן אותו
              או לבקש למחוק אותו, בכפוף לדין.
            </p>
            <h2>יצירת קשר</h2>
            <p>
              לשאלות או בקשות בנושא פרטיות:{" "}
              {displayAddress(shop.location.street, shop.location.city)}
              {phone && (
                <>
                  {" · "}
                  <a href={telHref(phone)}>
                    <span dir="ltr">{phone}</span>
                  </a>
                </>
              )}
            </p>
          </Prose>
        </Container>
      </section>
    </>
  );
}
