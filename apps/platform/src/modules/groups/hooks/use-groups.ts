import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
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
  const { category, search, sort } = filters;

  const query = useQuery({
    queryKey: qk.groups({ category, search, sort }),
    queryFn: () => {
      const params = new URLSearchParams({ page: "1", limit: "20" });
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);
      return api.list<Group>(`/api/groups?${params}`);
    },
  });

  return {
    groups: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}
