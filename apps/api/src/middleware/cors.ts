import { cors } from "hono/cors";
import type { Context } from "../types.js";

export const corsMiddleware = cors({
  origin: ["http://localhost:5173"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});
