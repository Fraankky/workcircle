import { z } from "zod";

export const upgradeSchema = z.object({
  plan: z.enum(["pro", "team"]),
});

export type UpgradeInput = z.infer<typeof upgradeSchema>;
