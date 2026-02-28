import type { MiddlewareHandler } from "hono";
import type { Context } from "../types.js";
import { ForbiddenError } from "../exceptions.js";

export const requirePro: MiddlewareHandler<Context> = async (c, next) => {
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

  if (user.plan === "free") {
    throw new ForbiddenError("Upgrade ke PRO untuk mengakses fitur ini");
  }

  return next();
};

export const requireTeam: MiddlewareHandler<Context> = async (c, next) => {
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

  if (user.plan !== "team") {
    throw new ForbiddenError("Fitur ini hanya tersedia untuk plan Team");
  }

  return next();
};
