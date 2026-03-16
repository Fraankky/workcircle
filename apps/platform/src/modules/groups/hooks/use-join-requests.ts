import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import type { JoinRequest } from "../types";

interface JoinRequestsState {
  requests: JoinRequest[];
  isLoading: boolean;
  error: string | null;
  approve: (requestId: string) => Promise<void>;
  reject: (requestId: string, reason?: string) => Promise<void>;
  refetch: () => void;
}

export function useJoinRequests(groupId: string): JoinRequestsState {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: qk.joinRequests(groupId),
    queryFn: () => api.list<JoinRequest>(`/api/groups/${groupId}/join-requests`),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: qk.joinRequests(groupId) });
    queryClient.invalidateQueries({ queryKey: qk.group(groupId) });
    queryClient.invalidateQueries({ queryKey: qk.myGroups() });
  };

  const approveMutation = useMutation({
    mutationFn: (requestId: string) =>
      api.patch(`/api/groups/${groupId}/join-requests/${requestId}`, { action: "approve" }),
    onSuccess: invalidate,
  });

  const rejectMutation = useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason?: string }) =>
      api.patch(`/api/groups/${groupId}/join-requests/${requestId}`, {
        action: "reject",
        rejectionReason: reason,
      }),
    onSuccess: invalidate,
  });

  return {
    requests: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof ApiError
      ? query.error.message
      : query.error instanceof Error
        ? query.error.message
        : null,
    approve: (requestId) => approveMutation.mutateAsync(requestId).then(() => {}),
    reject: (requestId, reason) => rejectMutation.mutateAsync({ requestId, reason }).then(() => {}),
    refetch: query.refetch,
  };
}
