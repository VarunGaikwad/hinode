import { Router, Request, Response } from "express";
import { getRandomShayari } from "../services/shayari.service";
import { adminAuth } from "../middleware/auth";
import { db } from "../db/db";

const router = Router();

router.get("/random", async (req: Request, res: Response) => {
  const language = typeof req.query.language === "string" ? req.query.language : undefined;
  try {
    const shayari = await getRandomShayari(language);
    if (shayari) {
      res.json({ shayari });
    } else {
      res.status(404).json({ error: "No shayari found" });
    }
  } catch (err) {
    console.error("Error fetching random shayari:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", adminAuth, async (req: Request, res: Response) => {
  const { id, text, language, category, mood, author } = req.body ?? {};
  if (!id || !text || !language) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const now = new Date().toISOString();
  db.run(
    "INSERT INTO shayari (id, text, language, category, mood, author, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)",
    [id, text, language, category ?? null, mood ?? null, author ?? null, now, now],
    (err) => {
      if (err) {
        console.error("Error inserting shayari:", err);
        // Detect duplicate primary key conflict
        if (err && (err as any).code === "SQLITE_CONSTRAINT") {
          res.status(409).json({ error: "Shayari with this ID already exists" });
        } else {
          res.status(500).json({ error: "Failed to create shayari" });
        }
        return;
      }
      res.status(201).json({ id });
    }
  );
});

export default router;
