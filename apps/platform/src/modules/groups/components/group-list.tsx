import type { Group } from "../types";
import { GroupCard } from "./group-card";
import { GroupCardSkeleton } from "../../../components/ui/skeleton";
import { ErrorState, EmptyState } from "../../../components/ui/error-state";

interface GroupListProps {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
}

export function GroupList({ groups, isLoading, error, emptyMessage }: GroupListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;

  if (groups.length === 0) {
    return (
      <EmptyState
        message={emptyMessage ?? "Belum ada grup yang ditemukan"}
        hint="Coba ubah filter atau kata pencarian"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}
