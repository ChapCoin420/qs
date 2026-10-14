import { servicesPage } from "@/content/site";
import { formatAgorot } from "@/lib/money";
import type { PublicService } from "@/modules/catalog";

/** Price list: name and description on the start side, price on the end side, joined by a leader rule. */
export function ServiceList({
  services,
  showDuration = false,
}: {
  services: PublicService[];
  showDuration?: boolean;
}) {
  return (
    <ul className="divide-y divide-current/15 border-y border-current/15">
      {services.map((s) => (
        <li key={s.slug} className="flex flex-col gap-2 py-6 sm:py-7">
          <div className="flex items-baseline gap-4">
            <h3 className="font-display text-2xl font-medium sm:text-3xl">{s.name}</h3>
            <span className="mb-1.5 h-px flex-1 self-end bg-current/25" aria-hidden="true" />
            <p className="shrink-0 text-xl font-semibold tabular-nums">
              {s.priceAgorot === null ? servicesPage.priceOnRequest : formatAgorot(s.priceAgorot)}
            </p>
          </div>
          {(s.description || showDuration) && (
            <p className="max-w-2xl text-base opacity-80">
              {s.description}
              {showDuration && (
                <>
                  {s.description ? " · " : ""}
                  {servicesPage.minutes(s.durationMin)}
                </>
              )}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
