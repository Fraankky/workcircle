export interface GroupAdmin {
  id: string;
  name: string;
  avatar_url: string | null;
  job_title: string | null;
  company: string | null;
}

export interface GroupSpace {
  id: string;
  name: string;
  area: string;
  address?: string | null;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  schedule: string;
  time_start: string;
  time_end: string;
  max_members: number;
  member_count: number;
  vibe: string | null;
  is_open: boolean;
  tags: string[];
  color: string;
  require_approval: boolean;
  chat_link?: string | null;
  chat_type?: string | null;
  pending_count?: number;
  created_at: string;
  updated_at?: string;
  admin: GroupAdmin;
  space: GroupSpace | null;
  members?: GroupMember[];
}

export interface GroupMember {
  id: string;
  role: "admin" | "member";
  joined_at: string;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    job_title: string | null;
    company: string | null;
  };
}

export interface JoinRequest {
  id: string;
  status: "pending" | "approved" | "rejected";
  message: string | null;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    job_title: string | null;
    company: string | null;
    location: string | null;
    bio: string | null;
  };
}

export interface ListMeta {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}
