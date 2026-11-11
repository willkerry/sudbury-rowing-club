CREATE TABLE `inflight_contacts` (
	`expires_at` integer NOT NULL,
	`message_id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inflight_contacts_expires_at` ON `inflight_contacts` (`expires_at`);