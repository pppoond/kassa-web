import { useState } from 'react';
import type { DayEndSummaryDto } from '../types/report';

export const useDayEnd = () => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<DayEndSummaryDto | null>(null);

    const fetchDayEndSummary = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data
        const mockSummary: DayEndSummaryDto = {
            date: new Date().toISOString(),
            totalSales: 15420.00,
            totalOrders: 45,
            cashSales: 5420.00,
            qrcodeSales: 8000.00,
            creditCardSales: 2000.00,
            paymentMethods: [
                { method: 'Cash', amount: 5420.00, count: 20 },
                { method: 'QR Code', amount: 8000.00, count: 18 },
                { method: 'Credit Card', amount: 2000.00, count: 7 },
            ],
            categorySales: [
                { category: 'Food', amount: 10500.00, count: 30 },
                { category: 'Beverage', amount: 3500.00, count: 10 },
                { category: 'Dessert', amount: 1420.00, count: 5 },
            ],
            openedAt: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
            closedAt: undefined
        };

        setSummary(mockSummary);
        setLoading(false);
    };

    const closeDay = async () => {
        setLoading(true);
         // Simulate API call
         await new Promise(resolve => setTimeout(resolve, 1500));
         if (summary) {
             setSummary({ ...summary, closedAt: new Date().toISOString() });
         }
         setLoading(false);
    };

    return {
        loading,
        summary,
        fetchDayEndSummary,
        closeDay
    };
};
