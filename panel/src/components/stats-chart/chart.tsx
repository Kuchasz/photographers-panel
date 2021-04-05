import React from 'react';
import { getDayAndMonth } from '@pp/utils/date';
import ChartistGraph from 'react-chartist';

export type ChartData = {
    date: string;
    value: number;
};

const chartOptions = {
    low: 0,
    showArea: true,
    height: 300,
    fullWidth: true,
};

const formatDateToDayAndMonth = (dateString: string) => getDayAndMonth(new Date(dateString));

const getData = (items: ChartData[]) => ({
    labels: items.map((item) => formatDateToDayAndMonth(item.date)),
    series: [items.map((item) => Number(item.value))],
});

export const Chart = ({ items }: { items: ChartData[] }) => (
    <div className="chart">
        <ChartistGraph data={getData(items)} options={chartOptions} type={'Line'} />
    </div>
);
