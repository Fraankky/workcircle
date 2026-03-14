import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import type { Group } from "../types";

interface CreateGroupData {
  name: string;
  description: string;
  category: string;
  vibe?: string;
  tags?: string[];
  spaceId?: string;
  schedule: string;
  timeStart: string;
  timeEnd: string;
  maxMembers: number;
  chatLink?: string;
  chatType?: string;
  requireApproval?: boolean;
  coverUrl?: string;
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateGroupData) => api.post<Group>("/api/groups", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: qk.myGroups() });
    },
  });

  return {
    createGroup: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error instanceof Error
        ? mutation.error.message
        : null,
  };
}
