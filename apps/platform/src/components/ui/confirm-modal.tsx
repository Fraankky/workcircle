import { Modal } from "./modal";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  danger?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  message,
  confirmLabel = "Konfirmasi",
  isLoading = false,
  danger = true,
}: ConfirmModalProps) {
  async function handleConfirm() {
    await onConfirm();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm text-fg leading-relaxed">{message}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 text-sm border border-border text-muted py-2.5 rounded hover:bg-overlay transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-50 ${
              danger
                ? "bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20"
                : "bg-fg text-bg hover:opacity-85"
            }`}
          >
            {isLoading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
