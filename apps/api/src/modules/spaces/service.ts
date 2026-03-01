import { prisma } from "../../utils/prisma.js";
import type { ListSpacesQuery } from "./schema.js";

export async function listSpaces(query: ListSpacesQuery) {
  const { page, limit, area } = query;

  const where = area ? { area: { contains: area, mode: "insensitive" as const } } : {};

  const [spaces, total] = await Promise.all([
    prisma.space.findMany({
      where,
      include: { _count: { select: { groups: true } } },
      orderBy: { rating: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.space.count({ where }),
  ]);

  return { spaces, total };
}

export async function getSpace(id: string) {
  return prisma.space.findUnique({
    where: { id },
    include: {
      _count: { select: { groups: true } },
      groups: {
        where: { isOpen: true },
        select: { id: true, name: true, category: true, schedule: true, isOpen: true, color: true },
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
