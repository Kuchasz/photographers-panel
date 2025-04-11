import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "private_gallery_photo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  ALTER TABLE "private_galleries" ADD COLUMN "photo_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "private_gallery_photo_id" integer;
  CREATE INDEX IF NOT EXISTS "private_gallery_photo_updated_at_idx" ON "private_gallery_photo" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "private_gallery_photo_created_at_idx" ON "private_gallery_photo" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "private_gallery_photo_filename_idx" ON "private_gallery_photo" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "private_gallery_photo_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "private_gallery_photo" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "private_gallery_photo_sizes_hero_sizes_hero_filename_idx" ON "private_gallery_photo" USING btree ("sizes_hero_filename");
  DO $$ BEGIN
   ALTER TABLE "private_galleries" ADD CONSTRAINT "private_galleries_photo_id_private_gallery_photo_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."private_gallery_photo"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_gallery_photo_fk" FOREIGN KEY ("private_gallery_photo_id") REFERENCES "public"."private_gallery_photo"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "private_galleries_photo_idx" ON "private_galleries" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_gallery_photo_id_idx" ON "payload_locked_documents_rels" USING btree ("private_gallery_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "private_gallery_photo" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "private_gallery_photo" CASCADE;
  ALTER TABLE "private_galleries" DROP CONSTRAINT "private_galleries_photo_id_private_gallery_photo_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_private_gallery_photo_fk";
  
  DROP INDEX IF EXISTS "private_galleries_photo_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_private_gallery_photo_id_idx";
  ALTER TABLE "private_galleries" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "private_gallery_photo_id";`)
}
