import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, UtensilsCrossed, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { fetchMenu } from '../../api/menu';
import { getOptionGroups } from '../../api/optionGroup';
import { placeOrder } from '../../api/order';
import { getTables } from '../../api/table';
import { useAdminStore } from '../../store/useAdminStore';
import type { CategoryMenuDto, MenuItemDto } from '../../types';
import type { OptionGroup, Option } from '../../types';
import type { CreateOrderItem } from '../../api/order';
import { useTranslation } from 'react-i18next';

interface CartItem {
    id: string;
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

const PosHomePage = () => {
    const { t } = useTranslation();
    const { selectedBranchId } = useAdminStore();

    const { data: menu = [] } = useQuery<CategoryMenuDto[]>({
        queryKey: ['menu'],
        queryFn: fetchMenu,
    });

    const { data: optionGroups = [] } = useQuery<OptionGroup[]>({
        queryKey: ['optionGroups'],
        queryFn: getOptionGroups,
    });

    const { data: tables = [] } = useQuery({
        queryKey: ['tables', selectedBranchId],
        queryFn: () => getTables(selectedBranchId || undefined),
        enabled: !!selectedBranchId,
    });

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [orderNote, setOrderNote] = useState('');
    const [optionModal, setOptionModal] = useState<{ item: MenuItemDto; groups: OptionGroup[] } | null>(null);
    const [tempOptions, setTempOptions] = useState<SelectedOption[]>([]);
    const [showMobileCart, setShowMobileCart] = useState(false);

    // Pre-select table from query param (เมื่อ navigate มาจากหน้า tables)
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const tableParam = searchParams.get('table');
        if (tableParam && !selectedTableId) {
            setSelectedTableId(tableParam);
        }
    }, [searchParams]);

    const categories = [
        { id: 'all', name: t('common.all') },
        ...menu.map(c => ({ id: c.categoryId, name: c.categoryName }))
    ];

    const allItems = menu.flatMap(c => c.items.map(item => ({ ...item, categoryId: c.categoryId })));

    const filteredItems = allItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getItemOptionGroups = (): OptionGroup[] => {
        return optionGroups.filter(og => og.isActive && og.options.length > 0);
    };

    const handleItemClick = (item: MenuItemDto) => {
        const groups = getItemOptionGroups();
        if (groups.length > 0) {
            setTempOptions([]);
            setOptionModal({ item, groups });
        } else {
            addToCart(item, []);
        }
    };

    const addToCart = (item: MenuItemDto, options: SelectedOption[]) => {
        const optionKey = options.map(o => o.optionId).sort().join(',');
        const cartId = `${item.id}_${optionKey}`;

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

    const getItemTotal = (item: CartItem) => {
        const optionTotal = item.selectedOptions.reduce((s, o) => s + o.price * o.quantity, 0);
        return (item.unitPrice + optionTotal) * item.quantity;
    };

    const subtotal = cart.reduce((sum, item) => sum + getItemTotal(item), 0);
    const tax = subtotal * 0.07;
    const total = subtotal + tax;
    const cartItemCount = cart.reduce((a, b) => a + b.quantity, 0);

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
        <>
            <div className="flex flex-col md:flex-row h-full">
                {/* Product Selection */}
                <div className="flex-1 flex flex-col h-full md:border-r border-base-300 min-w-0">
                    {/* Header */}
                    <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-100">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                            <input
                                type="text"
                                placeholder={`${t('common.search')}...`}
                                className="input input-bordered w-full pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Mobile cart button in header */}
                        <button
                            className="btn btn-ghost btn-sm relative ml-2 md:hidden"
                            onClick={() => setShowMobileCart(true)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 badge badge-primary badge-xs">{cartItemCount}</span>
                            )}
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="p-2 md:p-4 overflow-x-auto whitespace-nowrap bg-base-100/50 backdrop-blur-sm">
                        <div className="flex gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={cn("btn btn-md md:btn-lg rounded-full px-4 md:px-8", selectedCategory === cat.id ? "btn-primary" : "btn-ghost bg-base-200")}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-base-200/50">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                            {filteredItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 text-left h-full"
                                >
                                    <figure className="h-24 sm:h-32 lg:h-40 overflow-hidden bg-base-200">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-base-content/10">
                                                <UtensilsCrossed size={32} className="sm:w-12 sm:h-12" />
                                            </div>
                                        )}
                                    </figure>
                                    <div className="card-body p-2 sm:p-3 lg:p-4">
                                        <h3 className="font-bold text-sm sm:text-base lg:text-lg line-clamp-2">{item.name}</h3>
                                        <div className="flex justify-between items-end mt-auto">
                                            <span className="text-primary font-bold text-base sm:text-lg lg:text-xl">฿{item.price}</span>
                                            <div className="btn btn-circle btn-xs sm:btn-sm btn-primary">
                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart - Desktop (hidden on mobile) */}
                <div className="hidden md:flex w-[340px] lg:w-[400px] flex-col h-full bg-base-100 shadow-xl z-10 border-l border-base-300">
                    <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-100">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold">{t('cart.title')}</h2>
                        </div>
                        <div className="badge badge-primary badge-lg">{cartItemCount} items</div>
                    </div>

                    {/* Table Selection */}
                    <div className="p-3 border-b border-base-300 bg-base-200/50">
                        <Listbox value={selectedTableId || ''} onChange={(val) => setSelectedTableId(val || null)}>
                            <div className="relative">
                                <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-base-300 bg-base-100 py-2.5 pl-4 pr-10 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                    <span className={`block truncate ${selectedTableId ? 'font-medium' : 'opacity-50'}`}>
                                        {tables.find(t => t.id === selectedTableId)?.name || t('pos.selectTable')}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <ChevronDown size={14} className="opacity-40" />
                                    </span>
                                </Listbox.Button>
                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <Listbox.Options className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl bg-base-100 py-1 shadow-xl ring-1 ring-base-300 focus:outline-none">
                                        {tables.filter(t => t.isActive).map(t => (
                                            <Listbox.Option
                                                key={t.id}
                                                value={t.id}
                                                className={({ active }) => `relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-sm ${active ? 'bg-primary/10 text-primary' : 'text-base-content'}`}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className={`block truncate ${selected ? 'font-bold' : ''}`}>{t.name} ({t.code})</span>
                                                        {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check size={14} /></span>}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-base-content/30 gap-4">
                                <UtensilsCrossed className="w-16 h-16" />
                                <p className="text-xl font-medium">{t('cart.empty')}</p>
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
                                <span>{t('cart.subtotal')}</span>
                                <span>฿{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base-content/70">
                                <span>VAT (7%)</span>
                                <span>฿{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-primary pt-2 border-t border-base-300">
                                <span>{t('cart.total')}</span>
                                <span>฿{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="btn btn-outline btn-lg h-14" onClick={() => setCart([])} disabled={cart.length === 0}>
                                {t('common.cancel')}
                            </button>
                            <button className="btn btn-primary btn-lg h-14 gap-2" onClick={handlePayNow} disabled={cart.length === 0}>
                                <CreditCard className="w-5 h-5" />
                                {t('customer.placeOrder')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Option Selection Modal */}
            {optionModal && (
                <div className="overlay modal fixed inset-0 z-[80] overlay-open opacity-100" role="dialog">
                    <div className="modal-dialog w-full max-w-md mx-auto my-4 md:my-10 px-4 md:px-0">
                        <div className="modal-content border-0 rounded-3xl shadow-2xl bg-base-100">
                            <div className="flex items-center justify-between p-4 md:p-6 border-b border-base-200">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold">{optionModal.item.name}</h3>
                                    <p className="text-sm text-base-content/50">{t('customer.selectOptions')}</p>
                                </div>
                                <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setOptionModal(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto space-y-5">
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
                            <div className="flex justify-end p-4 md:p-6 border-t border-base-200 gap-3">
                                <button className="btn btn-ghost" onClick={() => setOptionModal(null)}>{t('common.cancel')}</button>
                                <button className="btn btn-primary px-8" onClick={handleConfirmOptions}>
                                    {t('customer.addToCart')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]" onClick={() => setOptionModal(null)}></div>
                </div>
            )}

            {/* Mobile Cart Drawer */}
            {showMobileCart && (
                <div className="fixed inset-0 z-50 flex flex-col md:hidden">
                    <div className="flex-1 bg-black/50" onClick={() => setShowMobileCart(false)}></div>
                    <div className="bg-base-100 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
                        <div className="p-4 border-b border-base-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-bold">{t('cart.title')}</h3>
                                <div className="badge badge-primary badge-sm">{cartItemCount}</div>
                            </div>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setShowMobileCart(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Mobile Table Selection */}
                        <div className="p-3 border-b border-base-300 bg-base-200/50">
                            <Listbox value={selectedTableId || ''} onChange={(val) => setSelectedTableId(val || null)}>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-base-300 bg-base-100 py-2.5 pl-4 pr-10 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                        <span className={`block truncate ${selectedTableId ? 'font-medium' : 'opacity-50'}`}>
                                            {tables.find(t => t.id === selectedTableId)?.name || t('pos.selectTable')}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ChevronDown size={14} className="opacity-40" />
                                        </span>
                                    </Listbox.Button>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <Listbox.Options className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl bg-base-100 py-1 shadow-xl ring-1 ring-base-300 focus:outline-none">
                                            {tables.filter(t => t.isActive).map(t => (
                                                <Listbox.Option
                                                    key={t.id}
                                                    value={t.id}
                                                    className={({ active }) => `relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-sm ${active ? 'bg-primary/10 text-primary' : 'text-base-content'}`}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-bold' : ''}`}>{t.name} ({t.code})</span>
                                                            {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check size={14} /></span>}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>

                        {/* Mobile Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-base-content/30 gap-4 py-8">
                                    <UtensilsCrossed className="w-12 h-12" />
                                    <p className="text-lg font-medium">{t('cart.empty')}</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-3 bg-base-200 rounded-xl items-center">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-base-300 flex items-center justify-center shrink-0">
                                                <UtensilsCrossed size={16} className="text-base-content/20" />
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
                                        <div className="flex items-center gap-1 bg-base-100 rounded-lg p-1">
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

                        {/* Mobile Cart Footer */}
                        <div className="p-4 bg-base-100 border-t border-base-300">
                            <div className="flex justify-between text-lg font-bold text-primary mb-3">
                                <span>{t('cart.total')}</span>
                                <span>฿{total.toFixed(2)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="btn btn-outline" onClick={() => setCart([])} disabled={cart.length === 0}>
                                    {t('common.cancel')}
                                </button>
                                <button className="btn btn-primary gap-2" onClick={() => { handlePayNow(); setShowMobileCart(false); }} disabled={cart.length === 0}>
                                    <CreditCard className="w-4 h-4" />
                                    {t('customer.placeOrder')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PosHomePage;
