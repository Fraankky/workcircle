import { prisma } from "../../utils/prisma.js";

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getStats() {
  const [totalUsers, totalGroups, totalSpaces, proUsers, teamUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.group.count(),
      prisma.space.count(),
      prisma.user.count({ where: { plan: "pro" } }),
      prisma.user.count({ where: { plan: "team" } }),
    ]);

  return { totalUsers, totalGroups, totalSpaces, proUsers, teamUsers };
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function listAdminUsers(opts: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { page, limit, search } = opts;
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        isAdmin: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { memberships: true, adminGroups: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

export async function updateAdminUser(
  id: string,
  data: { plan?: "free" | "pro" | "team"; isAdmin?: boolean }
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      isAdmin: true,
    },
  });
}

// ── Spaces ────────────────────────────────────────────────────────────────────

export async function listAdminSpaces(opts: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { page, limit, search } = opts;
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { area: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [spaces, total] = await Promise.all([
    prisma.space.findMany({
      where,
      include: { _count: { select: { groups: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.space.count({ where }),
  ]);

  return { spaces, total };
}

export async function createAdminSpace(data: {
  name: string;
  area: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  wifiSpeed?: "slow" | "medium" | "fast" | "very_fast";
  noiseLevel?: "quiet" | "medium" | "buzzy" | "loud";
  hasPower?: boolean;
  priceRange?: string;
  rating?: number;
  seatCount?: number;
}) {
  return prisma.space.create({ data });
}

export async function updateAdminSpace(
  id: string,
  data: {
    name?: string;
    area?: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
    wifiSpeed?: "slow" | "medium" | "fast" | "very_fast";
    noiseLevel?: "quiet" | "medium" | "buzzy" | "loud";
    hasPower?: boolean;
    priceRange?: string;
    rating?: number;
    seatCount?: number;
  }
) {
  return prisma.space.update({ where: { id }, data });
}

export async function deleteAdminSpace(id: string) {
  return prisma.space.delete({ where: { id } });
}

// ── Groups ────────────────────────────────────────────────────────────────────

export async function listAdminGroups(opts: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { page, limit, search } = opts;
  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [groups, total] = await Promise.all([
    prisma.group.findMany({
      where,
      include: {
        _count: { select: { members: true } },
        admin: { select: { id: true, name: true, email: true } },
        space: { select: { id: true, name: true, area: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.group.count({ where }),
  ]);

  return { groups, total };
}

export async function forceCloseGroup(id: string) {
  return prisma.group.update({ where: { id }, data: { isOpen: false } });
}
