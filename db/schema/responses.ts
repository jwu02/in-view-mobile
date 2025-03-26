import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { questionsTable } from "./questions";

export const responsesTable = sqliteTable("responses_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  questionId: integer()
    .notNull()
    .references(() => questionsTable.id, { onDelete: "cascade" }),
  type: text({ enum: ["text", "audio"] }).notNull(),
  textContent: text(),
  audioPath: text(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});
