import type { Shayari } from "../types/shayari";
import { db } from "../db/db";

/**
 * Retrieves a random shayari from the database.
 * Optionally filters by language if provided.
 * Returns a Shayari object or null if none found.
 */
export async function getRandomShayari(language?: string): Promise<Shayari | null> {
  const baseQuery = "SELECT * FROM shayari";
  const whereClause = language ? " WHERE language = ?" : "";
  const query = `${baseQuery}${whereClause} ORDER BY RANDOM() LIMIT 1;`;
  const params = language ? [language] : [];

  return new Promise<Shayari | null>((resolve) => {
    db.get(query, params, (err, row) => {
      if (err) {
        console.error("Error fetching random shayari:", err);
        resolve(null);
        return;
      }
      resolve(row ? (row as Shayari) : null);
    });
  });
}
