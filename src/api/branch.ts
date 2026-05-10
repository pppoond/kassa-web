import apiClient from './client';
import type { Branch, ApiResponse } from '../types';

export const getBranches = async (organizationId?: string): Promise<Branch[]> => {
    const response = await apiClient.get<ApiResponse<Branch[]>>('/branches', {
        params: { organizationId }
    });
    return response.data.data;
};
