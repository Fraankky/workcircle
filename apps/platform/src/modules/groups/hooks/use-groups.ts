import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import type { Group } from "../types";

interface Filters {
  category?: string;
  search?: string;
  sort?: "recent" | "popular";
}

const PAGE_SIZE = 12;

export function useGroups(filters: Filters = {}) {
  const { category, search, sort } = filters;

  return useInfiniteQuery({
    queryKey: qk.groups({ category, search, sort }),
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams({ page: String(pageParam), limit: String(PAGE_SIZE) });
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);
      return api.list<Group>(`/api/groups?${params}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.meta.has_more ? allPages.length + 1 : undefined,
  });
}
