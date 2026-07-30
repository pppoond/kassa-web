import apiClient from './client';
import type { ApiResponse } from '../types';

export interface CreateOrderItemOption {
    optionId: string;
    quantity: number;
    price: number;
}

export interface CreateOrderItem {
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    note?: string;
    options?: CreateOrderItemOption[];
}

export interface CreateOrderRequest {
    branchId: string;
    tableId: string;
    items: CreateOrderItem[];
    notes?: string;
    discountAmount?: number;
}

export interface CreateOrderResult {
    id: string;
    totalAmount: number;
}

export interface PlaceOrderRequest {
    branchId: string;
    tableId: string;
    items: CreateOrderItem[];
    notes?: string;
    discountAmount?: number;
}

export interface PlaceOrderResult {
    orderId: string;
    subOrderId: string;
    roundNo: number;
    totalAmount: number;
}

export interface KitchenSubOrder {
    id: string;
    orderId: string;
    roundNo: number;
    status: string;
    notes?: string;
    tableName: string;
    createdAt: string;
    items: KitchenOrderItem[];
}

export interface KitchenOrderItem {
    id: string;
    menuItemId: string;
    menuItemName: string;
    quantity: number;
    note?: string;
    status: string;
    options: KitchenItemOption[];
}

export interface KitchenItemOption {
    optionId: string;
    optionName: string;
    quantity: number;
    price: number;
}

export const createOrder = async (data: CreateOrderRequest): Promise<CreateOrderResult> => {
    const response = await apiClient.post<ApiResponse<CreateOrderResult>>('/orders', data);
    return response.data.data;
};

export const placeOrder = async (data: PlaceOrderRequest): Promise<PlaceOrderResult> => {
    const response = await apiClient.post<ApiResponse<PlaceOrderResult>>('/orders/place', data);
    return response.data.data;
};

export const getKitchenOrders = async (): Promise<KitchenSubOrder[]> => {
    const response = await apiClient.get<ApiResponse<KitchenSubOrder[]>>('/orders/kitchen');
    return response.data.data;
};

export const updateOrderItemStatus = async (itemId: string, status: string): Promise<void> => {
    await apiClient.patch(`/orders/items/${itemId}/status`, { status });
};

export interface OrderListItem {
    id: string;
    tableId: string;
    tableName: string;
    totalAmount: number;
    status: string;
}

export const getOrders = async (branchId?: string): Promise<OrderListItem[]> => {
    const response = await apiClient.get<ApiResponse<OrderListItem[]>>('/orders', { params: { branchId } });
    return response.data.data;
};

export const getOrder = async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/orders/${id}`);
    return response.data.data;
};

export const completeOrder = async (id: string): Promise<void> => {
    await apiClient.post(`/orders/${id}/complete`);
};

export const cancelOrder = async (id: string): Promise<void> => {
    await apiClient.post(`/orders/${id}/cancel`);
};
