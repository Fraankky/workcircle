import { z } from "zod";

export const submitJoinRequestSchema = z.object({
  message: z.string().max(500).optional(),
});

export const reviewJoinRequestSchema = z.object({
  action: z.enum(["approve", "reject"]),
  rejectionReason: z.string().max(500).optional(),
});

export const listJoinRequestsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type SubmitJoinRequestInput = z.infer<typeof submitJoinRequestSchema>;
export type ReviewJoinRequestInput = z.infer<typeof reviewJoinRequestSchema>;
export type ListJoinRequestsQuery = z.infer<typeof listJoinRequestsQuerySchema>;
