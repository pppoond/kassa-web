import apiClient from './client';
import type { ApiResponse } from '../types';

interface UploadResult {
    url: string;
}

/**
 * Upload ไฟล์ไปยัง API แล้วรับ URL กลับมา
 * @param file - File object จาก input[type=file]
 * @param module - ชื่อ module เพื่อแยก folder (e.g. "menus", "users", "branches")
 */
export const uploadFile = async (file: File, module: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<UploadResult>>(
        `/uploads/${module}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data.data.url;
};
