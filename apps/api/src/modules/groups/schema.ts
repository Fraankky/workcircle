import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  category: z.enum(["tech", "creative", "business", "productivity", "casual"]),
  vibe: z.string().optional(),
  tags: z.array(z.string()).default([]),
  schedule: z.string().min(1),
  timeStart: z.string().min(1),
  timeEnd: z.string().min(1),
  maxMembers: z.coerce.number().int().min(2).max(50).default(8),
  spaceId: z.string().uuid().optional(),
  chatLink: z.string().url().optional(),
  chatType: z.enum(["whatsapp", "telegram", "discord"]).optional(),
  requireApproval: z.boolean().default(true),
  color: z.string().default("#635BFF"),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(2000).optional(),
  category: z.enum(["tech", "creative", "business", "productivity", "casual"]).optional(),
  vibe: z.string().optional(),
  tags: z.array(z.string()).optional(),
  schedule: z.string().optional(),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
  maxMembers: z.coerce.number().int().min(2).max(50).optional(),
  spaceId: z.string().uuid().nullish(),
  chatLink: z.string().url().nullish(),
  chatType: z.enum(["whatsapp", "telegram", "discord"]).nullish(),
  requireApproval: z.boolean().optional(),
  color: z.string().optional(),
});

export const listGroupsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  category: z.enum(["tech", "creative", "business", "productivity", "casual"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["recent", "popular"]).default("recent"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type ListGroupsQuery = z.infer<typeof listGroupsQuerySchema>;
