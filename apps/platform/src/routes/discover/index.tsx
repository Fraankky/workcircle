import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useGroups } from "../../modules/groups/hooks";
import { GroupList } from "../../modules/groups/components/group-list";
import { CategoryFilter } from "../../modules/groups/components/category-filter";
import { useAuth } from "../../modules/auth/hooks";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function DiscoverPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"recent" | "popular">("recent");
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const { groups, isLoading, error } = useGroups({
    category: category || undefined,
    search: debouncedSearch || undefined,
    sort,
  });

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Discover</h1>
          <p className="text-xs text-gray-400 mt-0.5">Temukan komunitas kerja barengmu</p>
        </div>
        {user?.plan !== "free" && (
          <Link
            to="/groups/new"
            className="inline-flex items-center gap-1.5 bg-indigo-500 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Grup
          </Link>
        )}
      </div>

      {/* Search + sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            placeholder="Cari grup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "recent" | "popular")}
          className="text-xs border border-gray-200 rounded-lg px-2 py-2 text-gray-600 bg-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="recent">Terbaru</option>
          <option value="popular">Terpopuler</option>
        </select>
      </div>

      {/* Category filter */}
      <CategoryFilter selected={category} onChange={setCategory} />

      {/* Result count */}
      {!isLoading && !error && (
        <p className="text-xs text-gray-400">
          {groups.length} grup ditemukan
        </p>
      )}

      {/* Group list */}
      <GroupList groups={groups} isLoading={isLoading} error={error} />
    </div>
  );
}
