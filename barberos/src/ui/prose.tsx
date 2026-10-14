import type { ReactNode } from "react";

/** Long-form legal/informational text on a light surface. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl text-lg leading-relaxed [&_a]:font-semibold [&_a]:text-brass-deep [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-medium [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-6">
      {children}
    </div>
  );
}
