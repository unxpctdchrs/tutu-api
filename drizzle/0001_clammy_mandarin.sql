DO $$ BEGIN
 CREATE TYPE "public"."jenjangPendidikan" AS ENUM('Siswa', 'Mahasiswa');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birthDatePlace" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phoneNumber" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "jenjangPendidikan" "jenjangPendidikan";