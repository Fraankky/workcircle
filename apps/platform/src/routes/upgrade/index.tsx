import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PlanCard } from "../../modules/subscriptions/components/plan-card";
import { useSubscription } from "../../modules/subscriptions/hooks/use-subscription";
import { useAuth } from "../../modules/auth/hooks";
import { formatRelative } from "../../lib/utils";
import { PageHeader } from "../../components/ui/page-header";

export function UpgradePage() {
  const { user } = useAuth();
  const { subscription, upgrade, cancel } = useSubscription();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const currentPlan = user?.plan ?? "free";

  async function handleUpgrade(plan: "pro" | "team") {
    setIsLoading(true);
    try {
      await upgrade(plan);
      navigate({ to: "/discover" });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal upgrade");
    } finally {
      setIsLoading(false);
    }
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
    <div className="max-w-2xl mx-auto space-y-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(["free", "pro", "team"] as const).map((key) => (
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
        Pembayaran diproses melalui Mayar.id. Upgrade ini adalah simulasi untuk demo.
      </p>
    </div>
  );
}
