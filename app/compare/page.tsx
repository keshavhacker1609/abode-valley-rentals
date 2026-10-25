import { CompareView } from "@/components/flats/saved-lists";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = { title: "Compare flats", robots: { index: false } };

export default function ComparePage() {
  return (
    <>
      <PageHeader label="Compare" title="Side by side." />
      <CompareView />
    </>
  );
}
