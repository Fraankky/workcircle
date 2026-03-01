import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../../../lib/api-client";
import type { Space } from "../types";

interface UseSpacesOptions {
  area?: string;
}

export function useSpaces({ area }: UseSpacesOptions = {}) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (area) params.set("area", area);
      const path = `/api/spaces${area ? `?${params}` : ""}`;
      const res = await api.list<Space>(path);
      setSpaces(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat spaces");
    } finally {
      setIsLoading(false);
    }
  }, [area]);

  useEffect(() => {
    load();
  }, [load]);

  return { spaces, isLoading, error, refetch: load };
}
