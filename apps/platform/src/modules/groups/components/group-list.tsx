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
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-indigo-500 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3 opacity-40">🔍</div>
        <p className="text-sm font-medium text-gray-500">
          {emptyMessage ?? "Belum ada grup yang ditemukan"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Coba ubah filter atau kata pencarian</p>
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
