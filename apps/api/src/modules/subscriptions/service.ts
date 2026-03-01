import { prisma } from "../../utils/prisma.js";

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
