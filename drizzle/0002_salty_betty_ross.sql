ALTER TABLE `answers_table` RENAME TO `responses_table`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_responses_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`questionId` integer NOT NULL,
	`type` text NOT NULL,
	`textContent` text,
	`audioPath` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`questionId`) REFERENCES `questions_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_responses_table`("id", "questionId", "type", "textContent", "audioPath", "createdAt") SELECT "id", "questionId", "type", "textContent", "audioPath", "createdAt" FROM `responses_table`;--> statement-breakpoint
DROP TABLE `responses_table`;--> statement-breakpoint
ALTER TABLE `__new_responses_table` RENAME TO `responses_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;