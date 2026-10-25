import Image from "next/image";
import { OwnerForm } from "@/components/forms/owner-form";
import { PageHeader } from "@/components/ui/page-header";
import { blurProps } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "List your Abode Valley flat for rent",
  description: "Own a flat at Abode Valley? We find verified tenants, handle agreements and inspections, and keep you updated. No fee to list.",
  path: "/owners",
});

const POINTS = [
  ["Free to list", "Owners pay nothing to list. The tenant pays our fee when the agreement is signed."],
  ["Verified tenants", "ID, employer or college and previous-landlord checks before we bring anyone to your door."],
  ["Paperwork handled", "Agreement drafting, registration, police verification and a photo inventory at handover."],
  ["You stay in control", "You approve every tenant. We update the listing the moment you tell us something changed."],
];

export default function OwnersPage() {
  return (
    <>
      <PageHeader label="For owners" title="Let your flat to good tenants, without the phone calls." />
      <div className="container grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src="/images/exterior/owner-handover.webp" alt="Keys being handed over at an Abode Valley flat" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" {...blurProps("/images/exterior/owner-handover.webp")} />
          </div>
          <dl className="mt-10 space-y-6">
            {POINTS.map(([t, d], i) => (
              <div key={t} className="grid grid-cols-[2.5rem_1fr] border-t border-line pt-5">
                <span className="text-xs tabular-nums text-ink-soft">0{i + 1}</span>
                <div><dt className="font-display text-2xl">{t}</dt><dd className="mt-1 text-ink-soft">{d}</dd></div>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-7"><OwnerForm /></div>
      </div>
    </>
  );
}
