import { type UIFieldServerProps } from 'payload';
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_VISITS_SLUG } from '~/collections/collectionSlugs';
import { strings } from '~/resources';
import PrivateGalleryVisitsClient from './client';
import styles from './styles.module.css';

const PrivateGalleryVisits = async ({ siblingData, payload }: UIFieldServerProps) => {
    const { id } = siblingData;

    if (!id) {
        return null;
    }

    // Fetch gallery data to get the wedding date
    const gallery = await payload.findByID({
        collection: PRIVATE_GALLERIES_SLUG,
        id,
    });

    if (!gallery) {
        return null;
    }

    const galleryDate = new Date(gallery.date);
    const initialEndDate = new Date(galleryDate);
    initialEndDate.setDate(initialEndDate.getDate() + 30);
    const initialStartDate = galleryDate;

    const visits = (await payload.find({
        collection: PRIVATE_GALLERY_VISITS_SLUG,
        where: {
            gallery: {
                equals: id
            }
        },
        sort: 'date',
        limit: Number.MAX_SAFE_INTEGER,
    })).docs.map(visit => ({
        date: visit.date || new Date().toISOString(),
        ip: visit.ip || ''
    }));

    if (visits.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.statsGrid}>
                    <div className={styles.statsCard}>
                        <h3 className={styles.statsTitle}>{strings.admin.privateGalleryVisits.noVisits}</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PrivateGalleryVisitsClient
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
            galleryDate={galleryDate}
            visits={visits}
        />
    );
}

export default PrivateGalleryVisits;
