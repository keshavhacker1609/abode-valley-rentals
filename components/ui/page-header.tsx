import { SplitHeading } from "./split-heading";

export function PageHeader({ label, title, intro, children }: { label: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="container pb-12 pt-36 md:pb-16 md:pt-44">
      <p className="eyebrow mb-6 flex items-center gap-4">
        <span className="h-px w-10 bg-ink/30" aria-hidden />
        {label}
      </p>
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <SplitHeading as="h1" onScroll={false} className="text-display-lg md:col-span-8">{title}</SplitHeading>
        {intro && <p className="text-pretty text-lg leading-relaxed text-ink-soft md:col-span-4">{intro}</p>}
      </div>
      {children}
    </header>
  );
}
