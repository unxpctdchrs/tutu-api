DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'qm');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"uuid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"address" text,
	"isMentor" boolean DEFAULT false NOT NULL,
	"balance" bigint DEFAULT 0,
	"gender" "gender" DEFAULT 'qm'
);
