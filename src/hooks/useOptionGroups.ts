import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getOptionGroups,
    getOptionGroup,
    createOptionGroup,
    updateOptionGroup,
    getOptions,
    createOption,
    updateOption,
} from '../api/optionGroup';
import type {
    CreateOptionGroupRequest,
    UpdateOptionGroupRequest,
    CreateOptionRequest,
    UpdateOptionRequest,
} from '../types';

export const useOptionGroups = () => {
    return useQuery({
        queryKey: ['optionGroups'],
        queryFn: getOptionGroups,
    });
};

export const useOptionGroup = (id: string) => {
    return useQuery({
        queryKey: ['optionGroups', id],
        queryFn: () => getOptionGroup(id),
        enabled: !!id,
    });
};

export const useOptions = (optionGroupId: string) => {
    return useQuery({
        queryKey: ['options', optionGroupId],
        queryFn: () => getOptions(optionGroupId),
        enabled: !!optionGroupId,
    });
};

export const useCreateOptionGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOptionGroupRequest) => createOptionGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['optionGroups'] });
        },
    });
};

export const useUpdateOptionGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateOptionGroupRequest }) =>
            updateOptionGroup(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['optionGroups'] });
        },
    });
};

export const useCreateOption = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ optionGroupId, data }: { optionGroupId: string; data: CreateOptionRequest }) =>
            createOption(optionGroupId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['optionGroups'] });
            queryClient.invalidateQueries({ queryKey: ['options', variables.optionGroupId] });
        },
    });
};

export const useUpdateOption = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ optionGroupId, optionId, data }: { optionGroupId: string; optionId: string; data: UpdateOptionRequest }) =>
            updateOption(optionGroupId, optionId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['optionGroups'] });
            queryClient.invalidateQueries({ queryKey: ['options', variables.optionGroupId] });
        },
    });
};
