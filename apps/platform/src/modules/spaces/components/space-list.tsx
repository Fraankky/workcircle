import type { Space } from "../types";
import { SpaceCard } from "./space-card";
import { SpaceCardSkeleton } from "../../../components/ui/skeleton";

interface SpaceListProps {
  spaces: Space[];
  isLoading: boolean;
  error: string | null;
}

export function SpaceList({ spaces, isLoading, error }: SpaceListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SpaceCardSkeleton key={i} />
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

  if (spaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-[#6E7681]">Tidak ada space ditemukan</p>
        <p className="text-xs text-[#6E7681]/70 mt-1">Coba ubah filter area</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
}
