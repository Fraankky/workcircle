import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Context } from "../../types.js";
import { requireAuth } from "../../middleware/auth.js";
import { createPresignedPutUrl } from "../../utils/r2.js";

const presignSchema = z.object({
  type: z.enum(["avatar", "group-cover"]),
  contentType: z.enum(["image/jpeg", "image/webp", "image/png"]),
});

export const uploadRouter = new Hono<Context>()

  .post("/presign", requireAuth, zValidator("json", presignSchema), async (c) => {
    const user = c.get("user")!;
    const { type, contentType } = c.req.valid("json");

    const ext = "webp";
    const uuid = crypto.randomUUID();

    const key =
      type === "avatar"
        ? `avatars/${user.id}/${uuid}.${ext}`
        : `covers/${uuid}.${ext}`;

    const { uploadUrl, publicUrl } = await createPresignedPutUrl(key, contentType);

    return c.json({ data: { uploadUrl, publicUrl } });
  });
