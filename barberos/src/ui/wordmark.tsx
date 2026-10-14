/**
 * Placeholder typographic wordmark until the owner's vector logo is supplied.
 * Latin brand name, so it is marked lang="en" and isolated for correct bidi rendering.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      lang="en"
      dir="ltr"
      className={`inline-flex flex-col items-center leading-none ${className}`}
    >
      <span className="font-display text-2xl font-semibold tracking-wide">Wein&rsquo;s</span>
      <span className="mt-1 text-[0.625rem] font-semibold tracking-[0.35em] uppercase opacity-80">
        Barbershop
      </span>
    </span>
  );
}
