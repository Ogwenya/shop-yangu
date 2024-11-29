import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open SQLite database
export async function openDb() {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  // Initialize tables
  await db.exec(`
     CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

  return db;
}
