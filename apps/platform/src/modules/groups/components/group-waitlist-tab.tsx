import { useJoinRequests } from "../hooks";
import { JoinRequestCard } from "./join-request-card";

interface GroupWaitlistTabProps {
  groupId: string;
}

export function GroupWaitlistTab({ groupId }: GroupWaitlistTabProps) {
  const { requests, isLoading, error, approve, reject } =
    useJoinRequests(groupId);

  const pending = requests.filter((r) => r.status === "pending");

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded bg-overlay animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-faint text-center py-8">{error}</p>;
  }

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-2xl mb-2 opacity-30">—</p>
        <p className="text-sm text-faint">Tidak ada permintaan bergabung</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-faint">{pending.length} permintaan menunggu</p>
      {pending.map((request) => (
        <JoinRequestCard
          key={request.id}
          request={request}
          onApprove={approve}
          onReject={reject}
        />
      ))}
    </div>
  );
}
