import { booking } from "@/content/site";
import { telHref } from "@/lib/contact";

/** Persistent booking access on small screens. Page footer reserves space so it never hides content. */
export function MobileBookingBar({ phone }: { phone: string | null }) {
  return (
    <aside
      aria-label="קביעת תור מהירה"
      className="surface-dark fixed inset-x-0 bottom-0 z-30 border-t border-linen/15 bg-ink/95 p-3 backdrop-blur md:hidden"
    >
      <div className="flex gap-3">
        <a
          href={booking.url}
          className="flex min-h-12 flex-1 items-center justify-center bg-brass font-semibold text-ink"
        >
          {booking.label}
        </a>
        {phone && (
          <a
            href={telHref(phone)}
            className="flex min-h-12 items-center justify-center border border-linen/50 px-5 font-semibold text-linen"
          >
            התקשרו
          </a>
        )}
      </div>
    </aside>
  );
}
