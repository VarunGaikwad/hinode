import { Request, Response, NextFunction } from "express";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7).trim();
  const expected = process.env.SERVER_CLIENT_TOKEN;
  if (!expected || token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
