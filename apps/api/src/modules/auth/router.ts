import { Hono } from "hono";
import type { Context } from "../../types.js";

export const authRouter = new Hono<Context>();

// Placeholder routes - akan diimplementasikan di Phase 1
authRouter.get("/health", (c) => c.json({ status: "ok" }));
