import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";

export function useGroupActions(groupId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: qk.group(groupId) });
    queryClient.invalidateQueries({ queryKey: qk.groupRequest(groupId) });
    queryClient.invalidateQueries({ queryKey: qk.myGroups() });
    queryClient.invalidateQueries({ queryKey: ["groups"] });
    onSuccess?.();
  };

  const joinMutation = useMutation({
    mutationFn: (message?: string) =>
      api.post(`/api/groups/${groupId}/join-requests`, { message }),
    onSuccess: invalidate,
  });

  const leaveMutation = useMutation({
    mutationFn: () => api.post(`/api/groups/${groupId}/leave`),
    onSuccess: invalidate,
  });

  const kickMutation = useMutation({
    mutationFn: (userId: string) =>
      api.post(`/api/groups/${groupId}/kick`, { user_id: userId }),
    onSuccess: invalidate,
  });

  const error =
    (joinMutation.error instanceof ApiError ? joinMutation.error.message : null) ??
    (leaveMutation.error instanceof ApiError ? leaveMutation.error.message : null) ??
    (kickMutation.error instanceof ApiError ? kickMutation.error.message : null) ??
    (joinMutation.error instanceof Error ? joinMutation.error.message : null) ??
    (leaveMutation.error instanceof Error ? leaveMutation.error.message : null) ??
    (kickMutation.error instanceof Error ? kickMutation.error.message : null) ??
    null;

  return {
    join: (message?: string) => joinMutation.mutateAsync(message),
    leave: () => leaveMutation.mutateAsync(),
    kick: (userId: string) => kickMutation.mutateAsync(userId),
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
    isKicking: kickMutation.isPending,
    error,
  };
}
