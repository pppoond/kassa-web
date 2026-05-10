import apiClient from './client';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest, ApiResponse, PagedList } from '../types';

export const getCategories = async (branchId: string): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<PagedList<Category>>>('/categories', {
        params: { branchId }
    });
    return response.data.data.items; 
};

export const createCategory = async (data: CreateCategoryRequest): Promise<ApiResponse<{ id: string }>> => {
    const response = await apiClient.post<ApiResponse<{ id: string }>>('/categories', data);
    return response.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/categories/${id}`, data);
    return response.data;
};
