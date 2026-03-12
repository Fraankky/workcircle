import { useState } from "react";
import { PlanCard } from "../../modules/subscriptions/components/plan-card";
import { useSubscription } from "../../modules/subscriptions/hooks/use-subscription";
import { useAuth } from "../../modules/auth/hooks";
import { formatRelative } from "../../lib/utils";
import { PageHeader } from "../../components/ui/page-header";

export function UpgradePage() {
  const { user } = useAuth();
  const { subscription, upgrade, cancel } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const currentPlan = (user?.plan === "team" ? "pro" : user?.plan) ?? "free";

  async function handleUpgrade(plan: "pro") {
    setIsLoading(true);
    try {
      await upgrade(plan);
      // upgrade() redirects to Mayar — page will navigate away
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal membuat link pembayaran");
      setIsLoading(false);
    }
    // Don't set loading false on success — user is being redirected to Mayar
  }

  async function handleCancel() {
    if (!confirm("Yakin ingin membatalkan langganan?")) return;
    setIsLoading(true);
    try {
      await cancel();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal membatalkan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-12">
      <PageHeader title="Paket & Langganan" subtitle="Pilih paket yang sesuai dengan kebutuhanmu" />

      {/* Current plan info */}
      {subscription && currentPlan !== "free" && (
        <div className="bg-overlay border border-border/30 rounded px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-fg">
              Plan aktif: {currentPlan.toUpperCase()}
            </p>
            <p className="text-[10px] text-faint mt-0.5">
              Aktif hingga {formatRelative(subscription.current_period_end)}
            </p>
          </div>
          {subscription.status === "active" && (
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="text-xs text-danger/60 hover:text-danger disabled:opacity-50 transition-colors"
            >
              Batalkan
            </button>
          )}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["free", "pro"] as const).map((key) => (
          <PlanCard
            key={key}
            planKey={key}
            currentPlan={currentPlan}
            recommended={key === "pro"}
            onUpgrade={handleUpgrade}
            isLoading={isLoading}
          />
        ))}
      </div>

      <p className="text-[10px] text-faint text-center">
        Pembayaran diproses secara aman melalui Mayar.id. Kamu akan diarahkan ke halaman pembayaran Mayar.
      </p>
    </div>
  );
}
