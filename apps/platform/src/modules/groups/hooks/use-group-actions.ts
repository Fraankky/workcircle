import { useState } from "react";
import { api, ApiError } from "../../../lib/api-client";

export function useGroupActions(groupId: string, onSuccess?: () => void) {
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isKicking, setIsKicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const join = async (message?: string) => {
    setIsJoining(true);
    setError(null);
    try {
      await api.post(`/api/groups/${groupId}/join-requests`, { message });
      onSuccess?.();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal bergabung");
      throw e;
    } finally {
      setIsJoining(false);
    }
  };

  const leave = async () => {
    setIsLeaving(true);
    setError(null);
    try {
      await api.post(`/api/groups/${groupId}/leave`);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal keluar");
      throw e;
    } finally {
      setIsLeaving(false);
    }
  };

  const kick = async (userId: string) => {
    setIsKicking(true);
    setError(null);
    try {
      await api.post(`/api/groups/${groupId}/kick`, { user_id: userId });
      onSuccess?.();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal mengeluarkan anggota");
      throw e;
    } finally {
      setIsKicking(false);
    }
  };

  return { join, leave, kick, isJoining, isLeaving, isKicking, error };
}
