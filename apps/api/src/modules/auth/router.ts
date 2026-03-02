import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { setCookie, deleteCookie } from "hono/cookie";
import { SignJWT } from "jose";
import type { Context } from "../../types.js";
import { requireAuth } from "../../middleware/auth.js";
import { UnauthorizedError } from "../../exceptions.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "./schema.js";
import { prisma } from "../../utils/prisma.js";
import {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  USER_SELECT,
} from "./service.js";

export const authRouter = new Hono<Context>();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret"
);

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "Lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
  secure: process.env.NODE_ENV === "production",
};

async function signToken(payload: {
  userId: string;
  email: string;
  plan: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

authRouter.post("/register", zValidator("json", registerSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await registerUser(body);

  const token = await signToken({
    userId: user.id,
    email: user.email,
    plan: user.plan,
  });
  setCookie(c, "auth_token", token, COOKIE_OPTIONS);

  return c.json({ data: user }, 201);
});

authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await loginUser(body);

  if (!user) throw new UnauthorizedError("Invalid email or password");

  const token = await signToken({
    userId: user.id,
    email: user.email,
    plan: user.plan,
  });
  setCookie(c, "auth_token", token, COOKIE_OPTIONS);

  const { password: _, ...safeUser } = user;
  return c.json({ data: safeUser });
});

authRouter.post("/logout", (c) => {
  deleteCookie(c, "auth_token", { path: "/" });
  return c.json({ data: { message: "Logged out" } });
});

authRouter.get("/me", requireAuth, async (c) => {
  const userPayload = c.get("user")!;
  const user = await prisma.user.findUnique({
    where: { id: userPayload.id },
    select: USER_SELECT,
  });
  // Token valid but user deleted (e.g. after re-seed) — clear stale cookie
  if (!user) {
    deleteCookie(c, "auth_token", { path: "/" });
    throw new UnauthorizedError("Session expired");
  }
  return c.json({ data: user });
});

authRouter.patch("/me", requireAuth, zValidator("json", updateProfileSchema), async (c) => {
  const userPayload = c.get("user")!;
  const body = c.req.valid("json");
  const user = await updateProfile(userPayload.id, body);
  return c.json({ data: user });
});
