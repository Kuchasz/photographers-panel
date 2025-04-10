import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_private_galleries_state" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_events_type" AS ENUM('login', 'logout', 'view', 'create', 'update', 'delete');
  CREATE TYPE "public"."enum_opinions_source" AS ENUM('google', 'facebook', 'pm');
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "private_galleries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"state" "enum_private_galleries_state" DEFAULT 'draft' NOT NULL,
  	"password" varchar NOT NULL,
  	"direct_path" varchar NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "private_gallery_visits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ip" varchar,
  	"date" timestamp(3) with time zone,
  	"user_agent" varchar,
  	"gallery_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "private_gallery_auth_tokens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"token" varchar NOT NULL,
  	"gallery_id" integer NOT NULL,
  	"ip_address" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "private_gallery_media_downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" varchar NOT NULL,
  	"gallery_id" integer NOT NULL,
  	"token_id" integer NOT NULL,
  	"ip" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"alias" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"desc" varchar NOT NULL,
  	"descshort" varchar NOT NULL,
  	"video_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user" varchar,
  	"type" "enum_events_type" NOT NULL,
  	"occured_on" timestamp(3) with time zone NOT NULL,
  	"details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_visits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ip" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"user_agent" varchar,
  	"referrer" varchar,
  	"path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "offer_media" (
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
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "opinions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"media_id" integer,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"source" "enum_opinions_source" NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"is_published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "opinion_media" (
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
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"order" numeric DEFAULT 0,
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
  	"sizes_big_url" varchar,
  	"sizes_big_width" numeric,
  	"sizes_big_height" numeric,
  	"sizes_big_mime_type" varchar,
  	"sizes_big_filesize" numeric,
  	"sizes_big_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "instagram_tokens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Instagram Access Token' NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"access_token" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"private_galleries_id" integer,
  	"private_gallery_visits_id" integer,
  	"private_gallery_auth_tokens_id" integer,
  	"private_gallery_media_downloads_id" integer,
  	"videos_id" integer,
  	"events_id" integer,
  	"site_visits_id" integer,
  	"offer_media_id" integer,
  	"opinions_id" integer,
  	"opinion_media_id" integer,
  	"photos_id" integer,
  	"instagram_tokens_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "offer_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"content" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "offer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" jsonb,
  	"desc_short" varchar NOT NULL,
  	"tags" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "offer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"offer_media_id" integer
  );
  
  DO $$ BEGIN
   ALTER TABLE "private_gallery_visits" ADD CONSTRAINT "private_gallery_visits_gallery_id_private_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."private_galleries"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "private_gallery_auth_tokens" ADD CONSTRAINT "private_gallery_auth_tokens_gallery_id_private_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."private_galleries"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "private_gallery_media_downloads" ADD CONSTRAINT "private_gallery_media_downloads_gallery_id_private_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."private_galleries"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "private_gallery_media_downloads" ADD CONSTRAINT "private_gallery_media_downloads_token_id_private_gallery_auth_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."private_gallery_auth_tokens"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "opinions" ADD CONSTRAINT "opinions_media_id_opinion_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."opinion_media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_galleries_fk" FOREIGN KEY ("private_galleries_id") REFERENCES "public"."private_galleries"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_gallery_visits_fk" FOREIGN KEY ("private_gallery_visits_id") REFERENCES "public"."private_gallery_visits"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_gallery_auth_tokens_fk" FOREIGN KEY ("private_gallery_auth_tokens_id") REFERENCES "public"."private_gallery_auth_tokens"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_gallery_media_downloads_fk" FOREIGN KEY ("private_gallery_media_downloads_id") REFERENCES "public"."private_gallery_media_downloads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_visits_fk" FOREIGN KEY ("site_visits_id") REFERENCES "public"."site_visits"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offer_media_fk" FOREIGN KEY ("offer_media_id") REFERENCES "public"."offer_media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opinions_fk" FOREIGN KEY ("opinions_id") REFERENCES "public"."opinions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opinion_media_fk" FOREIGN KEY ("opinion_media_id") REFERENCES "public"."opinion_media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_instagram_tokens_fk" FOREIGN KEY ("instagram_tokens_id") REFERENCES "public"."instagram_tokens"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "offer_services" ADD CONSTRAINT "offer_services_photo_id_offer_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."offer_media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "offer_services" ADD CONSTRAINT "offer_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "offer_rels" ADD CONSTRAINT "offer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "offer_rels" ADD CONSTRAINT "offer_rels_offer_media_fk" FOREIGN KEY ("offer_media_id") REFERENCES "public"."offer_media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX IF NOT EXISTS "private_galleries_password_idx" ON "private_galleries" USING btree ("password");
  CREATE INDEX IF NOT EXISTS "private_galleries_updated_at_idx" ON "private_galleries" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "private_galleries_created_at_idx" ON "private_galleries" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "private_gallery_visits_gallery_idx" ON "private_gallery_visits" USING btree ("gallery_id");
  CREATE INDEX IF NOT EXISTS "private_gallery_visits_updated_at_idx" ON "private_gallery_visits" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "private_gallery_visits_created_at_idx" ON "private_gallery_visits" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "private_gallery_auth_tokens_gallery_idx" ON "private_gallery_auth_tokens" USING btree ("gallery_id");
  CREATE INDEX IF NOT EXISTS "private_gallery_auth_tokens_updated_at_idx" ON "private_gallery_auth_tokens" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "private_gallery_media_downloads_gallery_idx" ON "private_gallery_media_downloads" USING btree ("gallery_id");
  CREATE INDEX IF NOT EXISTS "private_gallery_media_downloads_token_idx" ON "private_gallery_media_downloads" USING btree ("token_id");
  CREATE INDEX IF NOT EXISTS "private_gallery_media_downloads_updated_at_idx" ON "private_gallery_media_downloads" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "private_gallery_media_downloads_created_at_idx" ON "private_gallery_media_downloads" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "videos_alias_idx" ON "videos" USING btree ("alias");
  CREATE INDEX IF NOT EXISTS "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "site_visits_updated_at_idx" ON "site_visits" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "site_visits_created_at_idx" ON "site_visits" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "offer_media_updated_at_idx" ON "offer_media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "offer_media_created_at_idx" ON "offer_media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "offer_media_filename_idx" ON "offer_media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "offer_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "offer_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "offer_media_sizes_card_sizes_card_filename_idx" ON "offer_media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "offer_media_sizes_full_sizes_full_filename_idx" ON "offer_media" USING btree ("sizes_full_filename");
  CREATE INDEX IF NOT EXISTS "opinions_media_idx" ON "opinions" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "opinions_updated_at_idx" ON "opinions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "opinions_created_at_idx" ON "opinions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "opinion_media_updated_at_idx" ON "opinion_media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "opinion_media_created_at_idx" ON "opinion_media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "opinion_media_filename_idx" ON "opinion_media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "opinion_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "opinion_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "opinion_media_sizes_card_sizes_card_filename_idx" ON "opinion_media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "opinion_media_sizes_full_sizes_full_filename_idx" ON "opinion_media" USING btree ("sizes_full_filename");
  CREATE INDEX IF NOT EXISTS "photos_updated_at_idx" ON "photos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "photos_created_at_idx" ON "photos" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "photos_filename_idx" ON "photos" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "photos_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "photos" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "photos_sizes_big_sizes_big_filename_idx" ON "photos" USING btree ("sizes_big_filename");
  CREATE INDEX IF NOT EXISTS "instagram_tokens_updated_at_idx" ON "instagram_tokens" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "instagram_tokens_created_at_idx" ON "instagram_tokens" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_galleries_id_idx" ON "payload_locked_documents_rels" USING btree ("private_galleries_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_gallery_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("private_gallery_visits_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_gallery_auth_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("private_gallery_auth_tokens_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_private_gallery_media_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("private_gallery_media_downloads_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_site_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("site_visits_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_offer_media_id_idx" ON "payload_locked_documents_rels" USING btree ("offer_media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_opinions_id_idx" ON "payload_locked_documents_rels" USING btree ("opinions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_opinion_media_id_idx" ON "payload_locked_documents_rels" USING btree ("opinion_media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("photos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_instagram_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("instagram_tokens_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "offer_services_order_idx" ON "offer_services" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "offer_services_parent_id_idx" ON "offer_services" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "offer_services_photo_idx" ON "offer_services" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "offer_rels_order_idx" ON "offer_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "offer_rels_parent_idx" ON "offer_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "offer_rels_path_idx" ON "offer_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "offer_rels_offer_media_id_idx" ON "offer_rels" USING btree ("offer_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "private_galleries" CASCADE;
  DROP TABLE "private_gallery_visits" CASCADE;
  DROP TABLE "private_gallery_auth_tokens" CASCADE;
  DROP TABLE "private_gallery_media_downloads" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "site_visits" CASCADE;
  DROP TABLE "offer_media" CASCADE;
  DROP TABLE "opinions" CASCADE;
  DROP TABLE "opinion_media" CASCADE;
  DROP TABLE "photos" CASCADE;
  DROP TABLE "instagram_tokens" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "offer_services" CASCADE;
  DROP TABLE "offer" CASCADE;
  DROP TABLE "offer_rels" CASCADE;
  DROP TYPE "public"."enum_private_galleries_state";
  DROP TYPE "public"."enum_events_type";
  DROP TYPE "public"."enum_opinions_source";`)
}
