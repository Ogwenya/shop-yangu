import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open SQLite database
export async function openDb() {
  try {
    const db = await open({
      filename: "./db.sqlite",
      driver: sqlite3.Database,
    });

    console.log("Database connection established");

    // Initialize tables
    await db.exec(`
     CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

    // -- Create the 'shop' table
    await db.exec(`
  CREATE TABLE IF NOT EXISTS shop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    logo TEXT
)
`);

    // -- Create the 'product' table
    await db.exec(`
  CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock_level INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    image TEXT,
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE
)
`);

    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}
