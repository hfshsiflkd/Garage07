import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: err.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        });
      }
      next(err);
    }
  };

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("❌ Unhandled Error:", err);
  if (res.headersSent) return;
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
}
