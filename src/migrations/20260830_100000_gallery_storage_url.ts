import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

const previousGalleryStorage = 'https://eu2.contabostorage.com/b198b89caced412197f2059257d331be:wed-gal-eu-001';
const currentGalleryStorage = 'https://wed-gal-waw-001.s3.waw.io.cloud.ovh.net';

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
    UPDATE "private_galleries"
    SET "direct_path" = replace(
      "direct_path",
      ${previousGalleryStorage},
      ${currentGalleryStorage}
    )
    WHERE "direct_path" LIKE ${`${previousGalleryStorage}%`};
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
    UPDATE "private_galleries"
    SET "direct_path" = replace(
      "direct_path",
      ${currentGalleryStorage},
      ${previousGalleryStorage}
    )
    WHERE "direct_path" LIKE ${`${currentGalleryStorage}%`};
  `);
}
