import apiClient from './client';
import type { ApiResponse } from '../types';

export interface DayEndSummary {
    date: string;
    totalSales: number;
    totalOrders: number;
    paymentMethods: { method: string; amount: number; count: number }[];
    categorySales: { category: string; amount: number; count: number }[];
    openedAt: string;
    closedAt?: string;
}

export const getDayEndReport = async (date?: string): Promise<DayEndSummary> => {
    const response = await apiClient.get<ApiResponse<DayEndSummary>>('/reports/day-end', {
        params: { date }
    });
    return response.data.data;
};

export const closeDay = async (date?: string): Promise<void> => {
    await apiClient.post('/reports/close-day', { date });
};
