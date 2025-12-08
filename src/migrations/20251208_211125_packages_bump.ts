import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_private_gallery_media_downloads_fk";
  
  DROP INDEX IF EXISTS "private_gallery_photo_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_private_gallery_auth_tokens_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_private_gallery_media_downloads_id_idx";
  ALTER TABLE "users_sessions" DROP CONSTRAINT IF EXISTS "users_sessions_parent_id_fk";
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_private_gallery_media_downl_fk";
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_gallery_media_downl_fk" FOREIGN KEY ("private_gallery_media_downloads_id") REFERENCES "public"."private_gallery_media_downloads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "private_gallery_photo_sizes_thumbnail_sizes_thumbnail_fi_idx" ON "private_gallery_photo" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_gallery_auth_token_idx" ON "payload_locked_documents_rels" USING btree ("private_gallery_auth_tokens_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_gallery_media_down_idx" ON "payload_locked_documents_rels" USING btree ("private_gallery_media_downloads_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "users_sessions" CASCADE;
  DROP TABLE IF EXISTS "payload_kv" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_private_gallery_media_downl_fk";
  
  DROP INDEX IF EXISTS "private_gallery_photo_sizes_thumbnail_sizes_thumbnail_fi_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_private_gallery_auth_token_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_private_gallery_media_down_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_private_gallery_media_downloads_fk";
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_gallery_media_downloads_fk" FOREIGN KEY ("private_gallery_media_downloads_id") REFERENCES "public"."private_gallery_media_downloads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "private_gallery_photo_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "private_gallery_photo" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_gallery_auth_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("private_gallery_auth_tokens_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_gallery_media_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("private_gallery_media_downloads_id");`)
}
