export interface Subscription {
  id: string;
  plan: "free" | "pro" | "team";
  status: "active" | "canceled" | "past_due";
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}
