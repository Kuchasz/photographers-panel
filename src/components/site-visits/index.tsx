import { type UIFieldServerProps } from 'payload';
import { strings } from '~/resources';
import { SITE_VISITS_SLUG } from '../../collections/collectionSlugs';
import SiteVisitsClient from './client';
import styles from './styles.module.css';

const SiteVisits = async ({ payload }: UIFieldServerProps) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalVisitsResult, todayVisitsResult, visitsResult] = await Promise.all([
        payload.count({ collection: SITE_VISITS_SLUG }),
        payload.count({
            collection: SITE_VISITS_SLUG,
            where: {
                date: {
                    greater_than_equal: todayStart.toISOString(),
                },
            },
        }),
        payload.find({
            collection: SITE_VISITS_SLUG,
            where: {
                date: {
                    greater_than_equal: thirtyDaysAgo.toISOString()
                }
            },
            sort: 'date',
            limit: Number.MAX_SAFE_INTEGER,
        })
    ]);

    const visits = visitsResult.docs.map(visit => ({
        date: visit.date || new Date().toISOString(),
        ip: visit.ip || ''
    }));

    if (visits.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.statsGrid}>
                    <div className={styles.statsCard}>
                        <h3 className={styles.statsTitle}>{strings.admin.siteVisits.noVisits}</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <SiteVisitsClient
            initialStartDate={thirtyDaysAgo}
            initialEndDate={new Date()}
            visits={visits}
            totalVisits={totalVisitsResult.totalDocs}
            todayVisits={todayVisitsResult.totalDocs}
        />
    );
}

export default SiteVisits;