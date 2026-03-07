import { useQueries } from "@tanstack/react-query";
import { api, ApiError } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
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

  const [groupQuery, requestQuery] = useQueries({
    queries: [
      {
        queryKey: qk.group(id),
        queryFn: () => api.get<Group>(`/api/groups/${id}`),
      },
      {
        queryKey: qk.groupRequest(id),
        queryFn: async () => {
          try {
            return await api.get<JoinRequest>(`/api/groups/${id}/join-requests/me`);
          } catch (e) {
            if (e instanceof ApiError && e.status === 404) return null;
            throw e;
          }
        },
        retry: (failureCount: number, error: unknown) => {
          if (error instanceof ApiError && error.status === 404) return false;
          return failureCount < 1;
        },
      },
    ],
  });

  const group = groupQuery.data ?? null;
  const myRequest = requestQuery.data ?? null;
  const isAdmin = !!group && !!user && group.admin.id === user.id;
  const isMember =
    !!group &&
    !!user &&
    (group.admin.id === user.id ||
      (group.members?.some((m) => m.user.id === user.id) ?? false));

  return {
    group,
    myRequest,
    isLoading: groupQuery.isLoading,
    error: groupQuery.error instanceof Error ? groupQuery.error.message : null,
    isAdmin,
    isMember,
    refetch: groupQuery.refetch,
  };
}
