import { useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { PlanCard } from "./plan-card";
import { useSubscription } from "../hooks/use-subscription";
import { useAuth } from "../../auth/hooks";
import { useToast } from "../../../components/ui/toast";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export function PremiumModal({ open, onClose }: PremiumModalProps) {
  const { user } = useAuth();
  const { upgrade } = useSubscription();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const currentPlan = (user?.plan ?? "free") as "free" | "pro";

  async function handleUpgrade(plan: "pro") {
    setIsLoading(true);
    try {
      await upgrade(plan);
      onClose();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Gagal upgrade", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Pilih Paket">
      <div className="space-y-4">
        <p className="text-sm text-muted">
          Upgrade untuk membuat dan mengelola grup kerjamu sendiri.
        </p>
        <div className="grid grid-cols-1 gap-4 pt-1">
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
      </div>
    </Modal>
  );
}
