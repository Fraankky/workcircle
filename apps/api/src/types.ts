import type { Context as HonoContext } from "hono";

export type UserPayload = {
  id: string;
  email: string;
  plan: "free" | "pro" | "team";
};

export type Context = HonoContext & {
  Variables: {
    user: UserPayload | null;
  };
};
