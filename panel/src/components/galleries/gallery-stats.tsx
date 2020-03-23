import React from 'react';
import { Loader } from 'rsuite';

interface Props {
    isLoading: boolean;
    todayVisits: number;
    totalVisits: number;
    bestDay: string;
    bestDayVisits: number;
    rangeDays: number;
    rangeVisits: number;
    emails: number;
}

export const GalleryStats = ({isLoading, todayVisits, totalVisits, bestDay, bestDayVisits, rangeDays, rangeVisits, emails}: Props) => <>
    <div className="stats">
        <Loader className={isLoading ? 'visible' : 'collapsed'}/>
        <span>Today visits:  <strong>{todayVisits}</strong></span>
        <span>Total visits:  <strong>{totalVisits}</strong></span>
        <span>Over {rangeDays} days visits:  <strong>{rangeVisits}</strong></span>
        <span>Best day:  <strong>{bestDay}</strong> ({bestDayVisits})</span>
        <span>Emails:  <strong>{emails}</strong></span>
    </div>
</>;