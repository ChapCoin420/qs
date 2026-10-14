import Image from "next/image";
import Link from "next/link";
import { booking, brand, home } from "@/content/site";
import { googleMapsHref, wazeHref } from "@/lib/contact";
import { openingHoursSpecification } from "@/lib/hours";
import { siteUrl } from "@/lib/env";
import { listServices } from "@/modules/catalog";
import { getShopProfile } from "@/modules/shop";
import { ButtonLink } from "@/ui/button-link";
import { Container } from "@/ui/container";
import { JsonLd } from "@/ui/json-ld";
import { SectionHeading } from "@/ui/section-heading";
import { ServiceList } from "@/ui/service-list";

export const revalidate = 300;

export default async function HomePage() {
  const [shop, services] = await Promise.all([getShopProfile(), listServices()]);
  const address = `${shop.location.street}, ${shop.location.city}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HairSalon",
          name: brand.name,
          url: siteUrl(),
          image: `${siteUrl()}/images/editorial-golden-hour.jpg`,
          telephone: shop.location.phone ?? undefined,
          foundingDate: String(brand.foundedYear),
          address: {
            "@type": "PostalAddress",
            streetAddress: shop.location.street,
            addressLocality: shop.location.city,
            addressCountry: "IL",
          },
          openingHoursSpecification: openingHoursSpecification(shop.hours),
        }}
      />

      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="surface-dark relative isolate overflow-hidden"
      >
        <Image
          src="/images/editorial-golden-hour.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[70%_30%]"
        />
        {/* Scrim keeps hero text above 4.5:1 contrast over any part of the photo. */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/30 md:bg-gradient-to-l md:from-ink md:via-ink/80 md:to-transparent"
          aria-hidden="true"
        />
        <Container className="flex min-h-[calc(100svh-5rem)] flex-col justify-end pt-40 pb-28 md:justify-center md:pb-24">
          <div className="max-w-xl">
            <p className="eyebrow mb-6 flex items-center gap-3 text-brass">
              <span className="rule" aria-hidden="true" />
              {home.hero.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="font-display text-5xl leading-[1.05] font-medium sm:text-7xl"
            >
              {home.hero.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-lg text-linen/90 sm:text-xl">{home.hero.lead}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={booking.url}>{booking.label}</ButtonLink>
              <ButtonLink href="/services" variant="ghost-dark">
                {home.hero.secondary}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Manifesto */}
      <section aria-label="מי אנחנו" className="surface-light py-24 sm:py-32">
        <Container>
          <p className="font-display mx-auto max-w-4xl text-center text-3xl leading-snug font-normal text-balance sm:text-[2.75rem]">
            {home.manifesto.text}
          </p>
        </Container>
      </section>

      {/* Craft */}
      <section aria-labelledby="craft-title" className="surface-dark grain py-24 sm:py-32">
        <Container className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden md:order-2">
            <Image
              src="/images/craft-straight-razor.jpg"
              alt="ספר מיישר בתער ישר את קו השיער בצדעה של לקוח. ברקע, ספרים נוספים עובדים באור חם."
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-12">
            <SectionHeading id="craft-title" label={home.craft.label} title={home.craft.title} />
            <ol className="flex flex-col gap-8">
              {home.craft.pillars.map((p, i) => (
                <li key={p.title} className="flex gap-6">
                  <span
                    className="font-display text-3xl text-brass tabular-nums"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    <p className="mt-1 text-base text-linen/80">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section aria-labelledby="services-title" className="surface-light py-24 sm:py-32">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            id="services-title"
            label={home.services.label}
            title={home.services.title}
            tone="brass-deep"
          />
          <ServiceList services={services} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={booking.url}>{booking.label}</ButtonLink>
            <ButtonLink href="/services" variant="ghost-light">
              {home.services.cta}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section aria-labelledby="story-title" className="surface-sea grain py-24 sm:py-32">
        <Container className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <SectionHeading
            id="story-title"
            label={home.story.label}
            title={home.story.title}
            tone="brass"
          />
          <div className="flex flex-col items-start gap-8">
            <p className="text-xl leading-relaxed text-linen/90">{home.story.text}</p>
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center gap-2 border-b border-linen/60 text-lg font-semibold hover:border-linen"
            >
              {home.story.cta}
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Visit */}
      <section aria-labelledby="visit-title" className="surface-dark py-24 sm:py-32">
        <Container className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="visit-title" label={home.visit.label} title={home.visit.title} />
          <div className="flex flex-col gap-6 md:items-end">
            <p className="text-lg text-linen/85">{home.visit.text}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={wazeHref(address)} variant="ghost-dark">
                ניווט ב־<span lang="en">Waze</span>
              </ButtonLink>
              <ButtonLink href={googleMapsHref(address)} variant="ghost-dark">
                <span lang="en">Google Maps</span>
              </ButtonLink>
              <ButtonLink href="/visit" variant="ghost-dark">
                שעות ופרטים
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section aria-labelledby="closing-title" className="surface-light py-24 text-center sm:py-32">
        <Container className="flex flex-col items-center gap-10">
          <h2
            id="closing-title"
            className="font-display text-4xl font-medium text-balance sm:text-6xl"
          >
            {home.closing.title}
          </h2>
          <ButtonLink href={booking.url}>{booking.label}</ButtonLink>
        </Container>
      </section>
    </>
  );
}
