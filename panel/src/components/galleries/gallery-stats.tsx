import React from 'react';

interface Props {
    todayVisits: number;
    totalVisits: number;
    bestDay: string;
    bestDayVisits: number;
    rangeDays: number;
    rangeVisits: number;
    emails: number;
}

export const GalleryStats = ({todayVisits, totalVisits, bestDay, bestDayVisits, rangeDays, rangeVisits, emails}: Props) => <>
    <div className="stats">
        <span>Today visits:  <strong>{todayVisits}</strong></span>
        <span>Total visits:  <strong>{totalVisits}</strong></span>
        <span>Over {rangeDays} days visits:  <strong>{rangeVisits}</strong></span>
        <span>Best day:  <strong>{bestDay}</strong> ({bestDayVisits})</span>
        <span>Emails:  <strong>{emails}</strong></span>
    </div>
</>;