CREATE TABLE `questions_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`notes` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP)
);
