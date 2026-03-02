import type { Group } from "../types";
import { GroupCard } from "./group-card";
import { GroupCardSkeleton } from "../../../components/ui/skeleton";

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-[#6E7681]">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-[#58A6FF] hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-[#6E7681]">
          {emptyMessage ?? "Belum ada grup yang ditemukan"}
        </p>
        <p className="text-xs text-[#6E7681]/70 mt-1">Coba ubah filter atau kata pencarian</p>
      </div>
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
