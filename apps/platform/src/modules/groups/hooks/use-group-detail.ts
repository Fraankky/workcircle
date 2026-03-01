import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../../../lib/api-client";
import { useAuth } from "../../auth/hooks";
import type { Group, JoinRequest } from "../types";

interface GroupDetailState {
  group: Group | null;
  myRequest: JoinRequest | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isMember: boolean;
  refetch: () => void;
}

export function useGroupDetail(id: string): GroupDetailState {
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [myRequest, setMyRequest] = useState<JoinRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [groupResult, requestResult] = await Promise.allSettled([
        api.get<Group>(`/api/groups/${id}`),
        api.get<JoinRequest>(`/api/groups/${id}/join-requests/me`),
      ]);

      if (groupResult.status === "fulfilled") {
        setGroup(groupResult.value);
      } else {
        throw groupResult.reason;
      }

      if (requestResult.status === "fulfilled") {
        setMyRequest(requestResult.value);
      } else if (
        requestResult.reason instanceof ApiError &&
        requestResult.reason.status === 404
      ) {
        setMyRequest(null);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat grup");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isAdmin = !!group && !!user && group.admin.id === user.id;
  const isMember =
    !!group &&
    !!user &&
    (group.admin.id === user.id ||
      (group.members?.some((m) => m.user.id === user.id) ?? false));

  return { group, myRequest, isLoading, error, isAdmin, isMember, refetch: load };
}
