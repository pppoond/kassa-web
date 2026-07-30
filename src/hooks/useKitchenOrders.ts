import { useState, useEffect, useCallback } from 'react';
import { getKitchenOrders, updateOrderItemStatus } from '../api/order';
import type { KitchenSubOrder } from '../api/order';

export type { KitchenSubOrder, KitchenOrderItem } from '../api/order';

export const useKitchenOrders = () => {
    const [orders, setOrders] = useState<KitchenSubOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const data = await getKitchenOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch kitchen orders', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000); // poll ทุก 5 วินาที
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const updateItemStatus = async (itemId: string, status: string) => {
        try {
            await updateOrderItemStatus(itemId, status);
            // Optimistic update
            setOrders(prev => prev.map(order => ({
                ...order,
                items: order.items.map(item =>
                    item.id === itemId ? { ...item, status } : item
                )
            })));
        } catch (err) {
            console.error('Failed to update item status', err);
        }
    };

    return { orders, loading, updateItemStatus, refetch: fetchOrders };
};
