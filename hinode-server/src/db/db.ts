import sqlite3 from 'sqlite3';
import fs from 'fs';
import path, { join } from 'path';

// Resolve database file path from environment or fall back to ./data/hinode.db relative to project root
const dbFilePath = process.env.DATABASE_URL || join(__dirname, '..', '..', 'data', 'hinode.db');

// Open SQLite connection with read/write and create flags
fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
export const db = new sqlite3.Database(
  dbFilePath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('Failed to open SQLite database:', err);
    } else {
      console.log(`SQLite database opened at ${dbFilePath}`);
    }
  }
);

/**
 * Executes the schema.sql migrations to ensure required tables exist.
 */
export async function runMigrations(): Promise<void> {
  try {
    const schemaPath = join(__dirname, 'schema.sql');
    const sql = await fs.promises.readFile(schemaPath, 'utf-8');
    await new Promise<void>((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) {
          console.error('Error executing migrations:', err);
          reject(err);
        } else {
          console.log('Database migrations executed successfully.');
          resolve();
        }
      });
    });
  } catch (e) {
    console.error('Failed to run migrations:', e);
    throw e;
  }
}
