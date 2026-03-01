import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../../../lib/api-client";
import { useAuth } from "../../auth/hooks";
import type { Subscription } from "../types";

export function useSubscription() {
  const { refetch: refetchUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sub = await api.get<Subscription>("/api/subscriptions/me");
      setSubscription(sub);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setSubscription(null);
      } else {
        setError(err instanceof ApiError ? err.message : "Gagal memuat subscription");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function upgrade(plan: "pro" | "team"): Promise<Subscription> {
    const sub = await api.post<Subscription>("/api/subscriptions/upgrade", { plan });
    setSubscription(sub);
    await refetchUser();
    return sub;
  }

  async function cancel(): Promise<Subscription> {
    const sub = await api.post<Subscription>("/api/subscriptions/cancel");
    setSubscription(sub);
    await refetchUser();
    return sub;
  }

  return { subscription, isLoading, error, upgrade, cancel, refetch: load };
}
