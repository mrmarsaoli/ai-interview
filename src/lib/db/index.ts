import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Create or connect to SQLite database
const sqlite = new Database(process.env.DATABASE_URL || 'sqlite.db');

// Enable foreign keys and WAL mode for better performance
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('journal_mode = WAL');

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

// Export the raw sqlite instance if needed
export { sqlite };

// Export all schema for easy access
export * from './schema';
