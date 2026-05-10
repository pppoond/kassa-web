import apiClient from './client';
import type { SystemStatus, SetupData, ApiResponse } from '../types';

export const getSystemStatus = async (): Promise<SystemStatus> => {
    const response = await apiClient.get<ApiResponse<SystemStatus>>('/system/status');
    return response.data.data;
};

export const setupSystem = async (data: SetupData): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/system/setup', data);
    return response.data;
};
