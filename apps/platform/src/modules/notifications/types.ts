export interface Notification {
  id: string;
  type: "join_approved" | "join_rejected" | "new_member" | "group_closed";
  title: string;
  body: string;
  link_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsMeta {
  unread_count: number;
}
