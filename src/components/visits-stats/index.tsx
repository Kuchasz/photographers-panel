import styles from './styles.module.css';
import { strings } from '~/resources';

interface VisitsStatsProps {
    todaysVisits: number;
    totalVisits: number;
    todaysVisitsLabel?: string;
    totalVisitsLabel?: string;
}

export default function VisitsStats({ 
    todaysVisits, 
    totalVisits, 
    todaysVisitsLabel = strings.admin.siteVisits.todaysVisits,
    totalVisitsLabel = strings.admin.siteVisits.totalVisits
}: VisitsStatsProps) {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
                <h3 className={styles.statsTitle}>{todaysVisitsLabel}</h3>
                <p className={styles.statsValue}>{todaysVisits}</p>
            </div>
            <div className={styles.statsCard}>
                <h3 className={styles.statsTitle}>{totalVisitsLabel}</h3>
                <p className={styles.statsValue}>{totalVisits}</p>
            </div>
        </div>
    );
} 