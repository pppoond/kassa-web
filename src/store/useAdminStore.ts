import { create } from 'zustand';
import type { Category, MenuItem, Branch } from '../types';
import * as categoryApi from '../api/category';
import * as menuItemApi from '../api/menuItem';
import * as branchApi from '../api/branch';

interface AdminState {
    branches: Branch[];
    selectedBranchId: string | null;
    categories: Category[];
    menuItems: MenuItem[];
    isLoading: boolean;
    error: string | null;
    
    setSelectedBranch: (id: string) => void;
    fetchBranches: (orgId?: string) => Promise<void>;
    fetchCategories: (branchId: string) => Promise<void>;
    fetchMenuItems: (categoryId?: string) => Promise<void>;
    
    addCategory: (branchId: string, category: Omit<Category, 'id'>) => Promise<void>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    
    addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
    updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
    deleteMenuItem: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    branches: [],
    selectedBranchId: null,
    categories: [],
    menuItems: [],
    isLoading: false,
    error: null,

    setSelectedBranch: (id: string) => {
        set({ selectedBranchId: id });
        get().fetchCategories(id);
    },

    fetchBranches: async (orgId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await branchApi.getBranches(orgId);
            set({ branches: data, isLoading: false });
            if (data.length > 0 && !get().selectedBranchId) {
                get().setSelectedBranch(data[0].id);
            }
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchCategories: async (branchId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await categoryApi.getCategories(branchId);
            set({ categories: data as Category[], isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchMenuItems: async (categoryId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await menuItemApi.getMenuItems(categoryId);
            const items = data.map(item => ({
                id: item.id,
                categoryId: item.categoryId,
                name: item.name,
                description: item.description,
                price: item.price,
                imageUrl: item.imageUrl,
                isAvailable: item.isAvailable
            })) as MenuItem[];
            set({ menuItems: items, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    addCategory: async (branchId, category) => {
        await categoryApi.createCategory({
            branchId,
            name: category.name,
            description: category.description
        });
        await get().fetchCategories(branchId);
    },

    updateCategory: async (id, updatedCategory) => {
        await categoryApi.updateCategory(id, {
            name: updatedCategory.name!,
            description: updatedCategory.description,
            isActive: updatedCategory.isActive ?? true
        });
        set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
        }));
    },

    deleteCategory: async (id) => {
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            menuItems: state.menuItems.filter((m) => m.categoryId !== id)
        }));
    },

    addMenuItem: async (item) => {
        await menuItemApi.createMenuItem({
            categoryId: item.categoryId,
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl
        });
        await get().fetchMenuItems(item.categoryId);
    },

    updateMenuItem: async (id, updatedItem) => {
        const currentItem = get().menuItems.find(m => m.id === id);
        if (!currentItem) return;

        await menuItemApi.updateMenuItem(id, {
            categoryId: updatedItem.categoryId || currentItem.categoryId,
            name: updatedItem.name || currentItem.name,
            description: updatedItem.description || currentItem.description,
            price: updatedItem.price || currentItem.price,
            imageUrl: updatedItem.imageUrl || currentItem.imageUrl,
            isAvailable: updatedItem.isAvailable ?? currentItem.isAvailable
        });
        
        set((state) => ({
            menuItems: state.menuItems.map((m) => (m.id === id ? { ...m, ...updatedItem } : m)),
        }));
    },

    deleteMenuItem: async (id) => {
        await menuItemApi.deleteMenuItem(id);
        set((state) => ({
            menuItems: state.menuItems.filter((m) => m.id !== id),
        }));
    },
}));
