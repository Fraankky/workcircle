import { useState } from "react";
import { api, ApiError } from "../../../lib/api-client";
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
}

export function useCreateGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createGroup(data: CreateGroupData): Promise<Group> {
    setIsLoading(true);
    setError(null);
    try {
      return await api.post<Group>("/api/groups", data);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal membuat grup";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { createGroup, isLoading, error };
}
