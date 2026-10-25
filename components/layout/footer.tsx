import Link from "next/link";
import { getSiteConfig } from "@/lib/site";
import { NAV, SECONDARY_NAV } from "./nav";
import { Logo } from "./logo";

export function Footer() {
  const site = getSiteConfig();
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-32 overflow-hidden bg-forest-deep text-on-forest grain">
      <div className="container pb-28 pt-20 lg:pb-12">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-display-md text-balance">Find your flat at Abode Valley, without the runaround.</p>
            <ul className="mt-8 space-y-4 text-on-forest/85">
              {site.team.map((b) => (
                <li key={b.id}>
                  <p className="font-medium text-on-forest">{b.name}</p>
                  <p className="text-sm">
                    <a className="link-underline" href={`tel:+${b.phone}`}>{b.phoneDisplay}</a>
                    <span className="mx-2 opacity-40">·</span>
                    <a className="link-underline break-all" href={`mailto:${b.email}`}>{b.email}</a>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-1 text-on-forest/80">
              <p className="max-w-xs text-sm leading-relaxed">{site.address}</p>
              <p className="text-sm">{site.hours}</p>
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            <div>
              <p className="eyebrow mb-5 text-on-forest/60">Explore</p>
              <ul className="space-y-2.5">{NAV.map((n) => <li key={n.href}><Link className="link-underline" href={n.href}>{n.label}</Link></li>)}</ul>
            </div>
            <div>
              <p className="eyebrow mb-5 text-on-forest/60">More</p>
              <ul className="space-y-2.5">{SECONDARY_NAV.map((n) => <li key={n.href}><Link className="link-underline" href={n.href}>{n.label}</Link></li>)}</ul>
            </div>
            <div>
              <p className="eyebrow mb-5 text-on-forest/60">Popular searches</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link className="link-underline" href="/listings?type=3BHK">3 BHK near SRM</Link></li>
                <li><Link className="link-underline" href="/listings?type=2.75BHK">2.75 BHK, Potheri</Link></li>
                <li><Link className="link-underline" href="/listings?tenant=Students">Flats for students</Link></li>
                <li><Link className="link-underline" href="/listings?furnish=Fully">Fully furnished</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-on-forest/15 pt-8 text-sm text-on-forest/70 md:flex-row md:items-center md:justify-between">
          <Logo name={site.name} />
          <p className="max-w-md md:text-center">Independent rental broker. Not affiliated with the developer or Stanza Living.</p>
          <div className="flex gap-5">
            <Link className="link-underline" href="/privacy">Privacy</Link>
            <Link className="link-underline" href="/terms">Terms</Link>
            <span>© {year}</span>
          </div>
        </div>
      </div>
      <p aria-hidden className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] leading-none text-on-forest/[0.04]">
        Abode Valley
      </p>
    </footer>
  );
}
