import { Faq } from "@/components/ui/accordion";
import { PageHeader } from "@/components/ui/page-header";
import { getFaqs } from "@/lib/content";
import { faqLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/lib/jsonld";

export const metadata = pageMeta({
  title: "FAQ: renting at Abode Valley",
  description: "Brokerage, deposits, maintenance, 2.75 BHK explained, students and bachelors, documents and move-in times at Abode Valley, Kattankulathur.",
  path: "/faq",
});

export default function FaqPage() {
  const faqs = getFaqs();
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <PageHeader label="FAQ" title="Straight answers." intro="Can't see your question? WhatsApp us; we usually reply within the hour." />
      <div className="container"><div className="md:ml-[calc(100%/12)] md:w-[calc(100%*10/12)]"><Faq items={faqs} /></div></div>
    </>
  );
}
