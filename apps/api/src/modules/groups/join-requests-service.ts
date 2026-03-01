import { prisma } from "../../utils/prisma.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../exceptions.js";
import { recalcIsOpen } from "./service.js";

const REQUEST_INCLUDE = {
  user: { select: { id: true, name: true, avatarUrl: true, jobTitle: true, company: true, location: true, bio: true } },
} as const;

export async function submitJoinRequest(groupId: string, userId: string, message?: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { _count: { select: { members: true } } },
  });
  if (!group) throw new NotFoundError("Grup");

  if (!group.isOpen) throw new ForbiddenError("Grup sudah penuh");

  const isMember = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId } } });
  if (isMember) throw new ConflictError("Kamu sudah menjadi anggota grup ini");

  const existing = await prisma.groupJoinRequest.findUnique({ where: { userId_groupId: { userId, groupId } } });
  if (existing && existing.status === "pending") throw new ConflictError("Kamu sudah punya permintaan bergabung yang sedang menunggu");

  // Free user max 3 active requests
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.plan === "free") {
    const activeCount = await prisma.groupJoinRequest.count({
      where: { userId, status: { in: ["pending", "approved"] } },
    });
    if (activeCount >= 3) throw new ForbiddenError("Upgrade ke PRO untuk bergabung ke lebih dari 3 grup");
  }

  if (!group.requireApproval) {
    // Auto-approve
    const req = await prisma.groupJoinRequest.upsert({
      where: { userId_groupId: { userId, groupId } },
      update: { status: "approved", message, reviewedAt: new Date() },
      create: { groupId, userId, message, status: "approved", reviewedAt: new Date() },
      include: REQUEST_INCLUDE,
    });
    await prisma.groupMember.create({ data: { userId, groupId, role: "member" } });
    await recalcIsOpen(groupId);
    return req;
  }

  return prisma.groupJoinRequest.upsert({
    where: { userId_groupId: { userId, groupId } },
    update: { status: "pending", message, reviewedAt: null, rejectionReason: null },
    create: { groupId, userId, message },
    include: REQUEST_INCLUDE,
  });
}

export async function getJoinRequestsForGroup(groupId: string) {
  return prisma.groupJoinRequest.findMany({
    where: { groupId, status: "pending" },
    include: REQUEST_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
}

export async function getMyJoinRequest(groupId: string, userId: string) {
  return prisma.groupJoinRequest.findUnique({
    where: { userId_groupId: { userId, groupId } },
    include: REQUEST_INCLUDE,
  });
}

export async function approveJoinRequest(requestId: string) {
  const req = await prisma.groupJoinRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new NotFoundError("Permintaan");
  if (req.status !== "pending") throw new ConflictError("Permintaan sudah diproses");

  const [updated] = await prisma.$transaction([
    prisma.groupJoinRequest.update({
      where: { id: requestId },
      data: { status: "approved", reviewedAt: new Date() },
      include: REQUEST_INCLUDE,
    }),
    prisma.groupMember.upsert({
      where: { userId_groupId: { userId: req.userId, groupId: req.groupId } },
      update: {},
      create: { userId: req.userId, groupId: req.groupId, role: "member" },
    }),
  ]);

  await recalcIsOpen(req.groupId);
  return updated;
}

export async function rejectJoinRequest(requestId: string, rejectionReason?: string) {
  const req = await prisma.groupJoinRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new NotFoundError("Permintaan");
  if (req.status !== "pending") throw new ConflictError("Permintaan sudah diproses");

  return prisma.groupJoinRequest.update({
    where: { id: requestId },
    data: { status: "rejected", rejectionReason, reviewedAt: new Date() },
    include: REQUEST_INCLUDE,
  });
}
