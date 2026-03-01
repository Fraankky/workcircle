import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../../../lib/api-client";
import type { Group } from "../types";

interface MyGroups {
  admin_groups: Group[];
  member_groups: Group[];
}

export function useMyGroups() {
  const [data, setData] = useState<MyGroups>({ admin_groups: [], member_groups: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.get<MyGroups>("/api/groups/mine");
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat grup");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, isLoading, error, refetch: load };
}
