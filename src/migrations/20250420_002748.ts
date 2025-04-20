import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "website_inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"wedding_date" varchar,
  	"wedding_place" varchar,
  	"wedding_venue" varchar,
  	"how_did_you_hear" varchar,
  	"additional_details" varchar,
  	"date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "website_inquiries_id" integer;
  CREATE INDEX IF NOT EXISTS "website_inquiries_updated_at_idx" ON "website_inquiries" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "website_inquiries_created_at_idx" ON "website_inquiries" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_website_inquiries_fk" FOREIGN KEY ("website_inquiries_id") REFERENCES "public"."website_inquiries"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_website_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("website_inquiries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "website_inquiries" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "website_inquiries" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_website_inquiries_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_website_inquiries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "website_inquiries_id";`)
}
