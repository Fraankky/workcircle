import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Context } from "../../types.js";
import { requireAuth } from "../../middleware/auth.js";
import { NotFoundError } from "../../exceptions.js";
import { prisma } from "../../utils/prisma.js";
import { upgradeSchema } from "./schema.js";
import {
  getSubscription,
  createMayarCheckout,
  cancelSubscription,
} from "./service.js";
import { webhookRouter } from "./webhook.js";

function formatSubscription(s: NonNullable<Awaited<ReturnType<typeof getSubscription>>>) {
  return {
    id: s.id,
    plan: s.plan,
    status: s.status,
    current_period_start: s.currentPeriodStart.toISOString(),
    current_period_end: s.currentPeriodEnd.toISOString(),
    created_at: s.createdAt.toISOString(),
    updated_at: s.updatedAt.toISOString(),
  };
}

export const subscriptionsRouter = new Hono<Context>()

  // GET /api/subscriptions/me
  .get("/me", requireAuth, async (c) => {
    const user = c.get("user")!;
    const subscription = await getSubscription(user.id);
    if (!subscription) throw new NotFoundError("Subscription");
    return c.json({ data: formatSubscription(subscription) });
  })

  // POST /api/subscriptions/checkout — buat Mayar payment link
  .post("/checkout", requireAuth, zValidator("json", upgradeSchema), async (c) => {
    const userPayload = c.get("user")!;
    const { plan } = c.req.valid("json");

    const user = await prisma.user.findUnique({ where: { id: userPayload.id } });
    if (!user) throw new NotFoundError("User");

    const checkoutUrl = await createMayarCheckout({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      plan,
    });

    return c.json({ data: { checkoutUrl } });
  })

  // POST /api/subscriptions/cancel
  .post("/cancel", requireAuth, async (c) => {
    const user = c.get("user")!;
    const subscription = await cancelSubscription(user.id);
    return c.json({ data: formatSubscription(subscription) });
  })

  .route("/webhook", webhookRouter);
