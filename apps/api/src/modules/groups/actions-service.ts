import { prisma } from "../../utils/prisma.js";
import { ForbiddenError, NotFoundError } from "../../exceptions.js";
import { assertGroupAdmin, recalcIsOpen } from "./service.js";

export async function leaveGroup(groupId: string, userId: string) {
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) throw new NotFoundError("Grup");
  if (group.adminId === userId) throw new ForbiddenError("Admin tidak bisa meninggalkan grup. Hapus grup atau transfer kepemilikan terlebih dahulu");

  const membership = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId, groupId } },
  });
  if (!membership) throw new NotFoundError("Kamu bukan anggota grup ini");

  await prisma.groupMember.delete({ where: { userId_groupId: { userId, groupId } } });
  await recalcIsOpen(groupId);
}

export async function kickMember(groupId: string, targetUserId: string, adminId: string) {
  await assertGroupAdmin(groupId, adminId);

  if (targetUserId === adminId) throw new ForbiddenError("Tidak bisa mengeluarkan diri sendiri");

  const membership = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: targetUserId, groupId } },
  });
  if (!membership) throw new NotFoundError("Member tidak ditemukan");

  await prisma.groupMember.delete({ where: { userId_groupId: { userId: targetUserId, groupId } } });
  await recalcIsOpen(groupId);
}
