'use client';

import { useState } from 'react';
import VisitsChart from '../visits-chart';
import VisitsStats from '../visits-stats';
import DateRangeSelector from '../date-range-selector';
import styles from './styles.module.css';
import { strings } from '~/resources';
import { distinct, groupBy, range } from '~/lib/array';
import { subtractDays } from '~/lib/date';

interface SiteVisitDoc {
    date: string;
    ip: string;
}

interface SiteVisitsClientProps {
    initialStartDate: Date;
    initialEndDate: Date;
    totalVisits: number;
    todayVisits: number;
    visits: SiteVisitDoc[];
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

export default function SiteVisitsClient({ 
    initialStartDate, 
    initialEndDate, 
    totalVisits,
    todayVisits,
    visits 
}: SiteVisitsClientProps) {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const handleDateRangeChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const filteredVisits = visits.filter(visit => {
        const visitDate = new Date(visit.date);
        return visitDate >= startDate && visitDate <= endDate;
    });

    const visitsByDay = groupBy(filteredVisits, (visit) => {
        return formatDateYYYYMMDD(new Date(visit.date));
    });

    const daysToShow = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const dailyVisits = range(daysToShow)
        .map(i => formatDateYYYYMMDD(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)))
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
            <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={handleDateRangeChange}
                minDate={subtractDays(new Date(), 365)}
                maxDate={new Date()}
            />

            <VisitsStats
                todaysVisits={todayVisits}
                totalVisits={totalVisits}
            />

            <VisitsChart
                data={dailyVisits}
                title={strings.admin.siteVisits.trafficAnalysis}
                subtitle={`${strings.admin.siteVisits.lastDays} (${formatDate(startDate)} - ${formatDate(endDate)})`}
            />
        </div>
    );
}