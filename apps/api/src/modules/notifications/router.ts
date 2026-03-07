import { Hono } from "hono";
import type { Context } from "../../types.js";
import { requireAuth } from "../../middleware/auth.js";
import {
  listNotifications,
  markNotificationRead,
  markAllRead,
} from "./service.js";

export const notificationsRouter = new Hono<Context>()

  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { notifications, unreadCount } = await listNotifications(user.id);
    return c.json({
      data: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        link_url: n.linkUrl,
        is_read: n.isRead,
        created_at: n.createdAt.toISOString(),
      })),
      meta: { unread_count: unreadCount },
    });
  })

  .post("/read-all", requireAuth, async (c) => {
    const user = c.get("user")!;
    await markAllRead(user.id);
    return c.json({ data: { ok: true } });
  })

  .post("/:id/read", requireAuth, async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    await markNotificationRead(id, user.id);
    return c.json({ data: { ok: true } });
  });
