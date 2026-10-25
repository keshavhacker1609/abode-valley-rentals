import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { getSiteConfig } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Terms of use", description: "Terms for using this website and our rental brokerage services.", path: "/terms" });

export default function TermsPage() {
  const site = getSiteConfig();
  return (
    <>
      <PageHeader label="Legal" title="Terms of use" intro="Last updated: review this page with your legal adviser before launch." />
      <Prose>
        <p><strong>{site.name} is an independent rental broker. We are not affiliated with the developer of Abode Valley or with Stanza Living.</strong></p>
        <h2>Listings</h2>
        <p>Flat details, rents, deposits and availability are supplied by owners and can change without notice. Photos may be representative. Please confirm everything on your visit and in the rental agreement, which is the only binding document.</p>
        <h2>Brokerage</h2>
        <p>Our fee is one month&rsquo;s rent plus applicable GST, payable by the tenant when the rental agreement is signed. Visits and shortlisting are free.</p>
        <h2>Token advances</h2>
        <p>Any token advance is paid to the owner against a written receipt and is governed by the terms agreed with that owner.</p>
        <h2>Liability</h2>
        <p>We take care to keep information accurate but are not liable for decisions made solely on the basis of this website.</p>
        <h2>Contact</h2>
        <p>{site.address} · <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
      </Prose>
    </>
  );
}
