import apiClient from './client';
import type { ApiResponse } from '../types';

export interface StaffMember {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    avatarUrl?: string;
    isActive: boolean;
    createdAt: string;
}

export const getStaffList = async (): Promise<StaffMember[]> => {
    const response = await apiClient.get<ApiResponse<StaffMember[]>>('/auth/users');
    return response.data.data;
};

export const resetStaffPassword = async (username: string, newPassword: string): Promise<void> => {
    await apiClient.post(`/auth/users/${username}/reset-password`, { newPassword });
};
