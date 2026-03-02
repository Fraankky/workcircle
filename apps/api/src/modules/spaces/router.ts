import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Context } from "../../types.js";
import { NotFoundError } from "../../exceptions.js";
import { listSpacesQuerySchema } from "./schema.js";
import { listSpaces, getSpace } from "./service.js";

export const spacesRouter = new Hono<Context>()

  .get("/", zValidator("query", listSpacesQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { spaces, total } = await listSpaces(query);

    return c.json({
      data: spaces.map((s) => ({
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
      })),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        has_more: query.page * query.limit < total,
      },
    });
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const space = await getSpace(id);
    if (!space) throw new NotFoundError("Space");

    return c.json({
      data: {
        id: space.id,
        name: space.name,
        area: space.area,
        address: space.address,
        latitude: space.latitude,
        longitude: space.longitude,
        wifi_speed: space.wifiSpeed,
        noise_level: space.noiseLevel,
        has_power: space.hasPower,
        price_range: space.priceRange,
        rating: space.rating,
        seat_count: space.seatCount,
        active_groups_count: space._count.groups,
        active_groups: space.groups.map((g) => ({
          id: g.id,
          name: g.name,
          category: g.category,
          schedule: g.schedule,
          is_open: g.isOpen,
          color: g.color,
        })),
        created_at: space.createdAt.toISOString(),
      },
    });
  });
