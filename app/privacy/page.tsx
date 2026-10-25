import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { getSiteConfig } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Privacy policy", description: "How we collect, use and protect your personal data.", path: "/privacy" });

export default function PrivacyPage() {
  const site = getSiteConfig();
  return (
    <>
      <PageHeader label="Legal" title="Privacy policy" intro="Last updated: review this page with your legal adviser before launch." />
      <Prose>
        <p>{site.name} (&ldquo;we&rdquo;) is an independent rental broker. This policy explains what we collect when you use this website and how we use it, in line with India&rsquo;s Digital Personal Data Protection Act, 2023.</p>
        <h2>What we collect</h2>
        <ul><li>Details you give us in forms: name, phone, email, budget, move-in date and messages.</li><li>Flats you shortlist, compare or view. These are stored only in your browser (localStorage) and never sent to us.</li><li>Basic server logs (IP address, browser) kept for security for up to 30 days.</li></ul>
        <h2>How we use it</h2>
        <p>Only to respond to your enquiry, arrange visits, and prepare rental paperwork. With your consent we share your name and number with the owner of a flat you want to rent. We never sell your data.</p>
        <h2>Third parties</h2>
        <p>Map tiles are loaded from OpenStreetMap/CARTO and, on the location page, Google Maps. WhatsApp links open WhatsApp, which has its own privacy policy.</p>
        <h2>Your rights</h2>
        <p>You can ask us to see, correct or delete your data at any time: <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </Prose>
    </>
  );
}
