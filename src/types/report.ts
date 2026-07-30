export interface PaymentMethodSummaryDto {
    method: string;
    amount: number;
    count: number;
}

export interface CategorySalesSummaryDto {
    category: string;
    amount: number;
    count: number;
}

export interface DayEndSummaryDto {
    date: string;
    totalSales: number;
    totalOrders: number;
    paymentMethods: PaymentMethodSummaryDto[];
    categorySales: CategorySalesSummaryDto[];
    openedAt: string;
    closedAt?: string;
}
