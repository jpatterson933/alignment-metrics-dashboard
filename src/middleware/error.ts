import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class ErrorHandler {
  /**
   * Express error handling middleware
   */
  static handle = (
    error: Error | unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const err = error as Error;

    console.error("Error caught in middleware:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    // Handle Zod validation errors
    if (err instanceof ZodError) {
      res.status(400).json({
        error: "Validation failed",
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      });
      return;
    }

    // Handle all other errors
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message || "An unexpected error occurred",
    });
  };
}
