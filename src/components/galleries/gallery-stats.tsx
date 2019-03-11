import React from 'react';

interface Props {
    today: number;
    total: number;
    bestDay: string;
    days: number;
    daysTotal: number;
}

export const GalleryStats = ({today, total, bestDay, days, daysTotal}: Props) => <>
    <div style={{marginTop: '4px'}}>
        <span>Today visits:  <strong>{today}</strong></span>
        <span style={{marginLeft: '32px'}}>Total visits:  <strong>{total}</strong></span>
        <span style={{marginLeft: '32px'}}>Past {days} days visits:  <strong>{daysTotal}</strong></span>
        <span style={{marginLeft: '32px'}}>Best day:  <strong>{bestDay}</strong></span>
    </div>
</>;