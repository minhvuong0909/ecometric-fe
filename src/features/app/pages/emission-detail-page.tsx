import { Link } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { EMISSION_DETAIL_COPY } from "@/features/app/constants/app-copy";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function EmissionDetailPage() {
  const copy = EMISSION_DETAIL_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={[{ label: copy.eyebrow, active: true }]}
        title={copy.title}
        description={copy.description}
        actions={
          <>
            <Button variant="outline">{copy.exportCta}</Button>
            <Button className="bg-primary font-bold">{copy.recalculateCta}</Button>
          </>
        }
      />

      <AppPanel
        title={copy.tableTitle}
        description={copy.tableSubtitle}
        badge={
          <span className="rounded bg-secondary px-3 py-1 text-xs font-black tracking-wide text-primary uppercase">
            {copy.badge}
          </span>
        }
        bodyClassName="overflow-x-auto p-0"
      >
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {copy.columns.map((col) => (
                <th key={col} className="px-6 py-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.source} className="border-b border-border last:border-0">
                <td className="px-6 py-4 font-medium">{row.source}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.activity}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.factor}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-primary">
                    {row.scope}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">{row.result}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/30">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-right font-bold">
                Tổng cộng
              </td>
              <td className="px-6 py-4 text-lg font-bold text-primary">{copy.total}</td>
            </tr>
          </tfoot>
        </table>
      </AppPanel>

      <div className="flex justify-end">
        <Button asChild className="font-bold">
          <Link to={ROUTES.app.ecoScore}>Mở điểm số Eco</Link>
        </Button>
      </div>
    </div>
  );
}
