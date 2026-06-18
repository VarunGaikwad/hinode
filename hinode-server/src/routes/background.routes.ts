import { Router, Request, Response, NextFunction } from "express";
import { getBackground } from "../services/background.service";

const router = Router();

router.get("/today", async (req: Request, res: Response, next: NextFunction) => {
  const query = typeof req.query.query === "string" && req.query.query.length > 0 ? req.query.query : "nature";
  try {
    const background = await getBackground(query, false);
    res.json({ background });
  } catch (err) {
    next(err);
  }
});

router.get("/random", async (req: Request, res: Response, next: NextFunction) => {
  const query = typeof req.query.query === "string" && req.query.query.length > 0 ? req.query.query : "nature";
  try {
    const background = await getBackground(query, true);
    res.json({ background });
  } catch (err) {
    next(err);
  }
});

export default router;
