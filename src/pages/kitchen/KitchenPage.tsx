import React from 'react';
import { useKitchenOrders } from '../../hooks/useKitchenOrders';
import type { KitchenSubOrder, KitchenOrderItem } from '../../hooks/useKitchenOrders';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, UtensilsCrossed } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const KitchenPage: React.FC = () => {
    const { t } = useTranslation();
    const { orders, loading, updateItemStatus } = useKitchenOrders();
    const navigate = useNavigate();

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
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </header>

            <main className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-base-content/30">
                        <UtensilsCrossed size={64} strokeWidth={1} />
                        <p className="text-2xl font-bold mt-4">{t('kitchen.noActiveOrders')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {orders.map(order => (
                            <KitchenOrderCard key={order.id} order={order} onUpdateItemStatus={updateItemStatus} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

interface KitchenOrderCardProps {
    order: KitchenSubOrder;
    onUpdateItemStatus: (itemId: string, status: string) => void;
}

const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({ order, onUpdateItemStatus }) => {
    const { t } = useTranslation();
    const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);

    const getStatusColor = () => {
        const hasNew = order.items.some(i => i.status === 'new');
        const hasCooking = order.items.some(i => i.status === 'cooking');
        const allReady = order.items.every(i => i.status === 'ready' || i.status === 'served');

        if (allReady) return 'border-l-success bg-success/5';
        if (hasCooking) return 'border-l-info bg-info/5';
        if (hasNew) return 'border-l-warning bg-warning/5';
        return 'border-l-base-content/20';
    };

    return (
        <div className={`card shadow-md border border-base-200 border-l-8 ${getStatusColor()} bg-base-100`}>
            <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold">{order.tableName}</h3>
                        <span className="text-xs text-base-content/50">Round #{order.roundNo}</span>
                    </div>
                    <div className="flex items-center text-sm font-mono text-base-content/70">
                        <Clock size={14} className="mr-1" />
                        {elapsedMinutes}m
                    </div>
                </div>

                {order.notes && (
                    <div className="alert alert-warning text-xs p-2 mb-2 rounded-lg">
                        <span>{t('kitchen.note')}: {order.notes}</span>
                    </div>
                )}

                <div className="divider my-1"></div>

                <ul className="space-y-2">
                    {order.items.map(item => (
                        <KitchenItemRow key={item.id} item={item} onUpdateStatus={onUpdateItemStatus} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

interface KitchenItemRowProps {
    item: KitchenOrderItem;
    onUpdateStatus: (itemId: string, status: string) => void;
}

const KitchenItemRow: React.FC<KitchenItemRowProps> = ({ item, onUpdateStatus }) => {
    const { t } = useTranslation();

    const getNextStatus = (current: string): string | null => {
        switch (current) {
            case 'new': return 'cooking';
            case 'cooking': return 'ready';
            case 'ready': return 'served';
            default: return null;
        }
    };

    const getButtonStyle = (current: string) => {
        switch (current) {
            case 'new': return 'btn-warning btn-xs';
            case 'cooking': return 'btn-success btn-xs';
            case 'ready': return 'btn-outline btn-xs';
            default: return 'btn-ghost btn-xs btn-disabled';
        }
    };

    const getButtonLabel = (current: string) => {
        switch (current) {
            case 'new': return t('kitchen.startCooking');
            case 'cooking': return t('kitchen.markReady');
            case 'ready': return t('kitchen.markServed');
            default: return '✓';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return 'badge-warning';
            case 'cooking': return 'badge-info';
            case 'ready': return 'badge-success';
            case 'served': return 'badge-ghost';
            default: return '';
        }
    };

    const nextStatus = getNextStatus(item.status);

    return (
        <li className="flex items-center justify-between gap-2 py-1">
            <div className="flex items-start gap-2 flex-1 min-w-0">
                <span className="font-bold text-sm shrink-0">{item.quantity}x</span>
                <div className="min-w-0">
                    <span className="block text-sm font-medium truncate">{item.menuItemName}</span>
                    {item.options.length > 0 && (
                        <span className="text-xs text-primary">{item.options.map(o => o.optionName).join(', ')}</span>
                    )}
                    {item.note && <span className="text-xs text-error italic block">{item.note}</span>}
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <div className={`badge badge-xs ${getStatusBadge(item.status)}`}>{item.status}</div>
                {nextStatus && (
                    <button
                        className={`btn ${getButtonStyle(item.status)}`}
                        onClick={() => onUpdateStatus(item.id, nextStatus)}
                    >
                        {getButtonLabel(item.status)}
                    </button>
                )}
            </div>
        </li>
    );
};

export default KitchenPage;
