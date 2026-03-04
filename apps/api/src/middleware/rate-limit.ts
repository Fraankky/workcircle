import type { MiddlewareHandler } from "hono";
import type { Context } from "../types.js";
import { AppError } from "../exceptions.js";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  max: number;       // max requests per window
  windowMs: number;  // window duration in ms
  message?: string;
}

export function rateLimit(options: RateLimitOptions): MiddlewareHandler<Context> {
  return async (c, next) => {
    const ip =
      c.req.header("x-forwarded-for")?.split(",")[0].trim() ??
      c.req.header("x-real-ip") ??
      "unknown";

    const key = `${c.req.path}:${ip}`;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + options.windowMs });
    } else {
      entry.count++;
      if (entry.count > options.max) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        c.header("Retry-After", String(retryAfter));
        throw new AppError(
          "TOO_MANY_REQUESTS",
          options.message ?? "Terlalu banyak permintaan. Coba lagi nanti.",
          429
        );
      }
    }

    await next();
  };
}
