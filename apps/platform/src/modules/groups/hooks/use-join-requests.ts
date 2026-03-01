import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../../../lib/api-client";
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
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.list<JoinRequest>(
        `/api/groups/${groupId}/join-requests`,
      );
      setRequests(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat waitlist");
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (requestId: string) => {
    await api.patch(`/api/groups/${groupId}/join-requests/${requestId}`, {
      action: "approve",
    });
    load();
  };

  const reject = async (requestId: string, reason?: string) => {
    await api.patch(`/api/groups/${groupId}/join-requests/${requestId}`, {
      action: "reject",
      rejection_reason: reason,
    });
    load();
  };

  return { requests, isLoading, error, approve, reject, refetch: load };
}
