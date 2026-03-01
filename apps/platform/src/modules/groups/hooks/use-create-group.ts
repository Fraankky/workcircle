import { useState } from "react";
import { api, ApiError } from "../../../lib/api-client";
import type { Group } from "../types";

interface CreateGroupData {
  name: string;
  description: string;
  category: string;
  vibe?: string;
  tags?: string[];
  space_id?: string;
  schedule: string;
  time_start: string;
  time_end: string;
  max_members: number;
  chat_link?: string;
  chat_type?: string;
  require_approval?: boolean;
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
