export const qk = {
  groups: (filters?: { category?: string; search?: string; sort?: string }) =>
    ["groups", filters] as const,
  group: (id: string) => ["group", id] as const,
  groupRequest: (id: string) => ["group-request", id] as const,
  joinRequests: (groupId: string) => ["join-requests", groupId] as const,
  myGroups: () => ["my-groups"] as const,
  spaces: (area?: string) => ["spaces", area] as const,
  spaceDetail: (id: string) => ["space", id] as const,
  subscription: () => ["subscription"] as const,
  notifications: () => ["notifications"] as const,
  adminStats: () => ["admin", "stats"] as const,
  adminUsers: (page?: number, search?: string) => ["admin", "users", page, search] as const,
  adminSpaces: (page?: number, search?: string) => ["admin", "spaces", page, search] as const,
  adminGroups: (page?: number, search?: string) => ["admin", "groups", page, search] as const,
};
