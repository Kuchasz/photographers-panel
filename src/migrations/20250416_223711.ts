import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "videos" ALTER COLUMN "alias" DROP NOT NULL;
  ALTER TABLE "videos" ALTER COLUMN "desc" DROP NOT NULL;
  ALTER TABLE "videos" ALTER COLUMN "descshort" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "videos" ALTER COLUMN "alias" SET NOT NULL;
  ALTER TABLE "videos" ALTER COLUMN "desc" SET NOT NULL;
  ALTER TABLE "videos" ALTER COLUMN "descshort" SET NOT NULL;`)
}
