import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_blacklisted_emails_reason" ADD VALUE 'bot' BEFORE 'invalid';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "public"."blacklisted_emails" ALTER COLUMN "reason" SET DATA TYPE text;
  DROP TYPE "public"."enum_blacklisted_emails_reason";
  CREATE TYPE "public"."enum_blacklisted_emails_reason" AS ENUM('spam', 'invalid', 'user-request', 'bounced', 'other');
  ALTER TABLE "public"."blacklisted_emails" ALTER COLUMN "reason" SET DATA TYPE "public"."enum_blacklisted_emails_reason" USING "reason"::"public"."enum_blacklisted_emails_reason";`)
}
