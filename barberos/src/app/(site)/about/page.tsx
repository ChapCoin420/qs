import type { Metadata } from "next";
import Image from "next/image";
import { about, booking } from "@/content/site";
import { listStaff } from "@/modules/catalog";
import { ButtonLink } from "@/ui/button-link";
import { Container } from "@/ui/container";
import { PageHeader } from "@/ui/page-header";

export const revalidate = 300;

export const metadata: Metadata = {
  title: about.title,
  description:
    "הסיפור של Wein's Barbershop: מחלום ילדות של ברוך ויין למספרת בוטיק לגברים בבת חן, חיפה.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const team = await listStaff();
  return (
    <>
      <PageHeader eyebrow="מאז 2019" title={about.title} lead={about.lead} />
      <section aria-label="הסיפור שלנו" className="surface-light py-20 sm:py-28">
        <Container className="grid gap-16 md:grid-cols-[1fr_1fr] md:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/craft-straight-razor.jpg"
              alt="עבודת תער מקרוב: יד מקועקעת מיישרת קו שיער בצדעה של לקוח."
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-12">
            {about.sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-3xl font-medium">{s.title}</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink/85">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section aria-labelledby="team-title" className="surface-dark grain py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <h2 id="team-title" className="font-display text-4xl font-medium">
            הצוות
          </h2>
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <li key={m.slug} className="flex flex-col gap-2 border-t border-brass/60 pt-6">
                <h3 className="font-display text-3xl">{m.displayName}</h3>
                <p className="eyebrow text-brass">{m.role}</p>
                {m.bio && <p className="mt-2 text-base text-linen/85">{m.bio}</p>}
              </li>
            ))}
          </ul>
          <div>
            <ButtonLink href={booking.url}>{booking.label}</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
