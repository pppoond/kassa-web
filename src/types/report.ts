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
    date: string; // ISO Date string
    totalSales: number;
    totalOrders: number;
    cashSales: number;
    qrcodeSales: number;
    creditCardSales: number;
    paymentMethods: PaymentMethodSummaryDto[];
    categorySales: CategorySalesSummaryDto[];
    openedAt: string;
    closedAt?: string;
}
