import { type UIFieldServerProps } from 'payload';
import { PRIVATE_GALLERY_VISITS_SLUG } from '~/collections/collectionSlugs';
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

    // Calculate date range for the last 30 days
    const endDate = new Date();
    const startDate = subtractDays(endDate, 30);

    // Format for filtering
    const formattedStartDate = startDate.toISOString();

    // Get total visits count
    const totalVisits = visits.length;

    // Get today's visits
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayVisits = visits.filter((visit) =>
        new Date(visit.date!) >= todayStart
    ).length;

    // Get visits within date range (last 30 days)
    const rangeVisits = visits.filter((visit) =>
        new Date(visit.date!) >= new Date(formattedStartDate)
    );

    // Organize data by day
    const visitsByDay = new Map<string, number>();
    const thirtyDaysPeriod: string[] = [];

    // Initialize all days in the period with zero visits
    for (let i = 0; i < 30; i++) {
        const day = subtractDays(endDate, i);
        const dayStr = formatDateYYYYMMDD(day);
        visitsByDay.set(dayStr, 0);
        thirtyDaysPeriod.unshift(dayStr); // Add to start to maintain chronological order
    }

    // Count visits per day
    rangeVisits.forEach((visit) => {
        if (visit.date) {
            const visitDate = new Date(visit.date);
            const dayKey = formatDateYYYYMMDD(visitDate);

            if (visitsByDay.has(dayKey)) {
                visitsByDay.set(dayKey, (visitsByDay.get(dayKey) ?? 0) + 1);
            }
        }
    });

    // Transform data for chart
    const dailyVisits = thirtyDaysPeriod.map(day => ({
        date: formatDate(new Date(day)),
        visits: visitsByDay.get(day) ?? 0,
        uniqueVisitors: Math.round((visitsByDay.get(day) ?? 0) * 0.8), // Approximation for unique visitors
    }));

    // Find best day
    let bestDay = { date: '', visits: 0 };
    for (const [day, count] of visitsByDay.entries()) {
        if (count > bestDay.visits) {
            bestDay = { date: day, visits: count };
        }
    }

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
