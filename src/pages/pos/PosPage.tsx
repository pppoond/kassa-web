import { useState } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, UtensilsCrossed, Store, LayoutGrid, Receipt, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import TableLayout from '../../components/pos/TableLayout';
import { cn } from '../../utils/cn';

// --- Mock Data ---
const MOCK_CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'tea', name: 'Tea' },
    { id: 'bakery', name: 'Bakery' },
    { id: 'food', name: 'Food' },
    { id: 'drinks', name: 'Soft Drinks' },
];

const MOCK_PRODUCTS = [
    { id: 1, name: 'Espresso', price: 60, category: 'coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fd962077a4?auto=format&fit=crop&w=300&q=80' },
    { id: 2, name: 'Iced Latte', price: 85, category: 'coffee', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80' },
    { id: 3, name: 'Cappuccino', price: 80, category: 'coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=300&q=80' },
    { id: 4, name: 'Thai Tea', price: 70, category: 'tea', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=300&q=80' },
    { id: 5, name: 'Green Tea Latte', price: 75, category: 'tea', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=300&q=80' },
    { id: 6, name: 'Croissant', price: 65, category: 'bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&w=300&q=80' },
    { id: 7, name: 'Cheesecake', price: 120, category: 'bakery', image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=300&q=80' },
    { id: 8, name: 'Pad Thai', price: 150, category: 'food', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=300&q=80' },
    { id: 9, name: 'Coke', price: 30, category: 'drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' },
];

interface CartItem {
    product: typeof MOCK_PRODUCTS[0];
    quantity: number;
}

type ViewMode = 'counter' | 'tables';

const PosPage = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('counter');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    const filteredProducts = MOCK_PRODUCTS.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToCart = (product: typeof MOCK_PRODUCTS[0]) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleTableClick = (tableId: number) => {
        // Simulation: Switch to counter mode for the selected table (future impl)
        console.log(`Table ${tableId} clicked`);
        setViewMode('counter');
    };

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

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
                        className={cn(
                            "btn btn-square w-full h-14 rounded-xl transition-all",
                            viewMode === 'counter' ? "btn-active btn-neutral" : "btn-ghost"
                        )}
                    >
                        <Store className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => setViewMode('tables')}
                        className={cn(
                            "btn btn-square w-full h-14 rounded-xl transition-all",
                            viewMode === 'tables' ? "btn-active btn-neutral" : "btn-ghost"
                        )}
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
                        {/* Product Selection (Left Split) */}
                        <div className="flex-1 flex flex-col h-full border-r border-base-300 min-w-0">
                            {/* Header */}
                            <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-100">
                                <div className="flex gap-4 items-center flex-1">
                                    <div className="relative w-full max-w-md">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="input input-bordered w-full pl-10"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="p-4 overflow-x-auto whitespace-nowrap bg-base-100/50 backdrop-blur-sm">
                                <div className="flex gap-2">
                                    {MOCK_CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={cn(
                                                "btn btn-lg rounded-full px-8",
                                                selectedCategory === cat.id ? "btn-primary" : "btn-ghost bg-base-200"
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Grid */}
                            <div className="flex-1 overflow-y-auto p-4 bg-base-200/50">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredProducts.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 text-left h-full"
                                        >
                                            <figure className="h-40 overflow-hidden relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                                            </figure>
                                            <div className="card-body p-4">
                                                <h3 className="font-bold text-lg">{product.name}</h3>
                                                <div className="flex justify-between items-end mt-auto">
                                                    <span className="text-primary font-bold text-xl">฿{product.price}</span>
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

                        {/* Cart (Right Split) */}
                        <div className="w-[400px] flex flex-col h-full bg-base-100 shadow-xl z-10 border-l border-base-300">
                            {/* Cart Header */}
                            <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-100">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="w-6 h-6 text-primary" />
                                    <h2 className="text-xl font-bold">Current Order</h2>
                                </div>
                                <div className="badge badge-primary badge-lg">{cart.reduce((a, b) => a + b.quantity, 0)} items</div>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-base-content/30 gap-4">
                                        <UtensilsCrossed className="w-16 h-16" />
                                        <p className="text-xl font-medium">No items selected</p>
                                        <p className="text-sm">Select products to start an order</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.product.id} className="flex gap-4 p-3 bg-base-200 rounded-xl items-center animate-in fade-in slide-in-from-right-4 duration-300">
                                            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold truncate">{item.product.name}</h4>
                                                <p className="text-primary font-semibold">฿{item.product.price * item.quantity}</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-base-100 rounded-lg p-1">
                                                <button
                                                    className="btn btn-xs btn-circle btn-ghost text-error"
                                                    onClick={() => updateQuantity(item.product.id, -1)}
                                                >
                                                    {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                                </button>
                                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    className="btn btn-xs btn-circle btn-ghost text-primary"
                                                    onClick={() => updateQuantity(item.product.id, 1)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Cart Footer */}
                            <div className="p-4 bg-base-100 border-t border-base-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-base-content/70">
                                        <span>Subtotal</span>
                                        <span>฿{total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base-content/70">
                                        <span>Tax (7%)</span>
                                        <span>฿{(total * 0.07).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold text-primary pt-2 border-t border-base-300">
                                        <span>Total</span>
                                        <span>฿{(total * 1.07).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full text-lg h-14"
                                        onClick={() => setCart([])}
                                        disabled={cart.length === 0}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="w-full text-lg h-14 gap-2"
                                        disabled={cart.length === 0}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        Pay Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PosPage;
