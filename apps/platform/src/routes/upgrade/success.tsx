import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks";
import { PageHeader } from "../../components/ui/page-header";

export function UpgradeSuccessPage() {
  const { refetch } = useAuth();

  // Refetch user so the plan badge updates
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6">
      <div className="w-14 h-14 rounded border border-border bg-surface flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>
      <PageHeader
        title="Pembayaran Berhasil!"
        subtitle="Akun kamu telah diupgrade. Selamat menikmati fitur premium."
      />
      <p className="text-xs text-faint">
        Jika plan belum terupdate, tunggu beberapa detik lalu refresh halaman.
      </p>
      <div className="flex gap-3 justify-center pt-2">
        <Link
          to="/discover"
          className="px-5 py-2 bg-fg text-bg text-sm font-semibold rounded hover:opacity-85 transition-opacity"
        >
          Mulai Explore
        </Link>
        <Link
          to="/upgrade"
          className="px-5 py-2 bg-surface text-fg text-sm rounded border border-border hover:bg-overlay transition-colors"
        >
          Lihat Langganan
        </Link>
      </div>
    </div>
  );
}
