import React, { useState, useEffect } from "react";
import { addMonths } from "@pp/utils/dist/date";
import { Chart, ChartData } from "./chart";
import { ChartStat, ChartStats } from "./stats";
import { StatsRange } from "./stats-range";
import type { ValueType } from 'rsuite/DateRangePicker';
import "./styles.less";

type StatsItem = {
    id: number;
    date: string;
};

type ChartStatsData = {
    data: ChartData[];
    stats: ChartStat[];
};

interface Props<Item extends StatsItem> {
    selectedItem: Item;
    fetchChartStatsData: (startDate: Date, endDate: Date, item: number) => Promise<ChartStatsData>;
}

export function StatsChart<T extends StatsItem>({ selectedItem, fetchChartStatsData }: Props<T>) {
    const [isLoading, setIsLoading] = useState(false);
    const [disableAutoDate, setDisableAutoDate] = useState(false);
    const [startDate, setStartDate] = useState(addMonths(new Date(), -1));
    const [endDate, setEndDate] = useState(new Date());
    const [stats, setStats] = useState<ChartStat[]>([]);
    const [items, setItems] = useState<ChartData[]>([]);

    const toggleAutoDate = () => {
        setDisableAutoDate(!disableAutoDate);
    };

    const fetchStats = () => {
        if (!selectedItem) return;
        
        setIsLoading(true);

        const newStartDate = disableAutoDate ? startDate : new Date(selectedItem.date);
        const newEndDate = disableAutoDate
            ? endDate
            : addMonths(new Date(selectedItem.date), 1);

        fetchChartStatsData(newStartDate, newEndDate, selectedItem.id).then((resp) => {
            setIsLoading(false);
            setStats(resp.stats);
            setItems(resp.data);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
        });
    };

    useEffect(() => {
        if (selectedItem) {
            fetchStats();
        }
    }, [selectedItem?.id, disableAutoDate]);

    const onDateRangeChanged = (value: ValueType) => {
        if (!Array.isArray(value) || !value[0] || !value[1]) return;
        
        const [newStartDate, newEndDate] = value as [Date, Date];
        
        setDisableAutoDate(true);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        
        if (selectedItem) {
            setIsLoading(true);

            fetchChartStatsData(newStartDate, newEndDate, selectedItem.id).then((resp) => {
                setIsLoading(false);
                setStats(resp.stats);
                setItems(resp.data);
            });
        }
    };

    return (
        <div className="stats-chart">
            <header>
                <StatsRange
                    onAutoChanged={toggleAutoDate}
                    autoDisabled={disableAutoDate}
                    startDate={startDate}
                    endDate={endDate}
                    onRangeChange={onDateRangeChanged}
                />
                <span>
                    {stats != null ? (
                        <ChartStats isLoading={isLoading} stats={stats} />
                    ) : null}
                </span>
            </header>
            <Chart items={items} />
        </div>
    );
}
