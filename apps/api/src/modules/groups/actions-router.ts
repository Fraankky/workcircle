import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Context } from "../../types.js";
import { requireAuth } from "../../middleware/auth.js";
import { kickMemberSchema } from "./actions-schema.js";
import { leaveGroup, kickMember } from "./actions-service.js";

// Mounted at /:id
export const actionsRouter = new Hono<Context>()

  .post("/leave", requireAuth, async (c) => {
    const user = c.get("user")!;
    const groupId = c.req.param("id")!;
    await leaveGroup(groupId, user.id);
    return c.json({ data: { message: "Berhasil keluar dari grup" } });
  })

  .post("/kick", requireAuth, zValidator("json", kickMemberSchema), async (c) => {
    const user = c.get("user")!;
    const groupId = c.req.param("id")!;
    const { userId: targetUserId } = c.req.valid("json");
    await kickMember(groupId, targetUserId, user.id);
    return c.json({ data: { message: "Member berhasil dikeluarkan" } });
  });
