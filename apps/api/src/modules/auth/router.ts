import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { setCookie, deleteCookie } from "hono/cookie";
import { SignJWT } from "jose";
import type { Context } from "../../types.js";
import { requireAuth } from "../../middleware/auth.js";
import { rateLimit } from "../../middleware/rate-limit.js";
import { UnauthorizedError } from "../../exceptions.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schema.js";
import { prisma } from "../../utils/prisma.js";
import {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  USER_SELECT,
  createEmailVerificationToken,
  verifyEmailToken,
  createPasswordResetToken,
  resetPassword,
} from "./service.js";
import { sendEmail } from "../../utils/email.js";
import { verifyEmailTemplate } from "../../emails/verify-email.js";
import { resetPasswordTemplate } from "../../emails/reset-password.js";

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

const loginRateLimit = rateLimit({ max: 10, windowMs: 15 * 60 * 1000, message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit." });
const registerRateLimit = rateLimit({ max: 5, windowMs: 15 * 60 * 1000, message: "Terlalu banyak pendaftaran. Coba lagi dalam 15 menit." });

authRouter.post("/register", registerRateLimit, zValidator("json", registerSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await registerUser(body);

  const token = await signToken({
    userId: user.id,
    email: user.email,
    plan: user.plan,
  });
  setCookie(c, "auth_token", token, COOKIE_OPTIONS);

  // Send verification email in background (don't block registration)
  createEmailVerificationToken(user.id).then((verifyToken) => {
    const APP_URL = process.env.APP_URL || "http://localhost:5173";
    const verifyUrl = `${APP_URL}/verify-email?token=${verifyToken}`;
    return sendEmail({
      to: user.email,
      subject: "Verifikasi email kamu — WorkCircle",
      html: verifyEmailTemplate(user.name, verifyUrl),
    });
  }).catch((err) => console.error("[register] email error:", err));

  return c.json({ data: user }, 201);
});

authRouter.post("/login", loginRateLimit, zValidator("json", loginSchema), async (c) => {
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

// ── Email verification ────────────────────────────────────────────────────────

// POST /api/auth/verify-email — resend verification email
authRouter.post("/verify-email", requireAuth, async (c) => {
  const userPayload = c.get("user")!;
  const user = await prisma.user.findUnique({ where: { id: userPayload.id } });
  if (!user || user.emailVerified) return c.json({ data: { message: "ok" } });

  const verifyToken = await createEmailVerificationToken(user.id);
  const APP_URL = process.env.APP_URL || "http://localhost:5173";
  const verifyUrl = `${APP_URL}/verify-email?token=${verifyToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verifikasi email kamu — WorkCircle",
    html: verifyEmailTemplate(user.name, verifyUrl),
  });

  return c.json({ data: { message: "Email verifikasi telah dikirim" } });
});

// GET /api/auth/verify-email/:token — click link from email
authRouter.get("/verify-email/:token", async (c) => {
  const token = c.req.param("token");
  await verifyEmailToken(token);
  const APP_URL = process.env.APP_URL || "http://localhost:5173";
  return c.redirect(`${APP_URL}/verify-email?success=true`);
});

// ── Password reset ─────────────────────────────────────────────────────────────

// POST /api/auth/forgot-password
authRouter.post("/forgot-password", rateLimit({ max: 5, windowMs: 15 * 60 * 1000, message: "Terlalu banyak permintaan." }), zValidator("json", forgotPasswordSchema), async (c) => {
  const { email } = c.req.valid("json");
  const result = await createPasswordResetToken(email);

  if (result) {
    const APP_URL = process.env.APP_URL || "http://localhost:5173";
    const resetUrl = `${APP_URL}/reset-password?token=${result.token}`;
    await sendEmail({
      to: email,
      subject: "Reset password — WorkCircle",
      html: resetPasswordTemplate(result.name, resetUrl),
    });
  }

  // Always return success to avoid email enumeration
  return c.json({ data: { message: "Jika email terdaftar, link reset password telah dikirim." } });
});

// POST /api/auth/reset-password
authRouter.post("/reset-password", zValidator("json", resetPasswordSchema), async (c) => {
  const { token, newPassword } = c.req.valid("json");
  await resetPassword(token, newPassword);
  return c.json({ data: { message: "Password berhasil diubah" } });
});
