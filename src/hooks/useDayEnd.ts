import { useState } from 'react';
import { getDayEndReport, closeDay as closeDayApi } from '../api/report';
import type { DayEndSummary } from '../api/report';

export const useDayEnd = () => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<DayEndSummary | null>(null);

    const fetchDayEndSummary = async (date?: string) => {
        setLoading(true);
        try {
            const data = await getDayEndReport(date);
            setSummary(data);
        } catch (err) {
            console.error('Failed to fetch day-end report', err);
        } finally {
            setLoading(false);
        }
    };

    const closeDay = async () => {
        setLoading(true);
        try {
            await closeDayApi(summary?.date);
            // Re-fetch to get updated closedAt
            await fetchDayEndSummary(summary?.date);
        } catch (err) {
            console.error('Failed to close day', err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, summary, fetchDayEndSummary, closeDay };
};
