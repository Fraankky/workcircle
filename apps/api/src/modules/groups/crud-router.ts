import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Context } from "../../types.js";
import { requireAuth } from "../../middleware/auth.js";
import { NotFoundError, ForbiddenError } from "../../exceptions.js";
import { createGroupSchema, updateGroupSchema, listGroupsQuerySchema } from "./schema.js";
import { listGroups, getGroup, createGroup, updateGroup, deleteGroup, getAdminGroups, getMemberGroups } from "./service.js";
import { formatGroupBrief, formatGroupFull } from "./formatters.js";

export const groupsCrudRouter = new Hono<Context>()

  .get("/", zValidator("query", listGroupsQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { groups, total } = await listGroups(query);
    c.header("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
    return c.json({
      data: groups.map(formatGroupBrief),
      meta: { page: query.page, limit: query.limit, total, has_more: query.page * query.limit < total },
    });
  })

  .get("/mine", requireAuth, async (c) => {
    const user = c.get("user")!;
    const [adminGroups, memberGroups] = await Promise.all([
      getAdminGroups(user.id),
      getMemberGroups(user.id),
    ]);
    return c.json({
      data: {
        admin_groups: adminGroups.map(formatGroupBrief),
        member_groups: memberGroups.map(formatGroupBrief),
      },
    });
  })

  .post("/", requireAuth, zValidator("json", createGroupSchema), async (c) => {
    const user = c.get("user")!;
    const body = c.req.valid("json");
    const group = await createGroup(body, user.id, user.plan);
    return c.json({ data: formatGroupFull(group!, true) }, 201);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const group = await getGroup(id);
    if (!group) throw new NotFoundError("Grup");
    const user = c.get("user");
    const isMemberOrAdmin =
      !!user &&
      (group.adminId === user.id ||
        group.members.some((m) => m.userId === user.id));
    c.header("Cache-Control", "private, max-age=0");
    return c.json({ data: formatGroupFull(group, isMemberOrAdmin) });
  })

  .patch("/:id", requireAuth, zValidator("json", updateGroupSchema), async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    const group = await getGroup(id);
    if (!group) throw new NotFoundError("Grup");
    if (group.adminId !== user.id) throw new ForbiddenError("Hanya admin yang bisa mengubah grup");
    const body = c.req.valid("json");
    const updated = await updateGroup(id, body);
    return c.json({ data: formatGroupFull(updated!, true) });
  })

  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    const group = await getGroup(id);
    if (!group) throw new NotFoundError("Grup");
    if (group.adminId !== user.id) throw new ForbiddenError("Hanya admin yang bisa menghapus grup");
    await deleteGroup(id);
    return c.body(null, 204);
  });
