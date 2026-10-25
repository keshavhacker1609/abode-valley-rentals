import { ShortlistView } from "@/components/flats/saved-lists";
import { PageHeader } from "@/components/ui/page-header";
import { RecentlyViewed } from "@/components/flat/recently-viewed";

export const metadata = { title: "Your shortlist", robots: { index: false } };

export default function ShortlistPage() {
  return (
    <>
      <PageHeader label="Shortlist" title="Flats you've saved." intro="Saved on this device. Share a flat's link with flatmates, or book one visit to see them all." />
      <ShortlistView />
      <RecentlyViewed />
    </>
  );
}
