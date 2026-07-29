import apiClient from './client';
import type {
    OptionGroup,
    Option,
    CreateOptionGroupRequest,
    UpdateOptionGroupRequest,
    CreateOptionRequest,
    UpdateOptionRequest,
    ApiResponse,
} from '../types';

// --- Option Groups ---

export const getOptionGroups = async (): Promise<OptionGroup[]> => {
    const response = await apiClient.get<ApiResponse<OptionGroup[]>>('/option-groups');
    return response.data.data;
};

export const getOptionGroup = async (id: string): Promise<OptionGroup> => {
    const response = await apiClient.get<ApiResponse<OptionGroup>>(`/option-groups/${id}`);
    return response.data.data;
};

export const createOptionGroup = async (data: CreateOptionGroupRequest): Promise<{ id: string }> => {
    const response = await apiClient.post<ApiResponse<{ id: string }>>('/option-groups', data);
    return response.data.data;
};

export const updateOptionGroup = async (id: string, data: UpdateOptionGroupRequest): Promise<void> => {
    await apiClient.put(`/option-groups/${id}`, data);
};

// --- Options ---

export const getOptions = async (optionGroupId: string): Promise<Option[]> => {
    const response = await apiClient.get<ApiResponse<Option[]>>(`/option-groups/${optionGroupId}/options`);
    return response.data.data;
};

export const createOption = async (optionGroupId: string, data: CreateOptionRequest): Promise<{ id: string }> => {
    const response = await apiClient.post<ApiResponse<{ id: string }>>(`/option-groups/${optionGroupId}/options`, data);
    return response.data.data;
};

export const updateOption = async (optionGroupId: string, optionId: string, data: UpdateOptionRequest): Promise<void> => {
    await apiClient.put(`/option-groups/${optionGroupId}/options/${optionId}`, data);
};
