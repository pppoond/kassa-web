import { useState, useEffect } from 'react';
import type { SubOrderDto } from '../types/kitchen';

// Mock Data
const MOCK_SUB_ORDERS: SubOrderDto[] = [
    {
        id: '1',
        orderId: '101',
        roundNo: 1,
        status: 'Pending',
        notes: 'Dressing on the side',
        createdAt: new Date().toISOString(),
        tableName: 'T-01',
        orderItems: [
            {
                id: '1001',
                orderId: '101',
                menuItemId: 'm1',
                quantity: 2,
                unitPrice: 150,
                totalPrice: 300,
                status: 'Pending',
                createdAt: new Date().toISOString(),
                menuItem: { id: 'm1', name: 'Caesar Salad' }
            },
            {
                id: '1002',
                orderId: '101',
                menuItemId: 'm2',
                quantity: 1,
                unitPrice: 250,
                totalPrice: 250,
                status: 'Pending',
                createdAt: new Date().toISOString(),
                menuItem: { id: 'm2', name: 'Grilled Chicken' }
            }
        ]
    },
    {
        id: '2',
        orderId: '102',
        roundNo: 1,
        status: 'Cooking',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        tableName: 'T-05',
        orderItems: [
            {
                id: '2001',
                orderId: '102',
                menuItemId: 'm3',
                quantity: 1,
                unitPrice: 120,
                totalPrice: 120,
                status: 'Cooking',
                createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
                menuItem: { id: 'm3', name: 'Spaghetti Carbonara' }
            }
        ]
    }
];

export const useKitchenOrders = () => {
    const [orders, setOrders] = useState<SubOrderDto[]>([]);

    useEffect(() => {
        // Mock fetching data
        setOrders(MOCK_SUB_ORDERS);

        // Here we would setup SignalR connection
        // connection.on('ReceiveOrder', (order) => ... )
        
        return () => {
            // connection.stop()
        };
    }, []);

    const updateOrderStatus = (subOrderId: string, status: string) => {
        setOrders(prev => prev.map(order => 
            order.id === subOrderId 
                ? { ...order, status } 
                : order
        ));
    };

    return {
        orders,
        updateOrderStatus
    };
};
