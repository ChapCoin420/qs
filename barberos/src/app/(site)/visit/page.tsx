import type { Metadata } from "next";
import { booking, visitPage } from "@/content/site";
import { displayAddress, googleMapsHref, telHref, wazeHref, whatsappHref } from "@/lib/contact";
import { weekSchedule } from "@/lib/hours";
import { getShopProfile } from "@/modules/shop";
import { ButtonLink } from "@/ui/button-link";
import { Container } from "@/ui/container";
import { PageHeader } from "@/ui/page-header";

export const revalidate = 300;

export const metadata: Metadata = {
  title: visitPage.title,
  description: "כתובת, שעות פעילות, טלפון וניווט ל־Wein's Barbershop, בת חן 64, חיפה.",
  alternates: { canonical: "/visit" },
};

export default async function VisitPage() {
  const shop = await getShopProfile();
  const { location } = shop;
  const address = `${location.street}, ${location.city}`;
  const week = weekSchedule(shop.hours);

  return (
    <>
      <PageHeader eyebrow={location.city} title={visitPage.title} lead={visitPage.lead} />
      <section aria-label="פרטי ביקור" className="surface-light py-20 sm:py-28">
        <Container className="grid gap-16 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-medium">{visitPage.hoursTitle}</h2>
            {shop.hours.length === 0 ? (
              <p className="text-lg">{visitPage.hoursByAppointment}</p>
            ) : (
              <table className="w-full text-lg">
                <caption className="sr-only">{visitPage.hoursTitle}</caption>
                <tbody>
                  {week.map((d) => (
                    <tr key={d.weekday} className="border-b border-ink/15">
                      <th scope="row" className="py-3 text-start font-semibold">
                        {d.label}
                      </th>
                      <td className="py-3 text-end tabular-nums">
                        {d.ranges.length ? (
                          <span dir="ltr">{d.ranges.join(", ")}</span>
                        ) : (
                          visitPage.closed
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div>
              <ButtonLink href={booking.url}>{booking.label}</ButtonLink>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-3xl font-medium">{visitPage.contactTitle}</h2>
              <address className="text-lg leading-9 not-italic">
                {displayAddress(location.street, location.city)}
                {location.phone && (
                  <>
                    <br />
                    טלפון:{" "}
                    <a
                      href={telHref(location.phone)}
                      className="font-semibold underline underline-offset-4"
                    >
                      <span dir="ltr">{location.phone}</span>
                    </a>
                  </>
                )}
                {location.whatsappE164 && (
                  <>
                    <br />
                    <a
                      href={whatsappHref(location.whatsappE164)}
                      className="font-semibold underline underline-offset-4"
                    >
                      שליחת הודעה בוואטסאפ
                    </a>
                  </>
                )}
              </address>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-3xl font-medium">{visitPage.directionsTitle}</h2>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={wazeHref(address)} variant="ghost-light">
                  ניווט ב־<span lang="en">Waze</span>
                </ButtonLink>
                <ButtonLink href={googleMapsHref(address)} variant="ghost-light">
                  <span lang="en">Google Maps</span>
                </ButtonLink>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-3xl font-medium">{visitPage.accessibilityTitle}</h2>
              <p className="text-lg">
                {location.accessibilityInfo ?? visitPage.accessibilityPending}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
