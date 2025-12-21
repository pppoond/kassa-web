import React from 'react';
import type { MenuItemDto } from '../../types/menu';
import { useCartStore } from '../../store/useCartStore';
import { Plus, Minus } from 'lucide-react';

interface MenuItemCardProps {
    item: MenuItemDto;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    const { items, addToCart, removeFromCart, updateQuantity } = useCartStore();
    const cartItem = items.find(i => i.id === item.id);
    const quantity = cartItem?.quantity || 0;

    const handleIncrement = () => {
        addToCart(item, 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(item.id, quantity - 1);
        } else {
            removeFromCart(item.id);
        }
    };

    return (
        <div className="card card-side bg-base-100 shadow-sm border border-base-200 mb-4 h-32 relative overflow-hidden">
             {item.imageUrl && (
                <figure className="w-32 h-full bg-base-200">
                    <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </figure>
            )}
            <div className="card-body p-4 w-full">
                <h3 className="card-title text-base line-clamp-1">{item.name}</h3>
                <p className="text-xs text-base-content/60 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-end mt-2">
                    <span className="font-bold text-lg text-primary">฿{item.price.toLocaleString()}</span>
                    
                    {quantity === 0 ? (
                        <button 
                            className="btn btn-sm btn-circle btn-primary shadow-md"
                            onClick={handleIncrement}
                            aria-label={`Add ${item.name}`}
                        >
                            <Plus size={16} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 bg-base-200 rounded-full p-1 shadow-inner">
                             <button 
                                className="btn btn-xs btn-circle btn-ghost"
                                onClick={handleDecrement}
                            >
                                <Minus size={14} />
                            </button>
                            <span className="font-medium text-sm w-4 text-center">{quantity}</span>
                            <button 
                                className="btn btn-xs btn-circle btn-ghost"
                                onClick={handleIncrement}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
