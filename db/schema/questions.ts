import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const questionsTable = sqliteTable("questions_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  notes: text(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});
