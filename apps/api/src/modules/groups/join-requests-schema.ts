import { z } from "zod";

export const submitJoinRequestSchema = z.object({
  message: z.string().max(500).optional(),
});

export const reviewJoinRequestSchema = z.object({
  action: z.enum(["approve", "reject"]),
  rejectionReason: z.string().max(500).optional(),
});

export type SubmitJoinRequestInput = z.infer<typeof submitJoinRequestSchema>;
export type ReviewJoinRequestInput = z.infer<typeof reviewJoinRequestSchema>;
