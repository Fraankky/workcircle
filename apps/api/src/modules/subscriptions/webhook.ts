import { Hono } from "hono";
import type { Context } from "../../types.js";

export const webhookRouter = new Hono<Context>()

  .post("/", async (c) => {
    const payload = await c.req.json();
    console.log("[Mayar Webhook]", JSON.stringify(payload, null, 2));
    return c.json({ data: { received: true } });
  });
