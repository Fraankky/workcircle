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

export interface ActiveGroupBrief {
  id: string;
  name: string;
  category: string;
  schedule: string;
  is_open: boolean;
  color: string;
}

export interface SpaceDetail extends Omit<Space, "active_groups"> {
  active_groups_count: number;
  active_groups: ActiveGroupBrief[];
}
