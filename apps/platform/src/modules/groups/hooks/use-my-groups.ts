import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import type { Group } from "../types";

interface MyGroups {
  admin_groups: Group[];
  member_groups: Group[];
}

export function useMyGroups() {
  const query = useQuery({
    queryKey: qk.myGroups(),
    queryFn: () => api.get<MyGroups>("/api/groups/mine"),
  });

  return {
    admin_groups: query.data?.admin_groups ?? [],
    member_groups: query.data?.member_groups ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}
