import type { Prisma } from "../../generated/prisma/client.js";

// ── Type aliases for Prisma payloads ──────────────────────────────────────────

export type GroupBrief = Prisma.GroupGetPayload<{
  include: {
    admin: { select: { id: true; name: true; avatarUrl: true; jobTitle: true; company: true } };
    space: { select: { id: true; name: true; area: true } };
    _count: { select: { members: true; joinRequests: true } };
  };
}>;

export type GroupFull = Prisma.GroupGetPayload<{
  include: {
    admin: { select: { id: true; name: true; avatarUrl: true; jobTitle: true; company: true; bio: true } };
    space: { select: { id: true; name: true; area: true; address: true } };
    members: {
      include: { user: { select: { id: true; name: true; avatarUrl: true; jobTitle: true; company: true; plan: true } } };
    };
    _count: { select: { joinRequests: { where: { status: "pending" } } } };
  };
}>;

export type JoinRequestFull = Prisma.GroupJoinRequestGetPayload<{
  include: {
    user: { select: { id: true; name: true; avatarUrl: true; jobTitle: true; company: true; location: true; bio: true } };
  };
}>;

// ── Formatters ─────────────────────────────────────────────────────────────────

export function formatGroupBrief(g: GroupBrief) {
  return {
    id: g.id,
    name: g.name,
    description: g.description,
    category: g.category,
    schedule: g.schedule,
    time_start: g.timeStart,
    time_end: g.timeEnd,
    max_members: g.maxMembers,
    member_count: g._count.members,
    vibe: g.vibe,
    is_open: g.isOpen,
    tags: g.tags,
    color: g.color,
    require_approval: g.requireApproval,
    cover_url: g.coverUrl,
    created_at: g.createdAt.toISOString(),
    admin: {
      id: g.admin.id,
      name: g.admin.name,
      avatar_url: g.admin.avatarUrl,
      job_title: g.admin.jobTitle,
      company: g.admin.company,
    },
    space: g.space ? { id: g.space.id, name: g.space.name, area: g.space.area } : null,
  };
}

export function formatGroupFull(g: GroupFull, showChatLink = false) {
  return {
    id: g.id,
    name: g.name,
    description: g.description,
    category: g.category,
    schedule: g.schedule,
    time_start: g.timeStart,
    time_end: g.timeEnd,
    max_members: g.maxMembers,
    vibe: g.vibe,
    is_open: g.isOpen,
    tags: g.tags,
    color: g.color,
    require_approval: g.requireApproval,
    chat_link: showChatLink ? g.chatLink : null,
    chat_type: showChatLink ? g.chatType : null,
    cover_url: g.coverUrl,
    member_count: g.members.length,
    pending_count: g._count.joinRequests,
    created_at: g.createdAt.toISOString(),
    updated_at: g.updatedAt.toISOString(),
    admin: {
      id: g.admin.id,
      name: g.admin.name,
      avatar_url: g.admin.avatarUrl,
      job_title: g.admin.jobTitle,
      company: g.admin.company,
      bio: g.admin.bio,
    },
    space: g.space
      ? { id: g.space.id, name: g.space.name, area: g.space.area, address: g.space.address }
      : null,
    members: g.members.map((m) => ({
      id: m.id,
      role: m.role,
      joined_at: m.joinedAt.toISOString(),
      user: {
        id: m.user.id,
        name: m.user.name,
        avatar_url: m.user.avatarUrl,
        job_title: m.user.jobTitle,
        company: m.user.company,
        plan: m.user.plan,
      },
    })),
  };
}

export function formatJoinRequest(r: JoinRequestFull) {
  return {
    id: r.id,
    status: r.status,
    message: r.message,
    rejection_reason: r.rejectionReason,
    reviewed_at: r.reviewedAt?.toISOString() ?? null,
    created_at: r.createdAt.toISOString(),
    user: {
      id: r.user.id,
      name: r.user.name,
      avatar_url: r.user.avatarUrl,
      job_title: r.user.jobTitle,
      company: r.user.company,
      location: r.user.location,
      bio: r.user.bio,
    },
  };
}
