CREATE TABLE `answers_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`questionId` integer NOT NULL,
	`type` text NOT NULL,
	`textContent` text,
	`audioPath` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`questionId`) REFERENCES `questions_table`(`id`) ON UPDATE no action ON DELETE cascade
);
