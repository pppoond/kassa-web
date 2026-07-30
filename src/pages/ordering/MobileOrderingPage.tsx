import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Send, UtensilsCrossed, X, Check } from 'lucide-react';
import { getCustomerInfo, getCustomerMenu, getCustomerItemOptions, placeCustomerOrder } from '../../api/customer';
import type { CustomerInfo, CustomerCategory, CustomerMenuItem, CustomerOptionGroup, CustomerOption, CustomerOrderItem } from '../../api/customer';

interface CartItem {
    id: string;
    menuItemId: string;
    name: string;
    imageUrl?: string;
    unitPrice: number;
    quantity: number;
    note?: string;
    options: { optionId: string; name: string; price: number; quantity: number }[];
}

const MobileOrderingPage = () => {
    const { orderId: token } = useParams<{ orderId: string }>();
    const [info, setInfo] = useState<CustomerInfo | null>(null);
    const [menu, setMenu] = useState<CustomerCategory[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCart, setShowCart] = useState(false);

    // Option modal
    const [optionModal, setOptionModal] = useState<{ item: CustomerMenuItem; groups: CustomerOptionGroup[] } | null>(null);
    const [tempOptions, setTempOptions] = useState<{ optionId: string; name: string; price: number; quantity: number }[]>([]);

    useEffect(() => {
        if (!token) return;
        const load = async () => {
            try {
                const [infoData, menuData] = await Promise.all([
                    getCustomerInfo(token),
                    getCustomerMenu(token),
                ]);
                setInfo(infoData);
                setMenu(menuData);
            } catch {
                setError('QR code is invalid or expired');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token]);

    const handleItemClick = async (item: CustomerMenuItem) => {
        if (!token) return;
        try {
            const groups = await getCustomerItemOptions(token, item.id);
            if (groups.length > 0) {
                setTempOptions([]);
                setOptionModal({ item, groups });
            } else {
                addToCart(item, []);
            }
        } catch {
            addToCart(item, []);
        }
    };

    const addToCart = (item: CustomerMenuItem, options: { optionId: string; name: string; price: number; quantity: number }[]) => {
        const optionKey = options.map(o => o.optionId).sort().join(',');
        const cartId = `${item.id}_${optionKey}`;

        setCart(prev => {
            const existing = prev.find(c => c.id === cartId);
            if (existing) {
                return prev.map(c => c.id === cartId ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { id: cartId, menuItemId: item.id, name: item.name, imageUrl: item.imageUrl, unitPrice: item.price, quantity: 1, options }];
        });
    };

    const toggleOption = (option: CustomerOption) => {
        setTempOptions(prev => {
            const exists = prev.find(o => o.optionId === option.id);
            if (exists) return prev.filter(o => o.optionId !== option.id);
            return [...prev, { optionId: option.id, name: option.name, price: option.additionalPrice, quantity: 1 }];
        });
    };

    const handleConfirmOptions = () => {
        if (!optionModal) return;
        addToCart(optionModal.item, tempOptions);
        setOptionModal(null);
    };

    const updateQuantity = (cartId: string, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === cartId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        ).filter(item => item.quantity > 0));
    };

    const getItemTotal = (item: CartItem) => {
        const optTotal = item.options.reduce((s, o) => s + o.price * o.quantity, 0);
        return (item.unitPrice + optTotal) * item.quantity;
    };

    const total = cart.reduce((sum, item) => sum + getItemTotal(item), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!token || cart.length === 0) return;
        setLoading(true);
        try {
            const items: CustomerOrderItem[] = cart.map(item => ({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                note: item.note,
                options: item.options.map(o => ({ optionId: o.optionId, quantity: o.quantity, price: o.price })),
            }));
            const result = await placeCustomerOrder(token, items);
            setSuccess(`Order sent! Round #${result.roundNo}`);
            setCart([]);
            setShowCart(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !info) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error && !info) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
                <UtensilsCrossed size={64} className="text-error mb-4" />
                <p className="text-xl font-bold text-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-primary text-primary-content p-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-bold">KINDEE</h1>
                        <p className="text-xs opacity-80">{info?.tableName} ({info?.tableCode})</p>
                    </div>
                </div>
            </header>

            {/* Success toast */}
            {success && (
                <div className="fixed top-20 left-4 right-4 z-50 alert alert-success shadow-lg rounded-xl">
                    <Check size={20} />
                    <span className="font-medium">{success}</span>
                    <button className="btn btn-xs btn-ghost" onClick={() => setSuccess('')}>✕</button>
                </div>
            )}

            {/* Menu */}
            <main className="p-4 space-y-6">
                {menu.map(category => (
                    <div key={category.id}>
                        <h2 className="text-lg font-bold mb-3 text-base-content/80">{category.name}</h2>
                        <div className="space-y-3">
                            {category.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className="w-full card card-side bg-base-100 shadow-sm border border-base-200 h-24 overflow-hidden active:scale-[0.98] transition-transform"
                                >
                                    {item.imageUrl && (
                                        <figure className="w-24 h-full shrink-0">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </figure>
                                    )}
                                    <div className="card-body p-3 justify-center">
                                        <h3 className="font-bold text-sm">{item.name}</h3>
                                        {item.description && <p className="text-xs text-base-content/50 line-clamp-1">{item.description}</p>}
                                        <span className="text-primary font-bold">฿{item.price}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </main>

            {/* Floating Cart Button */}
            {totalItems > 0 && !showCart && (
                <button
                    onClick={() => setShowCart(true)}
                    className="fixed bottom-6 left-4 right-4 btn btn-primary btn-lg rounded-2xl shadow-2xl justify-between"
                >
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} />
                        <span className="badge badge-sm">{totalItems}</span>
                    </div>
                    <span className="font-bold">฿{total.toFixed(2)}</span>
                </button>
            )}

            {/* Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 z-40 flex flex-col">
                    <div className="flex-1 bg-black/50" onClick={() => setShowCart(false)}></div>
                    <div className="bg-base-100 rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-base-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Your Order</h3>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setShowCart(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{item.name}</p>
                                        {item.options.length > 0 && (
                                            <p className="text-xs text-primary">{item.options.map(o => o.name).join(', ')}</p>
                                        )}
                                        <p className="text-sm text-base-content/60">฿{getItemTotal(item).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-base-200 rounded-lg p-1">
                                        <button className="btn btn-xs btn-circle btn-ghost" onClick={() => updateQuantity(item.id, -1)}>
                                            {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                        </button>
                                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                        <button className="btn btn-xs btn-circle btn-ghost" onClick={() => updateQuantity(item.id, 1)}>
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-base-200">
                            <div className="flex justify-between mb-3 text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">฿{total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className={`btn btn-primary btn-lg w-full rounded-xl gap-2 ${loading ? 'loading' : ''}`}
                            >
                                {!loading && <Send size={20} />}
                                {loading ? 'Sending...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Option Modal */}
            {optionModal && (
                <div className="fixed inset-0 z-50 flex items-end">
                    <div className="flex-1 bg-black/50" onClick={() => setOptionModal(null)}></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-base-100 rounded-t-3xl shadow-2xl max-h-[70vh] flex flex-col">
                        <div className="p-4 border-b border-base-200">
                            <h3 className="text-lg font-bold">{optionModal.item.name}</h3>
                            <p className="text-sm text-base-content/50">Select options</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {optionModal.groups.map(group => (
                                <div key={group.id}>
                                    <h4 className="font-bold text-xs uppercase text-base-content/50 mb-2">
                                        {group.name} {group.isRequired && <span className="text-error">*</span>}
                                    </h4>
                                    <div className="space-y-2">
                                        {group.options.map(option => {
                                            const selected = tempOptions.some(o => o.optionId === option.id);
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => toggleOption(option)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${selected ? 'border-primary bg-primary/5' : 'border-base-300'}`}
                                                >
                                                    <span className="font-medium text-sm">{option.name}</span>
                                                    {option.additionalPrice > 0 && <span className="text-xs text-primary font-bold">+฿{option.additionalPrice}</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-base-200 flex gap-3">
                            <button className="btn btn-ghost flex-1" onClick={() => setOptionModal(null)}>Skip</button>
                            <button className="btn btn-primary flex-1" onClick={handleConfirmOptions}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileOrderingPage;
