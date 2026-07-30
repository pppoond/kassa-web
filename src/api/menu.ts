import apiClient from './client';
import type { CategoryMenuDto, ApiResponse } from '../types';

export const fetchMenu = async (): Promise<CategoryMenuDto[]> => {
    const response = await apiClient.get<ApiResponse<CategoryMenuDto[]>>('/menus');
    return response.data.data;
};
