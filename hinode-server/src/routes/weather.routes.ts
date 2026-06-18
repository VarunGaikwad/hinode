// Weather routes
import { Router, Request, Response, NextFunction } from "express";
import { getCurrentWeather } from "../services/weather.service";

const router = Router();

router.get("/current", async (req: Request, res: Response, next: NextFunction) => {
  const latParam = req.query.lat;
  const lonParam = req.query.lon;
  const city = typeof req.query.city === "string" ? req.query.city : undefined;
  const unit = typeof req.query.unit === "string" ? (req.query.unit as "metric" | "imperial") : "metric";

  const lat = latParam !== undefined ? Number(latParam) : undefined;
  const lon = lonParam !== undefined ? Number(lonParam) : undefined;

  try {
    const weather = await getCurrentWeather({ lat, lon, city, unit });
    res.json({ weather });
  } catch (err) {
    next(err);
  }
});

export default router;
