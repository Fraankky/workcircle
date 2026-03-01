import { useState, useEffect, useCallback } from "react";
import { api } from "../../../lib/api-client";
import type { ListMeta } from "../../../lib/api-client";
import type { Group } from "../types";

interface Filters {
  category?: string;
  search?: string;
  sort?: "recent" | "popular";
}

interface UseGroupsResult {
  groups: Group[];
  meta: ListMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGroups(filters: Filters = {}): UseGroupsResult {
  const [groups, setGroups] = useState<Group[]>([]);
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: "1", limit: "20" });
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.sort) params.set("sort", filters.sort);

    api
      .list<Group>(`/api/groups?${params}`)
      .then(({ data, meta }) => {
        if (cancelled) return;
        setGroups(data);
        setMeta(meta);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message ?? "Gagal memuat grup");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.search, filters.sort, tick]);

  return { groups, meta, isLoading, error, refetch };
}
