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
          <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-gray-400 text-center py-8">{error}</p>;
  }

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-3xl mb-2 opacity-40">✅</div>
        <p className="text-sm text-gray-400">Tidak ada permintaan bergabung</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">{pending.length} permintaan menunggu</p>
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
