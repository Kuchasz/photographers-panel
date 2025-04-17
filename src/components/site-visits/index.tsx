import { getPayload } from 'payload';
import { SITE_VISITS_SLUG } from '../../collections/collectionSlugs';
import { distinct, groupBy, range } from '../../lib/array';
import config from '../../payload.config';
import VisitsChart from '../visits-chart';
import styles from './styles.module.css';
import { strings } from '~/resources';

interface SiteVisitDoc {
  id: string | number;
  date: string;
  ip: string;
  userAgent?: string;
  referrer?: string;
  path?: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export default async function SiteVisits() {
  const endDate = new Date();
  const startDate = subtractDays(endDate, 30);

  const formattedStartDate = startDate.toISOString();
  const formattedEndDate = endDate.toISOString();

  const payload = await getPayload({ config });

  try {
    const totalVisitsResult = await payload.count({
      collection: SITE_VISITS_SLUG,
    });

    const totalVisits = totalVisitsResult.totalDocs;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayVisitsResult = await payload.count({
      collection: SITE_VISITS_SLUG,
      where: {
        date: {
          greater_than_equal: todayStart.toISOString(),
        },
      },
    });

    const todayVisits = todayVisitsResult.totalDocs;

    const rangeVisitsResult = await payload.find({
      collection: SITE_VISITS_SLUG,
      where: {
        date: {
          greater_than_equal: formattedStartDate,
          less_than_equal: formattedEndDate,
        },
      },
      sort: 'date',
      limit: Number.MAX_SAFE_INTEGER,
    });

    const visitsByDay = groupBy(rangeVisitsResult.docs as SiteVisitDoc[], (visit) => {
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
            <h3 className={styles.statsTitle}>{strings.admin.siteVisits.todaysVisits}</h3>
            <p className={styles.statsValue}>{todayVisits}</p>
          </div>
          <div className={styles.statsCard}>
            <h3 className={styles.statsTitle}>{strings.admin.siteVisits.totalVisits}</h3>
            <p className={styles.statsValue}>{totalVisits}</p>
          </div>
        </div>

        <VisitsChart
          data={dailyVisits}
          title={strings.admin.siteVisits.trafficAnalysis}
          subtitle={`${strings.admin.siteVisits.lastDays} (${formatDate(startDate)} - ${formatDate(endDate)})`}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching site visit data:', error);
    return (
      <div className={styles.errorMessage}>
        <p>{strings.admin.siteVisits.errorMessage}</p>
      </div>
    );
  }
}