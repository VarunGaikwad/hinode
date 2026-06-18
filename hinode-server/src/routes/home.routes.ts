import { Router, Request, Response, NextFunction } from "express";
import { getHomePayload } from "../services/home.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lat = typeof req.query.lat === "string" ? parseFloat(req.query.lat) : undefined;
    const lon = typeof req.query.lon === "string" ? parseFloat(req.query.lon) : undefined;
    const city = typeof req.query.city === "string" ? req.query.city : undefined;
    const unit = typeof req.query.unit === "string" && (req.query.unit === "metric" || req.query.unit === "imperial") ? req.query.unit : undefined;
    const backgroundQuery = typeof req.query.backgroundQuery === "string" ? req.query.backgroundQuery : undefined;
    const language = typeof req.query.language === "string" ? req.query.language : undefined;

    const payload = await getHomePayload({
      lat,
      lon,
      city,
      unit,
      backgroundQuery,
      language,
    });
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

export default router;
