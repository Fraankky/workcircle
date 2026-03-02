import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma.js";
import {
  ConflictError,
  NotFoundError,
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
