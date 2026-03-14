import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import { useAuth } from "../../auth/hooks";
import type { Notification, NotificationsMeta } from "../types";

interface NotificationsResponse {
  data: Notification[];
  meta: NotificationsMeta;
}

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: qk.notifications(),
    queryFn: () => api.list<Notification>("/api/notifications") as unknown as Promise<NotificationsResponse>,
    refetchInterval: 30_000,
    enabled: isAuthenticated,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post("/api/notifications/read-all"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.notifications() }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.post(`/api/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.notifications() }),
  });

  return {
    notifications: query.data?.data ?? [],
    unreadCount: query.data?.meta.unread_count ?? 0,
    isLoading: query.isLoading,
    markAllRead: () => markAllReadMutation.mutate(),
    markRead: (id: string) => markReadMutation.mutate(id),
  };
}
