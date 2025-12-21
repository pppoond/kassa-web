import React from 'react';
import type { SubOrderDto } from '../../types/kitchen';
import { Clock } from 'lucide-react';

interface OrderCardProps {
    order: SubOrderDto;
    onStatusChange: (id: string, status: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
    // Calculate elapsed time (mock)
    const elapsedMinutes = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'border-l-warning bg-warning/10 dark:bg-warning/20';
            case 'Cooking': return 'border-l-info bg-info/10 dark:bg-info/20';
            case 'Ready': return 'border-l-success bg-success/10 dark:bg-success/20';
            default: return 'border-l-base-content/20';
        }
    };

    return (
        <div className={`card shadow-md border border-base-200 border-l-8 ${getStatusColor(order.status)} bg-base-100 text-base-content`}>
            <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Table {order.tableName}</h3>
                    <div className="flex items-center text-sm font-mono text-base-content/70">
                        <Clock size={16} className="mr-1" />
                        {elapsedMinutes}m
                    </div>
                </div>
                <div className="text-xs text-base-content/70 mb-2">Round {order.roundNo} • {order.status}</div>
                
                {order.notes && (
                    <div className="alert alert-warning text-xs p-2 mb-2">
                        <span>Note: {order.notes}</span>
                    </div>
                )}

                <div className="divider my-1"></div>

                <ul className="space-y-2">
                    {order.orderItems.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                                <span className="font-bold mr-2">{item.quantity}x</span>
                                <div>
                                    <span className="block">{item.menuItem?.name || 'Unknown Item'}</span>
                                    {item.note && <span className="text-xs text-red-500 italic block">{item.note}</span>}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="card-actions justify-end mt-4">
                    {order.status === 'Pending' && (
                        <button 
                            className="btn btn-primary btn-lg w-full text-xl"
                            onClick={() => onStatusChange(order.id, 'Cooking')}
                        >
                            Start Cooking
                        </button>
                    )}
                    {order.status === 'Cooking' && (
                        <button 
                            className="btn btn-success btn-lg w-full text-white text-xl"
                            onClick={() => onStatusChange(order.id, 'Ready')}
                        >
                            Mark Ready
                        </button>
                    )}
                     {order.status === 'Ready' && (
                        <button 
                            className="btn btn-outline btn-lg w-full text-xl"
                            onClick={() => onStatusChange(order.id, 'Served')}
                        >
                            Mark Served
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
