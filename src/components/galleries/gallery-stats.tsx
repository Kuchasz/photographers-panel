import React from 'react';

interface Props {
    today: number;
    total: number;
    bestDay: string;
    days: number;
    daysTotal: number;
}

export const GalleryStats = ({today, total, bestDay, days, daysTotal}: Props) => <>
    <div className="stats">
        <span>Today visits:  <strong>{today}</strong></span>
        <span>Total visits:  <strong>{total}</strong></span>
        <span>Past {days} days visits:  <strong>{daysTotal}</strong></span>
        <span>Best day:  <strong>{bestDay}</strong></span>
    </div>
</>;