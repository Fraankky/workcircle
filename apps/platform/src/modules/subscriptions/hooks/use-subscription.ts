import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import { useAuth } from "../../auth/hooks";
import type { Subscription } from "../types";

export function useSubscription() {
  const { refetch: refetchUser } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: qk.subscription(),
    queryFn: async () => {
      try {
        return await api.get<Subscription>("/api/subscriptions/me");
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }
    },
  });

  const afterMutation = async (sub: Subscription) => {
    queryClient.setQueryData(qk.subscription(), sub);
    await refetchUser();
  };

  const upgradeMutation = useMutation({
    mutationFn: async (plan: "pro" | "team") => {
      const { checkoutUrl } = await api.post<{ checkoutUrl: string }>(
        "/api/subscriptions/checkout",
        { plan }
      );
      // Redirect to Mayar checkout page
      window.location.href = checkoutUrl;
      // Return a placeholder — page navigates away before this resolves
      return null as unknown as Subscription;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.post<Subscription>("/api/subscriptions/cancel"),
    onSuccess: afterMutation,
  });

  return {
    subscription: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof ApiError
      ? query.error.message
      : query.error instanceof Error
        ? query.error.message
        : null,
    upgrade: (plan: "pro" | "team") => upgradeMutation.mutateAsync(plan),
    cancel: () => cancelMutation.mutateAsync(),
    refetch: query.refetch,
  };
}
