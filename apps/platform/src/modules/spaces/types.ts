export interface Space {
  id: string;
  name: string;
  area: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  wifi_speed: "slow" | "medium" | "fast" | "very_fast";
  noise_level: "quiet" | "medium" | "buzzy" | "loud";
  has_power: boolean;
  price_range: string | null;
  rating: number;
  seat_count: number | null;
  active_groups: number;
  created_at: string;
}
