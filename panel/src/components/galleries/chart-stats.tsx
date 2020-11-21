import React from 'react';
import { Loader } from 'rsuite';

export interface ChartStat {
    label: string;
    value: string | boolean | number;
}

interface Props {
    isLoading: boolean;
    stats: ChartStat[];
}

export const ChartStats = ({ isLoading, stats }: Props) => <>
    <div className="stats">
        <Loader className={isLoading ? 'visible' : 'collapsed'} />
        {stats.map(s => <span>{s.label}: <strong>{s.value}</strong></span>)}
    </div>
</>;