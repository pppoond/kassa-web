import React from 'react';
import { useKitchenOrders } from '../../hooks/useKitchenOrders';
import { OrderCard } from '../../components/kitchen/OrderCard';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';

const KitchenPage: React.FC = () => {
    const { orders, updateOrderStatus } = useKitchenOrders();
    const navigate = useNavigate();

    const activeOrders = orders.filter(o => o.status !== 'Served');

    return (
        <div className="min-h-screen bg-base-200 p-4 transition-colors duration-300">
            <header className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="btn btn-circle btn-ghost">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-base-content">Kitchen Display System</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2">
                        <div className="badge badge-lg badge-primary">Pending: {activeOrders.filter(o => o.status === 'Pending').length}</div>
                        <div className="badge badge-lg badge-info">Cooking: {activeOrders.filter(o => o.status === 'Cooking').length}</div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeOrders.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-base-content/50">
                        <p className="text-xl">No active orders</p>
                    </div>
                ) : (
                    activeOrders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onStatusChange={updateOrderStatus} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default KitchenPage;
