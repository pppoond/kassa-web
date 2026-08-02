import apiClient from './client';
import type { ApiResponse } from '../types';

export interface CustomerInfo {
    orderId: string;
    tableName: string;
    tableCode: string;
    expiresAt: string;
}

export interface CustomerCategory {
    id: string;
    name: string;
    items: CustomerMenuItem[];
}

export interface CustomerMenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
}

export interface CustomerOptionGroup {
    id: string;
    name: string;
    isRequired: boolean;
    minSelections: number;
    maxSelections: number;
    options: CustomerOption[];
}

export interface CustomerOption {
    id: string;
    name: string;
    additionalPrice: number;
    isDefault: boolean;
}

export interface CustomerOrderItem {
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    note?: string;
    options?: { optionId: string; quantity: number; price: number }[];
}

export interface CustomerOrderResult {
    subOrderId: string;
    roundNo: number;
}

export const getCustomerInfo = async (token: string): Promise<CustomerInfo> => {
    const response = await apiClient.get<ApiResponse<CustomerInfo>>(`/customer/${token}/info`);
    return response.data.data;
};

export const getCustomerMenu = async (token: string): Promise<CustomerCategory[]> => {
    const response = await apiClient.get<ApiResponse<CustomerCategory[]>>(`/customer/${token}/menu`);
    return response.data.data;
};

export const getCustomerItemOptions = async (token: string, menuItemId: string): Promise<CustomerOptionGroup[]> => {
    const response = await apiClient.get<ApiResponse<CustomerOptionGroup[]>>(`/customer/${token}/options/${menuItemId}`);
    return response.data.data;
};

export const placeCustomerOrder = async (token: string, items: CustomerOrderItem[], notes?: string): Promise<CustomerOrderResult> => {
    const response = await apiClient.post<ApiResponse<CustomerOrderResult>>(`/customer/${token}/order`, { items, notes });
    return response.data.data;
};

// QR Generation (staff-only)
export const generateQrToken = async (
    branchId: string,
    tableId: string,
    expiryHours?: number,
    force = false,
): Promise<{ orderId: string; token: string; expiresAt: string }> => {
    const response = await apiClient.post<ApiResponse<{ orderId: string; token: string; expiresAt: string }>>('/orders/qr/generate', {
        branchId,
        tableId,
        expiryHours: expiryHours || 8,
        force,
    });
    return response.data.data;
};

/** สร้าง URL สำหรับให้ลูกค้า scan */
export const buildCustomerOrderUrl = (token: string) => `${window.location.origin}/customer/order/${token}`;
