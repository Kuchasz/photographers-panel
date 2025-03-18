import { getPayload } from 'payload';
import config from '../../payload.config';
import { SITE_VISITS_SLUG } from '../../collections/collectionSlugs';
import VisitsChart from '../visits-chart';
import styles from './styles.module.css';

// Define proper types for the site visit records from Payload
interface SiteVisitDoc {
  id: string | number;
  date: string;
  ip: string;
  userAgent?: string;
  referrer?: string;
  path?: string;
}

// Helper function to format dates without date-fns
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

export default async function SiteVisits() {
  // Calculate date range for the last 30 days
  const endDate = new Date();
  const startDate = subtractDays(endDate, 30);
  
  // Format for Payload query
  const formattedStartDate = startDate.toISOString();
  const formattedEndDate = endDate.toISOString();
  
  // Initialize Payload
  const payload = await getPayload({ config });
  
  try {
    // Get total visits count
    const totalVisitsResult = await payload.find({
      collection: SITE_VISITS_SLUG,
      limit: 0, // We only need the count
    });
    
    const totalVisits = totalVisitsResult.totalDocs;
    
    // Get today's visits
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayVisitsResult = await payload.find({
      collection: SITE_VISITS_SLUG,
      where: {
        date: {
          greater_than_equal: todayStart.toISOString(),
        },
      },
      limit: 0, // We only need the count
    });
    
    const todayVisits = todayVisitsResult.totalDocs;
    
    // Get visits within date range
    const rangeVisitsResult = await payload.find({
      collection: SITE_VISITS_SLUG,
      where: {
        date: {
          greater_than_equal: formattedStartDate,
          less_than_equal: formattedEndDate,
        },
      },
      limit: 1000, // Limit to 1000 records just in case
    });
    
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
    (rangeVisitsResult.docs as SiteVisitDoc[]).forEach((visit) => {
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
      uniqueVisitors: Math.round((visitsByDay.get(day) ?? 0) * 0.7), // Approximation for demo
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
          title="Website Traffic Analysis"
          subtitle={`Last 30 days (${formatDate(startDate)} - ${formatDate(endDate)})`}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching site visit data:', error);
    return (
      <div className={styles.errorMessage}>
        <p>Failed to load site visits data. Please try again later.</p>
      </div>
    );
  }
}