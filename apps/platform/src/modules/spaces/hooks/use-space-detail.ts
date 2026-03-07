import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import type { SpaceDetail } from "../types";

export function useSpaceDetail(id: string) {
  const query = useQuery({
    queryKey: qk.spaceDetail(id),
    queryFn: () => api.get<SpaceDetail>(`/api/spaces/${id}`),
  });

  return {
    space: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof ApiError
      ? query.error.message
      : query.error instanceof Error
        ? query.error.message
        : null,
    refetch: query.refetch,
  };
}
