import apiClient from './client';
import type { ApiResponse } from '../types';

export interface RoleDto {
    id: string;
    name: string;
    description?: string;
    isSystem: boolean;
    permissions: PermissionDto[];
}

export interface PermissionDto {
    id: string;
    code: string;
    name: string;
    module?: string;
}

export interface UserBranchDto {
    id: string;
    branchId: string;
    branchName: string;
    canAccess: boolean;
}

export const getRoles = async (): Promise<RoleDto[]> => {
    const response = await apiClient.get<ApiResponse<RoleDto[]>>('/roles');
    return response.data.data;
};

export const getUserBranchPermissions = async (userId: string): Promise<UserBranchDto[]> => {
    const response = await apiClient.get<ApiResponse<UserBranchDto[]>>(`/roles/users/${userId}/branches`);
    return response.data.data;
};

export const assignBranchPermission = async (userId: string, branchId: string, canAccess: boolean): Promise<void> => {
    await apiClient.post(`/roles/users/${userId}/branches`, { branchId, canAccess });
};

export const revokeBranchPermission = async (userId: string, branchId: string): Promise<void> => {
    await apiClient.delete(`/roles/users/${userId}/branches/${branchId}`);
};
