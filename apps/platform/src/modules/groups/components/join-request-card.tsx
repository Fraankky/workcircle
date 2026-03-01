import { useState } from "react";
import { Avatar } from "../../../components/ui/avatar";
import { formatRelative } from "../../../lib/utils";
import type { JoinRequest } from "../types";

interface JoinRequestCardProps {
  request: JoinRequest;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason?: string) => Promise<void>;
}

export function JoinRequestCard({
  request,
  onApprove,
  onReject,
}: JoinRequestCardProps) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = request;

  async function handleApprove() {
    setBusy(true);
    try {
      await onApprove(request.id);
    } finally {
      setBusy(false);
    }
  }

  async function handleReject() {
    if (!rejecting) {
      setRejecting(true);
      return;
    }
    setBusy(true);
    try {
      await onReject(request.id, reason || undefined);
      setRejecting(false);
      setReason("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar src={user.avatar_url} name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            {(user.job_title || user.company) && (
              <p className="text-xs text-gray-400 truncate">
                {[user.job_title, user.company].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
        <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
          {formatRelative(request.created_at)}
        </span>
      </div>

      {request.message && (
        <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 leading-relaxed">
          "{request.message}"
        </p>
      )}

      {rejecting && (
        <input
          type="text"
          placeholder="Alasan penolakan (opsional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      )}

      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={busy || rejecting}
          className="flex-1 text-xs font-medium bg-indigo-500 text-white rounded-lg py-2 hover:bg-indigo-600 disabled:opacity-50 transition-colors"
        >
          Terima
        </button>
        <button
          onClick={handleReject}
          disabled={busy}
          className="flex-1 text-xs font-medium border border-gray-200 text-gray-600 rounded-lg py-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {rejecting ? "Konfirmasi Tolak" : "Tolak"}
        </button>
        {rejecting && (
          <button
            onClick={() => { setRejecting(false); setReason(""); }}
            className="text-xs text-gray-400 hover:text-gray-600 px-2"
          >
            Batal
          </button>
        )}
      </div>
    </div>
  );
}
