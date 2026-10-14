import type { Metadata } from "next";
import { booking, servicesPage } from "@/content/site";
import { listServices } from "@/modules/catalog";
import { ButtonLink } from "@/ui/button-link";
import { Container } from "@/ui/container";
import { PageHeader } from "@/ui/page-header";
import { ServiceList } from "@/ui/service-list";

export const revalidate = 300;

export const metadata: Metadata = {
  title: servicesPage.title,
  description:
    "תספורת גבר, פיסול זקן, גילוח תער מסורתי ותספורת ילדים — מחירון Wein's Barbershop בחיפה.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await listServices();
  return (
    <>
      <PageHeader eyebrow="Wein's" title={servicesPage.title} lead={servicesPage.lead} />
      <section aria-labelledby="price-list-title" className="surface-light py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <h2 id="price-list-title" className="sr-only">
            מחירון
          </h2>
          <ServiceList services={services} showDuration />
          <div>
            <ButtonLink href={booking.url}>{booking.label}</ButtonLink>
          </div>
        </Container>
      </section>
      <section aria-labelledby="faq-title" className="surface-dark py-20 sm:py-28">
        <Container className="flex flex-col gap-10">
          <h2 id="faq-title" className="font-display text-4xl font-medium">
            {servicesPage.faqTitle}
          </h2>
          <div className="divide-y divide-linen/15 border-y border-linen/15">
            {servicesPage.faq.map((item) => (
              <details key={item.q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-xl font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    className="text-2xl text-brass group-open:rotate-45 motion-safe:transition-transform"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 text-base text-linen/85">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
