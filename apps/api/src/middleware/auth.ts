import { getCookie } from "hono/cookie";
import { jwtVerify } from "jose";
import type { MiddlewareHandler } from "hono";
import type { Context, UserPayload } from "../types.js";
import { prisma } from "../utils/prisma.js";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret"
);

export const authMiddleware: MiddlewareHandler<Context> = async (c, next) => {
  const token = getCookie(c, "auth_token");

  if (!token) {
    c.set("user", null);
    return next();
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userPayload: UserPayload = {
      id: payload.userId as string,
      email: payload.email as string,
      plan: payload.plan as "free" | "pro" | "team",
    };
    c.set("user", userPayload);
  } catch {
    c.set("user", null);
  }

  return next();
};

export const requireAuth: MiddlewareHandler<Context> = async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      },
      401
    );
  }

  return next();
};

export const requireAdmin: MiddlewareHandler<Context> = async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      401
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isAdmin: true },
  });

  if (!dbUser?.isAdmin) {
    return c.json(
      { error: { code: "FORBIDDEN", message: "Admin access required" } },
      403
    );
  }

  return next();
};
