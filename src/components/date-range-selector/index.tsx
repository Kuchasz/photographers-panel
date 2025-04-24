'use client';

import { useState } from 'react';
import { DatePicker } from '@payloadcms/ui';
import styles from './styles.module.css';
import { strings } from '~/resources';

interface DateRangeSelectorProps {
    startDate: Date;
    endDate: Date;
    onDateRangeChange: (startDate: Date, endDate: Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

export default function DateRangeSelector({
    startDate: initialStartDate,
    endDate: initialEndDate,
    onDateRangeChange,
    minDate,
    maxDate
}: DateRangeSelectorProps) {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const handleStartDateChange = (newStartDate: Date) => {
        setStartDate(newStartDate);
        onDateRangeChange(newStartDate, endDate);
    };

    const handleEndDateChange = (newEndDate: Date) => {
        setEndDate(newEndDate);
        onDateRangeChange(startDate, newEndDate);
    };

    return (
        <div className={styles.dateRangeContainer}>
            <div className={styles.dateInputGroup}>
                <label htmlFor="startDate">{strings.admin.dateRange.startDate}</label>
                <DatePicker
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            </div>
            <div className={styles.dateInputGroup}>
                <label htmlFor="endDate">{strings.admin.dateRange.endDate}</label>
                <DatePicker
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            </div>
        </div>
    );
} 