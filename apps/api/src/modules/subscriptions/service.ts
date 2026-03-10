import { prisma } from "../../utils/prisma.js";

const MAYAR_BASE = "https://api.mayar.id/hl/v1";

const PLAN_PRICES: Record<"pro" | "team", number> = {
  pro: 49_000,
  team: 149_000,
};

export async function createMayarCheckout(params: {
  userId: string;
  userName: string;
  userEmail: string;
  plan: "pro" | "team";
}): Promise<string> {
  const amount = PLAN_PRICES[params.plan];
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const APP_URL = process.env.APP_URL || "http://localhost:5173";

  const res = await fetch(`${MAYAR_BASE}/invoice/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: params.userName,
      email: params.userEmail,
      mobile: "08000000000",
      redirectUrl: `${APP_URL}/upgrade/success`,
      description: `WorkCircle ${params.plan.toUpperCase()} Plan — 30 hari`,
      expiredAt,
      items: [
        {
          quantity: 1,
          rate: amount,
          description: `WorkCircle ${params.plan.toUpperCase()} Plan`,
        },
      ],
      extraData: { userId: params.userId, plan: params.plan },
    }),
  });

  const json = await res.json();
  if (!res.ok || !json?.data?.link) {
    console.error("[Mayar checkout] error:", JSON.stringify(json));
    throw new Error("Gagal membuat link pembayaran");
  }

  return json.data.link as string;
}

export async function activatePlan(
  userId: string,
  plan: "pro" | "team",
  mayarTransactionId?: string
) {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + 30);

  const [subscription] = await prisma.$transaction([
    prisma.subscription.upsert({
      where: { userId },
      update: {
        plan,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        mayarSubscriptionId: mayarTransactionId ?? null,
        updatedAt: now,
      },
      create: {
        userId,
        plan,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        mayarSubscriptionId: mayarTransactionId ?? null,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { plan, planExpires: periodEnd },
    }),
  ]);

  return subscription;
}

export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
  });
}

export async function mockUpgrade(userId: string, plan: "pro" | "team") {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + 30);

  const [subscription] = await prisma.$transaction([
    prisma.subscription.upsert({
      where: { userId },
      update: {
        plan,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        updatedAt: now,
      },
      create: {
        userId,
        plan,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { plan, planExpires: periodEnd },
    }),
  ]);

  return subscription;
}

export async function cancelSubscription(userId: string) {
  const [subscription] = await prisma.$transaction([
    prisma.subscription.update({
      where: { userId },
      data: { status: "canceled", updatedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { plan: "free", planExpires: null },
    }),
  ]);

  return subscription;
}
