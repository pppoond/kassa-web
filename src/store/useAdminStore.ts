import { create } from 'zustand';
import type { Category, MenuItem } from '../types';

interface AdminState {
    categories: Category[];
    menuItems: MenuItem[];
    addCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (id: string, category: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
    updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
    deleteMenuItem: (id: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    categories: [
        { id: '1', name: 'Beverages', description: 'Drinks and smoothies' },
        { id: '2', name: 'Main Course', description: 'Lunch and dinner' },
    ],
    menuItems: [
        { id: '1', categoryId: '1', name: 'Iced Coffee', price: 80, isAvailable: true },
        { id: '2', categoryId: '2', name: 'Fried Rice', price: 120, isAvailable: true },
    ],
    addCategory: (category) =>
        set((state) => ({
            categories: [...state.categories, { ...category, id: Math.random().toString(36).substr(2, 9) }],
        })),
    updateCategory: (id, updatedCategory) =>
        set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
        })),
    deleteCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            menuItems: state.menuItems.filter((m) => m.categoryId !== id) // Cascade delete logic optional
        })),
    addMenuItem: (item) =>
        set((state) => ({
            menuItems: [...state.menuItems, { ...item, id: Math.random().toString(36).substr(2, 9) }],
        })),
    updateMenuItem: (id, updatedItem) =>
        set((state) => ({
            menuItems: state.menuItems.map((m) => (m.id === id ? { ...m, ...updatedItem } : m)),
        })),
    deleteMenuItem: (id) =>
        set((state) => ({
            menuItems: state.menuItems.filter((m) => m.id !== id),
        })),
}));
