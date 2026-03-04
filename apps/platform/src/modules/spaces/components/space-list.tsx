import type { Space } from "../types";
import { SpaceCard } from "./space-card";
import { SpaceCardSkeleton } from "../../../components/ui/skeleton";
import { ErrorState, EmptyState } from "../../../components/ui/error-state";

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

  if (error) return <ErrorState message={error} />;

  if (spaces.length === 0) {
    return <EmptyState message="Tidak ada space ditemukan" hint="Coba ubah filter area" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
}
