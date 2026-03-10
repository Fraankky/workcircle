import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "../../utils/prisma.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../exceptions.js";

export const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  bio: true,
  jobTitle: true,
  company: true,
  location: true,
  plan: true,
  profileComplete: true,
  emailVerified: true,
  isAdmin: true,
  createdAt: true,
} as const;

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  bio?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new ConflictError("Email already registered");

  const hashedPassword = await bcrypt.hash(data.password, 12);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      jobTitle: data.jobTitle,
      company: data.company,
      location: data.location,
      bio: data.bio,
    },
    select: USER_SELECT,
  });
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });
  if (!user) throw new NotFoundError("User");
  return user;
}

export async function updateProfile(
  id: string,
  data: {
    name?: string;
    bio?: string;
    jobTitle?: string;
    company?: string;
    location?: string;
    avatarUrl?: string;
  }
) {
  return prisma.user.update({
    where: { id },
    data,
    select: USER_SELECT,
  });
}

export async function findOrCreateGoogleUser(data: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}) {
  return prisma.user.upsert({
    where: { email: data.email },
    update: {
      googleId: data.googleId,
      name: data.name,
      avatarUrl: data.avatarUrl,
    },
    create: {
      googleId: data.googleId,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
    },
    select: USER_SELECT,
  });
}

// ── Email verification ────────────────────────────────────────────────────────

export async function createEmailVerificationToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  // Delete any existing tokens for this user
  await prisma.emailVerification.deleteMany({ where: { userId } });

  await prisma.emailVerification.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function verifyEmailToken(token: string) {
  const record = await prisma.emailVerification.findUnique({ where: { token } });

  if (!record) throw new ValidationError("Token tidak valid");
  if (record.expiresAt < new Date()) throw new ValidationError("Token sudah kadaluarsa");

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    }),
    prisma.emailVerification.delete({ where: { token } }),
  ]);
}

// ── Password reset ─────────────────────────────────────────────────────────────

export async function createPasswordResetToken(email: string): Promise<{ token: string; name: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null; // Don't reveal whether email exists

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  // Delete existing reset tokens for this user
  await prisma.passwordReset.deleteMany({ where: { userId: user.id } });

  await prisma.passwordReset.create({
    data: { userId: user.id, token, expiresAt },
  });

  return { token, name: user.name };
}

export async function resetPassword(token: string, newPassword: string) {
  const record = await prisma.passwordReset.findUnique({ where: { token } });

  if (!record) throw new ValidationError("Token tidak valid");
  if (record.expiresAt < new Date()) throw new ValidationError("Token sudah kadaluarsa");
  if (record.usedAt) throw new ValidationError("Token sudah digunakan");

  const hashed = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    }),
    prisma.passwordReset.update({
      where: { token },
      data: { usedAt: new Date() },
    }),
  ]);
}
