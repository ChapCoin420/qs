import type { ReactNode } from "react";

interface Props {
  label: string;
  title: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  tone?: "brass" | "brass-deep";
}

export function SectionHeading({ label, title, id, as: Tag = "h2", tone = "brass" }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p
        className={`eyebrow flex items-center gap-3 ${tone === "brass" ? "text-brass" : "text-brass-deep"}`}
      >
        <span className="rule" aria-hidden="true" />
        {label}
      </p>
      <Tag
        id={id}
        className="font-display text-4xl leading-[1.1] font-medium text-balance sm:text-5xl"
      >
        {title}
      </Tag>
    </div>
  );
}
