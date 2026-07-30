import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, UtensilsCrossed, Store, LayoutGrid, Receipt, Settings, LogOut, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/common/ThemeToggle';
import TableLayout from '../../components/pos/TableLayout';
import { cn } from '../../utils/cn';
import { fetchMenu } from '../../api/menu';
import { getOptionGroups } from '../../api/optionGroup';
import { placeOrder } from '../../api/order';
import { getTables } from '../../api/table';
import { useAdminStore } from '../../store/useAdminStore';
import type { CategoryMenuDto, MenuItemDto } from '../../types';
import type { OptionGroup, Option } from '../../types';
import type { CreateOrderItem, CreateOrderItemOption } from '../../api/order';
import type { Table } from '../../api/table';

interface CartItem {
    id: string; // unique key (menuItemId + options combo)
    menuItemId: string;
    name: string;
    imageUrl?: string;
    unitPrice: number;
    quantity: number;
    note?: string;
    selectedOptions: SelectedOption[];
}

interface SelectedOption {
    optionId: string;
    name: string;
    price: number;
    quantity: number;
}

const PosPage = () => {
    const { selectedBranchId } = useAdminStore();

    // Fetch menu from API
    const { data: menu = [] } = useQuery<CategoryMenuDto[]>({
        queryKey: ['menu'],
        queryFn: fetchMenu,
    });

    // Fetch option groups for option selection modal
    const { data: optionGroups = [] } = useQuery<OptionGroup[]>({
        queryKey: ['optionGroups'],
        queryFn: getOptionGroups,
    });

    // Fetch tables for selection
    const { data: tables = [] } = useQuery({
        queryKey: ['tables', selectedBranchId],
        queryFn: () => getTables(selectedBranchId || undefined),
        enabled: !!selectedBranchId,
    });

    const [viewMode, setViewMode] = useState<'counter' | 'tables'>('counter');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [orderNote, setOrderNote] = useState('');

    // Option selection modal state
    const [optionModal, setOptionModal] = useState<{ item: MenuItemDto; groups: OptionGroup[] } | null>(null);
    const [tempOptions, setTempOptions] = useState<SelectedOption[]>([]);

    // Build category list from API data
    const categories = [
        { id: 'all', name: 'All' },
        ...menu.map(c => ({ id: c.categoryId, name: c.categoryName }))
    ];

    // Flatten menu items for filtering
    const allItems = menu.flatMap(c => c.items.map(item => ({ ...item, categoryId: c.categoryId })));

    const filteredItems = allItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Check if menu item has option groups linked
    const getItemOptionGroups = (menuItemId: string): OptionGroup[] => {
        // TODO: ideally fetch linked option groups per item from API
        // For now show all option groups (user picks what applies)
        return optionGroups.filter(og => og.isActive && og.options.length > 0);
    };

    const handleItemClick = (item: MenuItemDto) => {
        const groups = getItemOptionGroups(item.id);
        if (groups.length > 0) {
            // Show option selection modal
            setTempOptions([]);
            setOptionModal({ item, groups });
        } else {
            // Add directly to cart
            addToCart(item, []);
        }
    };

    const addToCart = (item: MenuItemDto, options: SelectedOption[]) => {
        const optionKey = options.map(o => o.optionId).sort().join(',');
        const cartId = `${item.id}_${optionKey}`;
        const optionTotal = options.reduce((sum, o) => sum + o.price * o.quantity, 0);

        setCart(prev => {
            const existing = prev.find(c => c.id === cartId);
            if (existing) {
                return prev.map(c => c.id === cartId ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, {
                id: cartId,
                menuItemId: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
                unitPrice: item.price,
                quantity: 1,
                selectedOptions: options,
            }];
        });
    };

    const handleConfirmOptions = () => {
        if (!optionModal) return;
        addToCart(optionModal.item, tempOptions);
        setOptionModal(null);
    };

    const toggleOption = (option: Option) => {
        setTempOptions(prev => {
            const exists = prev.find(o => o.optionId === option.id);
            if (exists) {
                return prev.filter(o => o.optionId !== option.id);
            }
            return [...prev, { optionId: option.id, name: option.name, price: option.additionalPrice, quantity: 1 }];
        });
    };

    const updateQuantity = (cartId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === cartId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleTableClick = (tableId: number) => {
        // TODO: map table number to table ID from API
        setViewMode('counter');
    };

    const getItemTotal = (item: CartItem) => {
        const optionTotal = item.selectedOptions.reduce((s, o) => s + o.price * o.quantity, 0);
        return (item.unitPrice + optionTotal) * item.quantity;
    };

    const subtotal = cart.reduce((sum, item) => sum + getItemTotal(item), 0);
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    const handlePayNow = async () => {
        if (!selectedBranchId || !selectedTableId || cart.length === 0) {
            alert('Please select a table and add items');
            return;
        }

        const items: CreateOrderItem[] = cart.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            note: item.note,
            options: item.selectedOptions.map(o => ({
                optionId: o.optionId,
                quantity: o.quantity,
                price: o.price,
            })),
        }));

        try {
            const result = await placeOrder({
                branchId: selectedBranchId,
                tableId: selectedTableId,
                items,
                notes: orderNote || undefined,
            });
            setCart([]);
            setOrderNote('');
            alert(`Order placed! Round #${result.roundNo}`);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to place order');
        }
    };

    return (
        <div className="flex h-screen bg-base-100 overflow-hidden transition-colors duration-300">
            {/* Sidebar Navigation */}
            <div className="w-20 bg-base-200 border-r border-base-300 flex flex-col items-center py-4 gap-6 z-20">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-xl shadow-lg">
                    K
                </div>

                <div className="flex flex-col gap-4 w-full px-2">
                    <button
                        onClick={() => setViewMode('counter')}
                        className={cn("btn btn-square w-full h-14 rounded-xl transition-all", viewMode === 'counter' ? "btn-active btn-neutral" : "btn-ghost")}
                    >
                        <Store className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setViewMode('tables')}
                        className={cn("btn btn-square w-full h-14 rounded-xl transition-all", viewMode === 'tables' ? "btn-active btn-neutral" : "btn-ghost")}
                    >
                        <LayoutGrid className="w-6 h-6" />
                    </button>
                    <button className="btn btn-square btn-ghost w-full h-14 rounded-xl">
                        <Receipt className="w-6 h-6" />
                    </button>
                    <button className="btn btn-square btn-ghost w-full h-14 rounded-xl">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                <div className="mt-auto flex flex-col gap-4 w-full px-2 items-center">
                    <ThemeToggle />
                    <Link to="/" className="btn btn-square btn-ghost w-full h-14 rounded-xl text-error">
                        <LogOut className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {viewMode === 'tables' ? (
                    <TableLayout onTableClick={handleTableClick} />
                ) : (
                    <div className="flex h-full">
                        {/* Product Selection */}
                        <div className="flex-1 flex flex-col h-full border-r border-base-300 min-w-0">
                            {/* Header */}
                            <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-100">
                                <div className="relative w-full max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="Search menu..."
                                        className="input input-bordered w-full pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="p-4 overflow-x-auto whitespace-nowrap bg-base-100/50 backdrop-blur-sm">
                                <div className="flex gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={cn("btn btn-lg rounded-full px-8", selectedCategory === cat.id ? "btn-primary" : "btn-ghost bg-base-200")}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Grid */}
                            <div className="flex-1 overflow-y-auto p-4 bg-base-200/50">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredItems.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleItemClick(item)}
                                            className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 text-left h-full"
                                        >
                                            <figure className="h-40 overflow-hidden bg-base-200">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-base-content/10">
                                                        <UtensilsCrossed size={48} />
                                                    </div>
                                                )}
                                            </figure>
                                            <div className="card-body p-4">
                                                <h3 className="font-bold text-lg">{item.name}</h3>
                                                <div className="flex justify-between items-end mt-auto">
                                                    <span className="text-primary font-bold text-xl">฿{item.price}</span>
                                                    <div className="btn btn-circle btn-sm btn-primary">
                                                        <Plus className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cart */}
                        <div className="w-[400px] flex flex-col h-full bg-base-100 shadow-xl z-10 border-l border-base-300">
                            <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-100">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="w-6 h-6 text-primary" />
                                    <h2 className="text-xl font-bold">Current Order</h2>
                                </div>
                                <div className="badge badge-primary badge-lg">{cart.reduce((a, b) => a + b.quantity, 0)} items</div>
                            </div>

                            {/* Table Selection */}
                            <div className="p-3 border-b border-base-300 bg-base-200/50">
                                <select
                                    className="select select-bordered select-sm w-full"
                                    value={selectedTableId || ''}
                                    onChange={(e) => setSelectedTableId(e.target.value || null)}
                                >
                                    <option value="">-- Select Table --</option>
                                    {tables.filter(t => t.isActive).map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-base-content/30 gap-4">
                                        <UtensilsCrossed className="w-16 h-16" />
                                        <p className="text-xl font-medium">No items selected</p>
                                        <p className="text-sm">Select products to start an order</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex gap-3 p-3 bg-base-200 rounded-xl items-center">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg bg-base-300 flex items-center justify-center shrink-0">
                                                    <UtensilsCrossed size={20} className="text-base-content/20" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                                {item.selectedOptions.length > 0 && (
                                                    <p className="text-xs text-base-content/50 truncate">
                                                        {item.selectedOptions.map(o => o.name).join(', ')}
                                                    </p>
                                                )}
                                                <p className="text-primary font-semibold text-sm">฿{getItemTotal(item).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-base-100 rounded-lg p-1">
                                                <button className="btn btn-xs btn-circle btn-ghost text-error" onClick={() => updateQuantity(item.id, -1)}>
                                                    {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                                </button>
                                                <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                                <button className="btn btn-xs btn-circle btn-ghost text-primary" onClick={() => updateQuantity(item.id, 1)}>
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Cart Footer */}
                            <div className="p-4 bg-base-100 border-t border-base-300">
                                <div className="space-y-1 mb-4 text-sm">
                                    <div className="flex justify-between text-base-content/70">
                                        <span>Subtotal</span>
                                        <span>฿{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base-content/70">
                                        <span>VAT (7%)</span>
                                        <span>฿{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold text-primary pt-2 border-t border-base-300">
                                        <span>Total</span>
                                        <span>฿{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="btn btn-outline btn-lg h-14" onClick={() => setCart([])} disabled={cart.length === 0}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary btn-lg h-14 gap-2" onClick={handlePayNow} disabled={cart.length === 0}>
                                        <CreditCard className="w-5 h-5" />
                                        Pay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Option Selection Modal */}
            {optionModal && (
                <div className="overlay modal fixed inset-0 z-[80] overlay-open opacity-100" role="dialog">
                    <div className="modal-dialog w-full max-w-md mx-auto my-10">
                        <div className="modal-content border-0 rounded-3xl shadow-2xl bg-base-100">
                            <div className="flex items-center justify-between p-6 border-b border-base-200">
                                <div>
                                    <h3 className="text-xl font-bold">{optionModal.item.name}</h3>
                                    <p className="text-sm text-base-content/50">Select options</p>
                                </div>
                                <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setOptionModal(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5">
                                {optionModal.groups.map(group => (
                                    <div key={group.id}>
                                        <h4 className="font-bold text-sm uppercase text-base-content/50 mb-2">
                                            {group.name}
                                            {group.isRequired && <span className="text-error ml-1">*</span>}
                                        </h4>
                                        <div className="space-y-2">
                                            {group.options.filter(o => o.isActive).map(option => {
                                                const isSelected = tempOptions.some(o => o.optionId === option.id);
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => toggleOption(option)}
                                                        className={cn(
                                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                                                            isSelected ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary/50"
                                                        )}
                                                    >
                                                        <span className="font-medium">{option.name}</span>
                                                        {option.additionalPrice > 0 && (
                                                            <span className="text-sm text-primary font-bold">+฿{option.additionalPrice}</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end p-6 border-t border-base-200 gap-3">
                                <button className="btn btn-ghost" onClick={() => setOptionModal(null)}>Skip</button>
                                <button className="btn btn-primary px-8" onClick={handleConfirmOptions}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]" onClick={() => setOptionModal(null)}></div>
                </div>
            )}
        </div>
    );
};

export default PosPage;
