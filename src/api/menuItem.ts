import apiClient from './client';
import type { MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest, ApiResponse, PagedList } from '../types';

export const getMenuItems = async (categoryId?: string): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<PagedList<any>>>('/menus/items', {
        params: { categoryId }
    });
    
    // Map backend property names (BasePrice -> price, IsActive -> isAvailable)
    const items = response.data.data.items.map((item: any) => ({
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.basePrice || item.price,
        imageUrl: item.imageUrl,
        isAvailable: item.isActive ?? item.isAvailable ?? true
    }));
    
    return items;
};

export const createMenuItem = async (data: CreateMenuItemRequest) => {
    const response = await apiClient.post<ApiResponse<any>>('/menus', {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        basePrice: data.price,
        imageUrl: data.imageUrl
    });
    return response.data;
};

export const updateMenuItem = async (id: string, data: UpdateMenuItemRequest) => {
    const response = await apiClient.put<ApiResponse<any>>(`/menus/${id}`, {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        basePrice: data.price,
        imageUrl: data.imageUrl,
        isActive: data.isAvailable
    });
    return response.data;
};

export const deleteMenuItem = async (id: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/menus/${id}`);
    return response.data;
};
