import Link from "next/link";
import { booking, brand, nav, social } from "@/content/site";
import { displayAddress, telHref, whatsappHref } from "@/lib/contact";
import type { ShopProfile } from "@/modules/shop";
import { Container } from "./container";
import { Wordmark } from "./wordmark";

export function SiteFooter({ shop }: { shop: ShopProfile }) {
  const { location } = shop;
  return (
    <footer className="surface-dark grain border-t border-linen/10 pt-16 pb-28 md:pb-12">
      <Container className="grid gap-12 md:grid-cols-4">
        <div className="flex flex-col items-start gap-4">
          <Wordmark />
          <p className="max-w-xs text-base text-linen/80">{brand.tagline}</p>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-brass">ביקור</h2>
          <address className="text-base leading-8 not-italic">
            {displayAddress(location.street, location.city)}
            <br />
            {location.phone && (
              <a href={telHref(location.phone)} className="underline-offset-4 hover:underline">
                <span dir="ltr">{location.phone}</span>
              </a>
            )}
          </address>
          {location.whatsappE164 && (
            <a
              href={whatsappHref(location.whatsappE164)}
              className="mt-2 inline-block text-base underline-offset-4 hover:underline"
            >
              וואטסאפ
            </a>
          )}
        </div>

        <nav aria-label="ניווט תחתון">
          <h2 className="eyebrow mb-4 text-brass">ניווט</h2>
          <ul className="flex flex-col gap-2 text-base">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={booking.url} className="underline-offset-4 hover:underline">
                {booking.label}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-4 text-brass">עקבו אחרינו</h2>
          <ul className="flex flex-col gap-2 text-base">
            {social.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="underline-offset-4 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="mt-16 flex flex-col gap-4 border-t border-linen/10 pt-8 text-sm text-linen/75 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} <span lang="en">{brand.name}</span>
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/accessibility" className="underline-offset-4 hover:underline">
              הצהרת נגישות
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              מדיניות פרטיות
            </Link>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
