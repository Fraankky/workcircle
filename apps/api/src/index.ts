import { config } from "dotenv";
config({ path: "../../.env" });
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authMiddleware } from "./middleware/auth.js";
import { authRouter } from "./modules/auth/router.js";
import { groupsRouter } from "./modules/groups/router.js";
import { spacesRouter } from "./modules/spaces/router.js";
import { subscriptionsRouter } from "./modules/subscriptions/router.js";
import type { Context } from "./types.js";

const app = new Hono<Context>();

// Global middleware
app.use("*", corsMiddleware);
app.use("*", authMiddleware);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

// Routes
app.route("/api/auth", authRouter);
app.route("/api/groups", groupsRouter);
app.route("/api/spaces", spacesRouter);
app.route("/api/subscriptions", subscriptionsRouter);

// Error handler
app.onError(errorHandler);

const PORT = parseInt(process.env.API_PORT || "3001");

console.log(`🚀 Server running on http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});
