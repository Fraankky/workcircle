import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import type { Context } from "../../types.js";
import { requireAdmin } from "../../middleware/auth.js";
import { NotFoundError } from "../../exceptions.js";
import {
  getStats,
  listAdminUsers,
  updateAdminUser,
  listAdminSpaces,
  createAdminSpace,
  updateAdminSpace,
  deleteAdminSpace,
  listAdminGroups,
  forceCloseGroup,
} from "./service.js";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

const spaceBodySchema = z.object({
  name: z.string().min(1),
  area: z.string().min(1),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  wifiSpeed: z.enum(["slow", "medium", "fast", "very_fast"]).optional(),
  noiseLevel: z.enum(["quiet", "medium", "buzzy", "loud"]).optional(),
  hasPower: z.boolean().optional(),
  priceRange: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  seatCount: z.number().int().min(0).optional(),
});

const spaceUpdateSchema = spaceBodySchema.partial();

const userUpdateSchema = z.object({
  plan: z.enum(["free", "pro", "team"]).optional(),
  isAdmin: z.boolean().optional(),
});

function formatSpace(s: {
  id: string;
  name: string;
  area: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  wifiSpeed: string;
  noiseLevel: string;
  hasPower: boolean;
  priceRange: string | null;
  rating: number;
  seatCount: number | null;
  createdAt: Date;
  _count: { groups: number };
}) {
  return {
    id: s.id,
    name: s.name,
    area: s.area,
    address: s.address,
    latitude: s.latitude,
    longitude: s.longitude,
    wifi_speed: s.wifiSpeed,
    noise_level: s.noiseLevel,
    has_power: s.hasPower,
    price_range: s.priceRange,
    rating: s.rating,
    seat_count: s.seatCount,
    active_groups: s._count.groups,
    created_at: s.createdAt.toISOString(),
  };
}

export const adminRouter = new Hono<Context>()

  // ── Stats ──────────────────────────────────────────────────────────────────
  .get("/stats", requireAdmin, async (c) => {
    const stats = await getStats();
    return c.json({ data: stats });
  })

  // ── Users ──────────────────────────────────────────────────────────────────
  .get(
    "/users",
    requireAdmin,
    zValidator("query", paginationSchema),
    async (c) => {
      const query = c.req.valid("query");
      const { users, total } = await listAdminUsers(query);
      return c.json({
        data: users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          plan: u.plan,
          is_admin: u.isAdmin,
          email_verified: u.emailVerified,
          groups_count: u._count.adminGroups,
          memberships_count: u._count.memberships,
          created_at: u.createdAt.toISOString(),
        })),
        meta: {
          page: query.page,
          limit: query.limit,
          total,
          has_more: query.page * query.limit < total,
        },
      });
    }
  )

  .patch(
    "/users/:id",
    requireAdmin,
    zValidator("json", userUpdateSchema),
    async (c) => {
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const user = await updateAdminUser(id, body);
      return c.json({ data: user });
    }
  )

  // ── Spaces ─────────────────────────────────────────────────────────────────
  .get(
    "/spaces",
    requireAdmin,
    zValidator("query", paginationSchema),
    async (c) => {
      const query = c.req.valid("query");
      const { spaces, total } = await listAdminSpaces(query);
      return c.json({
        data: spaces.map(formatSpace),
        meta: {
          page: query.page,
          limit: query.limit,
          total,
          has_more: query.page * query.limit < total,
        },
      });
    }
  )

  .post(
    "/spaces",
    requireAdmin,
    zValidator("json", spaceBodySchema),
    async (c) => {
      const body = c.req.valid("json");
      const space = await createAdminSpace(body);
      return c.json(
        {
          data: {
            ...space,
            wifi_speed: space.wifiSpeed,
            noise_level: space.noiseLevel,
            has_power: space.hasPower,
            price_range: space.priceRange,
            seat_count: space.seatCount,
            created_at: space.createdAt.toISOString(),
          },
        },
        201
      );
    }
  )

  .patch(
    "/spaces/:id",
    requireAdmin,
    zValidator("json", spaceUpdateSchema),
    async (c) => {
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const space = await updateAdminSpace(id, body);
      return c.json({
        data: {
          ...space,
          wifi_speed: space.wifiSpeed,
          noise_level: space.noiseLevel,
          has_power: space.hasPower,
          price_range: space.priceRange,
          seat_count: space.seatCount,
          created_at: space.createdAt.toISOString(),
        },
      });
    }
  )

  .delete("/spaces/:id", requireAdmin, async (c) => {
    const id = c.req.param("id");
    await deleteAdminSpace(id).catch(() => {
      throw new NotFoundError("Space");
    });
    return c.json({ data: { ok: true } });
  })

  // ── Groups ─────────────────────────────────────────────────────────────────
  .get(
    "/groups",
    requireAdmin,
    zValidator("query", paginationSchema),
    async (c) => {
      const query = c.req.valid("query");
      const { groups, total } = await listAdminGroups(query);
      return c.json({
        data: groups.map((g) => ({
          id: g.id,
          name: g.name,
          category: g.category,
          is_open: g.isOpen,
          members_count: g._count.members,
          admin: g.admin,
          space: g.space,
          created_at: g.createdAt.toISOString(),
        })),
        meta: {
          page: query.page,
          limit: query.limit,
          total,
          has_more: query.page * query.limit < total,
        },
      });
    }
  )

  .patch("/groups/:id/close", requireAdmin, async (c) => {
    const id = c.req.param("id");
    const group = await forceCloseGroup(id);
    return c.json({ data: { id: group.id, is_open: group.isOpen } });
  });
