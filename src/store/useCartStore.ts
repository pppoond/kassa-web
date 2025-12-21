import { create } from 'zustand';
import type { MenuItemDto } from '../types/menu';

export interface CartItem extends MenuItemDto {
    quantity: number;
    notes?: string;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: MenuItemDto, quantity: number, notes?: string) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: () => number;
    totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addToCart: (item, quantity, notes) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
            return {
                items: state.items.map(i => 
                    i.id === item.id 
                        ? { ...i, quantity: i.quantity + quantity, notes: notes || i.notes } 
                        : i
                )
            };
        }
        return { items: [...state.items, { ...item, quantity, notes }] };
    }),
    removeFromCart: (itemId) => set((state) => ({
        items: state.items.filter(i => i.id !== itemId)
    })),
    updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map(i => 
            i.id === itemId ? { ...i, quantity } : i
        ).filter(i => i.quantity > 0) // Remove if quantity becomes 0
    })),
    clearCart: () => set({ items: [] }),
    totalAmount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    totalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
    }
}));
