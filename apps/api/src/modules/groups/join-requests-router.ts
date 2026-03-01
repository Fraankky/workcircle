import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Context } from "../../types.js";
import { requireAuth } from "../../middleware/auth.js";
import { ForbiddenError, NotFoundError } from "../../exceptions.js";
import { submitJoinRequestSchema, reviewJoinRequestSchema } from "./join-requests-schema.js";
import {
  submitJoinRequest,
  getJoinRequestsForGroup,
  getMyJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
} from "./join-requests-service.js";
import { assertGroupAdmin } from "./service.js";
import { formatJoinRequest } from "./formatters.js";

// Mounted at /:groupId/join-requests
export const joinRequestsRouter = new Hono<Context>()

  .post("/", requireAuth, zValidator("json", submitJoinRequestSchema), async (c) => {
    const user = c.get("user")!;
    const groupId = c.req.param("id")!;
    const { message } = c.req.valid("json");
    const req = await submitJoinRequest(groupId, user.id, message);
    return c.json({ data: formatJoinRequest(req) }, 201);
  })

  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const groupId = c.req.param("id")!;
    await assertGroupAdmin(groupId, user.id);
    const requests = await getJoinRequestsForGroup(groupId);
    return c.json({ data: requests.map(formatJoinRequest) });
  })

  .get("/me", requireAuth, async (c) => {
    const user = c.get("user")!;
    const groupId = c.req.param("id")!;
    const req = await getMyJoinRequest(groupId, user.id);
    if (!req) throw new NotFoundError("Join request");
    return c.json({ data: formatJoinRequest(req) });
  })

  .patch("/:requestId", requireAuth, zValidator("json", reviewJoinRequestSchema), async (c) => {
    const user = c.get("user")!;
    const groupId = c.req.param("id")!;
    const requestId = c.req.param("requestId")!;
    await assertGroupAdmin(groupId, user.id);
    const { action, rejectionReason } = c.req.valid("json");

    const result =
      action === "approve"
        ? await approveJoinRequest(requestId)
        : await rejectJoinRequest(requestId, rejectionReason);

    return c.json({ data: formatJoinRequest(result) });
  });
