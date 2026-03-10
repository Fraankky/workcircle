import { prisma } from "../../utils/prisma.js";
import { ForbiddenError, NotFoundError } from "../../exceptions.js";
import type { CreateGroupInput, UpdateGroupInput, ListGroupsQuery } from "./schema.js";

const ADMIN_SELECT = { select: { id: true, name: true, avatarUrl: true, jobTitle: true, company: true, bio: true } } as const;
const SPACE_BRIEF_SELECT = { select: { id: true, name: true, area: true } } as const;

const GROUP_BRIEF_INCLUDE = {
  admin: ADMIN_SELECT,
  space: SPACE_BRIEF_SELECT,
  _count: { select: { members: true, joinRequests: true } },
} as const;

const GROUP_FULL_INCLUDE = {
  admin: ADMIN_SELECT,
  space: { select: { id: true, name: true, area: true, address: true } },
  members: {
    include: {
      user: { select: { id: true, name: true, avatarUrl: true, jobTitle: true, company: true, plan: true } },
    },
    orderBy: { joinedAt: "asc" as const },
  },
  _count: { select: { joinRequests: true } },
} as const;

export async function listGroups(query: ListGroupsQuery) {
  const { page, limit, category, search, sort } = query;

  // Use full-text search when search term is provided
  if (search) {
    return listGroupsFts({ page, limit, category, search, sort });
  }

  const where = {
    AND: [
      category ? { category } : {},
    ],
  };

  const orderBy =
    sort === "popular"
      ? { members: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [groups, total] = await Promise.all([
    prisma.group.findMany({ where, include: GROUP_BRIEF_INCLUDE, orderBy, skip: (page - 1) * limit, take: limit }),
    prisma.group.count({ where }),
  ]);

  return { groups, total };
}

type RawGroup = {
  id: string;
  name: string;
  description: string;
  category: string;
  admin_id: string;
  space_id: string | null;
  schedule: string;
  time_start: string;
  time_end: string;
  max_members: number;
  vibe: string | null;
  is_open: boolean;
  tags: unknown;
  color: string;
  require_approval: boolean;
  chat_link: string | null;
  chat_type: string | null;
  cover_url: string | null;
  created_at: Date;
  updated_at: Date;
};

async function listGroupsFts(query: { page: number; limit: number; category?: string; search: string; sort: string }) {
  const { page, limit, category, search, sort } = query;
  const offset = (page - 1) * limit;

  const categoryFilter = category ? `AND category::text = '${category}'` : "";
  const orderByClause =
    sort === "popular"
      ? "ORDER BY member_count DESC"
      : "ORDER BY g.created_at DESC";

  const rawGroups = await prisma.$queryRawUnsafe<(RawGroup & { rank: number })[]>(`
    SELECT g.*,
           ts_rank(g.search_vector, plainto_tsquery('simple', $1)) AS rank
    FROM groups g
    WHERE g.search_vector @@ plainto_tsquery('simple', $1)
    ${categoryFilter}
    ${orderByClause}
    LIMIT $2 OFFSET $3
  `, search, limit, offset);

  const [{ count }] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(`
    SELECT count(*) FROM groups g
    WHERE g.search_vector @@ plainto_tsquery('simple', $1)
    ${categoryFilter}
  `, search);

  const total = Number(count);

  // Fetch related data for each group
  const groups = await prisma.group.findMany({
    where: { id: { in: rawGroups.map((g) => g.id) } },
    include: GROUP_BRIEF_INCLUDE,
  });

  // Preserve FTS order
  const ordered = rawGroups
    .map((r) => groups.find((g) => g.id === r.id))
    .filter(Boolean) as typeof groups;

  return { groups: ordered, total };
}

export async function getGroup(id: string) {
  return prisma.group.findUnique({ where: { id }, include: GROUP_FULL_INCLUDE });
}

export async function createGroup(data: CreateGroupInput, adminId: string, adminPlan: string) {
  if (adminPlan === "free") throw new ForbiddenError("Upgrade ke PRO untuk membuat grup");

  const adminGroupCount = await prisma.group.count({ where: { adminId } });
  if (adminPlan === "pro" && adminGroupCount >= 3) throw new ForbiddenError("Batas maksimal 3 grup untuk plan PRO");
  if (adminPlan === "team" && adminGroupCount >= 10) throw new ForbiddenError("Batas maksimal 10 grup untuk plan Team");

  const group = await prisma.group.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      adminId,
      spaceId: data.spaceId,
      schedule: data.schedule,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      maxMembers: data.maxMembers,
      vibe: data.vibe,
      tags: data.tags,
      color: data.color,
      requireApproval: data.requireApproval,
      chatLink: data.chatLink,
      chatType: data.chatType,
      coverUrl: data.coverUrl,
    },
  });

  await prisma.groupMember.create({
    data: { userId: adminId, groupId: group.id, role: "admin" },
  });

  return prisma.group.findUnique({ where: { id: group.id }, include: GROUP_FULL_INCLUDE });
}

export async function updateGroup(id: string, data: UpdateGroupInput) {
  return prisma.group.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    include: GROUP_FULL_INCLUDE,
  });
}

export async function deleteGroup(id: string) {
  return prisma.group.delete({ where: { id } });
}

export async function getAdminGroups(adminId: string) {
  return prisma.group.findMany({
    where: { adminId },
    include: GROUP_BRIEF_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function getMemberGroups(userId: string) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId, role: "member" },
    include: { group: { include: GROUP_BRIEF_INCLUDE } },
    orderBy: { joinedAt: "desc" },
  });
  return memberships.map((m) => m.group);
}

export async function assertGroupAdmin(groupId: string, userId: string) {
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) throw new NotFoundError("Grup");
  if (group.adminId !== userId) throw new ForbiddenError("Hanya admin yang dapat melakukan ini");
  return group;
}

export async function recalcIsOpen(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { _count: { select: { members: true } } },
  });
  if (!group) return;
  await prisma.group.update({
    where: { id: groupId },
    data: { isOpen: group._count.members < group.maxMembers },
  });
}
