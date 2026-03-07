import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import type { Space } from "../types";

interface UseSpacesOptions {
  area?: string;
}

export function useSpaces({ area }: UseSpacesOptions = {}) {
  const query = useQuery({
    queryKey: qk.spaces(area),
    queryFn: () => {
      const params = new URLSearchParams();
      if (area) params.set("area", area);
      const path = `/api/spaces${area ? `?${params}` : ""}`;
      return api.list<Space>(path);
    },
  });

  return {
    spaces: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof ApiError
      ? query.error.message
      : query.error instanceof Error
        ? query.error.message
        : null,
    refetch: query.refetch,
  };
}
