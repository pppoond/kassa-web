import apiClient from './client';
import type { ApiResponse } from '../types';

export interface Table {
    id: string;
    branchId: string;
    code: string;
    name: string;
    isActive: boolean;
}

export interface CreateTableRequest {
    branchId: string;
    code: string;
    name: string;
}

export interface UpdateTableRequest {
    code: string;
    name: string;
}

export const getTables = async (branchId?: string): Promise<Table[]> => {
    const response = await apiClient.get<ApiResponse<Table[]>>('/tables', {
        params: { branchId }
    });
    return response.data.data;
};

export const getTable = async (id: string): Promise<Table> => {
    const response = await apiClient.get<ApiResponse<Table>>(`/tables/${id}`);
    return response.data.data;
};

export const createTable = async (data: CreateTableRequest): Promise<{ id: string }> => {
    const response = await apiClient.post<ApiResponse<{ id: string }>>('/tables', data);
    return response.data.data;
};

export const updateTable = async (id: string, data: UpdateTableRequest): Promise<void> => {
    await apiClient.put(`/tables/${id}`, data);
};

export const toggleTableActive = async (id: string): Promise<{ id: string; isActive: boolean }> => {
    const response = await apiClient.patch<ApiResponse<{ id: string; isActive: boolean }>>(`/tables/${id}/deactivate`);
    return response.data.data;
};
