export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="max-w-2xl space-y-5 leading-relaxed text-ink-soft md:ml-[calc(100%/12)] [&_h2]:pt-6 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
