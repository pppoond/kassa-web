import apiClient from './client';
import type { ApiResponse } from '../types';

interface GodVerifyResult {
    token: string;
}

interface GodResetPasswordRequest {
    token: string;
    username: string;
    newPassword: string;
    confirmPassword: string;
}

export const godVerify = async (godPassword: string): Promise<string> => {
    const response = await apiClient.post<ApiResponse<GodVerifyResult>>('/system/god/verify', { godPassword });
    return response.data.data.token;
};

export const godResetPassword = async (data: GodResetPasswordRequest): Promise<void> => {
    await apiClient.post('/system/god/reset-password', data);
};
