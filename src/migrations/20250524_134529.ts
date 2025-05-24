import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_website_inquiries_blacklist_reason" AS ENUM('spam', 'invalid', 'user-request', 'other');
  CREATE TYPE "public"."enum_blacklisted_emails_reason" AS ENUM('spam', 'invalid', 'user-request', 'bounced', 'other');
  CREATE TABLE IF NOT EXISTS "blacklisted_emails" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"reason" "enum_blacklisted_emails_reason" DEFAULT 'spam' NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "website_inquiries" ADD COLUMN "is_blacklisted" boolean DEFAULT false;
  ALTER TABLE "website_inquiries" ADD COLUMN "blacklist_reason" "enum_website_inquiries_blacklist_reason" DEFAULT 'spam';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blacklisted_emails_id" integer;
  CREATE UNIQUE INDEX IF NOT EXISTS "blacklisted_emails_email_idx" ON "blacklisted_emails" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "blacklisted_emails_updated_at_idx" ON "blacklisted_emails" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blacklisted_emails_created_at_idx" ON "blacklisted_emails" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blacklisted_emails_fk" FOREIGN KEY ("blacklisted_emails_id") REFERENCES "public"."blacklisted_emails"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blacklisted_emails_id_idx" ON "payload_locked_documents_rels" USING btree ("blacklisted_emails_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blacklisted_emails" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blacklisted_emails" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blacklisted_emails_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_blacklisted_emails_id_idx";
  ALTER TABLE "website_inquiries" DROP COLUMN IF EXISTS "is_blacklisted";
  ALTER TABLE "website_inquiries" DROP COLUMN IF EXISTS "blacklist_reason";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "blacklisted_emails_id";
  DROP TYPE "public"."enum_website_inquiries_blacklist_reason";
  DROP TYPE "public"."enum_blacklisted_emails_reason";`)
}
