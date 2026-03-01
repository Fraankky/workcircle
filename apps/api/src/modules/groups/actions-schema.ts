import { z } from "zod";

export const kickMemberSchema = z.object({
  userId: z.string().uuid(),
});

export type KickMemberInput = z.infer<typeof kickMemberSchema>;
