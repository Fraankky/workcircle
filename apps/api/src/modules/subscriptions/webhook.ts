import { Hono } from "hono";
import { createHmac, timingSafeEqual } from "crypto";
import type { Context } from "../../types.js";
import { activatePlan } from "./service.js";
import { prisma } from "../../utils/prisma.js";

export const webhookRouter = new Hono<Context>()

  .post("/", async (c) => {
    const rawBody = await c.req.text();

    // ── Signature verification ──────────────────────────────────────────────
    const secret = process.env.MAYAR_WEBHOOK_SECRET;
    if (secret) {
      const signature =
        c.req.header("X-Mayar-Signature") ?? c.req.header("x-mayar-signature");

      if (signature) {
        const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
        const sigBuffer = Buffer.from(signature);
        const expBuffer = Buffer.from(expected);
        const isValid =
          sigBuffer.length === expBuffer.length &&
          timingSafeEqual(sigBuffer, expBuffer);

        if (!isValid) {
          console.warn("[Mayar Webhook] Invalid signature");
          return c.json({ error: "Invalid signature" }, 401);
        }
      } else {
        // Fallback: token in query param (register URL as ?token=<secret>)
        const queryToken = c.req.query("token");
        if (queryToken && queryToken !== secret) {
          return c.json({ error: "Unauthorized" }, 401);
        }
        if (!queryToken) {
          console.warn("[Mayar Webhook] No signature or token — processing without verification");
        }
      }
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }

    const p = payload as Record<string, unknown>;
    const event = (p.event as string) ?? "";
    const data = (p.data ?? {}) as Record<string, unknown>;

    console.log("[Mayar Webhook] event:", event, "id:", data.id);

    if (event !== "payment.received") {
      return c.json({ data: { received: true } });
    }

    // ── Extract userId + plan from extraData ────────────────────────────────
    const extra = (data.extraData ?? {}) as Record<string, unknown>;
    const userId = extra.userId as string | undefined;
    const plan = extra.plan as "pro" | "team" | undefined;

    if (!userId || !plan || !["pro", "team"].includes(plan)) {
      // Fallback: try to identify user by email (but plan unknown)
      const customerEmail = data.customerEmail as string | undefined;
      if (customerEmail) {
        const user = await prisma.user.findUnique({ where: { email: customerEmail } });
        console.warn("[Mayar Webhook] extraData missing — user:", user?.id, "plan unknown");
      }
      return c.json({ data: { received: true } });
    }

    const transactionId = data.id as string | undefined;

    try {
      await activatePlan(userId, plan, transactionId);
      console.log(`[Mayar Webhook] Activated ${plan} for user ${userId}`);
    } catch (err) {
      console.error("[Mayar Webhook] activatePlan error:", err);
    }

    return c.json({ data: { received: true } });
  });
