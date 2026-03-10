import { Link } from "@tanstack/react-router";
import { PageHeader } from "../../components/ui/page-header";

export function UpgradeCancelPage() {
  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6">
      <div className="w-14 h-14 rounded border border-border bg-surface flex items-center justify-center mx-auto text-2xl">
        ×
      </div>
      <PageHeader
        title="Pembayaran Dibatalkan"
        subtitle="Kamu membatalkan proses pembayaran. Tidak ada yang ditagih."
      />
      <div className="flex gap-3 justify-center pt-2">
        <Link
          to="/upgrade"
          className="px-5 py-2 bg-fg text-bg text-sm font-semibold rounded hover:opacity-85 transition-opacity"
        >
          Coba Lagi
        </Link>
        <Link
          to="/discover"
          className="px-5 py-2 bg-surface text-fg text-sm rounded border border-border hover:bg-overlay transition-colors"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
