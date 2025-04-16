import { type UIFieldServerProps } from 'payload';
import { PRIVATE_GALLERY_VISITS_SLUG } from '~/collections/collectionSlugs';
import { distinct, groupBy, range } from '~/lib/array';
import VisitsChart from '../visits-chart';
import styles from './styles.module.css';

// Helper function to format dates
function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

// Helper function to format date in YYYY-MM-DD format
function formatDateYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper function to subtract days from a date
function subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

const PrivateGalleryVisits = async ({ siblingData, payload }: UIFieldServerProps) => {
    const { id } = siblingData;

    if (!id) {
        return null;
    }

    const visits = (await payload.find({
        collection: PRIVATE_GALLERY_VISITS_SLUG,
        where: {
            gallery: {
                equals: id
            }
        }
    })).docs;

    const endDate = new Date();
    const startDate = subtractDays(endDate, 30);

    const formattedStartDate = startDate.toISOString();

    const totalVisits = visits.length;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayVisits = visits.filter((visit) =>
        new Date(visit.date!) >= todayStart
    ).length;

    const rangeVisits = visits.filter((visit) =>
        new Date(visit.date!) >= new Date(formattedStartDate)
    );

    const visitsByDay = groupBy(rangeVisits, (visit) => {
        if (visit.date) {
            return formatDateYYYYMMDD(new Date(visit.date));
        }
        return '';
    });

    const dailyVisits = range(30)
        .map(i => formatDateYYYYMMDD(subtractDays(endDate, 29 - i)))
        .map(day => {
            const dayVisits = visitsByDay[day] ?? [];
            const uniqueVisitors = distinct(dayVisits.map(visit => visit.ip)).length;

            return {
                date: formatDate(new Date(day)),
                visits: dayVisits.length,
                uniqueVisitors,
            };
        });

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                <div className={styles.statsCard}>
                    <h3 className={styles.statsTitle}>Today&apos;s Visits</h3>
                    <p className={styles.statsValue}>{todayVisits}</p>
                </div>
                <div className={styles.statsCard}>
                    <h3 className={styles.statsTitle}>Total Visits</h3>
                    <p className={styles.statsValue}>{totalVisits}</p>
                </div>
            </div>

            <VisitsChart
                data={dailyVisits}
                title="Gallery Traffic Analysis"
                subtitle={`Last 30 days (${formatDate(startDate)} - ${formatDate(endDate)})`}
            />
        </div>
    );
}

export default PrivateGalleryVisits;
