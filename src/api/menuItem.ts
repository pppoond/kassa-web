import apiClient from './client';
import type { MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest, ApiResponse, PagedList } from '../types';

interface MenuItemBackend {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    basePrice: number;
    imageUrl: string | null;
    isActive: boolean;
}

export const getMenuItems = async (categoryId?: string): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<PagedList<MenuItemBackend>>>('/menus/items', {
        params: { categoryId }
    });
    
    // Map backend property names (basePrice -> price, isActive -> isAvailable)
    return response.data.data.items.map((item) => ({
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || undefined,
        price: item.basePrice,
        imageUrl: item.imageUrl || undefined,
        isAvailable: item.isActive
    }));
};

export const createMenuItem = async (data: CreateMenuItemRequest): Promise<ApiResponse<{ id: string }>> => {
    const response = await apiClient.post<ApiResponse<{ id: string }>>('/menus', {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        basePrice: data.price,
        imageUrl: data.imageUrl
    });
    return response.data;
};

export const updateMenuItem = async (id: string, data: UpdateMenuItemRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/menus/${id}`, {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        basePrice: data.price,
        imageUrl: data.imageUrl,
        isActive: data.isAvailable
    });
    return response.data;
};

export const deleteMenuItem = async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/menus/${id}`);
    return response.data;
};
