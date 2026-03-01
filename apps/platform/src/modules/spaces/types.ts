export interface Space {
  id: string;
  name: string;
  area: string;
  address: string | null;
  wifi_speed: "slow" | "medium" | "fast";
  noise_level: "quiet" | "medium" | "loud";
  has_power: boolean;
  price_range: string | null;
  rating: number;
  seat_count: number | null;
  active_groups: number;
  created_at: string;
}
