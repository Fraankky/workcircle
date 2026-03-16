import type { ErrorHandler } from "hono";
import { AppError } from "../exceptions.js";
import type { Context } from "../types.js";

export const errorHandler: ErrorHandler<Context> = (err, c) => {
  if (!(err instanceof AppError) || err.status >= 500) {
    console.error("Error:", err);
  }

  if (err instanceof AppError) {
    return c.json(
      {
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
        },
      },
      err.status as never
    );
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: (err as { issues?: unknown[] }).issues,
        },
      },
      400
    );
  }

  // Default error response
  return c.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    },
    500
  );
};
