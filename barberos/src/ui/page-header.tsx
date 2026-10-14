import { Container } from "./container";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="surface-dark grain border-b border-linen/10 pt-20 pb-16 sm:pt-28 sm:pb-20">
      <Container>
        {eyebrow && (
          <p className="eyebrow mb-6 flex items-center gap-3 text-brass">
            <span className="rule" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-5xl leading-[1.05] font-medium sm:text-7xl">{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-lg text-linen/85 sm:text-xl">{lead}</p>}
      </Container>
    </section>
  );
}
