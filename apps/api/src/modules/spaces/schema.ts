import { z } from "zod";

export const listSpacesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  area: z.string().optional(),
});

export type ListSpacesQuery = z.infer<typeof listSpacesQuerySchema>;
