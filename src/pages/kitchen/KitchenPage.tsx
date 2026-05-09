import React from 'react';
import { useKitchenOrders } from '../../hooks/useKitchenOrders';
import { OrderCard } from '../../components/kitchen/OrderCard';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const KitchenPage: React.FC = () => {
    const { t } = useTranslation();
    const { orders, updateOrderStatus } = useKitchenOrders();
    const navigate = useNavigate();

    const activeOrders = orders.filter(o => o.status !== 'Served');

    return (
        <div className="min-h-screen bg-base-200 transition-colors duration-400 font-sans">
            <header className="navbar bg-base-100 shadow-sm sticky top-0 z-40 px-8 py-4 border-b border-base-300 flex justify-between">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/')} className="btn btn-circle btn-ghost hover:bg-base-300">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tight text-primary leading-none uppercase">KINDEE Kitchen</h1>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Live Order Management</p>
                    </div>
                </div>
                
                <div className="flex gap-6 items-center">
                    <div className="hidden md:flex gap-3">
                        <div className="badge badge-lg h-10 px-4 bg-primary/10 text-primary border-none font-bold">
                           {t('kitchen.pending')}: {activeOrders.filter(o => o.status === 'Pending').length}
                        </div>
                        <div className="badge badge-lg h-10 px-4 bg-info/10 text-info border-none font-bold">
                           {t('kitchen.cooking')}: {activeOrders.filter(o => o.status === 'Cooking').length}
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <div className="p-8">
                {activeOrders.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-base-content/50">
                        <p className="text-xl">{t('kitchen.noActiveOrders')}</p>
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
