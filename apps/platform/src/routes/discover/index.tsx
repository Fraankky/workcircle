import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { PremiumModal } from "../../modules/subscriptions/components/premium-modal";
import { useGroups } from "../../modules/groups/hooks";
import { GroupCard } from "../../modules/groups/components/group-card";
import { GroupCardSkeleton } from "../../components/ui/skeleton";
import { ErrorState, EmptyState } from "../../components/ui/error-state";
import { CategoryFilter } from "../../modules/groups/components/category-filter";
import { useAuth } from "../../modules/auth/hooks";
import { useDebounce } from "../../lib/hooks/use-debounce";
import { PageHeader } from "../../components/ui/page-header";

export function DiscoverPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"recent" | "popular">("recent");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useGroups({
    category: category || undefined,
    search: debouncedSearch || undefined,
    sort,
  });

  const groups = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;

  // IntersectionObserver — auto-load next page when sentinel is visible
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div className="space-y-5 p-6">
      <PageHeader title="Discover" subtitle="Temukan komunitas kerja barengmu">
        {user?.plan === "free" ? (
          <button
            onClick={() => setShowUpgrade(true)}
            className="inline-flex items-center gap-1.5 text-muted text-xs font-medium px-3 py-2 rounded border border-border hover:border-ascent hover:text-fg transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Buat Grup
          </button>
        ) : (
          <Link
            to="/groups/new"
            className="inline-flex items-center gap-1.5 text-black text-xs font-medium px-3 py-2 rounded hover:bg-accent-glow transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Grup
          </Link>
        )}
      </PageHeader>
      <PremiumModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />

      {/* Search + sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Cari grup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded border border-border bg-surface text-fg placeholder-muted focus:border-ascent focus:outline-none transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "recent" | "popular")}
          className="text-xs border border-border rounded px-2 py-2 text-muted bg-surface focus:border-ascent focus:outline-none"
        >
          <option value="recent">Terbaru</option>
          <option value="popular">Terpopuler</option>
        </select>
      </div>

      {/* Category filter */}
      <CategoryFilter selected={category} onChange={setCategory} />

      {/* Result count */}
      {!isLoading && !error && (
        <p className="text-xs text-faint">
          {groups.length} dari {total} grup
        </p>
      )}

      {/* Group list */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GroupCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error instanceof Error ? error.message : "Gagal memuat grup"} />
      ) : groups.length === 0 ? (
        <EmptyState
          message="Belum ada grup yang ditemukan"
          hint="Coba ubah filter atau kata pencarian"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-border border-t-fg/50 rounded-full animate-spin" />
        </div>
      )}

      {/* End of results */}
      {!hasNextPage && groups.length > 0 && !isLoading && (
        <p className="text-center text-xs text-faint py-4">
          Semua {total} grup sudah ditampilkan
        </p>
      )}
    </div>
  );
}
