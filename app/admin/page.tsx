import { AdminTable } from "@/components/admin/admin-table";
import { getFlats } from "@/lib/inventory";
import { overridesBackend, readOverrides } from "@/lib/overrides";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const [flats, overrides] = await Promise.all([getFlats(), readOverrides()]);
  return (
    <div className="container pb-20 pt-10">
      <AdminTable
        flats={flats.map(({ id, block, floor, type, status, rent, deposit, maintenance, availableFrom, furnishing }) => ({ id, block, floor, type, status, rent, deposit, maintenance, availableFrom, furnishing }))}
        edited={Object.fromEntries(Object.entries(overrides).map(([k, v]) => [k, v.updatedAt ?? ""]))}
        backend={overridesBackend}
        sheet={!!process.env.SHEET_CSV_URL}
      />
    </div>
  );
}
