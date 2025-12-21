import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartDrawerProps {
    isOpen: boolean;
    onToggle: () => void;
    onPlaceOrder: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onToggle, onPlaceOrder }) => {
    const { items, totalAmount, totalItems, updateQuantity, removeFromCart } = useCartStore();
    const { t } = useTranslation();
    const amount = totalAmount();
    const count = totalItems();

    if (count === 0) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'}`}>
            {/* Expanded Content (Cart List) */}
             <div className="bg-base-100 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-base-200">
                
                 {/* Header / Toggle Handle */}
                <div 
                    className="p-4 flex justify-between items-center cursor-pointer border-b border-base-200 h-20"
                    onClick={onToggle}
                >
                    <div className="flex items-center gap-3">
                         <div className="indicator">
                            <span className="indicator-item badge badge-secondary badge-sm">{count}</span>
                            <div className="bg-primary text-primary-content p-3 rounded-full">
                                <ShoppingCart size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-lg">฿{amount.toLocaleString()}</p>
                            <p className="text-xs opacity-60 text-base-content">{isOpen ? t('cart.hide') : t('cart.view')}</p>
                        </div>
                    </div>
                     <button className="btn btn-ghost btn-circle btn-sm">
                        {isOpen ? <ChevronDown /> : <ChevronUp />}
                    </button>
                </div>

                {/* Content (Visible only when open) */}
                <div className={`overflow-y-auto transition-all duration-300 ${isOpen ? 'max-h-[60vh] p-4' : 'max-h-0'}`}>
                    <h3 className="font-bold text-lg mb-4">{t('cart.title')}</h3>
                    <div className="flex flex-col gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-base-100 last:border-0">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-primary font-bold">฿{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                                <div className="join">
                                    <button className="join-item btn btn-xs" onClick={() => {
                                        if(item.quantity > 1) updateQuantity(item.id, item.quantity - 1)
                                        else removeFromCart(item.id)
                                    }}>-</button>
                                    <span className="join-item btn btn-xs btn-ghost no-animation cursor-default w-8">{item.quantity}</span>
                                    <button className="join-item btn btn-xs" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        className="btn btn-primary w-full mt-6 btn-lg"
                        onClick={onPlaceOrder}
                    >
                        {t('cart.placeOrder')} - ฿{amount.toLocaleString()}
                    </button>
                    <div className="h-8"></div> {/* Bottom Spacer */}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
