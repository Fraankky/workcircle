import { Hono } from "hono";
import type { Context } from "../../types.js";
import { groupsCrudRouter } from "./crud-router.js";
import { joinRequestsRouter } from "./join-requests-router.js";
import { actionsRouter } from "./actions-router.js";

export const groupsRouter = new Hono<Context>();

// CRUD: GET /, GET /mine, POST /, GET /:id, PATCH /:id, DELETE /:id
groupsRouter.route("/", groupsCrudRouter);

// Join requests: POST|GET /:id/join-requests, GET /:id/join-requests/me, PATCH /:id/join-requests/:requestId
groupsRouter.route("/:id/join-requests", joinRequestsRouter);

// Actions: POST /:id/leave, POST /:id/kick
groupsRouter.route("/:id", actionsRouter);
