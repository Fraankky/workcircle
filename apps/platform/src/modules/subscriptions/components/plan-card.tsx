import { PLANS } from "../../../lib/constants";
import { formatPrice } from "../../../lib/utils";

type PlanKey = "free" | "pro" | "team";

interface PlanCardProps {
  planKey: PlanKey;
  currentPlan: PlanKey;
  recommended?: boolean;
  onUpgrade: (plan: "pro" | "team") => void;
  isLoading: boolean;
}

export function PlanCard({
  planKey,
  currentPlan,
  recommended,
  onUpgrade,
  isLoading,
}: PlanCardProps) {
  const plan = PLANS[planKey];
  const isCurrent = currentPlan === planKey;
  const isDowngrade =
    (planKey === "free" && currentPlan !== "free") ||
    (planKey === "pro" && currentPlan === "team");

  return (
    <div
      className={`relative rounded border p-5 space-y-4 transition-colors ${
        recommended
          ? "border-[#58A6FF] bg-[#161B22]"
          : "border-[#30363D] bg-[#161B22]"
      }`}
    >
      {recommended && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1F3558] text-[#58A6FF] border border-[#58A6FF]/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
          Rekomendasi
        </span>
      )}

      <div>
        <h3 className="text-sm font-bold text-[#C9D1D9]">{plan.label}</h3>
        <p className="text-xl font-bold text-[#C9D1D9] mt-1">
          {plan.price === 0 ? (
            "Gratis"
          ) : (
            <>
              {formatPrice(plan.price)}
              <span className="text-xs font-normal text-[#6E7681]">/bulan</span>
            </>
          )}
        </p>
      </div>

      <ul className="space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-[#8B949E]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-[#3FB950] shrink-0 mt-0.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div className="w-full text-center text-xs font-medium text-[#6E7681] py-2 border border-[#30363D] rounded bg-[#21262D]">
          Plan Aktif
        </div>
      ) : isDowngrade || planKey === "free" ? null : (
        <button
          onClick={() => onUpgrade(planKey as "pro" | "team")}
          disabled={isLoading}
          className={`w-full text-xs font-semibold py-2.5 rounded transition-colors disabled:opacity-50 ${
            recommended
              ? "bg-[#58A6FF] text-[#0D1117] hover:bg-[#388BFD]"
              : "bg-[#21262D] text-[#C9D1D9] border border-[#30363D] hover:bg-[#30363D]"
          }`}
        >
          {isLoading ? "Memproses..." : `Pilih ${plan.label}`}
        </button>
      )}
    </div>
  );
}
