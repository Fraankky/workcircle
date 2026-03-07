import { prisma } from "../../utils/prisma.js";
import type { NotifType } from "../../generated/prisma/client.js";

export async function createNotification({
  userId,
  type,
  title,
  body,
  linkUrl,
}: {
  userId: string;
  type: NotifType;
  title: string;
  body: string;
  linkUrl?: string;
}) {
  return prisma.notification.create({
    data: { userId, type, title, body, linkUrl },
  });
}

export async function listNotifications(userId: string) {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);
  return { notifications, unreadCount };
}

export async function markNotificationRead(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });
}

export async function markAllRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
